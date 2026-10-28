import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    // AVIF first (~20% smaller than WebP), WebP for older browsers.
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/juniors-digital.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/portfolio.html",
        destination: "/work",
        permanent: true,
      },
      {
        source: "/start-a-project.html",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/get-a-quote.html",
        destination: "/contact",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
