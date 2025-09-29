import { useState, useEffect } from "react";
import { SpotifyTrack } from "@/types/spotify";
import TrackCard from "./TrackCard";
import { Loader2 } from "lucide-react";

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
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 bg-white/80 backdrop-blur-sm p-3 rounded-lg">
        Your Top Tracks
      </h2>
      {topTracks && Array.isArray(topTracks) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl">
          {topTracks.slice(0, 6).map((track, index) => (
            <TrackCard
              key={track.id}
              track={track}
              allTracks={topTracks.slice(0, 6)}
              trackIndex={index}
              playbackContext="dashboard"
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No tracks found</p>
      )}
    </div>
  );
};

export default TopTracks;
