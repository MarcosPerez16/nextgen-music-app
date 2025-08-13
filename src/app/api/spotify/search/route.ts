import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { fetchSpotifyTracks } from "@/lib/spotifyApi";
import { ExtendedSession } from "@/types/auth";
import { Session } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  //get the search query from URL params
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  //check if query exists
  if (!query) {
    return Response.json(
      { error: "No search param identified" },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const extendedSession = session as Session & ExtendedSession;

  if (!extendedSession.spotifyId) {
    return Response.json({ error: "No Spotify ID" }, { status: 400 });
  }

  try {
    const tracks = await fetchSpotifyTracks(extendedSession.spotifyId, query);

    return Response.json(tracks);
  } catch {
    return Response.json({ error: "Failed to fetch tracks" }, { status: 500 });
  }
}
