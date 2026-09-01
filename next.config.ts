import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
