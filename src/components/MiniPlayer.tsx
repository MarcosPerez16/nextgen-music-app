"use client";

import { MiniPlayerProps } from "@/types/spotify";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import Image from "next/image";

const MiniPlayer = ({
  currentTrack,
  isPlaying,
  position,
  duration,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  handleSeek,
  volume,
  handleVolumeChange,
}: MiniPlayerProps) => {
  // Format time in mm:ss format
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  const onSeekChange = (value: number[]) => {
    handleSeek(value[0]);
  };

  const onVolumeChange = (value: number[]) => {
    handleVolumeChange(value[0]);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-950 border-t border-purple-700/50 p-4 shadow-lg">
      <div className="max-w-screen-xl mx-auto">
        {/* Progress bar */}
        {currentTrack && (
          <div className="mb-3">
            <div className="flex items-center space-x-2 text-xs text-gray-300 mb-1">
              <span className="w-10 text-right">{formatTime(position)}</span>
              <div className="flex-1">
                <Slider
                  value={[progressPercentage]}
                  max={100}
                  step={0.1}
                  onValueChange={onSeekChange}
                  className="w-full [&_.bg-primary]:bg-purple-600 [&_[role=slider]]:bg-purple-600 [&_[role=slider]]:border-purple-600"
                />
              </div>
              <span className="w-10">{formatTime(duration)}</span>
            </div>
          </div>
        )}

        {/* Main player controls */}
        <div className="flex items-center justify-between">
          {/* Track info section */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {currentTrack ? (
              <>
                <div className="w-14 h-14 bg-gray-700 rounded overflow-hidden relative flex-shrink-0">
                  {currentTrack.album.images?.[0] && (
                    <Image
                      src={currentTrack.album.images[0].url}
                      alt={currentTrack.album.name}
                      width={56}
                      height={56}
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate text-white">
                    {currentTrack.name}
                  </p>
                  <p className="text-sm text-gray-400 truncate">
                    {currentTrack.artists
                      .map((artist) => artist.name)
                      .join(", ")}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-gray-400">No track playing</p>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mx-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevious}
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              onClick={isPlaying ? onPause : onPlay}
              className="bg-purple-600 hover:bg-purple-700 text-white h-10 w-10 rounded-full"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onNext}
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          {/* Volume */}
          <div className="flex items-center space-x-2 flex-1 justify-end">
            <Volume2 className="h-4 w-4 text-gray-300" />
            <div className="w-24">
              <Slider
                value={[volume]}
                max={100}
                step={1}
                onValueChange={onVolumeChange}
                className="w-full [&_.bg-primary]:bg-purple-600 [&_[role=slider]]:bg-purple-600 [&_[role=slider]]:border-purple-600"
              />
            </div>
            <span className="text-xs text-gray-300 w-10 text-right">
              {Math.round(volume)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
