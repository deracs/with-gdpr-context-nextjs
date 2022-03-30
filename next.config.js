/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  publicRuntimeConfig: {
    // Will be available on both server and client
    logger: {
      level: 'DEBUG',
    },
  },
}

module.exports = nextConfig
