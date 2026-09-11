import { BRAND } from '@/lib/brand'
import { AiGlyph } from '../BrandIcons'
import { EventCtaFrame } from '../EventCtaFrame'

/**
 * The event article's right rail: the shared animated product tour from the
 * approved CTA handoff, followed by the matching answer-engine links.
 *
 * The CTA design is code-owned; the event label, dates and destination come
 * from the event document and global CTA setting.
 */
export function ArticleSidebar({
  eventName,
  eventDates,
  startDate,
  demoHref,
}: {
  eventName: string
  eventDates?: string
  startDate?: string
  demoHref?: string | null
}) {
  const s = BRAND.articleSidebar

  return (
    <aside className="artside" aria-label="Related">
      <div className="artside__product-tour" data-event-cta="cta3">
        <EventCtaFrame
          kind={3}
          eventName={eventName}
          eventDates={eventDates}
          startDate={startDate}
          demoHref={demoHref}
        />
      </div>

      <div className="artside__ai">
        <div className="artside__ai-head">{s.aiHeading}</div>
        <div className="artside__ai-icons">
          {BRAND.aiLinks.map((a) => (
            <a
              key={a.glyph}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ask ${a.label} about B2Brain`}
              title={a.label}
            >
              <AiGlyph glyph={a.glyph} />
            </a>
          ))}
        </div>
      </div>
    </aside>
  )
}
