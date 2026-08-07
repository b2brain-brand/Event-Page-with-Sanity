import type { MetadataRoute } from 'next'
import { getEventsSitemapEntries } from '@/lib/sitemap-entries'

/**
 * =============================================================================
 * /events/sitemap.xml — the SAME sitemap, served a second time under /events/*.
 * =============================================================================
 *
 * Why this exists: b2brain.com is a reverse proxy in front of Webflow, with
 * only `/events/*` and `/_next/*` routed through to this Vercel app — every
 * other root path (including /sitemap.xml and /robots.txt) falls through to
 * Webflow. Confirmed live: `www.b2brain.com/sitemap.xml` returns Webflow's own
 * sitemap (Server: cloudflare, x-wf-region headers), which lists only Webflow's
 * pages — none of our 30+ event pages or 11 industry pages are in it. And
 * Webflow's own robots.txt points Google at ITS sitemap
 * (wf-origin.b2brain.com/sitemap.xml), so there is no way to get our URLs into
 * discovery via the root sitemap without a proxy change on the client's side.
 *
 * This route sidesteps that entirely: it's identical content, served from a
 * path (`/events/sitemap.xml`) that the EXISTING proxy rule already sends to
 * Vercel — reachable today at https://www.b2brain.com/events/sitemap.xml with
 * zero infrastructure changes. Register that URL as an "additional sitemap" in
 * Google Search Console (Settings > Sitemaps) and every event + category page
 * is submitted for indexing, independent of whatever Webflow's sitemap says.
 *
 * If the client later routes /sitemap.xml itself to Vercel, this becomes
 * redundant but harmless — leave it, GSC allows multiple registered sitemaps.
 */
export const revalidate = 60

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getEventsSitemapEntries()
}
