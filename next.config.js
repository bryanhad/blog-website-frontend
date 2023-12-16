/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {hostname: 'localhost'}
    ],
    deviceSizes: [576, 768, 992, 1200, 1400] //this uses the bootstrap's break point
  }
}

module.exports = nextConfig
