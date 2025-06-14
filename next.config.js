/** @type {import('next').NextConfig} */
const config = require('./config');

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  env: {
    ...config,
  },
  // Ensure config.js is included in the build
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
