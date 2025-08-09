export interface ExtendedSession {
  spotifyId?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface CustomJWT {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  spotifyId?: string;
  error?: string;
}
