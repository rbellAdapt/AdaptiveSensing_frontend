import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";

const interSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AdaptiveSensing.io | Atmospheric & Subsea Analytics",
  description: "Adaptive Decision Support for Complex Atmospheric Plumes & Extreme Environments. Bridging the gap between physical instrumentation and algorithmic data science.",
};

import Navigation from "@/components/ui/Navigation";
import CloudRunPinger from "@/components/ui/CloudRunPinger";
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interSans.variable} ${firaCode.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <Navigation />
        <CloudRunPinger />
        <main className="pt-16">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
