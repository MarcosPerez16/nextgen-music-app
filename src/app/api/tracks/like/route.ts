import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ExtendedSession } from "@/types/auth";
import { Session } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  //get users session
  const session = await getServerSession(authOptions);

  //check for valid session
  if (!session) {
    return Response.json(
      { error: "You must be logged in to like or dislike a track" },
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

  //extract data from the request body
  const trackData = await request.json();

  //check if its valid data
  if (
    !trackData.spotifyId ||
    !trackData.name ||
    !trackData.artist ||
    !trackData.album ||
    !trackData.duration_ms
  ) {
    return Response.json(
      { error: "Missing required track data" },
      { status: 400 }
    );
  }

  try {
    //if valid data, check if it exists in our track table

    const existingTrack = await prisma.track.findUnique({
      where: {
        spotifyId: trackData.spotifyId,
      },
    });

    //if track doesn't exist, create it. Otherwise use existing track
    let track;
    if (!existingTrack) {
      track = await prisma.track.create({
        data: {
          spotifyId: trackData.spotifyId,
          name: trackData.name,
          artist: trackData.artist,
          album: trackData.album,
          duration_ms: trackData.duration_ms,
          imageUrl: trackData.imageUrl,
        },
      });
    } else {
      // Update existing track if it doesn't have an imageUrl
      if (!existingTrack.imageUrl && trackData.imageUrl) {
        track = await prisma.track.update({
          where: { id: existingTrack.id },
          data: { imageUrl: trackData.imageUrl },
        });
      } else {
        track = existingTrack;
      }
    }

    //check if like relationship already exists between user and track
    const existingLike = await prisma.likedTrack.findFirst({
      where: {
        userId: user.id,
        trackId: track.id,
      },
    });

    //Toggle like/unlike based on current state
    if (existingLike) {
      //user already like it, so unlike it
      await prisma.likedTrack.delete({
        where: {
          id: existingLike.id,
        },
      });

      return Response.json({ liked: false, message: "Track unliked" });
    } else {
      //user hasn't liked it yet, so like it
      await prisma.likedTrack.create({
        data: {
          userId: user.id,
          trackId: track.id,
        },
      });

      return Response.json({ liked: true, message: "Track liked" });
    }
  } catch (error) {
    console.error("Error with track like/unlike:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
