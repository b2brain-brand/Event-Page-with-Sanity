'use client'

import { useState } from 'react'
import { has } from '@/lib/format'
import type { EventDoc } from '@/lib/types'

type Day = NonNullable<NonNullable<EventDoc['agenda']>['days']>[number]

/** The tabbed day switcher. Client-side only for the tab state. */
export function AgendaTabs({ days }: { days: Day[] }) {
  const [active, setActive] = useState(0)

  return (
    <>
      <div className="tabs" role="tablist">
        {days.map((d, i) => (
          <button
            type="button"
            key={`${d.label}-${i}`}
            className={`tab${i === active ? ' is-active' : ''}`}
            role="tab"
            aria-selected={i === active}
            aria-controls={`ag${i}`}
            onClick={() => setActive(i)}
          >
            {d.label}
            {has(d.meta) && <span className="tab__meta">{d.meta}</span>}
          </button>
        ))}
      </div>

      {days.map((d, i) => (
        <div
          className={`agenda__panel${i === active ? ' is-active' : ''}`}
          id={`ag${i}`}
          key={`panel-${i}`}
          role="tabpanel"
        >
          {(d.items || []).map((it, j) => (
            <div className="agenda__row" key={`${it.title}-${j}`}>
              <div className="agenda__time mono-num">{it.time}</div>
              <div>
                <div className="agenda__title">{it.title}</div>
                {has(it.loc) && <div className="agenda__loc">{it.loc}</div>}
              </div>
              {has(it.track) && <div className="agenda__track">{it.track}</div>}
            </div>
          ))}
        </div>
      ))}
    </>
  )
}
