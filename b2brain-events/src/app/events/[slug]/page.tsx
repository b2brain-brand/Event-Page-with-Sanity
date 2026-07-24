import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { fetchSanity } from '@/sanity/lib/fetch'
import { client } from '@/sanity/lib/client'
import { ogUrl } from '@/sanity/lib/image'
import { siteUrl } from '@/sanity/env'
import {
  EVENT_QUERY,
  EVENT_SLUGS_QUERY,
  RELATED_FALLBACK_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/sanity/lib/queries'

import { EventPage } from '@/components/EventPage'
import { EventJsonLd } from '@/components/JsonLd'
import { S } from '@/lib/defaults'
import type { EventCard, EventDoc, SiteSettings } from '@/lib/types'

/**
 * =============================================================================
 * /events/[slug] — the programmatic event landing page
 * =============================================================================
 *
 * Statically generated for every event at build time, then kept current two ways:
 *   - the Sanity webhook purges the `event` cache tag the moment anyone publishes
 *   - an hourly revalidate floor keeps the server-computed countdown honest
 *
 * `dynamicParams` stays on so a brand-new event published after the last deploy
 * renders on first request instead of 404ing until the next build.
 */

export const revalidate = 3600
export const dynamicParams = true

type Params = { slug: string }

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await client.fetch<{ slug: string }[]>(EVENT_SLUGS_QUERY)
  return (slugs || []).filter((s) => s?.slug).map((s) => ({ slug: s.slug }))
}

async function getEvent(slug: string) {
  return fetchSanity<EventDoc | null>({
    query: EVENT_QUERY,
    params: { slug },
    tags: ['event', `event:${slug}`, 'venue', 'eventSeries'],
  })
}

async function getSettings() {
  return fetchSanity<SiteSettings | null>({
    query: SITE_SETTINGS_QUERY,
    tags: ['siteSettings'],
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const [event, settings] = await Promise.all([getEvent(slug), getSettings()])
  if (!event) return { title: 'Event not found' }

  const orgName = S(settings, 'organizationName') || 'B2Brain'
  const title = event.seo?.metaTitle || `${event.name} — ${orgName} — The Event Meeting Platform`
  const description =
    event.seo?.metaDescription || event.subhead || event.tldr || event.tagline || undefined

  const image = event.seo?.ogImage ?? settings?.defaultOgImage
  const imageUrl = image ? ogUrl(image) : undefined
  const canonical = event.seo?.canonicalUrl || `${siteUrl}/events/${slug}`

  return {
    title,
    description,
    alternates: { canonical },
    robots: event.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'website',
      title,
      description,
      url: canonical,
      siteName: orgName,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: event.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const [event, settings] = await Promise.all([getEvent(slug), getSettings()])
  if (!event) notFound()

  /* --------------------------------------------------------------------
     Similar events: hand-picked references win. If the editor picked none
     and auto-fill is on, borrow up to three upcoming shows from the same
     category — so the section is present on a page nobody has curated yet,
     and the internal-link graph stays connected across the whole set.
     -------------------------------------------------------------------- */
  let related: EventCard[] = event.relatedEvents || []
  if (!related.length && event.autoFillRelated !== false && event.categoryIds?.length) {
    related = await fetchSanity<EventCard[]>({
      query: RELATED_FALLBACK_QUERY,
      params: { id: event._id, categoryIds: event.categoryIds },
      tags: ['event'],
    })
  }

  const now = new Date()
  const pageUrl = `${siteUrl}/events/${slug}`
  const image = event.seo?.ogImage ?? settings?.defaultOgImage

  return (
    <>
      <EventJsonLd
        event={event}
        settings={settings}
        pageUrl={pageUrl}
        ogImageUrl={image ? ogUrl(image) : undefined}
      />
      <EventPage event={event} settings={settings} related={related} now={now} />
    </>
  )
}
