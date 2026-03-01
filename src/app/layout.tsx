import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

import { AppContextProvider } from "@/context/AppContext";
import CommandPalette from "@/components/command-palette/command-palette";
import AmongUsEasterEgg from "@/components/easter-egg/amoung-us";
import { Toaster } from "@/components/ui/sonner";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";
import PageLoader from "@/components/ui/PageLoader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
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
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable} no-scrollbar`}>
      <body className="relative antialiased bg-black text-primaryText no-scrollbar">
        <AppContextProvider>
          <PageLoader />
          <AnalyticsTracker />
          {/* <SparkleBackground /> */}
          <AmongUsEasterEgg />
          {children}
          <CommandPalette />
          <Toaster />
        </AppContextProvider>
      </body>
    </html>
  );
}
