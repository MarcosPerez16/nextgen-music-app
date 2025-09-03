import { useState, useEffect } from "react";
import { SpotifyPlaylist } from "@/types/spotify";
import PlaylistCard from "./SpotifyPlaylistCard";

const Playlists = () => {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      setIsLoading(true);

      try {
        const response = await fetch("/api/spotify/playlists");
        const result = await response.json();
        setPlaylists(result.userPlaylist.playlists);
      } catch (error) {
        console.error("Error fetching playlists", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  if (isLoading) {
    return <div>Loading playlists...</div>;
  }

  return (
    <div>
      <h2 className="text-center p-10">Your Spotify Playlists</h2>
      {playlists && Array.isArray(playlists) ? (
        <div className="grid grid-cols-3 gap-4">
          {playlists.slice(0, 6).map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      ) : (
        "No playlists found"
      )}
    </div>
  );
};

export default Playlists;
