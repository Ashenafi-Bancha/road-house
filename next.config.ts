import type { NextConfig } from "next";

/**
 * Static export: `npm run build` writes a fully static site to /out
 * that can be hosted on Vercel, Netlify, or any static host.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    // Custom loader builds responsive Unsplash (or local) URLs — no image server needed.
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
  },
};

export default nextConfig;
