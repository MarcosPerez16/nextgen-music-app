"use client";
import DisplayPlaylists from "@/components/DisplayPlaylists";
import PlaylistsForm from "@/components/PlaylistsForm";
import { AppPlaylist } from "@/types/playlist";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const Playlists = () => {
  const [playlists, setPlaylists] = useState<AppPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchPlaylists = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/playlists");
      const data = await response.json();
      setIsLoading(false);
      setPlaylists(data.playlists);
    } catch (error) {
      console.error("Error fetching playlists", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchPlaylists();
  }, []);

  const handleDeletePlaylist = (playlistId: number) => {
    setPlaylists((playlists) =>
      playlists.filter((playlist) => playlist.id !== playlistId)
    );
  };
  return (
    <div>
      <h1>Browse or create your personal NextGen playlists!</h1>
      {isLoading && <Loader2 className="h-8 w-8 animate-spin" />}
      <PlaylistsForm handleFetchPlaylists={handleFetchPlaylists} />
      <DisplayPlaylists
        playlists={playlists}
        onPlaylistDelete={handleDeletePlaylist}
        onPlaylistUpdate={handleFetchPlaylists}
      />
    </div>
  );
};

export default Playlists;
