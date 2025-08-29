import Playlist from "./Playlist";
import { AppPlaylist } from "@/types/playlist";

const DisplayPlaylists = ({ playlists }: { playlists: AppPlaylist[] }) => {
  return (
    <div>
      {playlists.map((playlist) => (
        <Playlist key={playlist.id} playlist={playlist} />
      ))}
    </div>
  );
};

export default DisplayPlaylists;
