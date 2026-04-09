import { ReactNode } from "react";

export const metadata = {
  title: "UAS Plume Simulator | AdaptiveSensing.io",
  description: "Advanced Decision Support for atmospheric dispersion modeling and real-time UAS trace gas simulation. Features Google Cloud backend connectivity.",
  openGraph: {
    title: "UAS Plume Simulator | AdaptiveSensing.io",
    description: "Advanced Decision Support for atmospheric dispersion modeling and real-time UAS trace gas simulation.",
    url: 'https://adaptivesensing.io/interactive-tools/uas-plume-simulator',
  }
};

export default function UASPlumeSimulatorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
