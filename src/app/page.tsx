"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Music } from "lucide-react";
import { signIn } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
      <Card className="w-[450px] border-purple-700/50 bg-slate-900/90 backdrop-blur">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
            <Music className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-white">
            NextGen Music
          </CardTitle>
          <CardDescription className="text-gray-300 text-base">
            Connect your Spotify account to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => signIn()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-6 text-lg"
          >
            <Music className="mr-2 h-5 w-5" />
            Login with Spotify
          </Button>
          <p className="text-center text-sm text-gray-400">
            Spotify Premium required for playback
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
