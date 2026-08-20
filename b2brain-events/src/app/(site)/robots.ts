import type { MetadataRoute } from 'next'
import { siteUrl } from '@/sanity/env'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The Studio and the preview endpoints are not content.
        disallow: ['/studio', '/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
