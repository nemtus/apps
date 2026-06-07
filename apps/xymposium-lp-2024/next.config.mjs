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

// `next dev` 実行時に Cloudflare のバインディング(env など)を利用可能にする。
// この関数は workerd プロセスを起動するため、Storybook build や next build で実行されると
// workerd が残存してプロセスが終了せずハングする。`npm run dev` のときだけ呼び出す。
if (process.env.npm_lifecycle_event === "dev") {
  initOpenNextCloudflareForDev();
}
