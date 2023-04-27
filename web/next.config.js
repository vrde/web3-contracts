const { readFileSync } = require("fs");

const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
const path = `../deployments/${chainId}.network.json`;
const networkConfig = JSON.parse(readFileSync(path, "utf8"));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["../lib"],
  env: {
    NETWORK_CONFIG: networkConfig,
  },
};

module.exports = nextConfig;
