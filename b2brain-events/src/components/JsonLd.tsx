import { has } from '@/lib/format'
import { B, S } from '@/lib/defaults'
import type { EventDoc, SiteSettings } from '@/lib/types'

/**
 * =============================================================================
 * STRUCTURED DATA
 * =============================================================================
 * One @graph, five nodes, emitted server-side so it is in the initial HTML:
 *
 *   Organization    site-wide entity — who is publishing this
 *   WebPage         the page itself, with datePublished / dateModified
 *   BreadcrumbList  Home > Events > [Event]
 *   Event           the show — dates, venue, organiser, passes, speakers
 *   FAQPage         every Q/A pair from the FAQ section
 *
 * The Event node is the one that matters commercially: it is what makes the page
 * eligible for the event rich result and gives answer engines a machine-readable
 * "when and where" instead of asking them to parse a hero.
 *
 * Rule: nothing goes in here that is not also visible on the page. Structured
 * data that contradicts the rendered content is a manual-action risk.
 */

const ATTENDANCE: Record<string, string> = {
  'In-person': 'https://schema.org/OfflineEventAttendanceMode',
  'In-person + broadcast': 'https://schema.org/MixedEventAttendanceMode',
  Hybrid: 'https://schema.org/MixedEventAttendanceMode',
  Virtual: 'https://schema.org/OnlineEventAttendanceMode',
}

/** Breadcrumb hrefs may be relative; JSON-LD needs absolute URLs. */
function absolute(href: string, origin: string): string {
  if (/^https?:\/\//i.test(href)) return href
  return `${origin}${href.startsWith('/') ? '' : '/'}${href === '/' ? '' : href}`
}

/** "$1,999" -> 1999 · "Varies" -> null (an Offer without a price is not emitted). */
function parsePrice(price?: string): number | null {
  if (!price) return null
  const cleaned = price.replace(/[^0-9.]/g, '')
  if (!cleaned) return null
  const n = Number.parseFloat(cleaned)
  return Number.isFinite(n) ? n : null
}

export function EventJsonLd({
  event,
  settings,
  pageUrl,
  ogImageUrl,
}: {
  event: EventDoc
  settings: SiteSettings | null
  pageUrl: string
  ogImageUrl?: string
}) {
  const origin = pageUrl.replace(/\/events\/.*$/, '')
  const orgName = S(settings, 'organizationName') || 'B2Brain'

  const address = event.venue
    ? {
        '@type': 'PostalAddress',
        streetAddress: event.venue.streetAddress || undefined,
        addressLocality: event.venue.city?.split(',')[0]?.trim() || undefined,
        addressRegion: event.venue.city?.split(',')[1]?.trim() || undefined,
        postalCode: event.venue.postalCode || undefined,
        addressCountry: event.venue.country || 'US',
      }
    : undefined

  const offers = (event.logistics?.passes || [])
    .map((p) => {
      const price = parsePrice(p.price)
      if (price === null) return null
      return {
        '@type': 'Offer',
        name: p.name,
        price,
        priceCurrency: 'USD',
        url: event.registerUrl || event.officialUrl || pageUrl,
        availability: 'https://schema.org/InStock',
      }
    })
    .filter(Boolean)

  const performers = (event.speakers || [])
    .filter((s) => has(s?.name))
    .map((s) => ({
      '@type': 'Person',
      name: s.name,
      jobTitle: s.role || undefined,
    }))

  const faqs = (event.faq || []).filter((f) => has(f?.q) && has(f?.a))

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Organization',
      '@id': `${origin}/#organization`,
      name: orgName,
      url: origin,
      sameAs: S(settings, 'organizationSameAs') || undefined,
    },
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: event.seo?.metaTitle || `${event.name} — ${orgName}`,
      description: event.seo?.metaDescription || event.tldr || event.subhead || undefined,
      datePublished: event.publishedAt || undefined,
      dateModified: event.lastUpdated || event._updatedAt || undefined,
      isPartOf: { '@id': `${origin}/#website` },
      publisher: { '@id': `${origin}/#organization` },
      primaryImageOfPage: ogImageUrl || undefined,
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      // Mirrors the visible breadcrumb exactly — structured data that disagrees
      // with the rendered page is a manual-action risk.
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: B(settings, 'homeLabel'),
          item: absolute(B(settings, 'homeHref'), origin),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: B(settings, 'eventsLabel'),
          item: absolute(B(settings, 'eventsHref'), origin),
        },
        { '@type': 'ListItem', position: 3, name: event.name, item: pageUrl },
      ],
    },
    {
      '@type': 'Event',
      '@id': `${pageUrl}#event`,
      name: event.name,
      description: event.tldr || event.tagline || undefined,
      startDate: event.startDate || undefined,
      endDate: event.endDate || undefined,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode:
        ATTENDANCE[event.format || 'In-person'] ||
        'https://schema.org/OfflineEventAttendanceMode',
      url: event.officialUrl || pageUrl,
      image: ogImageUrl ? [ogImageUrl] : undefined,
      location: event.venue
        ? {
            '@type': 'Place',
            name: event.venue.name,
            address,
            ...(typeof event.venue.lat === 'number' && typeof event.venue.lng === 'number'
              ? {
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: event.venue.lat,
                    longitude: event.venue.lng,
                  },
                }
              : {}),
          }
        : undefined,
      organizer: event.series?.organizerName
        ? {
            '@type': 'Organization',
            name: event.series.organizerName,
            url: event.series.organizerUrl || undefined,
          }
        : undefined,
      offers: offers.length ? offers : undefined,
      performer: performers.length ? performers : undefined,
      subjectOf: { '@id': `${pageUrl}#webpage` },
    },
  ]

  if (faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }

  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, (_k, v) =>
    v === undefined ? undefined : v,
  )

  return (
    <script
      type="application/ld+json"
      // Server-rendered from our own CMS data; JSON.stringify escapes the values.
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, '\\u003c') }}
    />
  )
}
