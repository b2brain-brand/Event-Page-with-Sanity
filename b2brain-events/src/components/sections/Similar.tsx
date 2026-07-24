import Link from 'next/link'
import { fmtRange, has } from '@/lib/format'
import { L } from '@/lib/defaults'
import { Section, SectionHead } from '../SectionHead'
import type { EventCard, SiteSettings } from '@/lib/types'

/**
 * SIMILAR EVENTS  ->  mSimilar()
 *
 * Each card is a real reference to another Event document, so the name, dates
 * and city are never retyped and never drift. Internal links between event
 * pages are also the cheapest topical-authority signal available on a
 * programmatic page set — a show page that links to three sibling shows tells a
 * crawler what this cluster is about.
 */
export function Similar({
  events,
  settings,
}: {
  events: EventCard[]
  settings: SiteSettings | null
}) {
  const cards = (events || []).filter((e) => has(e?.name) && has(e?.slug))
  if (!cards.length) return null

  return (
    <Section id="similar">
      <SectionHead eyebrow={L(settings, 'similarEyebrow')} title={L(settings, 'similarHeading')} />
      {/* The grid is 3-up by design. With one or two cards we narrow the track
          count instead of leaving dead space inside the bordered frame — same
          rule as everywhere else on this page: never render an empty box. */}
      <div className="similar" style={gridFor(cards.length)}>
        {cards.map((e) => (
          <Link className="scard" href={`/events/${e.slug}`} key={e._id}>
            <div className="scard__date">{fmtRange(e.startDate, e.endDate)}</div>
            <div className="scard__name">{e.name}</div>
            {has(e.city) && <div className="scard__loc">{e.city}</div>}
            <div className="scard__link link-arrow">{L(settings, 'similarLinkLabel')}</div>
          </Link>
        ))}
      </div>
    </Section>
  )
}

/** Cards fill the row: 3 -> the design default, 1 or 2 -> that many tracks. */
export function gridFor(count: number): React.CSSProperties | undefined {
  if (count >= 3) return undefined
  return { gridTemplateColumns: `repeat(${Math.max(count, 1)}, 1fr)` }
}
