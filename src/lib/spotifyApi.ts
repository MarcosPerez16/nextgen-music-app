import { getValidAccessToken } from "./spotify";

export const fetchSpotifyUserProfile = async (userId: string) => {
  //get valid token using existing function
  const accessToken = await getValidAccessToken(userId);

  //if no valid access token throw error
  if (!accessToken) {
    throw new Error("User must be logged in");
  }

  const userProfile = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  //check if spotify said success or error
  if (!userProfile.ok) {
    throw new Error("Could not fetch user data ");
  }

  const data = await userProfile.json();

  return data;
};
