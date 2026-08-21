import { has } from '@/lib/format'
import { L } from '@/lib/defaults'
import { Section, SectionHead } from '../SectionHead'
import type { EventDoc, SiteSettings } from '@/lib/types'
import type { CSSProperties } from 'react'

/**
 * BEYOND THE BOOTH  ->  mTactics()
 *
 * Template V2 addition (2026-07-22). Right after Cost & ROI: the booth is one
 * venue, and a real share of the conversations that become pipeline happen
 * off the show floor. This section names those moments and when to be there.
 */
export function Tactics({ event, settings }: { event: EventDoc; settings: SiteSettings | null }) {
  const t = event.tactics
  const items = (t?.items || []).filter((x) => has(x?.name) && has(x?.desc))
  if (!items.length) return null
  const gridStyle = { '--tact-columns': items.length } as CSSProperties

  return (
    <Section id="tactics">
      <SectionHead eyebrow={L(settings, 'tacticsEyebrow')} title={L(settings, 'tacticsHeading')} />
      {has(t?.intro) && <p className="cmp__intro">{t!.intro}</p>}
      <div className="tact" style={gridStyle}>
        {items.map((x, i) => (
          <div className="tact__card" key={`${x.name}-${i}`}>
            {has(x.when) && <div className="tact__when">{x.when}</div>}
            <div className="tact__name">{x.name}</div>
            <div className="tact__desc">{x.desc}</div>
          </div>
        ))}
      </div>
      {has(t?.foot) && <div className="gallery__foot">{t!.foot}</div>}
    </Section>
  )
}
