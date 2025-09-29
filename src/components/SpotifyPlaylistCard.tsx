import { Card, CardContent } from "./ui/card";
import { SpotifyPlaylist } from "@/types/spotify";
import Image from "next/image";
import Link from "next/link";
import { Music2 } from "lucide-react";

interface PlaylistCardProps {
  playlist: SpotifyPlaylist;
}

const SpotifyPlaylistCard = ({ playlist }: PlaylistCardProps) => {
  const imageUrl =
    playlist.images && playlist.images.length > 0
      ? playlist.images[0].url
      : null;

  return (
    <Link
      href={`https://open.spotify.com/playlist/${playlist.id}`}
      target="_blank"
    >
      <Card className="group hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-purple-300 cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Playlist image */}
            {imageUrl ? (
              <div className="relative flex-shrink-0">
                <Image
                  src={imageUrl}
                  alt={playlist.name}
                  className="rounded-md object-cover"
                  width={80}
                  height={80}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-md flex-shrink-0 flex items-center justify-center">
                <Music2 className="h-8 w-8 text-purple-600" />
              </div>
            )}

            {/* Playlist info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-gray-900 truncate group-hover:text-purple-700 transition-colors mb-1">
                {playlist.name}
              </h3>

              <p className="text-sm text-purple-600 font-medium mb-2">
                {playlist.tracks.total}{" "}
                {playlist.tracks.total === 1 ? "track" : "tracks"}
              </p>

              {playlist.description && (
                <p className="text-xs text-gray-500 line-clamp-2">
                  {playlist.description}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SpotifyPlaylistCard;
