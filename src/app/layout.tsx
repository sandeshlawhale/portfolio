import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/navbar/navbar";
import BottomNavbar from "@/components/navbar/bottom-navbar";
import { AppContextProvider } from "@/context/AppContext";
import SparkleBackground from "@/components/ui/sparkle-background";
import CommandPalette from "@/components/command-palette/command-palette";
import AmongUsEasterEgg from "@/components/easter-egg/amoung-us";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfolio | Sandesh Lawhale",
  description: "Sandesh Lawhale's Portfolio Website",
  icons: {
    icon: "/assets/me/me.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="relative antialiased bg-black text-primaryText">
        <AppContextProvider>
          <div className="w-screen h-screen flex overflow-x-hidden">
            <SparkleBackground />
            <AmongUsEasterEgg />
            <Navbar />
            <main className="w-screen flex-1 flex flex-col items-center h-screen overflow-y-auto scrollbar">
              {children}
            </main>
            <BottomNavbar />
            <CommandPalette />
            <Toaster />
          </div>
        </AppContextProvider>
        <div
          className="absolute bottom-0 left-0 right-0 h-20
             bg-black/40 backdrop-blur-xl"
          style={{
            maskImage: "linear-gradient(to bottom, transparent, black)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black)",
          }}
        />
      </body>
    </html>
  );
}
