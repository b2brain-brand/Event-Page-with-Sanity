import type { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { SITEMAP_QUERY } from '@/sanity/lib/queries'
import { siteUrl } from '@/sanity/env'

/**
 * sitemap.xml
 *
 * Two decisions worth knowing about:
 *  - noindex events are excluded at the query level, so a page still being
 *    sourced is never submitted for crawling.
 *  - Upcoming shows get a higher priority than past ones. A trade-show page's
 *    value is almost entirely front-loaded; after the show closes it becomes a
 *    recap that supports next year's edition rather than a conversion page.
 */
export const revalidate = 3600

type Row = { slug: string; lastUpdated?: string; _updatedAt?: string; startDate?: string }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rows = await client.fetch<Row[]>(SITEMAP_QUERY)
  const today = new Date().toISOString().slice(0, 10)

  const events: MetadataRoute.Sitemap = (rows || []).map((r) => {
    const upcoming = (r.startDate || '') >= today
    return {
      url: `${siteUrl}/events/${r.slug}`,
      lastModified: new Date(r.lastUpdated || r._updatedAt || Date.now()),
      changeFrequency: upcoming ? 'weekly' : 'monthly',
      priority: upcoming ? 0.9 : 0.5,
    }
  })

  return [
    {
      url: `${siteUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...events,
  ]
}
