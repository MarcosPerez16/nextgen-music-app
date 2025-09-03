import CustomPlaylistCard from "./CustomPlaylistCard";
import { AppPlaylist } from "@/types/playlist";

const DisplayPlaylists = ({
  playlists,
  onPlaylistUpdate,
}: {
  playlists: AppPlaylist[];
  onPlaylistUpdate: () => void;
}) => {
  return (
    <div>
      {playlists.map((playlist) => (
        <CustomPlaylistCard
          key={playlist.id}
          playlist={playlist}
          onPlaylistUpdate={onPlaylistUpdate}
        />
      ))}
    </div>
  );
};

export default DisplayPlaylists;
