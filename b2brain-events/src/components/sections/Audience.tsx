import { has } from '@/lib/format'
import { L } from '@/lib/defaults'
import { Section, SectionHead } from '../SectionHead'
import type { EventDoc, SiteSettings } from '@/lib/types'

/**
 * WHO ATTENDS  ->  mAudience()
 *
 * Two columns. When only one has data the reference build drops the 2-up grid
 * and renders a single bordered box instead of leaving a dead half — reproduced
 * here exactly.
 */
export function Audience({ event, settings }: { event: EventDoc; settings: SiteSettings | null }) {
  const a = event.audience
  if (!a) return null

  const bars = (a.titleMix || []).filter((t) => has(t?.label) && typeof t.pct === 'number')
  const industries = (a.industries || []).filter((i) => has(i))
  const match = a.match

  const left =
    bars.length > 0 ? (
      <div className="aud__col">
        <div className="eyebrow eyebrow--asterisk" style={{ marginBottom: 18 }}>
          {L(settings, 'audienceTitleMixLabel')}
        </div>
        {bars.map((t, i) => (
          <div className="aud__bar" key={`${t.label}-${i}`}>
            <div className="aud__bar-top">
              <span>{t.label}</span>
              <b className="mono-num">{t.pct}%</b>
            </div>
            <div className="aud__bar-track">
              <div className="aud__bar-fill" style={{ width: `${t.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    ) : null

  const right =
    industries.length > 0 || has(match) ? (
      <div className="aud__col">
        <div className="eyebrow eyebrow--asterisk" style={{ marginBottom: 18 }}>
          {L(settings, 'audienceIndustriesLabel')}
        </div>
        {industries.length > 0 && (
          <div className="aud__chips">
            {industries.map((i) => (
              <span key={i}>{i}</span>
            ))}
          </div>
        )}
        {has(match) && (
          <div className="aud__match">
            <h4>{L(settings, 'audienceMatchHeading')}</h4>
            <p>{match}</p>
          </div>
        )}
      </div>
    ) : null

  if (!left && !right) return null

  return (
    <Section id="audience">
      <SectionHead
        eyebrow={L(settings, 'audienceEyebrow')}
        title={L(settings, 'audienceHeading')}
      />
      {left && right ? (
        <div className="aud__grid">
          {left}
          {right}
        </div>
      ) : (
        <div style={{ border: '1px solid var(--black)' }}>{left || right}</div>
      )}
    </Section>
  )
}
