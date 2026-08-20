import type { MetadataRoute } from 'next'
import { getEventsSitemapEntries } from '@/lib/sitemap-entries'

/**
 * /sitemap.xml — see src/app/events/pages/sitemap.ts for why a second copy of
 * this exists at /events/pages/sitemap.xml, and src/lib/sitemap-entries.ts for
 * the actual query + mapping logic both share.
 */
export const revalidate = 60

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getEventsSitemapEntries()
}
