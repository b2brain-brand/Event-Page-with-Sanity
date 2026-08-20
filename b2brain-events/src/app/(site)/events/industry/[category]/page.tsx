import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import { fetchSanity } from '@/sanity/lib/fetch'
import { client } from '@/sanity/lib/client'
import { siteUrl } from '@/sanity/env'
import {
  CATEGORY_PAGE_QUERY,
  EVENT_CATEGORIES_QUERY,
  EVENT_CATEGORY_SLUGS_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/sanity/lib/queries'

import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { Section, SectionHead } from '@/components/SectionHead'
import { EventsBrowser } from '@/components/events/EventsBrowser'
import { CategoryJsonLd } from '@/components/JsonLd'
import { BRAND } from '@/lib/brand'
import { has } from '@/lib/format'
import type { CategoryPageData, IndustryLink, SiteSettings } from '@/lib/types'

/**
 * =============================================================================
 * /events/industry/[category] — one real, indexable page per vertical.
 * =============================================================================
 *
 * This is the fix for the client's "/events is a homogeneous directory" finding:
 * before this page existed, "Filter By Industry" on /events was a client-side
 * radio toggle over ONE shared URL, so a search for "manufacturing trade shows
 * 2026" had no distinct page to match — Google's every crawl of /events returned
 * the exact same undifferentiated list regardless of vertical. This route gives
 * each of the 12 categories its own URL, its own title/description, its own
 * CollectionPage/ItemList schema, and — where an editor has written one — its
 * own unique intro paragraph (`eventCategory.description`).
 *
 * Same freshness model as every other page here: 60s revalidate floor behind
 * the publish webhook, dynamicParams on so a brand-new category (or the first
 * event added to an empty one) renders on first request rather than 404ing
 * until the next deploy.
 */

export const revalidate = 60
export const dynamicParams = true

type Params = { category: string }

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await client.fetch<{ slug: string }[]>(EVENT_CATEGORY_SLUGS_QUERY)
  return (slugs || []).filter((s) => s?.slug).map((s) => ({ category: s.slug }))
}

async function getCategory(slug: string) {
  return fetchSanity<CategoryPageData | null>({
    query: CATEGORY_PAGE_QUERY,
    params: { slug },
    tags: ['event', 'eventCategory'],
  })
}

async function getIndustries() {
  return fetchSanity<IndustryLink[]>({ query: EVENT_CATEGORIES_QUERY, tags: ['eventCategory'] })
}

async function getSettings() {
  return fetchSanity<SiteSettings | null>({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] })
}

/** "2026-08-04" -> "Aug 4". No upcoming show -> em dash, never a crash. */
function shortDate(iso?: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { category: slug } = await params
  const category = await getCategory(slug)
  if (!category) return { title: 'Industry not found' }

  const total = category.events.length
  const title = `${category.title} Trade Shows & Conferences 2026 | B2Brain`
  const description = [
    category.description,
    `${total} ${category.title} event${total === 1 ? '' : 's'} tracked for 2026 — dates, venues, who attends, and exhibitor costs.`,
  ]
    .filter(has)
    .join(' ')
  const canonical = `${siteUrl}/events/industry/${slug}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { type: 'website', title, description, url: canonical },
  }
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { category: slug } = await params
  const [category, industries, settings] = await Promise.all([
    getCategory(slug),
    getIndustries(),
    getSettings(),
  ])
  if (!category) notFound()

  const today = new Date().toISOString().slice(0, 10)
  const events = category.events
  const upcoming = events.filter((e) => (e.startDate || '') >= today)
  const cities = new Set(events.map((e) => e.city).filter(has))
  const nextShow = upcoming[0]

  const stats = [
    { num: String(events.length), label: 'TRACKED SHOWS' },
    { num: String(upcoming.length), label: 'UPCOMING IN 2026' },
    { num: String(cities.size), label: 'CITIES' },
    { num: shortDate(nextShow?.startDate), label: 'NEXT SHOW' },
  ]

  const pageUrl = `${siteUrl}/events/industry/${slug}`
  const otherIndustries = industries.filter((i) => i.slug !== slug)

  return (
    <>
      <CategoryJsonLd
        title={category.title}
        description={category.description}
        pageUrl={pageUrl}
        events={events.map((e) => ({ name: e.name, slug: e.slug }))}
      />

      <Nav settings={settings} />
      <main>
        <section className="ehero">
          <div className="container">
            <div className="hero__crumb">
              <a href={BRAND.breadcrumb.home.href}>{BRAND.breadcrumb.home.label}</a> /{' '}
              <a href={BRAND.breadcrumb.events.href}>{BRAND.breadcrumb.events.label}</a> /{' '}
              {category.title}
            </div>

            <span className="eyebrow eyebrow--dash">INDUSTRY</span>
            <h1 className="ehero__h1">{category.title} trade shows &amp; conferences, 2026</h1>
            <p className="ehero__intro">
              {[
                category.description,
                `${events.length} ${category.title.toLowerCase()} event${events.length === 1 ? '' : 's'} tracked for 2026 — dates, venues, who attends, and what it costs to exhibit at each one.`,
              ]
                .filter(has)
                .join(' ')}
            </p>

            <div className="ehero__ctas">
              <a href={BRAND.cta.href} className="btn btn--primary">
                {BRAND.cta.label}
              </a>
              <Link href="/events" className="btn btn--ghost">
                View all events
              </Link>
            </div>

            <div className="estat">
              {stats.map((s) => (
                <div className="estat__cell" key={s.label}>
                  <div className="estat__num">{s.num}</div>
                  <div className="estat__label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Section id="all">
          <SectionHead
            eyebrow="ALL EVENTS"
            title={`Browse ${category.title.toLowerCase()} events.`}
            variant="dash"
          />
          {events.length > 0 ? (
            <EventsBrowser
              events={events}
              industries={industries}
              activeIndustry={slug}
              industryLabel="Filter By Industry"
              searchPlaceholder="Search by name & industry"
              cardCtaLabel="See The Event Playbook"
            />
          ) : (
            <p className="muted">No {category.title.toLowerCase()} events published yet.</p>
          )}
        </Section>

        {otherIndustries.length > 0 && (
          <Section id="other-industries">
            <SectionHead eyebrow="EXPLORE" title="Other industries we track." variant="dash" />
            <div className="cat-chips">
              {otherIndustries.map((ind) => (
                <Link key={ind.slug} href={`/events/industry/${ind.slug}`} className="cat-chip">
                  {ind.title}
                </Link>
              ))}
            </div>
          </Section>
        )}

        <section id="cta" className="cta">
          <div className="container">
            <div className="cta__inner">
              <span className="cta__px cta__px--tl" aria-hidden="true" />
              <span className="cta__px cta__px--br" aria-hidden="true" />
              <div>
                <span className="eyebrow eyebrow--asterisk cta__weeks">FROM OFFLINE TO PIPELINE</span>
                <h2>Every {category.title.toLowerCase()} show is a pipeline channel, not a cost centre.</h2>
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
      <Footer settings={settings} />
    </>
  )
}
