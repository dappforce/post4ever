/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["pbs.twimg.com", "abs.twimg.com"],
  },
};

const withTM = require('next-transpile-modules')(['react-daisyui']);

module.exports = withTM(nextConfig);
