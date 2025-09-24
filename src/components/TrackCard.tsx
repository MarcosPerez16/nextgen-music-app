import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { Play } from "lucide-react";
import { usePlayerStore } from "@/lib/stores/playerStore";
import { TrackCardProps } from "@/types/spotify";

const TrackCard = ({ track }: TrackCardProps) => {
  const { deviceId } = usePlayerStore();
  //get album artwork
  const imageUrl =
    track.album.images && track.album.images.length > 0
      ? track.album.images[0].url
      : null;

  //convert from miliseconds
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  //join multiple artists names
  const artistNames = track.artists.map((artist) => artist.name).join(", ");

  const handlePlayTrack = async () => {
    if (!deviceId) {
      console.error("No device ID available");
      return;
    }

    try {
      const response = await fetch("/api/spotify/play", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trackUri: track.uri || `spotify:track:${track.id}`,
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
    <Card className="mb-4">
      <CardContent className="flex items-center p-4">
        {/* Album artwork */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={track.album.name}
            className="rounded-md mr-4 object-cover"
            width={64}
            height={64}
          />
        ) : (
          <div className="w-16 h-16 bg-gray-300 rounded-md mr-4 flex items-center justify-center">
            <span className="text-gray-500 text-xs">No Image</span>
          </div>
        )}

        {/* Track info */}
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{track.name}</h3>
          <p className="text-sm text-gray-600">{artistNames}</p>
          <p className="text-sm text-gray-500">
            {formatDuration(track.duration_ms)}
          </p>
        </div>
        <Button onClick={handlePlayTrack} variant="outline" size="sm">
          <Play className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default TrackCard;
