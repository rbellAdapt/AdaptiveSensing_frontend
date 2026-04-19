import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/simulate/:path*",
        destination: "https://uas-plume-tracker-802451771317.us-west3.run.app/api/simulate/:path*",
      },
    ];
  },
};

export default nextConfig;
