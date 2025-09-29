import { SpotifyUserProfile } from "@/types/spotify";
import { Skeleton } from "./ui/skeleton";
import Playlists from "./Playlists";
import TopTracks from "./TopTracks";
import UserProfile from "./UserProfile";

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
    <main className="p-6 max-w-7xl mx-auto bg-white min-h-screen">
      <UserProfile userProfile={userProfile} />
      <Playlists />
      <TopTracks />
    </main>
  );
};

export default Main;
