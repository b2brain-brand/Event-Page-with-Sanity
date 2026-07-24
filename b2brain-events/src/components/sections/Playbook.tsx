import { has, tpl } from '@/lib/format'
import { L } from '@/lib/defaults'
import { Section, SectionHead } from '../SectionHead'
import type { EventDoc, SiteSettings } from '@/lib/types'

/**
 * HOW TO WIN AT [EVENT]  ->  mPlaybook()
 *
 * The narrative spine — Speed, Commitment, Pipeline — expressed against this
 * specific show. Card colour is bound to the motion index (01 purple, 02 orange,
 * 03 green) and never varies; that consistency across 40 pages is the point.
 */
export function Playbook({ event, settings }: { event: EventDoc; settings: SiteSettings | null }) {
  const p = event.playbook
  if (!p) return null

  const cards: { n: '1' | '2' | '3'; step: string; h?: string; b?: string }[] = []
  if (has(p.pre?.h)) cards.push({ n: '1', step: L(settings, 'playbookStep1'), ...p.pre })
  if (has(p.floor?.h)) cards.push({ n: '2', step: L(settings, 'playbookStep2'), ...p.floor })
  if (has(p.post?.h)) cards.push({ n: '3', step: L(settings, 'playbookStep3'), ...p.post })
  if (!cards.length) return null

  const name = has(event.name) ? event.name! : 'this show'
  const eyebrow = tpl(L(settings, 'playbookEyebrowTemplate'), { event: name.toUpperCase() })
  const heading = tpl(L(settings, 'playbookHeadingTemplate'), { event: name })

  return (
    <Section id="playbook">
      <SectionHead eyebrow={eyebrow} title={heading} />
      <div className="play">
        {cards.map((c) => (
          <div className={`play__card play__card--${c.n}`} key={c.n}>
            <div className="play__step">
              {tpl(L(settings, 'playbookMotionPrefix'), { n: c.n })}
              {c.step}
            </div>
            <div className="play__icon" aria-hidden="true" />
            <h4>{c.h}</h4>
            {has(c.b) && <p>{c.b}</p>}
          </div>
        ))}
      </div>
    </Section>
  )
}
