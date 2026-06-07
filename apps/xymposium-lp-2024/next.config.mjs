import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Cloudflare Workers では Next 標準の画像最適化は動かないため無効化する
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;

// `next dev` 実行時に Cloudflare のバインディング(env など)を利用可能にする
initOpenNextCloudflareForDev();
