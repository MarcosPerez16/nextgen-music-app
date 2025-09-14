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
}
