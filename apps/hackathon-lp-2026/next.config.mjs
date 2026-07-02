/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export → served by a Cloudflare Workers Static Assets Worker (see wrangler.toml).
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
