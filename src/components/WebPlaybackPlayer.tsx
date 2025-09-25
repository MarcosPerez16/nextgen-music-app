"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "@/types/auth";
import MiniPlayer from "./MiniPlayer";
import { usePlayerStore } from "@/lib/stores/playerStore";
import spotifyPlayerManager from "@/lib/spotifyPlayerManager";

const WebPlaybackPlayer = () => {
  const { data: session } = useSession();
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    deviceId,
    currentTrack,
    isPlaying,
    position,
    duration,
    volume,
    handleExternalUpdate,
    setVolume,
  } = usePlayerStore();

  // Check premium status when session changes
  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!session) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/user/premium-status");
        const premiumStatusData = await response.json();
        setIsPremium(premiumStatusData.isPremium);
      } catch (error) {
        console.error("Failed to check premium status.", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkPremiumStatus();
  }, [session]);

  // Set up external player callback
  useEffect(() => {
    spotifyPlayerManager.setStateUpdateCallback(handleExternalUpdate);
  }, [handleExternalUpdate]);

  // Initialize player when premium status becomes true
  useEffect(() => {
    const initializeExternalPlayer = async () => {
      const extendedSession = session as ExtendedSession;
      if (extendedSession?.accessToken) {
        await spotifyPlayerManager.initialize(extendedSession.accessToken);
      }
    };

    if (isPremium && session) {
      initializeExternalPlayer();
    }
  }, [isPremium, session]);

  // Player control handlers
  const handlePlay = () => spotifyPlayerManager.player?.resume();
  const handlePause = () => spotifyPlayerManager.player?.pause();
  const handleNext = () => spotifyPlayerManager.player?.nextTrack();
  const handlePrevious = () => spotifyPlayerManager.player?.previousTrack();

  const handleSeek = (percentage: number) => {
    if (spotifyPlayerManager.player && duration > 0) {
      const newPosition = (percentage / 100) * duration;
      spotifyPlayerManager.player.seek(newPosition);
    }
  };

  const handleVolumeChange = (percentage: number) => {
    if (spotifyPlayerManager.player) {
      const volumeLevel = percentage / 100;
      spotifyPlayerManager.player.setVolume(volumeLevel);
      setVolume(percentage);
    }
  };

  if (isLoading) {
    return <div>Checking subscription status...</div>;
  }

  if (!isPremium) {
    return <div>Spotify Premium required for playback</div>;
  }

  return (
    <div>
      {!deviceId ? (
        <p>Loading player...</p>
      ) : (
        <MiniPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          position={position}
          duration={duration}
          onPlay={handlePlay}
          onPause={handlePause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          handleSeek={handleSeek}
          volume={volume}
          handleVolumeChange={handleVolumeChange}
        />
      )}
    </div>
  );
};

export default WebPlaybackPlayer;
