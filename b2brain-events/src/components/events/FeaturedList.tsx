import Link from 'next/link'
import { fmtRange, has } from '@/lib/format'
import type { IndexEventCard } from '@/lib/types'

/**
 * Featured events — the vertical, line-by-line list from b2brain.com/events
 * ("The buying committees worth planning around").
 *
 * Verified against the live DOM: each event is a full-width 2-column row
 * (left ≈ 354px, right ≈ 1fr, 40px gap, 40px vertical padding) with a 1px black
 * rule between rows.
 *   LEFT  — the headline attendee stat (big) + its label
 *   RIGHT — the meta line (date · city · exhibitors), the 40px title, the
 *           description, and the "Open Event Playbook" button
 *
 * This is the aligned table/list layout; the industry-filter card grid below it
 * is unchanged.
 */
export function FeaturedList({
  events,
  ctaLabel,
}: {
  events: IndexEventCard[]
  ctaLabel: string
}) {
  if (!events.length) return null

  return (
    <div className="flist">
      {events.map((e) => {
        const industry = e.categories?.[0]?.title
        const meta = [fmtRange(e.startDate, e.endDate), e.city, e.exhibitors ? `${e.exhibitors} Exhibitors` : '']
          .filter((x) => has(x))
          .join('  ·  ')
        return (
          <Link className="flist__row" href={`/events/${e.slug}`} key={e._id}>
            <div className="flist__left">
              <div className="flist__stat">{has(e.attendees) ? e.attendees : e.type}</div>
              <div className="flist__stat-label">{has(e.attendees) ? 'Attendees' : industry || 'Event'}</div>
            </div>

            <div className="flist__right">
              <div className="flist__tags">
                {has(e.type) && <span className="ecard__type">{e.type}</span>}
                {has(industry) && <span className="ecard__industry">{industry}</span>}
              </div>
              {has(meta) && <div className="flist__meta">{meta}</div>}
              <h3 className="flist__title">{e.name}</h3>
              {has(e.description) && <p className="flist__desc">{e.description}</p>}
              <span className="btn btn--primary flist__btn">{ctaLabel}</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
