import { L, S } from '@/lib/defaults'
import { has } from '@/lib/format'
import { SocialIcon, socialLabel, type SocialPlatform } from './SocialIcons'
import type { SiteSettings } from '@/lib/types'

/**
 * Footer — mirrors b2brain.com so an event page closes the same way the rest of
 * the site does: brand, social squares, contact, the same link columns, legal.
 *
 * The "stamp" line under the blurb is specific to these pages: last-updated plus
 * the sources the numbers came from. Small, and the cheapest trust signal a
 * programmatic page set has.
 */
export function Footer({
  settings,
  lastUpdated,
  sources,
}: {
  settings: SiteSettings | null
  lastUpdated?: string | null
  sources?: { label?: string }[] | null
}) {
  const columns = S(settings, 'footerColumns') ?? []
  const socials = (S(settings, 'socialLinks') ?? []).filter((s) => s?.url && s?.platform)
  const email = S(settings, 'contactEmail')
  const legal = S(settings, 'legalLinks') ?? []
  const sourceLabels = (sources || []).map((s) => s?.label).filter(Boolean) as string[]

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <a
              href={S(settings, 'logoHref') || '/'}
              className="footer__logo"
              aria-label={S(settings, 'logoText') || 'B2Brain'}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/b2brain-logo.webp"
                alt={S(settings, 'logoText') || 'B2Brain'}
                width={602}
                height={103}
              />
            </a>
            <p>{S(settings, 'footerBlurb')}</p>

            {socials.length > 0 && (
              <div className="footer__social">
                {socials.map((s, i) => (
                  <a
                    key={`${s.platform}-${i}`}
                    href={s.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={socialLabel(s.platform as SocialPlatform)}
                  >
                    <SocialIcon platform={s.platform as SocialPlatform} />
                  </a>
                ))}
              </div>
            )}

            {has(email) && (
              <div className="footer__contact">
                <a href={`mailto:${email}`}>{email}</a>
              </div>
            )}

            {has(lastUpdated) && (
              <div className="footer__stamp">
                {L(settings, 'footerStampPrefix')} {lastUpdated}
                {sourceLabels.length > 0 && (
                  <>
                    {' '}
                    · {L(settings, 'footerSourcesPrefix')} {sourceLabels.join(', ')}
                  </>
                )}
              </div>
            )}
          </div>

          {columns.map((col, i) => (
            <div className="footer__col" key={`${col.heading}-${i}`}>
              <h5>{col.heading}</h5>
              {(col.links || []).map((l, j) => (
                <a key={`${l.href}-${j}`} href={l.href || '#'}>
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <span>{S(settings, 'footerCopyright')}</span>
          <span className="footer__legal">
            {legal.length > 0
              ? legal.map((l, i) => (
                  <span key={`${l.href}-${i}`}>
                    {i > 0 && ' · '}
                    <a href={l.href || '#'}>{l.label}</a>
                  </span>
                ))
              : S(settings, 'footerLegal')}
          </span>
        </div>
      </div>
    </footer>
  )
}
