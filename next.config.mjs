/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produce a minimal standalone server (.next/standalone/server.js) with a much
  // smaller runtime memory footprint — needed for Render's 512MB free tier.
  output: "standalone",
};

export default nextConfig;
