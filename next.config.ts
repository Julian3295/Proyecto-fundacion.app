import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    localPatterns: [
      {
        pathname: '/images/**',
        search: '',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.rawg.io',
      },
    ],
  },
};

export default nextConfig;