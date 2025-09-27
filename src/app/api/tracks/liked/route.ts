import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ExtendedSession } from "@/types/auth";
import { Session } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  //get users session
  const session = await getServerSession(authOptions);

  //check for valid session
  if (!session) {
    return Response.json(
      { error: "You must be logged in to like a track" },
      { status: 401 }
    );
  }

  //cast session to include our custom spotify props
  const extendedSession = session as Session & ExtendedSession;

  //verify we have users spotify ID from their session
  if (!extendedSession.spotifyId) {
    return Response.json({ error: "No Spotify ID" }, { status: 400 });
  }

  //find user in db
  const user = await prisma.user.findUnique({
    where: {
      spotifyId: extendedSession.spotifyId,
    },
  });

  //no user throw error
  if (!user) {
    return Response.json({ error: "User could not be found" }, { status: 404 });
  }

  try {
    //get all tracks liked by user, inclduing track details, ordered by most recent
    const likedTracks = await prisma.likedTrack.findMany({
      where: {
        userId: user.id,
      },
      include: {
        track: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    //transform data to extract just the track info
    const tracks = likedTracks.map((likedTrack) => ({
      id: likedTrack.track.spotifyId,
      name: likedTrack.track.name,
      artists: [{ name: likedTrack.track.artist }],
      album: {
        name: likedTrack.track.album,
        images: likedTrack.track.imageUrl
          ? [
              {
                url: likedTrack.track.imageUrl,
                height: 640,
                width: 640,
              },
            ]
          : [],
      },
      duration_ms: likedTrack.track.duration_ms,
    }));

    return Response.json({ tracks });
  } catch (error) {
    console.error("Error getting track data", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
