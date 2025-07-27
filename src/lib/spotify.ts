import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const refreshSpotifyToken = async (oldRefreshToken: string) => {
  //set up the API endpoint and credentials
  const url = "https://accounts.spotify.com/api/token";
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

  //build the request payload
  const payload = {
    method: "POST",
    headers: {
      // tell spotify what format we're sending data in
      "Content-Type": "application/x-www-form-urlencoded",

      //   authenticate our app to spotify using basic auth
      //buffer.from() encodes "clientId: clientSecret" in base64 format
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString("base64")}`,
    },

    // the actual data we're sending to spotify
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: oldRefreshToken,
      client_id: clientId,
    }),
  };

  //   make the actual API call to spotify

  const response = await fetch(url, payload);
  const data = await response.json();

  //   return new tokens for our app to use
  return data;
};

// ensures we always have a valid (non-expired) access token for Spotify API calls
export const getValidAccessToken = async (userId: string) => {
  //get user from db, which gets us their current tokens and expiration time
  const user = await prisma.user.findUnique({
    where: {
      spotifyId: userId,
    },
  });

  //handle case where user doesn't exist
  if (!user) {
    return null;
  }

  //check if the access token is expired
  const currentTime = new Date();

  if (currentTime < user.expiresAt) {
    // token has not expired can still be used
    return user.accessToken;
  } else {
    //token is expired
    //1.call refresh function
    //calls spotify's API with our old refresh token
    const newTokens = await refreshSpotifyToken(user.refreshToken);

    //2. save new tokens to database
    //replaces the old expired tokens with fresh ones
    await prisma.user.update({
      where: { spotifyId: userId },
      data: {
        accessToken: newTokens.access_token,
        refreshToken: newTokens.refresh_token,
        expiresAt: new Date(Date.now() + newTokens.expires_in * 1000),
      },
    });
    //return new access token
    return newTokens.access_token;
  }
};
