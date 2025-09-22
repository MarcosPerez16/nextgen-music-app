"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "@/types/auth";
import "@/types/spotify";
import { SpotifyPlayer } from "@/types/spotify";

const WebPlaybackPlayer = () => {
  const { data: session } = useSession();

  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);

  useEffect(() => {
    const loadSpotifySDK = () => {
      //cast session to include our custom spotify props
      const extendedSession = session as ExtendedSession;

      //only proceed if we have a session with access token
      if (!extendedSession.accessToken) {
        console.error("No access token available");
        return;
      }

      const accessToken = extendedSession.accessToken;

      // Check if script already exists
      if (document.querySelector('script[src*="spotify-player"]')) {
        setSdkLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      window.onSpotifyWebPlaybackSDKReady = () => {
        console.log("Spotify SDK is ready");

        const player = new window.Spotify!.Player({
          name: "My Web Player",
          getOAuthToken: (cb) => {
            cb(accessToken);
          },
        });

        //connect player
        player.connect();

        player.addListener("ready", (data) => {
          const { device_id } = data as { device_id: string };
          console.log("Ready with Device ID", device_id);
        });

        player.addListener("not_ready", (data) => {
          const { device_id } = data as { device_id: string };
          console.log("Device ID has gone offline", device_id);
        });

        setPlayer(player);
        setSdkLoaded(true);
      };

      document.head.appendChild(script);
    };

    //CHECK STATUS FUNCTION
    const checkPremiumStatus = async () => {
      //only proceed if user is logged in
      if (!session) {
        setIsLoading(false);
        return;
      }

      try {
        //call API route
        const response = await fetch("/api/user/premium-status");
        //parse data
        const premiumStatusData = await response.json();

        //update state with result
        setIsPremium(premiumStatusData.isPremium);

        //if user is premium, load the SDK
        if (premiumStatusData.isPremium) {
          loadSpotifySDK();
        }
      } catch (error) {
        console.error("Failed to check premium status.", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkPremiumStatus();
  }, [session]);

  if (isLoading) {
    return <div>Checking subscription status...</div>;
  }

  //mesage for non-premium users
  if (!isPremium) {
    return <div>Spotify Premium required for playback</div>;
  }

  return (
    <div>
      <h2>Spotify Web Player</h2>
      <p>Premium user detected - Ready to load SDK</p>
    </div>
  );
};

export default WebPlaybackPlayer;
