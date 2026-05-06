import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.rawg.io', // <--- ESTO ES VITAL
      },
    ],
  },
};

export default nextConfig;