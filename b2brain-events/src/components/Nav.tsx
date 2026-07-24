import Link from 'next/link'
import { S } from '@/lib/defaults'
import type { SiteSettings } from '@/lib/types'

/**
 * Sticky nav — the same structure as b2brain.com so an event page reads as part
 * of the site rather than a detached microsite.
 *
 * A nav link with children renders a dropdown (Platform → New Pipeline
 * Generation / Event Attendees / Event Exhibitors). Opens on hover and on
 * keyboard focus, so it is not mouse-only.
 *
 * Links are hidden below 991px, per the original design.
 */
export function Nav({ settings }: { settings: SiteSettings | null }) {
  const links = S(settings, 'navLinks') ?? []
  const logoHref = S(settings, 'logoHref') || '/'

  return (
    <header className="nav">
      <div className="nav__inner">
        <a href={logoHref} className="nav__logo" aria-label={S(settings, 'logoText') || 'B2Brain'}>
          {/* Fixed brand asset — served from /public, not the CMS, so it cannot
              be accidentally cleared and costs no CDN round-trip.
              eslint-disable-next-line @next/next/no-img-element */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/b2brain-logo.webp"
            alt={S(settings, 'logoText') || 'B2Brain'}
            width={602}
            height={103}
          />
        </a>

        <nav className="nav__links">
          {links.map((l, i) => {
            const children = l.children?.filter((c) => c?.label && c?.href) ?? []
            if (!children.length) {
              return (
                <a
                  key={`${l.href}-${i}`}
                  href={l.href || '#'}
                  style={l.isCurrent ? { color: 'var(--black)' } : undefined}
                  aria-current={l.isCurrent ? 'page' : undefined}
                >
                  {l.label}
                </a>
              )
            }
            return (
              <div className="nav__item" key={`${l.href}-${i}`}>
                <a
                  href={l.href || '#'}
                  style={l.isCurrent ? { color: 'var(--black)' } : undefined}
                  aria-current={l.isCurrent ? 'page' : undefined}
                >
                  {l.label}
                  <span className="nav__caret" aria-hidden="true" />
                </a>
                <div className="nav__menu">
                  {children.map((c, j) => (
                    <a key={`${c.href}-${j}`} href={c.href!}>
                      {c.label}
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
        </nav>

        <div className="nav__cta">
          <a href={S(settings, 'navLoginHref') || '#'} className="nav__login">
            {S(settings, 'navLoginLabel')}
          </a>
          <Link href={S(settings, 'navCtaHref') || '#cta'} className="btn btn--primary btn--sm">
            {S(settings, 'navCtaLabel')}
          </Link>
        </div>
      </div>
    </header>
  )
}
