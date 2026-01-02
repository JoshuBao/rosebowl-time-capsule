import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Allow optional photo/clip uploads via Server Actions.
    serverActions: {
      bodySizeLimit: "10mb",
    },
    // Explicitly set Turbopack root to silence warning about multiple lockfiles
    // This tells Turbopack the project root is the 'web' directory
    turbopack: {
      root: ".",
    },
  },
};

export default nextConfig;
