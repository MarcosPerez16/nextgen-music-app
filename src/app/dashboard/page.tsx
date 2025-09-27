"use client";
import Footer from "@/components/Footer";
import Main from "@/components/Main";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const DashBoard = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const userData = await fetch("/api/spotify-profile");
      const result = await userData.json();
      return result.userProfile.profile;
    },
    enabled: !!session,
    staleTime: 30 * 60 * 1000,
  });

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
