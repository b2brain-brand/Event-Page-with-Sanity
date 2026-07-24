import { has } from '@/lib/format'
import { L } from '@/lib/defaults'
import { Section, SectionHead } from '../SectionHead'
import { FaqList } from './Faq'
import type { EventDoc, SiteSettings } from '@/lib/types'

/**
 * FAQ  ->  mFaq()
 *
 * Two-column: the head sits in a 340px rail, the accordion fills the rest.
 * The same pairs are emitted as FAQPage JSON-LD from the page component.
 */
export function FaqSection({ event, settings }: { event: EventDoc; settings: SiteSettings | null }) {
  const items = (event.faq || []).filter((f) => has(f?.q) && has(f?.a))
  if (!items.length) return null

  return (
    <Section id="faq">
      <div className="faq__grid">
        <div>
          <SectionHead eyebrow={L(settings, 'faqEyebrow')} title={L(settings, 'faqHeading')} />
          <p className="muted" style={{ maxWidth: 340 }}>
            {L(settings, 'faqSideNote')}
          </p>
        </div>
        <FaqList items={items} />
      </div>
    </Section>
  )
}
