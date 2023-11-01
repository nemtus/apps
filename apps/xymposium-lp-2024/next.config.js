const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [],
  publicExcludes: ["!**/*"],
  buildExcludes: [() => true],
  fallbacks: false,
  cacheStartUrl: false,
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  // i18n: {
  //   locales: ["en", "ja"],
  //   defaultLocale: "en",
  // },
  images: {
    domains: ["https://www.google.com/maps/"],
  },
  reactStrictMode: true,
});

module.exports = nextConfig;
