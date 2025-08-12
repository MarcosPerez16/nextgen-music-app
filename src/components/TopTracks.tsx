import { useState, useEffect } from "react";
import { SpotifyTrack } from "@/types/spotify";
import TrackCard from "./TrackCard";

const TopTracks = () => {
  const [topTracks, setTopTracks] = useState<SpotifyTrack[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTopTracks = async () => {
      setIsLoading(true);

      try {
        const response = await fetch("/api/spotify/top-tracks");
        const result = await response.json();
        setTopTracks(result.userTopTracks.tracks.items);
      } catch (error) {
        console.error("Error fetching top tracks", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopTracks();
  }, []);

  if (isLoading) {
    return <div>Loading top tracks...</div>;
  }

  return (
    <div>
      <h2 className="text-center p-10">Your Top Tracks</h2>
      {topTracks && Array.isArray(topTracks) ? (
        <div className="grid grid-cols-3 gap-4">
          {topTracks.slice(0, 6).map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      ) : (
        "No tracks found"
      )}
    </div>
  );
};

export default TopTracks;
