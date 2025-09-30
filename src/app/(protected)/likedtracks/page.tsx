"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import TrackInfo from "@/components/TrackInfo";
import { SpotifyTrack } from "@/types/spotify";

const LikedTracks = () => {
  const [likedTracks, setLikedTracks] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLikedTracks = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/tracks/liked");

      //check if response is successful
      if (!response.ok) {
        throw new Error("Failed to get tracks");
      }

      //parse data
      const data = await response.json();

      //update state with tracks
      setLikedTracks(data.tracks);
    } catch (error) {
      console.error("Error searching for liked tracks", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlikeTrack = (spotifyId: string) => {
    setLikedTracks((currentTracks) =>
      currentTracks.filter((track) => track.id !== spotifyId)
    );
  };

  useEffect(() => {
    fetchLikedTracks();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Your Liked Tracks
      </h1>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      )}

      {!isLoading && likedTracks.length > 0 && (
        <div className="space-y-3 max-w-4xl mx-auto">
          {likedTracks.map((track, index) => (
            <TrackInfo
              key={track.id}
              track={track}
              allTracks={likedTracks}
              trackIndex={index}
              playbackContext="liked"
              showLikeButton={true}
              showPlayButton={true}
              onUnlike={handleUnlikeTrack}
            />
          ))}
        </div>
      )}

      {!isLoading && likedTracks.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No liked tracks yet. Go search and like some tracks!
        </p>
      )}
    </div>
  );
};

export default LikedTracks;
