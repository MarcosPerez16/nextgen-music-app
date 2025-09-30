import { Card, CardContent } from "../ui/card";
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
      <Card className="group hover:shadow-xl transition-all duration-200 border-gray-200 hover:border-purple-300 cursor-pointer overflow-hidden">
        <CardContent className="p-0">
          {/* Playlist image - full width at top */}
          <div className="relative aspect-square w-full overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={playlist.name}
                className="object-cover"
                width={300}
                height={300}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <Music2 className="h-16 w-16 text-purple-600" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Playlist info - below image */}
          <div className="p-4 h-32">
            {" "}
            {/* Fixed height */}
            <h3 className="font-semibold text-base text-gray-900 truncate group-hover:text-purple-700 transition-colors mb-1">
              {playlist.name}
            </h3>
            <p className="text-sm text-purple-600 font-medium mb-2">
              {playlist.tracks.total}{" "}
              {playlist.tracks.total === 1 ? "track" : "tracks"}
            </p>
            {playlist.description && (
              <p className="text-xs text-gray-500 line-clamp-3">
                {" "}
                {playlist.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SpotifyPlaylistCard;
