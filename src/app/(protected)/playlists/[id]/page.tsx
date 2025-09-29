"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import TrackInfo from "@/components/TrackInfo";
import { SpotifyTrack } from "@/types/spotify";
import { useParams } from "next/navigation";

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
    <div>
      <h1>Playlist Tracks</h1>

      {isLoading && <Loader2 className="h-8 w-8 animate-spin" />}
      {!isLoading && playlistTracks.length > 0 && (
        <div>
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
        <p>No tracks in this playlist yet. Add some tracks to get started!</p>
      )}
    </div>
  );
};

export default CustomPlaylistTracks;
