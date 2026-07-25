import { BRAND } from '@/lib/brand'
import { has } from '@/lib/format'
import { SocialIcon, socialLabel, type SocialPlatform } from './SocialIcons'

/**
 * Footer — the real b2brain.com footer, so an event page closes the same way
 * the rest of the site does. Links come from `@/lib/brand` (code constants),
 * not the CMS — same reasoning as the nav.
 *
 * The "stamp" line is the one event-specific thing here: last-updated plus the
 * sources the page's numbers came from. Small, and the cheapest trust signal a
 * programmatic page set has. It is passed in, not read from brand chrome.
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
        <div className="footer__grid">
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

            <div className="footer__contact">
              <a href={`mailto:${BRAND.contactEmail}`}>{BRAND.contactEmail}</a>
            </div>

            {has(lastUpdated) && (
              <div className="footer__stamp">
                Page last updated {lastUpdated}
                {sourceLabels.length > 0 && <> · Sources: {sourceLabels.join(', ')}</>}
              </div>
            )}
          </div>

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
        </div>

        <div className="footer__bottom">
          <span>{BRAND.copyright}</span>
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
