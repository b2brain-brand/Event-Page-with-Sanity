import { has } from '@/lib/format'
import { L } from '@/lib/defaults'
import { Section, SectionHead } from '../SectionHead'
import type { EventDoc, SiteSettings } from '@/lib/types'

/**
 * WHY IT MATTERS  ->  mWhy()
 *
 * With a pullquote: 1.3fr / 1fr split.
 * Without one: body runs full width, capped at 760px so the measure stays readable.
 */
export function Why({ event, settings }: { event: EventDoc; settings: SiteSettings | null }) {
  const w = event.why
  if (!w || (!has(w.headline) && !has(w.body))) return null

  const paragraphs = (w.body || []).filter((p) => has(p))
  const quote = w.pullquote
  const hasQuote = has(quote?.text)

  const body = (
    <>
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </>
  )

  return (
    <Section id="why">
      <SectionHead eyebrow={L(settings, 'whyEyebrow')} title={w.headline} />
      {hasQuote ? (
        <div className="why__grid">
          <div className="why__body">{body}</div>
          <aside className="pullquote">
            <p className="pullquote__text">&ldquo;{quote!.text}&rdquo;</p>
            {has(quote?.attr) && <div className="pullquote__attr">{quote!.attr}</div>}
          </aside>
        </div>
      ) : (
        <div className="why__body" style={{ maxWidth: 760 }}>
          {body}
        </div>
      )}
    </Section>
  )
}
