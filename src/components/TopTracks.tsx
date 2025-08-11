import { useState, useEffect } from "react";
import { SpotifyTrack } from "@/types/spotify";

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
      <h2>Your Top Tracks</h2>
      {topTracks && Array.isArray(topTracks)
        ? `Found ${topTracks.length} top tracks!`
        : "No tracks found"}
    </div>
  );
};

export default TopTracks;
