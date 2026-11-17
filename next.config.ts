import type { NextConfig } from "next";

// Static export, served from https://<user>.github.io/nextjs-heavy-widgets/
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/nextjs-heavy-widgets",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
