import { resolveChrome } from '@/lib/chrome'
import { has } from '@/lib/format'
import { socialLabel, type SocialPlatform } from './SocialIcons'
import { AiGlyph, AiInfoIcon } from './BrandIcons'
import { NewsletterForm } from './NewsletterForm'
import type { SiteSettings } from '@/lib/types'

/**
 * The live b2brain.com social icons are self-contained badge assets (a white
 * circle + light border baked into the SVG itself, not a CSS border) — so
 * they're self-hosted here verbatim rather than redrawn as React components,
 * which is the only way to get an exact pixel match.
 */
const SOCIAL_ICON_SRC: Record<string, string> = {
  instagram: '/social/instagram.svg',
  x: '/social/x.svg',
  facebook: '/social/facebook.svg',
  linkedin: '/social/linkedin.svg',
  youtube: '/social/youtube.svg',
}

/**
 * Footer — the real b2brain.com footer, now CMS-editable with the verified
 * b2brain chrome as the field-by-field fallback (see `@/lib/chrome`).
 *
 * The "stamp" line is the one event-specific thing here (last-updated + sources);
 * it is passed in, not part of the shared chrome.
 */
export function Footer({
  settings,
  lastUpdated,
  sources,
}: {
  settings?: SiteSettings | null
  lastUpdated?: string | null
  sources?: { label?: string }[] | null
}) {
  const c = resolveChrome(settings ?? null)
  const sourceLabels = (sources || []).map((s) => s?.label).filter(Boolean) as string[]

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <a href={c.logoHref} className="footer__logo" aria-label={c.logoText}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.logoSrc} alt={c.logoText} width={602} height={103} />
            </a>
            <p>{c.footerBlurb}</p>
            <div className="footer__social">
              {c.social.map((s, i) => (
                <a
                  key={`${s.platform}-${i}`}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={socialLabel(s.platform as SocialPlatform)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={SOCIAL_ICON_SRC[s.platform]} alt="" width={32} height={32} />
                </a>
              ))}
            </div>
          </div>

          {c.footerColumns.map((col, i) => (
            <div className="footer__col" key={`${col.heading}-${i}`}>
              <h5>{col.heading}</h5>
              {col.links.map((l, j) => (
                <a key={`${l.href}-${j}`} href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
          ))}

          <div className="footer__promo">
            <h5>
              <span className="footer__star">*</span>
              {c.newsletter.heading}
            </h5>
            <NewsletterForm
              placeholder={c.newsletter.placeholder}
              action={c.newsletter.action}
              heading={c.newsletter.heading}
            />

            <div className="footer__ai">
              <div className="footer__ai-head">
                {c.aiHeading.split('B2Brain').map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && <b>B2Brain</b>}
                  </span>
                ))}
                <span className="footer__ai-info" aria-hidden="true">
                  <AiInfoIcon />
                </span>
              </div>
              <div className="footer__ai-icons">
                {c.aiLinks.map((a) => (
                  <a
                    key={a.glyph + a.label}
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
          <span>{c.copyright}</span>
          {has(lastUpdated) && (
            <span className="footer__stamp">
              Page last updated {lastUpdated}
              {sourceLabels.length > 0 && <> · Sources: {sourceLabels.join(', ')}</>}
            </span>
          )}
          <span className="footer__legal">
            {c.legal.map((l, i) => (
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
