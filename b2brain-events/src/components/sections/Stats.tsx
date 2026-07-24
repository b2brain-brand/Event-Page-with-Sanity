import { has } from '@/lib/format'
import type { EventDoc } from '@/lib/types'

/**
 * AT-A-GLANCE  ->  mStats()
 *
 * Sits tight under the hero with no top padding and no bottom border, so the
 * strip reads as part of the hero block rather than as its own section. Cells
 * without a number are dropped; no numbers at all removes the strip.
 */
export function Stats({ event }: { event: EventDoc }) {
  const cells = (event.stats || []).filter((s) => has(s?.num))
  if (!cells.length) return null

  return (
    <section id="stats" className="sec" style={{ paddingTop: 0, borderBottom: 'none' }}>
      <div className="container" style={{ paddingTop: 64 }}>
        <div className="glance">
          {cells.map((s, i) => (
            <div className="glance__cell" key={`${s.label}-${i}`}>
              <div className="glance__num">{s.num}</div>
              <div className="glance__label">{s.label}</div>
              {has(s.meta) && <div className="glance__meta">{s.meta}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
