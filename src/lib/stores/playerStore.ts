import { create } from "zustand";
import { SpotifyPlayer, SpotifyTrack } from "@/types/spotify";

interface PlayerState {
  //player connection data
  player: SpotifyPlayer | null;
  deviceId: string | null;
  sdkLoaded: boolean;

  //current playback state
  currentTrack: SpotifyTrack | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  volume: number;

  //actions to update state
  setPlayer: (player: SpotifyPlayer) => void;
  setDeviceId: (deviceId: string) => void;
  setSdkLoaded: (loaded: boolean) => void;
  setCurrentTrack: (currentTrack: SpotifyTrack | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setPosition: (position: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  handleExternalUpdate: (update: {
    type: string;
    [key: string]: unknown;
  }) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  // Initial state values
  player: null,
  deviceId: null,
  sdkLoaded: false,
  currentTrack: null,
  isPlaying: false,
  position: 0,
  duration: 0,
  volume: 50,

  // Actions (functions that update state)
  setPlayer: (player) => set({ player }),
  setDeviceId: (deviceId) => set({ deviceId }),
  setSdkLoaded: (loaded) => set({ sdkLoaded: loaded }),
  setCurrentTrack: (currentTrack) => set({ currentTrack }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setPosition: (position) => set({ position }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  handleExternalUpdate: (update: { type: string; [key: string]: unknown }) => {
    if (update.type === "DEVICE_READY") {
      if (typeof update.deviceId === "string") {
        set({ deviceId: update.deviceId });
      }
    } else if (update.type === "PLAYBACK_STATE") {
      set({
        isPlaying:
          typeof update.isPlaying === "boolean" ? update.isPlaying : false,
        currentTrack: update.currentTrack as SpotifyTrack | null,
        position: typeof update.position === "number" ? update.position : 0,
        duration: typeof update.duration === "number" ? update.duration : 0,
      });
    }
  },
}));
