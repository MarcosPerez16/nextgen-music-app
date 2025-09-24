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

  useEffect(() => {
    fetchLikedTracks();
  }, []);

  return (
    <div>
      <h1>Your Liked Tracks</h1>

      {isLoading && <Loader2 className="h-8 w-8 animate-spin" />}

      {!isLoading && likedTracks.length > 0 && (
        <div>
          {likedTracks.map((track) => (
            <TrackInfo
              key={track.id}
              track={track}
              showLikeButton={false}
              showPlayButton={true}
            />
          ))}
        </div>
      )}

      {!isLoading && likedTracks.length === 0 && (
        <p>No liked tracks yet. Go search and like some tracks!</p>
      )}
    </div>
  );
};

export default LikedTracks;
