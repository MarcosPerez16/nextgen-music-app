"use client";
import Footer from "@/components/Footer";
import Main from "@/components/Main";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SpotifyUserProfile } from "@/types/spotify";
import { ExtendedSession } from "@/types/auth";
import { Loader2 } from "lucide-react";

const DashBoard = () => {
  const [userProfile, setUserProfile] = useState<SpotifyUserProfile | null>(
    null
  );
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  //client side auth check
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session) {
        router.push("/");
        return;
      }

      //if we have session, get user data
      //TypeScript type casting: "This session has both default + our custom Spotify properties
      const extendedSession = session as Session & ExtendedSession;
      const spotifyId = extendedSession.spotifyId;

      if (spotifyId) {
        setIsLoadingProfile(true);
        try {
          const userData = await fetch("/api/spotify-profile");
          const result = await userData.json();

          setUserProfile(result.userProfile.profile);
          setIsLoadingProfile(false);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [session, router]);

  //dont render anything until we have a session
  if (!session) {
    return (
      <div>
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Main userProfile={userProfile} isLoading={isLoadingProfile} />

      <Footer />
    </div>
  );
};

export default DashBoard;
