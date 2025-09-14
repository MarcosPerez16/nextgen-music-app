import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { ExtendedSession } from "@/types/auth";
import { Session } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  //get current users session from nextauth
  const session = await getServerSession(authOptions);
  //check if its valid session
  if (!session) {
    return Response.json(
      { error: "You must be logged in to view a playlist" },
      { status: 401 }
    );
  }
  //cast session to include our custom spotify props
  const extendedSession = session as Session & ExtendedSession;

  //verify we have users spotify ID from their session
  if (!extendedSession.spotifyId) {
    return Response.json({ error: "No Spotify ID" }, { status: 400 });
  }
  //find user in our DB
  const user = await prisma.user.findUnique({
    where: {
      spotifyId: extendedSession.spotifyId,
    },
  });

  //check if user exists
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  try {
    //query our db for all playlists belonging to specific user
    const playlists = await prisma.playlist.findMany({
      where: {
        //we use the users db ID, not spotify ID
        userId: user.id,
      },
      include: {
        _count: {
          select: {
            PlaylistTrack: true,
          },
        },
      },
    });

    return Response.json({ playlists });
  } catch {
    return Response.json(
      { error: "Failed to fetch playlists" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  //get current users session from nextauth
  const session = await getServerSession(authOptions);
  //check if its valid session
  if (!session) {
    return Response.json(
      { error: "You must be logged in to create a playlist" },
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

  //if no user throw error
  if (!user) {
    return Response.json({ error: "User could not be found" }, { status: 404 });
  }

  //parse data
  const playlistData = await request.json();

  //check if its valid data
  if (!playlistData.name || playlistData === undefined) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    //create the playlist in our db
    const playlist = await prisma.playlist.create({
      data: {
        name: playlistData.name,
        description: playlistData.description,
        isPublic: playlistData.isPublic,
        userId: user.id,
      },
    });

    return Response.json({ playlist });
  } catch {
    return Response.json(
      { error: "Failed to create playlist" },
      { status: 500 }
    );
  }
}
