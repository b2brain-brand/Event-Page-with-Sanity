/* eslint-disable no-console */
/**
 * =============================================================================
 * REVALIDATE — purge the deployed site's cache by hand.
 * =============================================================================
 *
 *   node scripts/revalidate.mjs --url=https://project-pcxmd.vercel.app
 *   node scripts/revalidate.mjs --url=https://… --type=event --slug=ai4-2026
 *
 * WHY THIS EXISTS
 * `/api/revalidate` is a Sanity webhook target and rejects anything without a
 * valid HS256 signature — correctly, or anyone could force cache purges. That
 * also means you cannot simply curl it after a bulk import. This signs a
 * payload the same way Sanity does so a script can trigger the purge.
 *
 * Reach for it when:
 *  - you wrote documents with the API (scripts/import-webflow.mjs) rather than
 *    through the Studio, and want them live now instead of within the hour;
 *  - the Sanity webhook is pointing at a dead URL and the site has gone stale.
 *
 * Signature format, from @sanity/webhook:
 *   header  sanity-webhook-signature: t=<unix-ms>,v1=<sig>
 *   sig     base64url( HMAC-SHA256( `${timestamp}.${body}`, secret ) )
 */

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHmac } from 'node:crypto'

const here = dirname(fileURLToPath(import.meta.url))

try {
  const raw = readFileSync(resolve(here, '..', '.env.local'), 'utf8')
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
} catch {
  /* rely on the ambient environment */
}

const argv = process.argv.slice(2)
const opt = (n, d = '') => {
  const hit = argv.find((a) => a.startsWith(`--${n}=`))
  return hit ? hit.slice(n.length + 3) : d
}

const base = (opt('url') || process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/+$/, '')
const secret = process.env.SANITY_REVALIDATE_SECRET
const type = opt('type', 'event')
const slug = opt('slug')

if (!base) throw new Error('Pass --url=https://your-deployment (or set NEXT_PUBLIC_SITE_URL).')
if (!secret) throw new Error('SANITY_REVALIDATE_SECRET is not set in .env.local.')

const body = JSON.stringify(slug ? { _type: type, slug } : { _type: type })
const timestamp = Date.now()
const signature = createHmac('sha256', secret)
  .update(`${timestamp}.${body}`)
  .digest('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/, '')

const res = await fetch(`${base}/api/revalidate`, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'sanity-webhook-signature': `t=${timestamp},v1=${signature}`,
  },
  body,
})

const text = await res.text()
console.log(`${res.status} ${res.statusText}  ${base}/api/revalidate`)
console.log(text)
if (!res.ok) process.exit(1)
