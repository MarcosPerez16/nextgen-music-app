export interface SpotifyUserProfile {
  display_name: string;
  followers: {
    total: number;
  };
  email: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  collaborative: boolean;
  public: boolean;
  href: string;
  uri: string;
  snapshot_id: string;
  type: string;
  primary_color: string | null;
  external_urls: {
    spotify: string;
  };
  images: Array<{
    url: string;
    height: number | null;
    width: number | null;
  }> | null;
  owner: {
    display_name: string;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  tracks: {
    href: string;
    total: number;
  };
}

export interface SpotifyArtist {
  id: string;
  name: string;
  type: string;
  uri: string;
  href: string;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  album_type: string;
  total_tracks: number;
  release_date: string;
  release_date_precision: string;
  type: string;
  uri: string;
  href: string;
  is_playable: boolean;
  artists: SpotifyArtist[];
  available_markets: string[];
  external_urls: {
    spotify: string;
  };
  images: Array<{
    height: number;
    url: string;
    width: number;
  }>;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  type: string;
  uri: string;
  href: string;
  popularity: number;
  duration_ms: number;
  explicit: boolean;
  is_local: boolean;
  is_playable: boolean;
  preview_url: string | null;
  track_number: number;
  disc_number: number;
  available_markets: string[];
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  external_ids: {
    isrc: string;
  };
  external_urls: {
    spotify: string;
  };
}

export interface TrackInfoProps {
  track: SpotifyTrack;
  showLikeButton?: boolean;
  showAddToPlaylist?: boolean;
  showRemoveButton?: boolean;
  playlistId?: string;
  deleteTrack?: (spotifyId: string) => void;
  showPlayButton?: boolean;
}

export interface TrackCardProps {
  track: SpotifyTrack;
}

//interfaces for the Web Playback SDK
export interface SpotifyPlayer {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (
    event:
      | "ready"
      | "not_ready"
      | "initialization_error"
      | "authentication_error"
      | "account_error"
      | "player_state_changed",
    callback: (data: unknown) => void
  ) => void;
  removeListener: (
    event: string,
    callback?: (...args: unknown[]) => void
  ) => void;
  getCurrentState: () => Promise<SpotifyPlayerState | null>;
  setName: (name: string) => Promise<void>;
  getVolume: () => Promise<number>;
  setVolume: (volume: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  togglePlay: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  previousTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
}

export interface SpotifyPlayerState {
  context: {
    uri: string;
    metadata: unknown;
  };
  disallows: {
    pausing: boolean;
    seeking: boolean;
    skipping_next: boolean;
    skipping_prev: boolean;
  };
  paused: boolean;
  position: number;
  repeat_mode: number;
  shuffle: boolean;
  track_window: {
    current_track: SpotifyTrack;
    previous_tracks: SpotifyTrack[];
    next_tracks: SpotifyTrack[];
  };
}

// Global window extensions
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady?: () => void;
    Spotify?: {
      Player: new (options: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
      }) => SpotifyPlayer;
    };
  }
}

export interface MiniPlayerProps {
  currentTrack: SpotifyTrack | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  handleSeek: (percentage: number) => void;
  volume: number;
  handleVolumeChange: (percentage: number) => void;
}
