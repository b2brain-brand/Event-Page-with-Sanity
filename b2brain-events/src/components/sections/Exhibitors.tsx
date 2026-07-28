import { has } from '@/lib/format'
import { L } from '@/lib/defaults'
import { Section, SectionHead } from '../SectionHead'
import type { EventDoc, SiteSettings } from '@/lib/types'

/**
 * EXHIBITORS & SPONSORS  ->  mExhibitors()
 *
 * Tier table + the orange-edged POV note. Either half alone renders the section.
 */
export function Exhibitors({
  event,
  settings,
}: {
  event: EventDoc
  settings: SiteSettings | null
}) {
  const x = event.exhibitors
  if (!x) return null

  const tiers = (x.tiers || []).filter((t) => has(t?.tier))
  const notable = x.notable
  if (!tiers.length && !has(notable)) return null

  return (
    <Section id="exhibitors">
      <SectionHead
        eyebrow={L(settings, 'exhibitorsEyebrow')}
        title={L(settings, 'exhibitorsHeading')}
      />

      {tiers.length > 0 && (
        <div className="exh__tiers">
          {tiers.map((t, i) => (
            <div className="exh__tier" key={`${t.tier}-${i}`}>
              <div className="exh__tier-name">{t.tier}</div>
              <div className="exh__logos">
                {(t.names || []).map((n, j) => (
                  <div className="exh__logo" key={`${n}-${j}`}>
                    {n}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {has(notable) && (
        <div className="exh__notable">
          <h4>{L(settings, 'exhibitorsNotableHeading')}</h4>
          <p>{notable}</p>
        </div>
      )}

      {/* CTA line just after the "which booths" box, per the request sheet. */}
      {has(L(settings, 'exhibitorsCta')) && (
        <a href="#cta" className="exh__cta link-arrow">
          {L(settings, 'exhibitorsCta')}
        </a>
      )}
    </Section>
  )
}
