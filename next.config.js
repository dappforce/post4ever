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
};

const withTM = require("next-transpile-modules")(["react-daisyui"]);

module.exports = withTM(nextConfig);
