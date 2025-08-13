import Image from "next/image";
import { SpotifyTrack } from "@/types/spotify";
import { Card } from "./ui/card";

const TrackInfo = ({ track }: { track: SpotifyTrack }) => {
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
    <Card className="p-4 mb-4">
      <div className="flex items-center space-x-4">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={track.album.name}
            className="rounded-md object-cover"
            width={64}
            height={64}
          />
        ) : (
          <div className="w-16 h-16 bg-gray-300 rounded-md mr-4 flex items-center justify-center">
            <span className="text-gray-500 text-xs">No Image</span>
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{track.name}</h3>
          <p className="text-gray-600">{artistNames}</p>
          <p className="text-gray-500 text-sm">{track.album.name}</p>
          <p className="text-gray-500 text-sm">
            {formatDuration(track.duration_ms)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TrackInfo;
