import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  reactCompiler: true,

  devIndicators: {
    position: "bottom-right",
  },
  typedRoutes: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pathcourse.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
    ],
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  experimental: {
    webpackMemoryOptimizations: true,
  },
};

export default nextConfig;
