import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Allow optional photo/clip uploads via Server Actions.
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
