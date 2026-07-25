import type { Metadata } from 'next'

import { fetchSanity } from '@/sanity/lib/fetch'
import { EVENTS_INDEX_QUERY } from '@/sanity/lib/queries'
import { siteUrl } from '@/sanity/env'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { Section, SectionHead } from '@/components/SectionHead'
import { EventCard } from '@/components/events/EventCard'
import { EventsBrowser } from '@/components/events/EventsBrowser'
import { FaqList } from '@/components/sections/Faq'
import { has } from '@/lib/format'
import { BRAND } from '@/lib/brand'
import type { EventsIndexPage, IndexEventCard } from '@/lib/types'

/**
 * =============================================================================
 * /events — the collection page, modelled on b2brain.com/events.
 * =============================================================================
 *
 * Distinct from the per-event landing pages, which this build does not change.
 * The page's own copy lives in the `eventsIndexPage` singleton; the cards are
 * the Event documents. Everything degrades to the b2brain.com defaults baked
 * into the schema, so it renders correctly before anyone opens the Studio.
 */

export const revalidate = 3600

type IndexData = { page: EventsIndexPage | null; events: IndexEventCard[] }

const FALLBACK: EventsIndexPage = {
  heroEyebrow: 'THE 2026 EVENT CALENDAR',
  heroHeading: 'From offline conversations to attributable pipeline.',
  heroIntro:
    'Browse the events, conferences, and industry shows revenue teams are planning pipeline around in 2026.',
  stats: [
    { num: '180+', label: 'Tracked shows' },
    { num: '3', label: 'Event motions' },
    { num: '2.8M', label: 'Leads captured' },
    { num: '$2.1B', label: 'Pipeline influenced' },
  ],
  featuredEyebrow: 'FEATURED',
  featuredHeading: 'The buying committees worth planning around.',
  allEyebrow: 'ALL EVENTS',
  allHeading: 'Browse the 2026 event calendar.',
  cardCtaLabel: 'Open Event Playbook',
  allCardCtaLabel: 'See The Event Playbook',
  industryFilterLabel: 'Filter By Industry',
  searchPlaceholder: 'Search events…',
  faqHeading: 'Frequently asked questions',
  // Kept in code as well as the schema so /events is complete before anyone
  // creates the Events-page document in the Studio. Editing it there overrides.
  faq: [
    {
      q: 'What is the B2Brain event calendar?',
      a: 'A curated calendar of the B2B trade shows and conferences revenue teams plan pipeline around, with an event playbook for each — who attends, what a booth costs, and how to turn floor conversations into booked meetings.',
    },
    {
      q: 'How much does B2Brain cost?',
      a: 'Show Pass is $200 per user per event. Annual plans start at $1,500. See the pricing page for current details.',
    },
    {
      q: 'Does B2Brain integrate with my CRM?',
      a: 'Yes. Booth conversations sync to Salesforce and other CRMs with the use case, blockers and next step captured — not just a scanned badge.',
    },
    {
      q: 'Does it work offline on the show floor?',
      a: 'Yes. Capture is offline-ready for the convention-centre dead zones, and syncs when you are back on signal.',
    },
  ],
  ctaEyebrow: 'FROM OFFLINE TO PIPELINE',
  ctaHeading: 'Every event conversation should end in attributable revenue.',
}

function v<K extends keyof EventsIndexPage>(
  page: EventsIndexPage | null,
  key: K,
): NonNullable<EventsIndexPage[K]> {
  const val = page?.[key]
  if (val === undefined || val === null || (typeof val === 'string' && !val.trim())) {
    return FALLBACK[key] as NonNullable<EventsIndexPage[K]>
  }
  return val as NonNullable<EventsIndexPage[K]>
}

