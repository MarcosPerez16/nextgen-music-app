"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { Heart, Home, ListMusic, Search, Music } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import spotifyPlayerManager from "@/lib/spotifyPlayerManager";

const sidebarMenuItems = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Playlists",
    url: "/playlists",
    icon: ListMusic,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "Liked Tracks",
    url: "/likedtracks",
    icon: Heart,
  },
];

export function AppSidebar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    if (spotifyPlayerManager.player) {
      try {
        await spotifyPlayerManager.player.pause();
      } catch (error) {
        console.error("Error pausing playback:", error);
      }
      spotifyPlayerManager.disconnect();
    }

    await signOut({ redirect: false });
    router.push("/");
  };

  if (!session) {
    return null;
  }

  return (
    <Sidebar className="bg-white border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Music className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">NextGen Music</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 text-xs uppercase tracking-wider px-3 py-2">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {sidebarMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                  >
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 px-3 py-2"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-4 space-y-3">
        {session?.user && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
            <NextImage
              src={session.user.image || "/default-avatar.png"}
              alt="User avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 text-sm truncate">
                {session.user.name}
              </div>
              <div className="text-gray-600 text-xs truncate">
                {session.user.email}
              </div>
            </div>
          </div>
        )}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full border-gray-300 text-gray-700 hover:bg-purple-600 hover:text-white hover:border-purple-600"
        >
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
