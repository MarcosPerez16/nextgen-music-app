import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ExtendedSession } from "@/types/auth";
import { Session } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  //get users session
  const session = await getServerSession(authOptions);

  //check valid session
  if (!session) {
    return Response.json(
      { error: "You must be logged in to update custom playlist name" },
      { status: 401 }
    );
  }

  //include our custom spotify props
  const extendedSession = session as Session & ExtendedSession;

  //verify users spotify ID from their session
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

  //get playlist ID from params, convert to number
  const playlistId = parseInt(params.id);

  //check if it's a valid number
  if (isNaN(playlistId)) {
    return Response.json({ error: "Invalid playlist ID" }, { status: 400 });
  }

  //get new name from request body
  const { name } = await request.json();

  //verify the playlist belongs to the user
  const playlist = await prisma.playlist.findUnique({
    where: {
      id: playlistId,
    },
  });
  //does playlist exist
  if (!playlist) {
    return Response.json({ error: "Playlist not found" }, { status: 404 });
  }
  //check to make sure they are not editing a playlist they do not own
  if (playlist.userId !== user.id) {
    return Response.json(
      { error: "You can only edit your own playlists" },
      { status: 403 }
    );
  }

  try {
    //update in db
    const updatedPlaylist = await prisma.playlist.update({
      where: {
        id: playlistId,
      },
      data: {
        name: name,
      },
    });

    return Response.json({ playlist: updatedPlaylist });
  } catch (error) {
    console.error("Error updating playlist:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  //get users session
  const session = await getServerSession(authOptions);

  //check valid session
  if (!session) {
    return Response.json(
      { error: "You must be logged in to delete a custom playlist" },
      { status: 401 }
    );
  }

  //include our custom spotify props
  const extendedSession = session as Session & ExtendedSession;

  //verify users spotify ID from their session
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

  //get playlist ID from params, convert to number
  const { id } = await params;
  const playlistId = parseInt(id);

  //check if its a valid number
  if (isNaN(playlistId)) {
    return Response.json({ error: "Invalid playlist ID" }, { status: 400 });
  }

  //verify the playlist belongs to the user
  const playlist = await prisma.playlist.findUnique({
    where: {
      id: playlistId,
    },
  });

  //does playlist exist
  if (!playlist) {
    return Response.json({ error: "Playlist not found" }, { status: 404 });
  }

  //check ownership
  if (playlist.userId !== user.id) {
    return Response.json(
      { error: "You can only delete your own playlists" },
      { status: 403 }
    );
  }

  try {
    //first delete all tracks in the playlist
    await prisma.playlistTrack.deleteMany({
      where: {
        playlistId: playlistId,
      },
    });

    //then delete the playlist itself
    await prisma.playlist.delete({
      where: {
        id: playlistId,
      },
    });

    return Response.json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.error("Error deleting playlist", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
