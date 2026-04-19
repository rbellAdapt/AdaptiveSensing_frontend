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
  metadataBase: new URL('https://adaptivesensing.io'),
  title: "AdaptiveSensing.io | Atmospheric & Subsea Analytics",
  description: "Adaptive Decision Support for Complex Atmospheric Plumes & Extreme Environments. Bridging the gap between physical instrumentation and algorithmic data science.",
  openGraph: {
    title: "AdaptiveSensing.io | Atmospheric & Subsea Analytics",
    description: "Adaptive Decision Support for Complex Atmospheric Plumes & Extreme Environments.",
    url: 'https://adaptivesensing.io',
    siteName: 'AdaptiveSensing.io',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AdaptiveSensing.io Architecture',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "AdaptiveSensing.io | Atmospheric & Subsea Analytics",
    description: "Adaptive Decision Support for Complex Atmospheric Plumes & Extreme Environments.",
    images: ['/og-image.jpg'],
  },
};

import Navigation from "@/components/ui/Navigation";
import { Analytics } from "@vercel/analytics/next";
import { NextAuthProvider } from '@/components/NextAuthProvider';
import { AuthWrapper } from '@/components/AuthWrapper';

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
        <NextAuthProvider>
          <AuthWrapper>
            <div className="flex flex-col min-h-screen">
              <Navigation />
              <main className="pt-16 flex-grow">
                {children}
              </main>
              <footer className="w-full py-6 mt-12 text-center text-xs text-slate-500 font-mono border-t border-slate-800/50">
                &copy; {new Date().getFullYear()} AdaptiveSensing.io | Built by Ryan Bell
              </footer>
            </div>
          </AuthWrapper>
          <Analytics />
        </NextAuthProvider>
      </body>
    </html>
  );
}
