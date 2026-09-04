'use client'

import Link from 'next/link'
import Image from 'next/image'
import { fmtRange, has } from '@/lib/format'
import { hasNumericMetric, resolveEventCardCover } from '@/lib/event-card-cover'
import { eventCardTiming } from '@/lib/event-status'
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
 * Cover priority is deliberate: approved Sanity image, then a server-verified
 * YouTube still, then deterministic event artwork. A failed or unavailable
 * remote thumbnail can therefore never leave a broken/loading card.
 *
 * The static design is fixed here; every value (title, tags, meta, image) is
 * driven per event from Sanity, so the cards are dynamic content in a fixed frame.
 */
export function EventCard({
  event,
  ctaLabel,
  today,
  featured = false,
}: {
  event: IndexEventCard
  ctaLabel: string
  /** Server-derived ISO day so the badge never changes during hydration. */
  today: string
  featured?: boolean
}) {
  const industry = event.categories?.[0]?.title
  const venueLine = [event.venueName, event.city].filter((x) => has(x)).join(' · ')
  const dateLine = fmtRange(event.startDate, event.endDate)
  const cover = resolveEventCardCover(event, industry)
  const timing = eventCardTiming(event, today)
  const statusLabel =
    timing === 'live' ? 'Live now' : timing === 'coming-soon' ? 'Coming soon' : timing === 'past' ? 'Past' : ''

  return (
    <Link className="ecard" href={`/events/${event.slug}`}>
      {statusLabel && (
        <span className={`ecard__status ecard__status--${timing}`}>
          <span className="ecard__status-dot" aria-hidden="true" />
          {statusLabel}
        </span>
      )}
      {cover.kind !== 'art' ? (
        <span className="ecard__img ecard__img--photo">
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            sizes="(max-width: 991px) 100vw, 380px"
            style={{ objectFit: 'cover' }}
          />
        </span>
      ) : (
        <span className="ecard__img ecard__img--art" style={cover.style} aria-hidden="true">
          <span className="ecard__art-grid" />
          <span className="ecard__art-orbit" />
          <span className="ecard__art-kicker">{industry || event.type || 'B2B event'}</span>
          <span className="ecard__art-monogram">{cover.monogram}</span>
          <span className="ecard__art-year">{event.startDate?.slice(0, 4) || 'EVENT'}</span>
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
          {hasNumericMetric(event.attendees) && (
            <span className="ecard__row">
              <b className="mono-num">{event.attendees}</b> Attendees
            </span>
          )}
          {hasNumericMetric(event.exhibitors) && (
            <span className="ecard__row">
              <b className="mono-num">{event.exhibitors}</b> Exhibitors
            </span>
          )}
        </span>

        {has(event.description) && <span className="ecard__desc">{event.description}</span>}

        <span className={`btn ${featured ? 'btn--primary' : 'btn--ghost'} ecard__btn`}>
          {ctaLabel}
        </span>
      </span>
    </Link>
  )
}
