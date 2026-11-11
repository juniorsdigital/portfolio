import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  experimental: {
    // The Tailwind sheet is ~9KB gzipped. Inlining it lets the first paint happen as
    // soon as the HTML arrives instead of after a stylesheet round trip that shares
    // bandwidth with the font downloads.
    inlineCss: true,
  },
  images: {
    // AVIF first (~20% smaller than WebP), WebP for older browsers.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // No full CSP: GTM and the YouTube embeds load scripts from hosts that
          // change. frame-ancestors alone stops other sites framing the pages.
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
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
