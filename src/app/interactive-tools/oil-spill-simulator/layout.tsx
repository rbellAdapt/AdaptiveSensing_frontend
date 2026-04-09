import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Oil Spill Simulator | AdaptiveSensing.io",
  description: "Dynamic simulation for subsea blowout and methane seep thermodynamics.",
  openGraph: {
    title: "Oil Spill Simulator | AdaptiveSensing.io",
    description: "Dynamic simulation for subsea blowout and methane seep thermodynamics.",
    url: 'https://adaptivesensing.io/interactive-tools/oil-spill-simulator',
  }
};

export default function OilSpillSimulatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
