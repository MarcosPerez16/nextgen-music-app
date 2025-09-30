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
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 bg-white/80 backdrop-blur-sm p-3 rounded-lg">
        Your Spotify Playlists
      </h2>
      {playlists && Array.isArray(playlists) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl">
          {playlists.slice(0, 6).map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No playlists found</p>
      )}
    </div>
  );
};

export default Playlists;
