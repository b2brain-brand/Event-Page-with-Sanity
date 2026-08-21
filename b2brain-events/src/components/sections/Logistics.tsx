import { has } from '@/lib/format'
import { L } from '@/lib/defaults'
import { Section, SectionHead } from '../SectionHead'
import type { EventDoc, SiteSettings } from '@/lib/types'

/**
 * LOGISTICS  ->  mLogistics()
 *
 * Each cell is a list OR a paragraph — the list wins when both exist, matching
 * the reference renderer. The passes table below is independently optional.
 */
export function Logistics({ event, settings }: { event: EventDoc; settings: SiteSettings | null }) {
  const l = event.logistics
  if (!l) return null

  const cells = (l.cells || [])
    .map((c) => ({ ...c, list: (c.list || []).filter((item) => has(item)) }))
    .filter((c) => has(c?.h) && (has(c?.body) || c.list.length > 0))
  const passes = (l.passes || []).filter((p) => has(p?.name) && has(p?.price))
  if (!cells.length && !passes.length) return null

  return (
    <Section id="logistics">
      <SectionHead
        eyebrow={L(settings, 'logisticsEyebrow')}
        title={L(settings, 'logisticsHeading')}
      />

      {cells.length > 0 && (
        <div className="log__grid">
          {cells.map((c, i) => (
            <div className="log__cell" key={`${c.h}-${i}`}>
              <h4>{c.h}</h4>
              {has(c.list) ? (
                <ul>
                  {c.list!.map((x, j) => (
                    <li key={j}>{x}</li>
                  ))}
                </ul>
              ) : (
                has(c.body) && <p>{c.body}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {passes.length > 0 && (
        <div style={{ marginTop: 26 }}>
          <div className="eyebrow eyebrow--asterisk" style={{ marginBottom: 14 }}>
            {L(settings, 'passesLabel')}
          </div>
          <div className="passes">
            {passes.map((p, i) => (
              <div className="passes__row" key={`${p.name}-${i}`}>
                <div>
                  <div className="passes__name">{p.name}</div>
                  {has(p.note) && <div className="passes__note">{p.note}</div>}
                </div>
                <div className="passes__price mono-num">{p.price}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Section>
  )
}
