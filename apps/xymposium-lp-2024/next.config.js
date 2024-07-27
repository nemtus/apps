/** @type {import('next').NextConfig} */
const nextConfig = {
  // i18n: {
  //   locales: ["en", "ja"],
  //   defaultLocale: "en",
  // },
  images: {
    remotePatterns: [{ hostname: "www.google.com" }],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
