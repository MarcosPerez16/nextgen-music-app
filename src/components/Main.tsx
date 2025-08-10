import { SpotifyUserProfile } from "@/types/spotify";
import { Skeleton } from "./ui/skeleton";

interface MainProps {
  userProfile: SpotifyUserProfile | null;
  isLoading: boolean;
}

const Main = ({ userProfile, isLoading }: MainProps) => {
  if (isLoading || !userProfile) {
    return (
      <main className="p-4">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </main>
    );
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
