import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  allowedDevOrigins: ['172.29.86.135'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};
export default nextConfig;
