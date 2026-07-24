import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

/**
 * =============================================================================
 * POST /api/revalidate  — Sanity webhook target
 * =============================================================================
 *
 * This is what makes "publish in Sanity, live on the site in seconds" true
 * without rebuilding 40 static pages. Sanity POSTs the changed document, we
 * verify the signature, then purge only the cache tags that document touches.
 *
 * Set up in Sanity → API → Webhooks:
 *   URL      https://<your-domain>/api/revalidate
 *   Dataset  production
 *   Trigger  Create · Update · Delete
 *   Filter   _type in ["event","siteSettings","venue","eventSeries","eventCategory"]
 *   Projection  {_type, "slug": slug.current}
 *   Secret   the same value as SANITY_REVALIDATE_SECRET
 *
 * The signature check is not optional — without it anyone can force cache
 * purges on the site.
 */

type WebhookPayload = {
  _type: string
  slug?: string
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET
    if (!secret) {
      return new NextResponse('SANITY_REVALIDATE_SECRET is not configured', { status: 500 })
    }

    const { isValidSignature, body } = await parseBody<WebhookPayload>(req, secret)

    if (!isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 })
    }
    if (!body?._type) {
      return new NextResponse('Bad request: missing _type', { status: 400 })
    }

    const tags = new Set<string>([body._type])

    // Editing any of these changes what an event page renders, so purge events too.
    if (['siteSettings', 'venue', 'eventSeries', 'eventCategory'].includes(body._type)) {
      tags.add('event')
    }
    if (body._type === 'event' && body.slug) {
      tags.add(`event:${body.slug}`)
    }

    // Next 16 requires a cache-life profile; 'max' purges every cached entry
    // carrying the tag, which is what a publish should do.
    for (const tag of tags) revalidateTag(tag, 'max')

    return NextResponse.json({
      revalidated: true,
      tags: [...tags],
      now: Date.now(),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new NextResponse(message, { status: 500 })
  }
}
