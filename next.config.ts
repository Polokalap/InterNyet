import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
    serverActions: {
      bodySizeLimit: "10mb",
    },
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
        source: "/logout",
        destination: "/account/logout",
        permanent: true,
      },
      {
        source: "/login",
        destination: "/account/login",
        permanent: true,
      },
      {
        source: "/register",
        destination: "/account/register",
        permanent: true,
      }
    ]
  }
};

export default nextConfig;
