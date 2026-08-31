import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Sanity's image CDN — every gallery / OG image is served from here.
      { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/**' },
      // Server-verified 1280x720 stills from event-specific YouTube videos.
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' },
    ],
  },
  // The embedded Studio ships its own <html> chrome; keep React strict mode on
  // for the marketing pages, which are the part that actually gets crawled.
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: false },
}

export default nextConfig
