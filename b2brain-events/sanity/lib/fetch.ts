import 'server-only'
import { draftMode } from 'next/headers'
import { client } from './client'
import { readToken } from '../env'

/**
 * The one place the site talks to Sanity.
 *
 * Published traffic  -> CDN client, cached by Next with a cache TAG per document
 *                       type. The Sanity webhook hits /api/revalidate and purges
 *                       that tag, so an edit is live in seconds without a rebuild.
 * Editors in preview -> token'd client, drafts perspective, no cache.
 *
 * `revalidate` defaults to an hour. That is not about content freshness (the
 * webhook handles that) — it is because the hero countdown chip is computed on
 * the server, and an hourly floor keeps "8 weeks to go" honest.
 */
const previewClient = client.withConfig({
  useCdn: false,
  token: readToken,
  perspective: 'drafts',
  stega: { enabled: true, studioUrl: '/studio' },
})

/**
 * In development the fetch cache is off. Next persists it to disk under .next,
 * so it survives a dev-server restart — which makes an edit in the Studio look
 * like it did not reach the site, when in fact it is a stale cache entry. Not
 * worth the confusion locally; production keeps the hourly floor plus the
 * webhook.
 */
// 60s in production is the safety-net floor behind the webhook (which purges the
// cache tag instantly on publish). Short enough that a missed webhook still means
// ~1-minute freshness, not an hour. Dev keeps the cache off entirely.
const DEFAULT_REVALIDATE = process.env.NODE_ENV === 'development' ? 0 : 60

type FetchArgs = {
  query: string
  params?: Record<string, unknown>
  tags?: string[]
  revalidate?: number | false
}

export async function fetchSanity<T>({
  query,
  params = {},
  tags = [],
  revalidate = DEFAULT_REVALIDATE,
}: FetchArgs): Promise<T> {
  const { isEnabled: isDraft } = await draftMode()

  if (isDraft) {
    if (!readToken) {
      throw new Error(
        'Draft mode is on but SANITY_API_READ_TOKEN is not set. Add it to .env.local and to the Vercel project.',
      )
    }
    return previewClient.fetch<T>(query, params, { cache: 'no-store' })
  }

  return client.fetch<T>(query, params, {
    next: { revalidate: revalidate === false ? undefined : revalidate, tags },
  })
}
