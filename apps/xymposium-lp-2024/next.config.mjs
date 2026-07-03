import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // このアプリは monorepo (nemtus/apps) 内の standalone パッケージ (apps/* は独自の
  // package-lock.json を持つ)。Next はリポジトリ root の package-lock.json も検出して
  // workspace root を誤推定し、turbopack / outputFileTracing の警告を出す。実体である
  // このディレクトリを明示的に root に固定して黙らせる (推定ではなく確定させる)。
  turbopack: {
    root: import.meta.dirname,
  },
  outputFileTracingRoot: import.meta.dirname,
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
