import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ExtendedSession } from "@/types/auth";
import { Session } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  //get users session
  const session = await getServerSession(authOptions);

  //check for valid session
  if (!session) {
    return Response.json(
      { error: "You must be logged in to check like status" },
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

  //get spotifyId from query params
  const url = new URL(request.url);
  const spotifyId = url.searchParams.get("spotifyId");

  if (!spotifyId) {
    return Response.json(
      { error: "Missing spotifyId parameter" },
      { status: 400 }
    );
  }

  try {
    //check if track ecists and if user has liked it
    const likedTrack = await prisma.likedTrack.findFirst({
      where: {
        userId: user.id,
        track: {
          spotifyId: spotifyId,
        },
      },
    });

    return Response.json({ liked: !!likedTrack });
  } catch (error) {
    console.error("Error checking like status:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
