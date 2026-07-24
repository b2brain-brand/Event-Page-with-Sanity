/**
 * The Sanity Studio, mounted inside this Next.js app at /studio.
 *
 * One repo, one deployment, one set of environment variables — and editors get
 * the Presentation tool pointing at the real pages on the same origin, so live
 * preview needs no CORS entry and no second hosting bill.
 */

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
