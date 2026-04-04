import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/simulate/:path*",
        destination: "https://uas-plume-tracker-802451771317.us-west3.run.app/api/simulate/:path*",
      },
      {
        source: "/api/bca-seawater",
        destination: "https://bca-dissolved-gas-calculator-720721335459.us-central1.run.app/bca-seawater",
      },
      {
        source: "/api/bca-dissgas-calculator",
        destination: "https://bca-dissolved-gas-calculator-720721335459.us-central1.run.app/bca-dissgas-calculator",
      },
      {
        source: "/api/bca-partial-pressure-calculator",
        destination: "https://bca-dissolved-gas-calculator-720721335459.us-central1.run.app/bca-partial-pressure-calculator",
      },
    ];
  },
};

export default nextConfig;
