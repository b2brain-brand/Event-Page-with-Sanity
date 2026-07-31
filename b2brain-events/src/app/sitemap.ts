import type { MetadataRoute } from 'next'
import { fetchSanity } from '@/sanity/lib/fetch'
import { SITEMAP_QUERY } from '@/sanity/lib/queries'
import { siteUrl } from '@/sanity/env'

/**
 * sitemap.xml
 *
 * Three decisions worth knowing about:
 *  - noindex events are excluded at the query level, so a page still being
 *    sourced is never submitted for crawling.
 *  - Upcoming shows get a higher priority than past ones. A trade-show page's
 *    value is almost entirely front-loaded; after the show closes it becomes a
 *    recap that supports next year's edition rather than a conversion page.
 *  - The read goes through `fetchSanity` so it carries the `event` cache tag.
 *    Calling `client.fetch` directly here left the sitemap untagged and
 *    therefore unpurgeable: publishing an event revalidated the pages and the
 *    index but not this file, so a new page sat outside the sitemap for up to
 *    an hour — the one place where a delay actually costs indexing.
 */
export const revalidate = 3600

type Row = { slug: string; lastUpdated?: string; _updatedAt?: string; startDate?: string }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rows = await fetchSanity<Row[]>({ query: SITEMAP_QUERY, tags: ['event'] })
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
