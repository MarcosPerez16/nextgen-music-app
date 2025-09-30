import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { Play } from "lucide-react";
import { usePlayerStore } from "@/lib/stores/playerStore";
import { TrackCardProps } from "@/types/spotify";

const TrackCard = ({
  track,
  allTracks,
  trackIndex,
  playbackContext,
}: TrackCardProps) => {
  const { deviceId } = usePlayerStore();

  const imageUrl =
    track.album.images && track.album.images.length > 0
      ? track.album.images[0].url
      : null;

  const artistNames = track.artists.map((artist) => artist.name).join(", ");

  const handlePlayTrack = async () => {
    if (!deviceId) {
      console.error("No device ID available");
      return;
    }

    if (allTracks && trackIndex !== undefined && playbackContext) {
      usePlayerStore
        .getState()
        .setQueue(allTracks, trackIndex, playbackContext);
    }

    try {
      const response = await fetch("/api/spotify/play", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(allTracks && trackIndex !== undefined
            ? {
                trackUris: allTracks.map(
                  (t) => t.uri || `spotify:track:${t.id}`
                ),
                offset: trackIndex,
              }
            : {
                trackUri: track.uri || `spotify:track:${track.id}`,
              }),
          deviceId: deviceId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to play track");
      }
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-200 border-gray-200 hover:border-purple-300 overflow-hidden">
      <CardContent className="p-0">
        {/* Album artwork - full width at top */}
        <div className="relative aspect-square w-full overflow-hidden">
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={track.album.name}
                className="object-cover"
                width={300}
                height={300}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  onClick={handlePlayTrack}
                  size="icon"
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-full h-14 w-14 shadow-lg"
                >
                  <Play className="h-6 w-6 fill-white ml-1" />
                </Button>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>

        {/* Track info - below image */}
        <div className="p-4">
          <h3 className="font-semibold text-base text-gray-900 truncate group-hover:text-purple-700 transition-colors mb-1">
            {track.name}
          </h3>
          <p className="text-sm text-gray-600 truncate">{artistNames}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackCard;
