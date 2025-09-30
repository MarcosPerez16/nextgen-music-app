"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import TrackInfo from "@/components/TrackInfo";
import { SpotifyTrack } from "@/types/spotify";
import { Card, CardContent } from "@/components/ui/card";

const Search = () => {
  const [input, setInput] = useState("");
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //return early if no input
    if (!input) {
      return;
    }
    handleSearch();
  };

  const handleSearch = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/spotify/search?q=${input}`);
      const data = await response.json();
      setTracks(data.tracks);

      setIsLoading(false);
    } catch (error) {
      console.error("Error searching for tracks", error);
      setIsLoading(false);
      setTracks([]);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Search For Your Favorite Tracks!
      </h1>

      {/* Search form */}
      <Card className="mb-8 border-purple-200 bg-gradient-to-r from-purple-50 to-white max-w-2xl mx-auto">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={input}
              onChange={handleInput}
              placeholder="Search for songs, artists, or albums..."
              className="flex-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6"
            >
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      )}

      {/* Search results */}
      {!isLoading && tracks.length > 0 && (
        <div className="space-y-3 max-w-4xl mx-auto">
          {tracks.map((track, index) => (
            <TrackInfo
              key={track.id}
              track={track}
              allTracks={tracks}
              trackIndex={index}
              playbackContext="search"
              showAddToPlaylist={true}
              showPlayButton={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
