import { BRAND } from './brand'

export type EventCtaKind = 1 | 2 | 3

const CTA_FILES: Record<EventCtaKind, string> = {
  1: '2026-09-10_b2brain_deliverable_bioprocess-cta1.html',
  2: '2026-09-10_b2brain_deliverable_bioprocess-cta2.html',
  3: '2026-09-10_b2brain_deliverable_bioprocess-cta3-v2.html',
}

/**
 * The three shared event CTAs always use the canonical B2Brain demo page.
 * Keep accepting the legacy argument so existing callers remain compatible,
 * but do not allow stale Sanity site settings to override this destination.
 */
export function eventCtaDemoHref(value?: string | null): string {
  void value
  return BRAND.cta.href
}

export function eventCtaSrc({
  kind,
  eventName,
  eventDates,
  startDate,
  demoHref,
}: {
  kind: EventCtaKind
  eventName: string
  eventDates?: string
  startDate?: string
  demoHref?: string | null
}): string {
  const params = new URLSearchParams({
    event: eventName.trim() || 'This event',
    demo: eventCtaDemoHref(demoHref),
  })

  if (eventDates?.trim()) params.set('dates', eventDates.trim())
  if (startDate?.trim()) params.set('start', startDate.trim())

  // Keep assets below /events so the public b2brain.com proxy forwards them
  // to this Next.js app instead of falling through to the Webflow origin.
  return `/events/b2brain-ctas/${CTA_FILES[kind]}?${params.toString()}`
}
