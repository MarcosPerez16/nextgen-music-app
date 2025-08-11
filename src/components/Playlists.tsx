import { useState, useEffect } from "react";
import { SpotifyPlaylist } from "@/types/spotify";

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
      <h2>Your Playlists</h2>
      {playlists && Array.isArray(playlists)
        ? `Found ${playlists.length} playlists!`
        : "No playlists"}
    </div>
  );
};

export default Playlists;
