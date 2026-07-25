'use client'

import { useMemo, useState } from 'react'
import { EventCard } from './EventCard'
import { has } from '@/lib/format'
import type { IndexEventCard } from '@/lib/types'

/**
 * The "Browse the 2026 event calendar" grid — the interactive half of /events.
 *
 * Two controls, exactly like b2brain.com/events: an industry dropdown built from
 * the categories actually present, and a free-text search over name, city and
 * industry. Both are client-side over the already-loaded list, so filtering is
 * instant and needs no round-trip. A "Clear all" appears once anything is set.
 *
 * The empty state matters: filter down to nothing and you get a message, not a
 * blank grid.
 */
export function EventsBrowser({
  events,
  industryLabel,
  searchPlaceholder,
  cardCtaLabel,
}: {
  events: IndexEventCard[]
  industryLabel: string
  searchPlaceholder: string
  cardCtaLabel: string
}) {
  const [industry, setIndustry] = useState('')
  const [query, setQuery] = useState('')

  const industries = useMemo(() => {
    const set = new Map<string, string>()
    for (const e of events) {
      for (const c of e.categories || []) {
        if (c?.title) set.set(c.slug || c.title, c.title)
      }
    }
    return [...set.entries()].sort((a, b) => a[1].localeCompare(b[1]))
  }, [events])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return events.filter((e) => {
      if (industry) {
        const inIndustry = (e.categories || []).some((c) => (c.slug || c.title) === industry)
        if (!inIndustry) return false
      }
      if (q) {
        const hay = [
          e.name,
          e.city,
          e.venueName,
          ...(e.categories || []).map((c) => c.title),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [events, industry, query])

  const dirty = Boolean(industry || query)

  return (
    <div>
      <div className="ebrowse__controls">
        <div className="ebrowse__search">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
          />
        </div>

        <div className="ebrowse__filter">
          <label htmlFor="industry" className="sr-only">
            {industryLabel}
          </label>
          <select
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            aria-label={industryLabel}
          >
            <option value="">{industryLabel}</option>
            {industries.map(([slug, title]) => (
              <option key={slug} value={slug}>
                {title}
              </option>
            ))}
          </select>
        </div>

        {dirty && (
          <button
            type="button"
            className="ebrowse__clear"
            onClick={() => {
              setIndustry('')
              setQuery('')
            }}
          >
            Clear all
          </button>
        )}

        <span className="ebrowse__count">
          {filtered.length} {filtered.length === 1 ? 'event' : 'events'}
        </span>
      </div>

      {filtered.length > 0 ? (
        <div className="ecards">
          {filtered.map((e) => (
            <EventCard key={e._id} event={e} ctaLabel={cardCtaLabel} />
          ))}
        </div>
      ) : (
        <div className="ebrowse__empty">
          No events match{has(query) ? ` “${query}”` : ''}
          {industry ? ' in that industry' : ''}. Try clearing the filters.
        </div>
      )}
    </div>
  )
}
