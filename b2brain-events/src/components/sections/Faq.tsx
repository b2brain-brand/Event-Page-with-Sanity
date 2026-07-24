'use client'

import { useRef, useState } from 'react'

export type FaqPair = { q?: string; a?: string }

/**
 * FAQ accordion  ->  the .faq__q handler in wireInteractions()
 *
 * max-height is animated from the measured scrollHeight, exactly like the
 * reference. The answers are in the DOM whether or not a panel is open, so
 * crawlers and answer engines read all of them — the interaction is presentation
 * only, never a content gate.
 */
export function FaqList({ items }: { items: FaqPair[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const panels = useRef<(HTMLDivElement | null)[]>([])

  return (
    <div className="faq__list">
      {items.map((f, i) => {
        const isOpen = open === i
        return (
          <div className={`faq__item${isOpen ? ' is-open' : ''}`} key={i}>
            <button
              type="button"
              className="faq__q"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span>{f.q}</span>
              <span className="faq__icon" aria-hidden="true" />
            </button>
            <div
              className="faq__a"
              ref={(el) => {
                panels.current[i] = el
              }}
              style={{ maxHeight: isOpen ? panels.current[i]?.scrollHeight ?? 999 : 0 }}
            >
              <div className="faq__a-inner">{f.a}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
