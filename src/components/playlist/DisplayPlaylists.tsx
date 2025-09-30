import CustomPlaylistCard from "./CustomPlaylistCard";
import { DisplayPlaylistsProps } from "@/types/playlist";

const DisplayPlaylists = ({
  playlists,
  onPlaylistDelete,
  onPlaylistUpdate,
}: DisplayPlaylistsProps) => {
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {playlists.length > 0 ? (
        playlists.map((playlist) => (
          <CustomPlaylistCard
            key={playlist.id}
            playlist={playlist}
            onPlaylistDelete={onPlaylistDelete}
            onPlaylistUpdate={onPlaylistUpdate}
          />
        ))
      ) : (
        <p className="text-gray-500 text-center py-8">
          No playlists yet. Create your first one above!
        </p>
      )}
    </div>
  );
};

export default DisplayPlaylists;
