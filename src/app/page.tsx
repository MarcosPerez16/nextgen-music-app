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

  // Send logged-in users to dashboard
  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  // Show login card for non-logged-in users
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Welcome to NextGen Music</CardTitle>
          <CardDescription>Login with your Spotify account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => signIn()}>
            <Music className="mr-2 h-4 w-4" />
            Login with Spotify
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
