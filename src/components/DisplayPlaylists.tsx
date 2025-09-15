import CustomPlaylistCard from "./CustomPlaylistCard";
import { DisplayPlaylistsProps } from "@/types/playlist";

const DisplayPlaylists = ({
  playlists,
  onPlaylistDelete,
  onPlaylistUpdate,
}: DisplayPlaylistsProps) => {
  return (
    <div>
      {playlists.map((playlist) => (
        <CustomPlaylistCard
          key={playlist.id}
          playlist={playlist}
          onPlaylistDelete={onPlaylistDelete}
          onPlaylistUpdate={onPlaylistUpdate}
        />
      ))}
    </div>
  );
};

export default DisplayPlaylists;
