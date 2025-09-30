"use client";
import DisplayPlaylists from "@/components/playlist/DisplayPlaylists";
import PlaylistsForm from "@/components/playlist/PlaylistsForm";
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
    <div className="p-6 max-w-7xl mx-auto bg-white min-h-screen pb-36">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Browse or create your personal NextGen playlists!
      </h1>
      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      )}
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
