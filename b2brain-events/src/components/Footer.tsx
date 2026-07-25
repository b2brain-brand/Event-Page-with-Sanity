import { BRAND } from '@/lib/brand'
import { has } from '@/lib/format'
import { SocialIcon, socialLabel, type SocialPlatform } from './SocialIcons'
import { AiGlyph } from './BrandIcons'
import { NewsletterForm } from './NewsletterForm'

/**
 * Footer — the real b2brain.com footer, verified against the live site:
 * brand blurb + circular social marks, the OVERVIEW / USE CASES / COMPANY link
 * columns, the newsletter signup, and the "Learn about B2Brain with AI" row.
 * Links come from `@/lib/brand`.
 *
 * The "stamp" line is the one event-specific thing here — last-updated + the
 * sources the page's numbers came from. Passed in, not part of the chrome.
 */
export function Footer({
  lastUpdated,
  sources,
}: {
  lastUpdated?: string | null
  sources?: { label?: string }[] | null
}) {
  const sourceLabels = (sources || []).map((s) => s?.label).filter(Boolean) as string[]

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          {/* Brand */}
          <div className="footer__brand">
            <a href={BRAND.logoHref} className="footer__logo" aria-label={BRAND.logoText}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BRAND.logoSrc} alt={BRAND.logoText} width={602} height={103} />
            </a>
            <p>{BRAND.footerBlurb}</p>
            <div className="footer__social">
              {BRAND.social.map((s, i) => (
                <a
                  key={`${s.platform}-${i}`}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={socialLabel(s.platform as SocialPlatform)}
                >
                  <SocialIcon platform={s.platform as SocialPlatform} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {BRAND.footerColumns.map((col, i) => (
            <div className="footer__col" key={`${col.heading}-${i}`}>
              <h5>{col.heading}</h5>
              {col.links.map((l, j) => (
                <a key={`${l.href}-${j}`} href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
          ))}

          {/* Newsletter + AI */}
          <div className="footer__promo">
            <h5>
              <span className="footer__star">*</span>
              {BRAND.newsletter.heading}
            </h5>
            <NewsletterForm />

            <div className="footer__ai">
              <div className="footer__ai-head">
                {BRAND.aiHeading.split('B2Brain').map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && <b>B2Brain</b>}
                  </span>
                ))}
              </div>
              <div className="footer__ai-icons">
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
          </div>
        </div>

        <div className="footer__bottom">
          <span>{BRAND.copyright}</span>
          {has(lastUpdated) && (
            <span className="footer__stamp">
              Page last updated {lastUpdated}
              {sourceLabels.length > 0 && <> · Sources: {sourceLabels.join(', ')}</>}
            </span>
          )}
          <span className="footer__legal">
            {BRAND.legal.map((l, i) => (
              <span key={`${l.href}-${i}`}>
                {i > 0 && ' · '}
                <a href={l.href}>{l.label}</a>
              </span>
            ))}
          </span>
        </div>
      </div>
    </footer>
  )
}
