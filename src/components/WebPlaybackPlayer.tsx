"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "@/types/auth";
import "@/types/spotify";
import {
  SpotifyPlayer,
  SpotifyPlayerState,
  SpotifyTrack,
} from "@/types/spotify";
import MiniPlayer from "./MiniPlayer";

const WebPlaybackPlayer = () => {
  const { data: session } = useSession();

  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);

  const handlePlay = () => player?.resume();
  const handlePause = () => player?.pause();
  const handleNext = () => player?.nextTrack();
  const handlePrevious = () => player?.previousTrack();

  const handleSeek = (percentage: number) => {
    if (player && duration > 0) {
      const newPosition = (percentage / 100) * duration;
      player.seek(newPosition);
    }
  };

  const handleVolumeChange = (percentage: number) => {
    if (player) {
      const volumeLevel = percentage / 100;
      player.setVolume(volumeLevel);
      setVolume(percentage);
    }
  };

  useEffect(() => {
    const loadSpotifySDK = () => {
      const extendedSession = session as ExtendedSession;

      if (!extendedSession.accessToken) {
        console.error("No access token available");
        return;
      }

      const accessToken = extendedSession.accessToken;

      if (document.querySelector('script[src*="spotify-player"]')) {
        setSdkLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify!.Player({
          name: "My Web Player",
          getOAuthToken: (cb) => {
            cb(accessToken);
          },
        });

        player.connect();

        player.addListener("ready", (data) => {
          const { device_id } = data as { device_id: string };
          console.log("Ready with Device ID", device_id);

          // Get initial volume
          player.getVolume().then((volume) => {
            setVolume(volume * 100);
          });
        });

        player.addListener("not_ready", (data) => {
          const { device_id } = data as { device_id: string };
          console.log("Device ID has gone offline", device_id);
        });

        player.addListener("player_state_changed", (data) => {
          const state = data as SpotifyPlayerState | null;
          if (state) {
            setIsPlaying(!state.paused);
            setCurrentTrack(state.track_window.current_track);
            setPosition(state.position);
            setDuration(state.track_window.current_track.duration_ms);
          }
        });

        setPlayer(player);
        setSdkLoaded(true);
      };

      document.head.appendChild(script);
    };

    const checkPremiumStatus = async () => {
      if (!session) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/user/premium-status");
        const premiumStatusData = await response.json();

        setIsPremium(premiumStatusData.isPremium);

        if (premiumStatusData.isPremium) {
          loadSpotifySDK();
        }
      } catch (error) {
        console.error("Failed to check premium status.", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkPremiumStatus();
  }, [session]);

  if (isLoading) {
    return <div>Checking subscription status...</div>;
  }

  if (!isPremium) {
    return <div>Spotify Premium required for playback</div>;
  }

  return (
    <div>
      {!sdkLoaded ? (
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
