import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ExtendedSession } from "@/types/auth";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const extendedSession = session as ExtendedSession;

  if (!extendedSession.accessToken) {
    return Response.json({ error: "No access token" }, { status: 401 });
  }

  try {
    const { trackUri, deviceId } = await request.json();

    const response = await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${extendedSession.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: [trackUri], // Array of Spotify URIs
        }),
      }
    );

    if (!response.ok) {
      //Handle different error cases
      return Response.json(
        { error: "Playback failed" },
        { status: response.status }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Playback error:", error);
    return Response.json(
      { error: "Failed to start playback" },
      { status: 500 }
    );
  }
}
