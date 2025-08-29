import { AppPlaylist } from "@/types/playlist";
import { Card } from "./ui/card";
import Image from "next/image";

const Playlist = ({ playlist }: { playlist: AppPlaylist }) => {
  //convert date
  const formatCreatedAt = () => {
    const date = new Date(playlist.createdAt);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center space-x-4">
        {playlist.imageUrl ? (
          <Image
            src={playlist.imageUrl}
            alt={playlist.name}
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
          <h3 className="font-semibold text-lg">{playlist.name}</h3>
          <p className="text-gray-500 text-sm">{playlist.description}</p>
          <p className="text-gray-500 text-sm">{formatCreatedAt()}</p>
          {playlist.isPublic ? "Public" : "Private"}
        </div>
      </div>
    </Card>
  );
};

export default Playlist;
