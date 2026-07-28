'use client'

import { useEffect, useState } from 'react'

export type ArticleTocEntry = { id: string; text: string; level: 2 | 3 }

/**
 * The article's "On this page" TOC with scrollspy.
 *
 * As the reader scrolls the blog body, the heading currently in view is tracked
 * via IntersectionObserver and its TOC link is highlighted orange. Clicking a
 * link smooth-scrolls to the heading, offset for the two sticky bars (nav 64 +
 * sub-nav 56 + gap). The list itself is sticky (handled in CSS).
 */
export function ArticleToc({
  entries,
  label,
}: {
  entries: ArticleTocEntry[]
  label: string
}) {
  const [active, setActive] = useState<string>(entries[0]?.id ?? '')

  useEffect(() => {
    const headings = entries
      .map((e) => ({ id: e.id, el: document.getElementById(e.id) }))
      .filter((h): h is { id: string; el: HTMLElement } => Boolean(h.el))
    if (!headings.length) return

    // Active = the last heading whose top has scrolled above the read line
    // (~150px from the viewport top). Computed directly on each scroll — cheap
    // for a handful of headings, and works even where rAF is throttled.
    const OFFSET = 150
    let ticking = false
    const update = () => {
      ticking = false
      let current = headings[0].id
      for (const h of headings) {
        if (h.el.getBoundingClientRect().top <= OFFSET) current = h.id
        else break
      }
      setActive(current)
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      setTimeout(update, 80)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [entries])

  const onClick = (e: React.MouseEvent, id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    const y = el.getBoundingClientRect().top + window.pageYOffset - (64 + 56 + 20)
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <aside className="article__toc" aria-label={label}>
      <div className="article__toc-label">{label}</div>
      <nav>
        {entries.map((t) => (
          <a
            key={t.id}
            href={`#${t.id}`}
            onClick={(e) => onClick(e, t.id)}
            className={
              (t.level === 3 ? 'article__toc-link article__toc-link--sub' : 'article__toc-link') +
              (active === t.id ? ' is-active' : '')
            }
            aria-current={active === t.id ? 'true' : undefined}
          >
            {t.text}
          </a>
        ))}
      </nav>
    </aside>
  )
}
