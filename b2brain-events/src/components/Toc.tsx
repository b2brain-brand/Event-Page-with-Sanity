'use client'

import { useEffect, useState } from 'react'

export type TocEntry = { id: string; label: string }

/**
 * The sticky "On this page" strip.
 *
 * Two behaviours ported from the reference build:
 *  1. It only lists sections that ACTUALLY RENDERED. The server decides that and
 *     hands down `entries` — an event with no speakers has no Speakers link.
 *  2. Scrollspy via IntersectionObserver, and anchor clicks that offset for the
 *     two stacked sticky bars (nav 64 + toc 56 + 12).
 *
 * Content is never hidden by the observer — it only moves the underline.
 */
export function Toc({
  entries,
  label,
  ctaLabel,
  ctaHref = '#cta',
}: {
  entries: TocEntry[]
  label: string
  ctaLabel: string
  ctaHref?: string
}) {
  const [active, setActive] = useState<string>(entries[0]?.id ?? '')

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('main section[id]'),
    )
    if (!sections.length) return

    const spy = new IntersectionObserver(
      (records) => {
        records.forEach((r) => {
          if (r.isIntersecting) setActive(r.target.id)
        })
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )
    sections.forEach((s) => spy.observe(s))
    return () => spy.disconnect()
  }, [entries])

  useEffect(() => {
    const onClick = (ev: MouseEvent) => {
      const a = (ev.target as HTMLElement | null)?.closest?.('a[href^="#"]') as
        | HTMLAnchorElement
        | null
      if (!a) return
      const id = a.getAttribute('href')?.slice(1)
      if (!id) return
      const el = document.getElementById(id)
      if (!el) return
      ev.preventDefault()
      const y = el.getBoundingClientRect().top + window.pageYOffset - (64 + 56 + 12)
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  if (!entries.length) return null

  return (
    <nav className="toc" id="toc" aria-label="On this page">
      <div className="toc__inner">
        <span className="toc__label">{label}</span>
        <div className="toc__links" id="tocLinks">
          {entries.map((e) => (
            <a
              key={e.id}
              href={`#${e.id}`}
              data-spy={e.id}
              className={active === e.id ? 'is-active' : undefined}
            >
              {e.label}
            </a>
          ))}
        </div>
        <a href={ctaHref} className="btn btn--primary btn--sm">
          {ctaLabel}
        </a>
      </div>
    </nav>
  )
}
