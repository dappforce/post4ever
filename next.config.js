/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {},
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: {
        loader: "@svgr/webpack",
        options: {
          svgoConfig: {
            plugins: [
              {
                name: "removeViewBox",
                active: false,
              },
            ],
          },
        },
      },
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
