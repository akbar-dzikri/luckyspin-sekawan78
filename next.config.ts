import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  distDir: "./dist",
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",
};

export default nextConfig;
