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
