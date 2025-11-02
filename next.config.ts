import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb", // image size setting : <= 10MB
    },
    serverComponentsExternalPackages: ["pdf-parse"],
  },
};

export default nextConfig;
