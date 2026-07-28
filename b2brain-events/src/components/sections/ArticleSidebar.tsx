import { BRAND } from '@/lib/brand'
import { AiGlyph } from '../BrandIcons'

/**
 * The event article's right rail — two black promo cards, matching the live
 * page: a "drive pipeline" CTA with a checklist and a "Book a 30m chat" button,
 * and a "Get Event Insights with AI" card with the answer-engine icons.
 *
 * Static content, the same on every event (from `@/lib/brand`). Made sticky in
 * CSS so it stays put while the blog body scrolls.
 */
export function ArticleSidebar() {
  const s = BRAND.articleSidebar

  return (
    <aside className="artside" aria-label="Related">
      <div className="artside__cta">
        <h4 className="artside__cta-head">{s.heading}</h4>
        <div className="artside__cta-sub">{s.subheading}</div>
        <ul className="artside__list">
          {s.points.map((p, i) => (
            <li key={i}>
              <span className="artside__check" aria-hidden="true">
                <svg viewBox="0 0 20 20" width="14" height="14">
                  <path fill="none" stroke="currentColor" strokeWidth="2.2" d="M4 10.5l4 4 8-9" />
                </svg>
              </span>
              {p}
            </li>
          ))}
        </ul>
        <a href={s.buttonHref} className="btn artside__btn">
          {s.buttonLabel}
        </a>
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
