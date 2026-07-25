import { BRAND } from '@/lib/brand'
import { UseCaseIcon } from './BrandIcons'

/**
 * Sticky nav — the real b2brain.com nav. Links come from `@/lib/brand`, not the
 * CMS, so the parent-site chrome always matches and cannot drift.
 *
 * The dropdown sits under "Use Cases" (verified against the live site) and its
 * items carry a coloured icon square, matching b2brain.com. Opens on hover AND
 * keyboard focus. Links hide below 991px, per the design.
 */
export function Nav() {
  return (
    <header className="nav">
      <div className="nav__inner">
        <a href={BRAND.logoHref} className="nav__logo" aria-label={BRAND.logoText}>
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
              <div className="nav__item" key={`${l.label}-${i}`}>
                <button type="button" className="nav__trigger">
                  {l.label}
                  <span className="nav__caret" aria-hidden="true" />
                </button>
                <div className="nav__menu nav__menu--rich">
                  {children.map((c, j) => (
                    <a key={`${c.href}-${j}`} href={c.href} className="nav__menu-item">
                      <UseCaseIcon icon={c.icon} />
                      <span>{c.label}</span>
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
