import { SpotifyUserProfile } from "@/types/spotify";

interface MainProps {
  userProfile: SpotifyUserProfile | null;
}

const Main = ({ userProfile }: MainProps) => {
  if (!userProfile) {
    return <div>Loading user data...</div>;
  }

  return (
    <main className="p-4">
      <h1>Welcome, {userProfile.display_name}</h1>
      <p>Follwers: {userProfile.followers.total}</p>
      <p>Email: {userProfile.email}</p>
      {/* add more info here */}
    </main>
  );
};

export default Main;
