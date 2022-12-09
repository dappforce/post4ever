/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["pbs.twimg.com", "abs.twimg.com"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/crosspost",
        permanent: true,
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

const withTM = require("next-transpile-modules")(["react-daisyui"]);

module.exports = withTM(nextConfig);
