"use client";

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

import { Home, ListMusic, Search, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import NextImage from "next/image";

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
    title: "Profile",
    url: "/profile",
    icon: User,
  },
];

export function AppSidebar() {
  const { data: session } = useSession();

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {sidebarMenuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className="border-t pt-2">
        {session?.user && (
          <div className="flex items-center gap-3 p-2 rounded-md bg-gray-50">
            <NextImage
              src={session.user.image || "/default-avatar.png"}
              alt="User avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex-1 text-sm">
              <div className="font-medium">{session.user.name}</div>
              <div className="text-gray-500">{session.user.email}</div>
            </div>
          </div>
        )}
        <Button
          onClick={() => signOut()}
          variant="outline"
          className="w-full mt-2"
        >
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
