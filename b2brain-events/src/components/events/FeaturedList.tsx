import Link from 'next/link'
import { fmtRange, has } from '@/lib/format'
import type { IndexEventCard } from '@/lib/types'

/**
 * Featured events — an exact match of b2brain.com/events' "buying committees"
 * cards. Verified against the live DOM:
 *
 *   Each event is a full-width 1px-black-bordered card, 40px padding, an inner
 *   354px / 1fr grid, stacked with a 40px gap.
 *     LEFT  — a tinted panel (alternating orange-light / purple-light): the
 *             headline attendee stat (40px), its meta line, and the event name.
 *     RIGHT — the date·city·exhibitors meta line, a 40px "name — tagline" title,
 *             the description, a divider, then the tag row (black industry pill +
 *             bordered type pill) with the Open Event Playbook button.
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
    <div className="fcards">
      {events.map((e, i) => {
        const industry = e.categories?.[0]?.title
        const meta = [
          fmtRange(e.startDate, e.endDate),
          e.city,
          e.exhibitors ? `${e.exhibitors} Exhibitors` : '',
        ]
          .filter((x) => has(x))
          .join('  -  ')

        // Dedicated card fields, like the main site — with graceful fallbacks so
        // an event that has not authored them still reads cleanly (name only,
        // never the hero sub-headline crammed in).
        const leftStat = has(e.cardStat) ? e.cardStat : e.attendees || e.type
        const leftAudience = has(e.cardAudience) ? e.cardAudience : e.attendeesMeta
        const title = has(e.cardHeadline) ? e.cardHeadline : e.name
        const tint = i % 2 === 0 ? 'fcard__side--orange' : 'fcard__side--purple'

        return (
          <Link className="fcard" href={`/events/${e.slug}`} key={e._id}>
            <div className={`fcard__side ${tint}`}>
              <div className="fcard__stat">{leftStat}</div>
              {has(leftAudience) && <div className="fcard__stat-meta">{leftAudience}</div>}
              <div className="fcard__name">{e.name}</div>
            </div>

            <div className="fcard__main">
              {has(meta) && <div className="fcard__meta">{meta}</div>}
              <h3 className="fcard__title">{title}</h3>
              {has(e.description) && <p className="fcard__desc">{e.description}</p>}

              <div className="fcard__foot">
                <div className="fcard__tags">
                  {has(industry) && <span className="fcard__tag fcard__tag--solid">{industry}</span>}
                  {has(e.type) && <span className="fcard__tag fcard__tag--outline">{e.type}</span>}
                </div>
                <span className="btn btn--primary fcard__btn">{ctaLabel}</span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
