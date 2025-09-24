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
}));
