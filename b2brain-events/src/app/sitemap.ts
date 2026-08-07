import type { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { SITEMAP_CATEGORIES_QUERY, SITEMAP_QUERY } from '@/sanity/lib/queries'
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
 *  - The read is a direct `client.fetch` tagged `event` — NOT the shared
 *    `fetchSanity`. fetchSanity calls `draftMode()`, and in a metadata route
 *    (sitemap.ts) that request-context call fails during background ISR
 *    revalidation, so Next silently kept serving the build-time sitemap — new
 *    events never appeared. A sitemap must never render drafts anyway, so the
 *    preview-aware wrapper is wrong here. The explicit `tags: ['event']` still
 *    makes it purge the instant any event is published.
 */
export const revalidate = 60

type Row = { slug: string; lastUpdated?: string; _updatedAt?: string; startDate?: string }
type CategoryRow = { slug: string; _updatedAt?: string }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [rows, categoryRows] = await Promise.all([
    client.fetch<Row[]>(SITEMAP_QUERY, {}, { next: { revalidate: 60, tags: ['event'] } }),
    client.fetch<CategoryRow[]>(
      SITEMAP_CATEGORIES_QUERY,
      {},
      { next: { revalidate: 60, tags: ['event', 'eventCategory'] } },
    ),
  ])
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

  // The 12 industry hub pages — see events/industry/[category]/page.tsx. Sits
  // between the events index (1.0) and individual events (0.9/0.5) in priority:
  // more durable than a single show, less than the top-level hub.
  const categories: MetadataRoute.Sitemap = (categoryRows || []).map((c) => ({
    url: `${siteUrl}/events/industry/${c.slug}`,
    lastModified: new Date(c._updatedAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [
    {
      url: `${siteUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...categories,
    ...events,
  ]
}
