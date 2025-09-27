import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchSpotifyUserTopTracks } from "@/lib/spotifyApi";
import { ExtendedSession } from "@/types/auth";
import { Session } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const extendedSession = session as Session & ExtendedSession;

  if (!extendedSession.spotifyId) {
    return Response.json({ error: "No Spotify ID" }, { status: 400 });
  }

  try {
    const userTopTracks = await fetchSpotifyUserTopTracks(
      extendedSession.spotifyId
    );
    return Response.json({ userTopTracks });
  } catch {
    return Response.json(
      { error: "Failed to fetch top tracks" },
      { status: 500 }
    );
  }
}
