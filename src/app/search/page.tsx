"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import TrackInfo from "@/components/TrackInfo";
import { SpotifyTrack } from "@/types/spotify";

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
    <div>
      <h1>Search For Your Favorite Tracks!</h1>
      {/* input field */}
      <form onSubmit={handleSubmit}>
        <Input value={input} onChange={handleInput} placeholder="Search" />
        <Button type="submit">Submit</Button>
      </form>
      {/* results display */}
      {isLoading && <Loader2 className="h-8 w-8 animate-spin" />}

      {!isLoading && tracks.length > 0 && (
        <div>
          {tracks.map((track) => (
            <TrackInfo key={track.id} track={track} showAddToPlaylist={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
