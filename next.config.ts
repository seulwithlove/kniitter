import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["pdf-parse", "canvas", "pdf-img-convert"],
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb", // image size setting : <= 10MB
    },
  },
};

export default nextConfig;
