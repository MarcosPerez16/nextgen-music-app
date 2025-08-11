import { SpotifyUserProfile } from "@/types/spotify";

interface UserProfileProps {
  userProfile: SpotifyUserProfile;
}

const UserProfile = ({ userProfile }: UserProfileProps) => {
  return (
    <div>
      <h1>Welcome, {userProfile.display_name}</h1>
      <p>Follwers: {userProfile.followers.total}</p>
      <p>Email: {userProfile.email}</p>
    </div>
  );
};

export default UserProfile;
