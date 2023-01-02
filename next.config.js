/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["pbs.twimg.com", "abs.twimg.com"],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/stat/:region",
        destination: "https://:region.google-analytics.com/g/collect",
      },
    ];
  },
};

const withTM = require("next-transpile-modules")(["react-daisyui"]);

module.exports = withTM(nextConfig);
