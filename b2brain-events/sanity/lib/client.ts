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
 * `useCdn: true` because every read is either statically rendered at build time
 * or revalidated by the Sanity webhook; no marketing page needs an uncached
 * round-trip.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  token: readToken || undefined,
  stega: { studioUrl: '/studio' },
})
