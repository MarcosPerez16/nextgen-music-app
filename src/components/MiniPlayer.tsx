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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
      <div className="max-w-screen-xl mx-auto">
        {/* Progress bar - spans full width */}
        {currentTrack && (
          <div className="mb-3">
            <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
              <span>{formatTime(position)}</span>
              <div className="flex-1">
                <Slider
                  value={[progressPercentage]}
                  max={100}
                  step={0.1}
                  onValueChange={onSeekChange}
                  className="w-full"
                />
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

        {/* Main player controls */}
        <div className="flex items-center justify-between">
          {/* Track info section */}
          <div className="flex items-center space-x-3 flex-1">
            {currentTrack ? (
              <>
                {/* Album artwork */}
                <div className="w-12 h-12 bg-gray-300 rounded overflow-hidden relative">
                  {currentTrack.album.images?.[0] && (
                    <Image
                      src={currentTrack.album.images[0].url}
                      alt={currentTrack.album.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{currentTrack.name}</p>
                  <p className="text-sm text-gray-600 truncate">
                    {currentTrack.artists
                      .map((artist) => artist.name)
                      .join(", ")}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-gray-500">No track playing</p>
            )}
          </div>

          {/* Controls section */}
          <div className="flex items-center space-x-2 mx-8">
            <Button variant="outline" size="sm" onClick={onPrevious}>
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={isPlaying ? onPause : onPlay}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            <Button variant="outline" size="sm" onClick={onNext}>
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Volume section */}
          <div className="flex items-center space-x-2 flex-1 justify-end">
            <Volume2 className="h-4 w-4 text-gray-600" />
            <div className="w-24">
              <Slider
                value={[volume]}
                max={100}
                step={1}
                onValueChange={onVolumeChange}
                className="w-full"
              />
            </div>
            <span className="text-xs text-gray-500 w-8 text-right">
              {Math.round(volume)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
