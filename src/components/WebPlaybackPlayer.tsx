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

  // // real-time position updates
  useEffect(() => {
    let positionInterval: NodeJS.Timeout;

    if (isPlaying && currentTrack) {
      positionInterval = setInterval(() => {
        const currentPos = usePlayerStore.getState().position;
        const duration = usePlayerStore.getState().duration;

        // Only increment if we haven't reached the end
        if (currentPos + 1000 <= duration) {
          usePlayerStore.getState().setPosition(currentPos + 1000);
        }
      }, 1000);
    }

    // Cleanup interval when paused or component unmounts
    return () => {
      if (positionInterval) {
        clearInterval(positionInterval);
      }
    };
  }, [isPlaying, currentTrack]);

  // Player control handlers
  const handlePlay = () => spotifyPlayerManager.player?.resume();
  const handlePause = () => spotifyPlayerManager.player?.pause();

  // Queue-aware next/previous handlers
  const handleNext = async () => {
    const nextTrack = usePlayerStore.getState().nextTrack();

    if (nextTrack && deviceId) {
      // Play the next track from our queue
      try {
        const response = await fetch("/api/spotify/play", {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            trackUri: nextTrack.uri || `spotify:track:${nextTrack.id}`,
            deviceId: deviceId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to play next track");
        }
      } catch (error) {
        console.error("Error playing next track:", error);
      }
    } else {
      // No more tracks in queue
      console.log("End of queue reached");
    }
  };

  const handlePrevious = async () => {
    const prevTrack = usePlayerStore.getState().previousTrack();

    if (prevTrack && deviceId) {
      // Play the previous track from our queue
      try {
        const response = await fetch("/api/spotify/play", {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            trackUri: prevTrack.uri || `spotify:track:${prevTrack.id}`,
            deviceId: deviceId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to play previous track");
        }
      } catch (error) {
        console.error("Error playing previous track:", error);
      }
    } else {
      // No previous tracks in queue
      console.log("Beginning of queue reached");
    }
  };

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
