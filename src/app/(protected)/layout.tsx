import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NextGen Music",
  description: "Your personal music streaming platform",
  icons: {
    icon: [{ url: "/icons8-music-50.png", sizes: "50x50", type: "image/png" }],
  },
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
