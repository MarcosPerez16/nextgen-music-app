import CustomPlaylistCard from "./CustomPlaylistCard";
import { DisplayPlaylistsProps } from "@/types/playlist";

const DisplayPlaylists = ({
  playlists,
  onPlaylistDelete,
  onPlaylistUpdate,
}: DisplayPlaylistsProps) => {
  return (
    <div>
      {playlists.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {playlists.map((playlist) => (
            <CustomPlaylistCard
              key={playlist.id}
              playlist={playlist}
              onPlaylistDelete={onPlaylistDelete}
              onPlaylistUpdate={onPlaylistUpdate}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">
          No playlists yet. Create your first one above!
        </p>
      )}
    </div>
  );
};

export default DisplayPlaylists;
