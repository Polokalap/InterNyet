import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: "/faq",
        destination: "/posts/faq",
        permanent: true,
      },
      {
        source: "/rules",
        destination: "/posts/rules",
        permanent: true,
      },
      {
        source: "/logout",
        destination: "/account/logout",
        permanent: true,
      }
    ]
  }
};

export default nextConfig;
