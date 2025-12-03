/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  env: {
    CUSTOM_BUILD_TIME: new Date().toISOString(),
  },
};

export default nextConfig;