async function getData() {
  return fetchSanity<IndexData>({
    query: EVENTS_INDEX_QUERY,
    tags: ['event', 'eventsIndexPage'],
  })
}

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getData()
  const title = v(page, 'metaTitle')
  const description = v(page, 'metaDescription')
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/events` },
    openGraph: { type: 'website', title, description, url: `${siteUrl}/events` },
  }
}

export default async function EventsIndex() {
  const { page, events } = await getData()
  const today = new Date().toISOString().slice(0, 10)

  // Featured: hand-picked in the CMS, else the next few upcoming shows.
  const upcoming = (events || []).filter((e) => (e.startDate || '') >= today)
  const featured = (page?.featured?.length ?? 0) > 0 ? page!.featured! : upcoming.slice(0, 3)

  const faqs = ((page?.faq?.length ? page.faq : FALLBACK.faq) || []).filter(
    (f) => has(f?.q) && has(f?.a),
  )

  return (
    <>
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }).replace(/</g, '\\u003c'),
          }}
        />
      )}

      <Nav />
      <main>
        {/* ---------------------------------------------------------- HERO */}
        <section className="ehero">
          <div className="container">
            <span className="eyebrow eyebrow--asterisk">{v(page, 'heroEyebrow')}</span>
            <h1 className="ehero__h1">{v(page, 'heroHeading')}</h1>
            {has(v(page, 'heroIntro')) && <p className="ehero__intro">{v(page, 'heroIntro')}</p>}
            <div className="ehero__ctas">
              <a href={BRAND.cta.href} className="btn btn--primary">
                {BRAND.cta.label}
              </a>
              <a
                href={BRAND.login.href}
                className="btn btn--ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                {BRAND.login.label}
              </a>
            </div>

            {(v(page, 'stats') as { num?: string; label?: string }[]).length > 0 && (
              <div className="estat">
                {(v(page, 'stats') as { num?: string; label?: string }[]).map((s, i) => (
                  <div className="estat__cell" key={i}>
                    <div className="estat__num">{s.num}</div>
                    <div className="estat__label">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ------------------------------------------------------ FEATURED */}
        {featured.length > 0 && (
          <Section id="featured">
            <SectionHead
              eyebrow={v(page, 'featuredEyebrow')}
              title={v(page, 'featuredHeading')}
            />
            <div className="ecards">
              {featured.map((e) => (
                <EventCard
                  key={e._id}
                  event={e}
                  ctaLabel={v(page, 'cardCtaLabel')}
                  featured
                />
              ))}
            </div>
          </Section>
        )}

        {/* --------------------------------------------------- ALL EVENTS */}
        <Section id="all">
          <SectionHead eyebrow={v(page, 'allEyebrow')} title={v(page, 'allHeading')} />
          {events.length > 0 ? (
            <EventsBrowser
              events={events}
              industryLabel={v(page, 'industryFilterLabel')}
              searchPlaceholder={v(page, 'searchPlaceholder')}
              cardCtaLabel={v(page, 'allCardCtaLabel')}
            />
          ) : (
            <p className="muted">No event pages published yet.</p>
          )}
        </Section>

        {/* --------------------------------------------------------- FAQ */}
        {faqs.length > 0 && (
          <Section id="faq">
            <div className="faq__grid">
              <div>
                <SectionHead eyebrow="FAQ" title={v(page, 'faqHeading')} />
              </div>
              <FaqList items={faqs} />
            </div>
          </Section>
        )}

        {/* --------------------------------------------------------- CTA */}
        <section id="cta" className="cta">
          <div className="container">
            <div className="cta__inner">
              <span className="cta__px cta__px--tl" aria-hidden="true" />
              <span className="cta__px cta__px--br" aria-hidden="true" />
              <div>
                <span className="eyebrow eyebrow--asterisk cta__weeks">{v(page, 'ctaEyebrow')}</span>
                <h2>{v(page, 'ctaHeading')}</h2>
                <div className="cta__ctas">
                  <a href={BRAND.cta.href} className="btn btn--primary">
                    {BRAND.cta.label}
                  </a>
                  <a
                    href={BRAND.login.href}
                    className="btn btn--ghost"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {BRAND.login.label}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
