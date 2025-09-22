import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { fetchSpotifyUserProfile } from "@/lib/spotifyApi";
import { ExtendedSession } from "@/types/auth";
import { Session } from "next-auth";

export async function GET() {
  //grab user session
  const session = await getServerSession(authOptions);

  //validate session
  if (!session) {
    return Response.json({ error: "Invalid Session" }, { status: 401 });
  }

  //cast session to include our custom spotify props
  const extendedSession = session as Session & ExtendedSession;

  //verify we have users spotify ID from their session
  if (!extendedSession.spotifyId) {
    return Response.json({ error: "No Spotify ID" }, { status: 400 });
  }

  try {
    //grab user profile
    const userProfile = await fetchSpotifyUserProfile(
      extendedSession.spotifyId
    );
    //check if user has premium, which is required for web playback SDK
    const isPremium = userProfile.profile.product === "premium";

    return Response.json({ isPremium });
  } catch {
    return Response.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}
