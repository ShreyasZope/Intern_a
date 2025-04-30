// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Other configurations might be here
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. It's recommended to fix the errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
