"use client";

import { useState, useEffect } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import TrackInfo from "@/components/TrackInfo";
import { SpotifyTrack } from "@/types/spotify";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CustomPlaylistTracks = () => {
  const [playlistTracks, setPlaylistTracks] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { id: playlistId } = useParams();

  useEffect(() => {
    const fetchPlaylistTracks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/playlists/${playlistId}/tracks`);

        if (!response.ok) {
          throw new Error("Failed to get playlist track");
        }

        const data = await response.json();

        setPlaylistTracks(data.tracks);
      } catch (error) {
        console.error("Error searching for playlist track", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylistTracks();
  }, [playlistId]);

  const handleDeletePlaylistTrack = (spotifyId: string) => {
    setPlaylistTracks((currentTracks) =>
      currentTracks.filter((track) => track.id !== spotifyId)
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Playlist Tracks</h1>
        <Link href="/playlists">
          <Button variant="outline" size="sm" className="hover:bg-purple-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Playlists
          </Button>
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      )}

      {!isLoading && playlistTracks.length > 0 && (
        <div className="space-y-3 max-w-4xl mx-auto">
          {playlistTracks.map((track, index) => (
            <TrackInfo
              key={track.id}
              track={track}
              allTracks={playlistTracks}
              trackIndex={index}
              playbackContext={`playlist:${playlistId}`}
              showLikeButton={false}
              showRemoveButton={true}
              playlistId={playlistId as string}
              deleteTrack={handleDeletePlaylistTrack}
              showPlayButton={true}
            />
          ))}
        </div>
      )}

      {!isLoading && playlistTracks.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No tracks in this playlist yet. Add some tracks to get started!
        </p>
      )}
    </div>
  );
};

export default CustomPlaylistTracks;
