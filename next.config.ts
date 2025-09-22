import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-87b84208ccf34255b805f85fec3df301.r2.dev',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
