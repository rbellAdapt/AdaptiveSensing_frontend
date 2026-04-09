import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dissolved Gas Calculators | AdaptiveSensing.io",
  description: "Scientific calculators for oceanographic and atmospheric applications, including TEOS-10 Seawater Properties and CO2SYS.",
  openGraph: {
    title: "Dissolved Gas Calculators | AdaptiveSensing.io",
    description: "Scientific calculators for oceanographic and atmospheric applications.",
    url: 'https://adaptivesensing.io/dissolved-gas-calculators',
  }
};

export default function DissolvedGasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
