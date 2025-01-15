/** @type {import('next').NextConfig} */
require('dotenv').config(); 

const nextConfig = {
  reactStrictMode: false,
  distDir: "build",
  swcMinify: false,
  publicRuntimeConfig: {
    network: "mainnet-beta",
    rpcUrl: process.env.MAINNET_RPC,
    // rpcUrl: "https://api.devnet.solana.com",
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
      // FIX this
      // Disable minimize to make it work with Candy Machine template
      // minimization brakes Public Key names
      config.optimization.minimize = true;
    }
    return config;
  },
  images: {
    domains: ['arweave.net', 'www.arweave.net'],
  },
  //avoiding CORS error, more here: https://vercel.com/support/articles/how-to-enable-cors
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  },
};
module.exports = nextConfig
