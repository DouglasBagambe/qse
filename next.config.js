/** @type {import('next').NextConfig} */
const config = require("./config");

// Convert nested objects to flat environment variables
const flattenConfig = (obj, prefix = "") => {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + "_" : "";
    if (
      typeof obj[k] === "object" &&
      obj[k] !== null &&
      !Array.isArray(obj[k])
    ) {
      Object.assign(acc, flattenConfig(obj[k], pre + k));
    } else {
      // Convert all values to strings
      acc[pre + k] = String(obj[k]);
    }
    return acc;
  }, {});
};

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  env: flattenConfig(config),
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
