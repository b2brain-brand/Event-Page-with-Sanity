import { has, tpl } from '@/lib/format'
import { L } from '@/lib/defaults'
import { Section, SectionHead } from '../SectionHead'
import type { EventDoc, SiteSettings } from '@/lib/types'

/**
 * QUICK ANSWER  ->  mAnswer()
 *
 * The purple box. Structurally the most valuable block on the page: an H2 that
 * IS the query ("What is Dreamforce 2026?") immediately followed by a
 * self-contained answer paragraph. That pairing is what gets lifted verbatim
 * into AI Overviews and Perplexity answers.
 */
export function Answer({
  event,
  settings,
}: {
  event: EventDoc
  settings: SiteSettings | null
}) {
  if (!has(event.tldr)) return null

  const name = has(event.name) ? event.name : 'this event'
  const heading = tpl(L(settings, 'answerHeadingTemplate'), { event: name })

  return (
    <Section id="answer">
      <SectionHead eyebrow={L(settings, 'answerEyebrow')} />
      <div className="answer">
        <h2>{heading}</h2>
        <p>{event.tldr}</p>
      </div>
    </Section>
  )
}
