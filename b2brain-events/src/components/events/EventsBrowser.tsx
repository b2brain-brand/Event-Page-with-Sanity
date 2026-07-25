'use client'

import { useMemo, useState } from 'react'
import { EventCard } from './EventCard'
import { has } from '@/lib/format'
import type { IndexEventCard } from '@/lib/types'

/**
 * "Browse the 2026 event calendar" — the interactive grid, matching
 * b2brain.com/events exactly (verified against the live DOM):
 *
 *   - "Filter By Industry": a row of RADIO buttons, one per industry present in
 *     the events, plus "All" to reset — single-select, like the main site.
 *   - "Search": a "Search by name & industry" text box.
 *   - a "Showing N Out of N" counter and a "Clear All" reset.
 *
 * Both controls are client-side over the loaded list, so filtering is instant.
 * Empty result set shows a message, never a blank grid.
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
        const hay = [e.name, e.city, e.venueName, ...(e.categories || []).map((c) => c.title)]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [events, industry, query])

  const dirty = Boolean(industry || query)
  const clear = () => {
    setIndustry('')
    setQuery('')
  }

  return (
    <div>
      <div className="filter">
        {/* Industry radios */}
        <div className="filter__industries">
          <div className="filter__label">{industryLabel}</div>
          <div className="filter__radios">
            <label className="filter__radio">
              <input
                type="radio"
                name="industry"
                checked={industry === ''}
                onChange={() => setIndustry('')}
              />
              <span>All</span>
            </label>
            {industries.map(([slug, title]) => (
              <label className="filter__radio" key={slug}>
                <input
                  type="radio"
                  name="industry"
                  checked={industry === slug}
                  onChange={() => setIndustry(slug)}
                />
                <span>{title}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Search + counter */}
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
            Showing <b>{filtered.length}</b> Out of <b>{events.length}</b>
          </span>
          {dirty && (
            <button type="button" className="filter__clear" onClick={clear}>
              Clear All
            </button>
          )}
        </div>
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
