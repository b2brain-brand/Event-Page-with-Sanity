import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, readToken } from '../env'

/**
 * Published-content client.
 *
 * A token is attached even for published reads. This project's dataset does not
 * serve content to anonymous requests — an unauthenticated GROQ query returns an
 * empty result set rather than an error, which is exactly the failure mode that
 * looks like "my pages 404 in production but work locally".
 *
 * The token is server-only. `SANITY_API_READ_TOKEN` has no NEXT_PUBLIC_ prefix,
 * so Next replaces it with `undefined` in any client bundle — it cannot leak
 * even if this module is imported from the wrong place.
 *
 * `useCdn: false` — deliberately. `apicdn.sanity.io` (useCdn:true) has its OWN
 * ~60s cache that sits BETWEEN the webhook purge and the next read: the
 * webhook purges Next's tag cache instantly, but the very next fetch can still
 * get a stale response back from Sanity's CDN if it's within that CDN's cache
 * window for the same query. That's what was causing "I published but it
 * still isn't live 5 minutes later" — Next was fresh, Sanity's CDN wasn't.
 * Hitting the live (non-CDN) API removes that second cache layer entirely, so
 * a publish is live as soon as the webhook fires (seconds), not up to a
 * minute-plus later. The trade-off is a slightly slower per-request read
 * against the non-CDN API — irrelevant here since every page is statically
 * rendered/ISR'd, not fetched per-visitor.
 */
const publishedClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
  token: readToken || undefined,
  stega: { studioUrl: '/studio' },
})

/**
 * @sanity/client network errors can contain the complete request object,
 * including its Authorization header. Next prints an unhandled error object
 * during static generation, so replace fetch failures with a deliberately
 * minimal error before they reach build/runtime logs.
 */
const publishedFetch = publishedClient.fetch.bind(publishedClient)
publishedClient.fetch = (async (...args: Parameters<typeof publishedFetch>) => {
  try {
    return await publishedFetch(...args)
  } catch {
    throw new Error('Sanity published-content fetch failed. Check network access and Sanity availability.')
  }
}) as typeof publishedClient.fetch

export const client = publishedClient
