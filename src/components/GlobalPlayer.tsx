"use client";

import { useSession } from "next-auth/react";
import WebPlaybackPlayer from "./WebPlaybackPlayer";

const GlobalPlayer = () => {
  const { data: session } = useSession();
  //only render music player if user is logged in
  if (!session) {
    return;
  }

  return <WebPlaybackPlayer />;
};

export default GlobalPlayer;
