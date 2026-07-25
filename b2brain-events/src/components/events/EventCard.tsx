import Link from 'next/link'
import { fmtRange, has } from '@/lib/format'
import type { IndexEventCard } from '@/lib/types'

/**
 * Event card for the /events collection page — modelled on b2brain.com/events.
 *
 * Header row: type chip + first industry (category). Then the name, the
 * date/location meta row, an attendees/exhibitors stat pair when present, the
 * description, and the "Open Event Playbook" link to the landing page.
 *
 * Everything below the name degrades independently, so a sparse event still
 * produces a clean card rather than empty rows.
 */
export function EventCard({
  event,
  ctaLabel,
}: {
  event: IndexEventCard
  ctaLabel: string
}) {
  const industry = event.categories?.[0]?.title
  const dateLoc = [fmtRange(event.startDate, event.endDate), event.city]
    .filter((x) => has(x))
    .join('  ·  ')

  return (
    <Link className="ecard" href={`/events/${event.slug}`}>
      <div className="ecard__top">
        {has(event.type) && <span className="ecard__tag">{event.type}</span>}
        {has(industry) && <span className="ecard__industry">{industry}</span>}
      </div>

      <h3 className="ecard__name">{event.name}</h3>

      {has(dateLoc) && <div className="ecard__meta">{dateLoc}</div>}

      {(has(event.attendees) || has(event.exhibitors)) && (
        <div className="ecard__stats">
          {has(event.attendees) && (
            <div className="ecard__stat">
              <span className="ecard__stat-num mono-num">{event.attendees}</span>
              <span className="ecard__stat-label">Attendees</span>
            </div>
          )}
          {has(event.exhibitors) && (
            <div className="ecard__stat">
              <span className="ecard__stat-num mono-num">{event.exhibitors}</span>
              <span className="ecard__stat-label">Exhibitors</span>
            </div>
          )}
        </div>
      )}

      {has(event.description) && <p className="ecard__desc">{event.description}</p>}

      <span className="ecard__link link-arrow">{ctaLabel}</span>
    </Link>
  )
}
