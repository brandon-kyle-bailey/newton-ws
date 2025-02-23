import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "coin-images.coingecko.com",
        pathname: "/coins/images/**",
      }
    ]
  }
};

export default nextConfig;
