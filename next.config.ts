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
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8080/api/:path*"
            : `${process.env.NEXT_PUBLIC_API_URL || 'https://adaptivesensing-api-107301792697.us-central1.run.app'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
