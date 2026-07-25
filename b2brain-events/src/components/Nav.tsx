import { BRAND } from '@/lib/brand'

/**
 * Sticky nav — the real b2brain.com nav, so an event page reads as part of the
 * site, not a detached microsite.
 *
 * Links come from `@/lib/brand` (code constants), not the CMS: the parent-site
 * nav must match b2brain.com exactly and can't be allowed to drift with stale
 * Site-settings data. See the note in lib/brand.ts.
 *
 * A link with children renders a dropdown (Platform → New Pipeline Generation /
 * Event Attendees / Event Exhibitors), opening on hover AND keyboard focus.
 * Links hide below 991px, per the design.
 */
export function Nav() {
  return (
    <header className="nav">
      <div className="nav__inner">
        <a href={BRAND.logoHref} className="nav__logo" aria-label={BRAND.logoText}>
          {/* Fixed brand asset from /public — no CDN round-trip, can't be cleared.
              eslint-disable-next-line @next/next/no-img-element */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BRAND.logoSrc} alt={BRAND.logoText} width={602} height={103} />
        </a>

        <nav className="nav__links">
          {BRAND.nav.map((l, i) => {
            const children = l.children ?? []
            if (!children.length) {
              return (
                <a
                  key={`${l.href}-${i}`}
                  href={l.href}
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
                  href={l.href}
                  style={l.isCurrent ? { color: 'var(--black)' } : undefined}
                  aria-current={l.isCurrent ? 'page' : undefined}
                >
                  {l.label}
                  <span className="nav__caret" aria-hidden="true" />
                </a>
                <div className="nav__menu">
                  {children.map((c, j) => (
                    <a key={`${c.href}-${j}`} href={c.href}>
                      {c.label}
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
        </nav>

        <div className="nav__cta">
          <a
            href={BRAND.login.href}
            className="nav__login"
            target="_blank"
            rel="noopener noreferrer"
          >
            {BRAND.login.label}
          </a>
          <a href={BRAND.cta.href} className="btn btn--primary btn--sm">
            {BRAND.cta.label}
          </a>
        </div>
      </div>
    </header>
  )
}
