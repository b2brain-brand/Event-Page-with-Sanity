import Link from 'next/link'
import Image from 'next/image'
import { fmtRange, has } from '@/lib/format'
import type { IndexEventCard } from '@/lib/types'

/**
 * Event card — an exact match of the b2brain.com/events card.
 *
 * Verified against the live site's DOM and computed styles:
 *   - 1px solid black border, zero radius, no shadow, white fill
 *   - type tag (uppercase, black-70) + industry pill (brand orange #ff382c,
 *     white text) in a row
 *   - title (Archivo, 24px)
 *   - a stacked meta list: date · venue/city · attendees · exhibitors
 *   - a button: filled "Open Event Playbook" when featured, ghost
 *     "See The Event Playbook" in the all-events grid
 *
 * The real cards carry NO image — this matches that by default. `cardImage` is
 * optional: populate it in the Studio and it renders at the top (16:9); leave it
 * empty and the card is identical to the live site.
 *
 * The static design is fixed here; every value (title, tags, meta, image) is
 * driven per event from Sanity, so the cards are dynamic content in a fixed frame.
 */
export function EventCard({
  event,
  ctaLabel,
  featured = false,
}: {
  event: IndexEventCard
  ctaLabel: string
  featured?: boolean
}) {
  const industry = event.categories?.[0]?.title
  const venueLine = [event.venueName, event.city].filter((x) => has(x)).join(' · ')
  const dateLine = fmtRange(event.startDate, event.endDate)
  const img = event.cardImage?.asset?.url

  return (
    <Link className="ecard" href={`/events/${event.slug}`}>
      {img && (
        <span className="ecard__img">
          <Image
            src={img}
            alt={event.cardImageAlt || event.name}
            fill
            sizes="(max-width: 991px) 100vw, 380px"
            style={{ objectFit: 'cover' }}
          />
        </span>
      )}

      <span className="ecard__body">
        <span className="ecard__tags">
          {has(event.type) && <span className="ecard__type">{event.type}</span>}
          {has(industry) && <span className="ecard__industry">{industry}</span>}
        </span>

        <span className="ecard__title">{event.name}</span>

        <span className="ecard__meta">
          {has(dateLine) && <span className="ecard__row">{dateLine}</span>}
          {has(venueLine) && <span className="ecard__row">{venueLine}</span>}
          {has(event.attendees) && (
            <span className="ecard__row">
              <b className="mono-num">{event.attendees}</b> Attendees
            </span>
          )}
          {has(event.exhibitors) && (
            <span className="ecard__row">
              <b className="mono-num">{event.exhibitors}</b> Exhibitors
            </span>
          )}
        </span>

        <span className={`btn ${featured ? 'btn--primary' : 'btn--ghost'} ecard__btn`}>
          {ctaLabel}
        </span>
      </span>
    </Link>
  )
}
