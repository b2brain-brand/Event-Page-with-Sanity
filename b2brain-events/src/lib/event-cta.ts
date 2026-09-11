import { BRAND } from './brand'

export type EventCtaKind = 1 | 2 | 3

const CTA_FILES: Record<EventCtaKind, string> = {
  1: '2026-09-10_b2brain_deliverable_bioprocess-cta1.html',
  2: '2026-09-10_b2brain_deliverable_bioprocess-cta2.html',
  3: '2026-09-10_b2brain_deliverable_bioprocess-cta3-v2.html',
}

/**
 * Site-settings URLs may be absolute or root-relative. The CTA lives in an
 * iframe, so relative links must be resolved against b2brain.com rather than
 * against /b2brain-ctas/ inside the iframe.
 */
export function eventCtaDemoHref(value?: string | null): string {
  const candidate = value?.trim() || BRAND.cta.href

  try {
    const url = new URL(candidate, BRAND.logoHref)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : BRAND.cta.href
  } catch {
    return BRAND.cta.href
  }
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

  return `/b2brain-ctas/${CTA_FILES[kind]}?${params.toString()}`
}
