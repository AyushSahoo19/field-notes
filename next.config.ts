import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.NEXT_PUBLIC_PAGES_BASE !== undefined && {
    basePath: process.env.NEXT_PUBLIC_PAGES_BASE,
  }),
};

export default nextConfig;
