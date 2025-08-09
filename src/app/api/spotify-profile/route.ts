import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { fetchSpotifyUserProfile } from "@/lib/spotifyApi";
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
    const userProfile = await fetchSpotifyUserProfile(
      extendedSession.spotifyId
    );
    return Response.json({ userProfile });
  } catch {
    return Response.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
