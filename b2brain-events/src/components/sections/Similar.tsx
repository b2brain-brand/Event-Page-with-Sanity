import Link from 'next/link'
import { fmtRange, has } from '@/lib/format'
import { L } from '@/lib/defaults'
import { Section, SectionHead } from '../SectionHead'
import type { EventCard, SiteSettings } from '@/lib/types'

/**
 * SIMILAR EVENTS — matches b2brain.com's "More events on the calendar" cards.
 *
 * 3-up bordered cards: a "TYPE - INDUSTRY" line, the event name, a meta list
 * where each row has a red dash marker and a hairline divider (date, venue -
 * location, attendees, exhibitors), and a full-width "See The Event Playbook"
 * button. A "See All Events" ghost button sits beside the heading. Every card
 * links to that event's landing page.
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
      <div className="fhead">
        <SectionHead
          eyebrow={L(settings, 'similarEyebrow')}
          title={L(settings, 'similarHeading')}
          variant="dash"
        />
        <Link href="/events" className="btn btn--ghost">
          See All Events
        </Link>
      </div>

      <div className="simcards" style={gridFor(cards.length)}>
        {cards.map((e) => {
          const industry = e.categories?.[0]?.title
          const topline = [e.type, industry].filter((x) => has(x)).join('  -  ')
          const rows = [
            fmtRange(e.startDate, e.endDate),
            [e.venueName, e.city].filter((x) => has(x)).join('  -  '),
            has(e.attendees) ? `${e.attendees}  Attendees` : '',
            has(e.exhibitors) ? `${e.exhibitors}  Exhibitors` : '',
          ].filter((x) => has(x))

          return (
            <Link className="simcard" href={`/events/${e.slug}`} key={e._id}>
              {has(topline) && <div className="simcard__top">{topline}</div>}
              <h3 className="simcard__name">{e.name}</h3>
              <div className="simcard__rows">
                {rows.map((r, i) => (
                  <div className="simcard__row" key={i}>
                    <span className="simcard__dash" aria-hidden="true" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
              <span className="btn btn--ghost simcard__btn">{L(settings, 'similarLinkLabel')}</span>
            </Link>
          )
        })}
      </div>
    </Section>
  )
}

/** Cards fill the row: 3 -> default, 1 or 2 -> that many tracks. */
export function gridFor(count: number): React.CSSProperties | undefined {
  if (count >= 3) return undefined
  return { gridTemplateColumns: `repeat(${Math.max(count, 1)}, 1fr)` }
}
