import { Card, CardContent } from "./ui/card";
import { SpotifyPlaylist } from "@/types/spotify";
import Image from "next/image";

interface PlaylistCardProps {
  playlist: SpotifyPlaylist;
}

const PlaylistCard = ({ playlist }: PlaylistCardProps) => {
  const imageUrl =
    playlist.images && playlist.images.length > 0
      ? playlist.images[0].url
      : null;

  return (
    <Card className="mb-4">
      <CardContent className="flex items-center p-4">
        {/* Image on left */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={playlist.name}
            className="rounded-md mr-4 object-cover"
            width={64}
            height={64}
          />
        ) : (
          <div className="w-16 h-16 bg-gray-300 rounded-md mr-4 flex items-center justify-center">
            <span className="text-gray-500 text-xs">No Image</span>
          </div>
        )}

        {/* text on right */}
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{playlist.name}</h3>
          <p className="text-sm text-gray-600">
            {playlist.tracks.total} tracks
          </p>
          {playlist.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {playlist.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaylistCard;
