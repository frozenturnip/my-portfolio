/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true,
  },

  reactStrictMode: true,

  // 🧩 Turbopack compatibility
  // Allow `any` here since Next's webpack config shape is complex and this is a small env shim
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webpack: (config: any) => {
    config.resolve.alias.canvas = false;
    return config;
  },

  // ✅ New line: empty turbopack config to silence warning
  turbopack: {},
};

export default nextConfig;
