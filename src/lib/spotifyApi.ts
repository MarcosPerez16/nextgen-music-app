import { getValidAccessToken } from "./spotify";

// USER PROFILE FUNCTION
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

  return { profile: data };
};

// USER PLAYLISTS FUNCTION
export const fetchSpotifyUserPlaylists = async (userId: string) => {
  //grab valid user access token
  const accessToken = await getValidAccessToken(userId);

  //no valid access token throw error
  if (!accessToken) {
    throw new Error("User must be logged in");
  }

  const userPlaylist = await fetch("https://api.spotify.com/v1/me/playlists", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  //check if spotify said success or error
  if (!userPlaylist.ok) {
    throw new Error("Could not fetch user data ");
  }

  const data = await userPlaylist.json();

  //we return the data wrapped in a object because
  //its more explicit about what the data is
  //easier to add metadata later
  //consistent with how APIs usually return data
  return { playlists: data.items };
};

// TOP TRACKS FUNCTION
export const fetchSpotifyUserTopTracks = async (userId: string) => {
  //grab valid user access token
  const accessToken = await getValidAccessToken(userId);

  //no valid access token throw error
  if (!accessToken) {
    throw new Error("User must be logged in");
  }

  const userTopTracks = await fetch(
    "https://api.spotify.com/v1/me/top/tracks",
    {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  //check if spotify said success or error
  if (!userTopTracks.ok) {
    throw new Error("Could not fetch user data ");
  }

  const data = await userTopTracks.json();

  return { tracks: data };
};
