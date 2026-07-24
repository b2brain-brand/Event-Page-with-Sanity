import type { Metadata } from 'next'
import Link from 'next/link'

import { fetchSanity } from '@/sanity/lib/fetch'
import { EVENTS_INDEX_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'
import { siteUrl } from '@/sanity/env'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { Section, SectionHead } from '@/components/SectionHead'
import { gridFor } from '@/components/sections/Similar'
import { fmtRange, has } from '@/lib/format'
import { L } from '@/lib/defaults'
import type { EventCard, SiteSettings } from '@/lib/types'

/**
 * /events — the hub the individual event pages hang off.
 *
 * Kept deliberately plain: it reuses the same card component the "Similar
 * events" section uses, so there is nothing new to design or maintain. Its job
 * is crawl paths — every event page must be reachable in one click from here.
 */

export const revalidate = 3600

type IndexEvent = EventCard & { tldr?: string; isFeatured?: boolean; attendees?: string }

export const metadata: Metadata = {
  title: 'Trade shows & conferences for B2B revenue teams — B2Brain',
  description:
    'Dates, venue, who attends, exhibitor costs and the booth math for every major B2B trade show and conference.',
  alternates: { canonical: `${siteUrl}/events` },
}

export default async function EventsIndex() {
  const [events, settings] = await Promise.all([
    fetchSanity<IndexEvent[]>({ query: EVENTS_INDEX_QUERY, tags: ['event'] }),
    fetchSanity<SiteSettings | null>({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
  ])

  const today = new Date().toISOString().slice(0, 10)
  const upcoming = (events || []).filter((e) => (e.startDate || '') >= today)
  const past = (events || []).filter((e) => (e.startDate || '') < today).reverse()

  return (
    <>
      <Nav settings={settings} />
      <main>
        <section className="hero">
          <div className="container hero__pad">
            <div className="hero__crumb">
              <Link href="/">Home</Link> / Events
            </div>
            <div className="hero__eyebrow">
              <span className="chip">Event guides</span>
            </div>
            <h1>Every show your team is weighing, with the booth math.</h1>
            <p className="hero__sub">
              Dates, venue, who is actually on the floor, what a booth costs, and what the pipeline
              has to look like to justify it. One page per show.
            </p>
          </div>
        </section>

        {upcoming.length > 0 && (
          <Section id="upcoming">
            <SectionHead eyebrow="UPCOMING" title="Shows still ahead" />
            <div className="similar" style={gridFor(upcoming.length)}>
              {upcoming.map((e) => (
                <EventCardLink key={e._id} event={e} settings={settings} />
              ))}
            </div>
          </Section>
        )}

        {past.length > 0 && (
          <Section id="past">
            <SectionHead eyebrow="PAST EDITIONS" title="Recaps and next-year prep" />
            <div className="similar" style={gridFor(past.length)}>
              {past.map((e) => (
                <EventCardLink key={e._id} event={e} settings={settings} />
              ))}
            </div>
          </Section>
        )}

        {!upcoming.length && !past.length && (
          <Section id="empty">
            <SectionHead
              eyebrow="EVENTS"
              title="No event pages published yet"
              sub="Create your first Event document in the Studio at /studio and it will appear here."
            />
          </Section>
        )}
      </main>
      <Footer settings={settings} />
    </>
  )
}

function EventCardLink({
  event,
  settings,
}: {
  event: IndexEvent
  settings: SiteSettings | null
}) {
  return (
    <Link className="scard" href={`/events/${event.slug}`}>
      <div className="scard__date">{fmtRange(event.startDate, event.endDate)}</div>
      <div className="scard__name">{event.name}</div>
      {has(event.city) && <div className="scard__loc">{event.city}</div>}
      <div className="scard__link link-arrow">{L(settings, 'similarLinkLabel')}</div>
    </Link>
  )
}
