import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ExtendedSession } from "@/types/auth";
import { Session } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  //get users session from nextauth
  const session = await getServerSession(authOptions);

  //validate session

  if (!session) {
    return Response.json(
      { error: "You must be logged in to view playlist tracks" },
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

  //get playlist ID from params and convert to number
  const resolvedParams = await params;
  const playlistId = parseInt(resolvedParams.id);

  //check if its a valid number
  if (isNaN(playlistId)) {
    return Response.json({ error: "Invalid playlist ID" }, { status: 400 });
  }

  //find playlist and verify user can access it
  const playlist = await prisma.playlist.findUnique({
    where: {
      id: playlistId,
    },
  });

  //check if playlist exists
  if (!playlist) {
    return Response.json({ error: "Playlist not found" }, { status: 404 });
  }

  //verify user can view this playlist
  if (playlist.userId !== user.id && !playlist.isPublic) {
    return Response.json(
      { error: "You don't have permission to view this playlist" },
      { status: 403 }
    );
  }

  //query PlaylistTrack records where playlistId matches
  try {
    const playlistTracks = await prisma.playlistTrack.findMany({
      where: {
        playlistId: playlist.id,
      },
      include: {
        track: true,
      },
      orderBy: {
        position: "asc",
      },
    });

    //transform data to extract just the track info
    const tracks = playlistTracks.map((playlistTrack) => ({
      id: playlistTrack.track.spotifyId,
      name: playlistTrack.track.name,
      artists: [{ name: playlistTrack.track.artist }],
      album: {
        name: playlistTrack.track.album,
        images: playlistTrack.track.imageUrl
          ? [
              {
                url: playlistTrack.track.imageUrl,
                height: 640,
                width: 640,
              },
            ]
          : [],
      },
      duration_ms: playlistTrack.track.duration_ms,
    }));

    return Response.json({ tracks });
  } catch (error) {
    console.error("Error getting track data", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  //get users session from nextauth
  const session = await getServerSession(authOptions);

  //validate session

  if (!session) {
    return Response.json(
      { error: "You must be logged in to add tracks to a playlist" },
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

  //get playlist ID from params and convert to number
  const resolvedParams = await params;
  const playlistId = parseInt(resolvedParams.id);

  //check if its a valid number
  if (isNaN(playlistId)) {
    return Response.json({ error: "Invalid playlist ID" }, { status: 400 });
  }

  //find playlist and verify user can access it
  const playlist = await prisma.playlist.findUnique({
    where: {
      id: playlistId,
    },
  });

  //check if playlist exists
  if (!playlist) {
    return Response.json({ error: "Playlist not found" }, { status: 404 });
  }

  //verify user can view this playlist
  if (playlist.userId !== user.id) {
    return Response.json(
      { error: "You don't have permission to view this playlist" },
      { status: 403 }
    );
  }

  //get track data from request body
  const trackData = await request.json();

  //validate track data

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
    const existingPlaylistTrack = await prisma.playlistTrack.findFirst({
      where: {
        playlistId: playlist.id,
        trackId: track.id,
      },
    });

    if (existingPlaylistTrack) {
      return Response.json(
        { error: "Track is already in this playlist" },
        { status: 409 }
      );
    }

    //find the highest position in this playlist
    const lastTrack = await prisma.playlistTrack.findFirst({
      where: {
        playlistId: playlist.id,
      },
      orderBy: {
        position: "desc",
      },
    });

    //if theres a last track, put the new one after it. If the playlist is empty, start at position 1
    const nextPosition = lastTrack ? lastTrack.position + 1 : 1;

    //add track to playlist
    await prisma.playlistTrack.create({
      data: {
        playlistId: playlist.id,
        trackId: track.id,
        position: nextPosition,
      },
    });

    return Response.json({ message: "Track added to playlist successfully" });
  } catch (error) {
    console.error("Error adding track to playlist:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  //get users session from nextauth
  const session = await getServerSession(authOptions);

  //validate session

  if (!session) {
    return Response.json(
      { error: "You must be logged in to remove tracks from a playlist" },
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

  //get playlist ID from params and convert to number
  const resolvedParams = await params;
  const playlistId = parseInt(resolvedParams.id);

  //check if its a valid number
  if (isNaN(playlistId)) {
    return Response.json({ error: "Invalid playlist ID" }, { status: 400 });
  }

  //find playlist and verify user can access it
  const playlist = await prisma.playlist.findUnique({
    where: {
      id: playlistId,
    },
  });

  //check if playlist exists
  if (!playlist) {
    return Response.json({ error: "Playlist not found" }, { status: 404 });
  }

  //verify user can view this playlist
  if (playlist.userId !== user.id) {
    return Response.json(
      {
        error: "You don't have permission to remove tracks from this playlist",
      },
      { status: 403 }
    );
  }

  //get track data from request body
  const trackData = await request.json();

  //validate track data

  if (!trackData.spotifyId) {
    return Response.json(
      { error: "Missing spotify ID for track to remove" },
      { status: 400 }
    );
  }

  try {
    //find the track to remove
    const track = await prisma.track.findUnique({
      where: {
        spotifyId: trackData.spotifyId,
      },
    });

    if (!track) {
      return Response.json({ error: "Track not found" }, { status: 404 });
    }

    //find the playlist track relationship to remove
    const existingPlaylistTrack = await prisma.playlistTrack.findFirst({
      where: {
        playlistId: playlist.id,
        trackId: track.id,
      },
    });

    if (!existingPlaylistTrack) {
      return Response.json(
        { error: "Track is not in this playlist" },
        { status: 404 }
      );
    }

    //delete the playlist track relationship
    await prisma.playlistTrack.delete({
      where: {
        id: existingPlaylistTrack.id,
      },
    });

    return Response.json({
      message: "Track removed from playlist successfully",
    });
  } catch (error) {
    console.error("Error removing track from playlist:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
