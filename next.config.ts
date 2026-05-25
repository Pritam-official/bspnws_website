import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    // @ts-ignore
    allowedDevOrigins: ["surrogate-onlooker-graveyard.ngrok-free.dev"],
  },
  reactCompiler: false,
};

export default nextConfig;
