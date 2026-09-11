'use client'

import { useEffect, useMemo, useRef } from 'react'

import { eventCtaDemoHref, eventCtaSrc, type EventCtaKind } from '@/lib/event-cta'

const TITLES: Record<EventCtaKind, string> = {
  1: 'B2Brain: scan a contact, book a meeting and sync it to CRM',
  2: 'B2Brain: capture event badges, business cards and digital QR codes',
  3: 'Explore B2Brain event lead capture',
}

export function EventCtaFrame({
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
}) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const src = useMemo(
    () => eventCtaSrc({ kind, eventName, eventDates, startDate, demoHref }),
    [kind, eventName, eventDates, startDate, demoHref],
  )

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    let observer: ResizeObserver | undefined

    const fitSameOriginFrame = () => {
      observer?.disconnect()
      observer = undefined

      try {
        const doc = frame.contentDocument
        const root = doc?.querySelector<HTMLElement>('.composition,.b3')
        if (!doc || !root) return

        const label = eventName.trim() || 'This event'
        const destination = eventCtaDemoHref(demoHref)

        doc.querySelectorAll<HTMLElement>('[data-event],#event').forEach((element) => {
          element.textContent = label
          element.title = label
        })
        doc.querySelectorAll<HTMLAnchorElement>('a.cta,a.demo').forEach((link) => {
          link.href = destination
        })

        if (kind === 1) {
          root.dataset.eventName = label
          root.setAttribute('aria-label', `Illustrative B2Brain event sales workflow for ${label}`)

          const crmEvent = doc.querySelector<HTMLElement>('.crm-title span')
          if (crmEvent) {
            crmEvent.textContent = label
            crmEvent.title = label
          }

          const source = doc.querySelector<HTMLElement>('.field-row > div:nth-child(2) b')
          if (source) source.textContent = `${label} · Badge scan`

          const badgeHead = doc.querySelector<HTMLElement>('.scan .badge .badge-head')
          if (badgeHead?.firstChild) badgeHead.firstChild.textContent = label
          const badgeDates = badgeHead?.querySelector<HTMLElement>('span')
          if (badgeDates && eventDates?.trim()) badgeDates.textContent = eventDates.trim()

          if (startDate && /^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
            const meetingDate = new Date(`${startDate}T12:00:00`)
            meetingDate.setDate(meetingDate.getDate() + 1)
            const shortDate = new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
            }).format(meetingDate)
            const longDate = new Intl.DateTimeFormat('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            }).format(meetingDate)
            const calendarDate = doc.querySelector<HTMLElement>('.calendar small')
            const meetingRow = doc.querySelector<HTMLElement>('.meeting-row span')
            if (calendarDate) calendarDate.textContent = longDate
            if (meetingRow) meetingRow.textContent = `Discovery meeting · ${shortDate}, 10:00 AM`
          }
        }

        if (kind === 2) {
          root.dataset.eventName = label
          const badgeDates = doc.querySelector<HTMLElement>('.item.badge:not(.expo) .badge-head small')
          if (badgeDates && eventDates?.trim()) badgeDates.textContent = eventDates.trim()

          const eventHeading = doc.querySelector<HTMLElement>('.event-heading')
          if (eventHeading) {
            eventHeading.style.fontSize = label.length > 64 ? '17px' : label.length > 48 ? '20px' : ''
          }
        }

        const fit = () => {
          const art = [...doc.querySelectorAll<HTMLElement>('.art')]
          const bottoms = [root, ...art].map((element) => element.getBoundingClientRect().bottom)
          frame.style.height = `${Math.ceil(Math.max(...bottoms) + 12)}px`
        }

        observer = new ResizeObserver(fit)
        observer.observe(root)
        void doc.fonts?.ready.then(fit)
        fit()
      } catch {
        // The source-checked postMessage handler below covers cross-origin frames.
      }
    }

    const onMessage = (event: MessageEvent) => {
      const data = event.data as { type?: string; id?: number; height?: number } | null
      if (
        event.origin !== window.location.origin ||
        event.source !== frame.contentWindow ||
        data?.type !== 'b2brain-cta-height' ||
        data.id !== kind ||
        !Number.isFinite(data.height) ||
        data.height! <= 100 ||
        data.height! >= 1600
      ) {
        return
      }

      frame.style.height = `${data.height}px`
    }

    frame.addEventListener('load', fitSameOriginFrame)
    window.addEventListener('message', onMessage)
    fitSameOriginFrame()

    return () => {
      observer?.disconnect()
      frame.removeEventListener('load', fitSameOriginFrame)
      window.removeEventListener('message', onMessage)
    }
  }, [kind, src, eventName, eventDates, startDate, demoHref])

  return (
    <iframe
      ref={frameRef}
      className={`event-cta event-cta--${kind}`}
      src={src}
      title={TITLES[kind]}
      loading="lazy"
    />
  )
}

export function EventCtaBand({
  kind,
  eventName,
  eventDates,
  startDate,
  demoHref,
}: {
  kind: 1 | 2
  eventName: string
  eventDates?: string
  startDate?: string
  demoHref?: string | null
}) {
  return (
    <section className="event-cta-placement" data-event-cta={`cta${kind}`}>
      <div className="container">
        <EventCtaFrame
          kind={kind}
          eventName={eventName}
          eventDates={eventDates}
          startDate={startDate}
          demoHref={demoHref}
        />
      </div>
    </section>
  )
}
