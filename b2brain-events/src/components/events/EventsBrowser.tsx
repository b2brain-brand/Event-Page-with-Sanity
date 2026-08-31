'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { EventCard } from './EventCard'
import { has } from '@/lib/format'
import {
  eventTimeCounts,
  eventsForTimeFilter,
  type EventTimeFilter,
} from '@/lib/event-status'
import type { IndexEventCard, IndustryLink } from '@/lib/types'

/**
 * "Browse the 2026 event calendar" — the interactive grid, matching
 * b2brain.com/events (verified against the live DOM), PLUS one deliberate
 * change from the original: "Filter By Industry" used to be a client-side-only
 * radio toggle over one shared URL, so Google's crawler only ever saw a single
 * undifferentiated /events page no matter which vertical a search query was
 * about. Each industry is now a real page — /events/industry/[slug] — so this
 * component only renders the industry row as plain links (crawlable, no JS
 * required) and highlights whichever one is current. It no longer filters by
 * industry itself; the SERVER already scoped `events` to the right set before
 * this ever renders. Search-by-text stays client-side over that (already
 * correctly scoped) list — that part doesn't need its own URL, it's a
 * convenience for the visitor already on the page, not a distinct answer to a
 * distinct query.
 */
export function EventsBrowser({
  events,
  industries,
  activeIndustry,
  today,
  industryLabel,
  searchPlaceholder,
  cardCtaLabel,
}: {
  events: IndexEventCard[]
  /** Every vertical site-wide, not just the ones present in `events`. */
  industries: IndustryLink[]
  /** The current category page's slug; undefined on /events itself ("All"). */
  activeIndustry?: string
  /** Server-derived ISO day; keeps status filtering timezone-stable. */
  today: string
  industryLabel: string
  searchPlaceholder: string
  cardCtaLabel: string
}) {
  const [query, setQuery] = useState('')
  const [timeFilter, setTimeFilter] = useState<EventTimeFilter>('upcoming')
  const counts = useMemo(() => eventTimeCounts(events, today), [events, today])
  const statusEvents = useMemo(
    () => eventsForTimeFilter(events, timeFilter, today),
    [events, timeFilter, today],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return statusEvents
    return statusEvents.filter((e) => {
      const hay = [e.name, e.city, e.venueName, ...(e.categories || []).map((c) => c.title)]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [query, statusEvents])

  const clear = () => setQuery('')

  return (
    <div>
      <div className="filter">
        {/* Industry nav — real links, not radios; see file note above. */}
        <div className="filter__industries">
          <div className="filter__timing">
            <div className="filter__label">Event Date</div>
            <div className="filter__status" role="group" aria-label="Filter events by date">
              {(
                [
                  ['upcoming', `Upcoming (${counts.upcoming})`],
                  ['past', `Past (${counts.past})`],
                  ['all', `All events (${events.length})`],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`filter__status-button${timeFilter === value ? ' is-active' : ''}`}
                  aria-pressed={timeFilter === value}
                  onClick={() => setTimeFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter__label">{industryLabel}</div>
          <div className="filter__radios">
            <Link
              href="/events"
              className={`filter__radio${!activeIndustry ? ' is-active' : ''}`}
              aria-current={!activeIndustry ? 'page' : undefined}
            >
              <span className="filter__radio-dot" aria-hidden="true" />
              <span>All</span>
            </Link>
            {industries.map((ind) => (
              <Link
                key={ind.slug}
                href={`/events/industry/${ind.slug}`}
                className={`filter__radio${activeIndustry === ind.slug ? ' is-active' : ''}`}
                aria-current={activeIndustry === ind.slug ? 'page' : undefined}
              >
                <span className="filter__radio-dot" aria-hidden="true" />
                <span>{ind.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Search + counter — unchanged. */}
        <div className="filter__search">
          <div className="filter__label">Search</div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
          />
        </div>

        <div className="filter__meta">
          <span className="filter__count">
            Showing <b>{filtered.length}</b> Out of <b>{statusEvents.length}</b>
          </span>
          {has(query) && (
            <button type="button" className="filter__clear" onClick={clear}>
              Clear All
            </button>
          )}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="ecards">
          {filtered.map((e) => (
            <EventCard key={e._id} event={e} ctaLabel={cardCtaLabel} today={today} />
          ))}
        </div>
      ) : (
        <div className="ebrowse__empty">
          No {timeFilter === 'all' ? '' : `${timeFilter} `}events match
          {has(query) ? ` “${query}”` : ''}. Try another date filter or clear the search.
        </div>
      )}
    </div>
  )
}
