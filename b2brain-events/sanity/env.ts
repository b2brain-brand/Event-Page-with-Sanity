/** Environment plumbing shared by the Studio, the server queries and the scripts. */

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-28'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET',
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID',
)

/** Server-only. Used for draft-mode reads and live queries — never shipped to the browser. */
export const readToken = process.env.SANITY_API_READ_TOKEN || ''

/**
 * Canonical origin — the base for every canonical link, og:url, JSON-LD url,
 * sitemap and robots host.
 *
 * The app is served under b2brain.com/events (a reverse-proxy rewrite), so the
 * canonical MUST be https://www.b2brain.com — a page at b2brain.com/events/x must
 * not canonicalise to a different host (e.g. events.b2brain.com), or search
 * engines treat them as competing URLs.
 *
 * This is only the DEFAULT. `NEXT_PUBLIC_SITE_URL` on Vercel still wins, so after
 * the /events rewrite is live set that env var to https://www.b2brain.com (or
 * remove it to fall back to this default). Locally, .env.local can point it at
 * http://localhost:3000.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.b2brain.com'
).replace(/\/$/, '')

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) throw new Error(errorMessage)
  return v
}
