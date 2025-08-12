import { Card, CardContent } from "./ui/card";
import { SpotifyTrack } from "@/types/spotify";
import Image from "next/image";

interface TrackCardProps {
  track: SpotifyTrack;
}
const TrackCard = ({ track }: TrackCardProps) => {
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
      </CardContent>
    </Card>
  );
};

export default TrackCard;
