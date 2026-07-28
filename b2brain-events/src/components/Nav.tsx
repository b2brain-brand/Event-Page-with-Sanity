import { resolveChrome } from '@/lib/chrome'
import { UseCaseIcon } from './BrandIcons'
import type { SiteSettings } from '@/lib/types'

/**
 * Sticky nav — the real b2brain.com nav.
 *
 * Now CMS-editable: it renders whatever is in Site settings, falling back
 * field-by-field to the verified b2brain.com chrome in `@/lib/brand`. So the
 * default is an exact copy, editors can add or change links in the Studio, and
 * clearing a field degrades to the real value rather than breaking.
 *
 * Dropdown items (Use Cases) carry a coloured icon, open on hover AND keyboard
 * focus. Links hide below 991px, per the design.
 */
export function Nav({ settings }: { settings?: SiteSettings | null }) {
  const c = resolveChrome(settings ?? null)

  return (
    <header className="nav">
      <div className="nav__inner">
        <a href={c.logoHref} className="nav__logo" aria-label={c.logoText}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.logoSrc} alt={c.logoText} width={602} height={103} />
        </a>

        <nav className="nav__links">
          {c.nav.map((l, i) => {
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
                  {children.map((ch, j) => (
                    <a key={`${ch.href}-${j}`} href={ch.href} className="nav__menu-item">
                      <UseCaseIcon icon={ch.icon} />
                      <span>{ch.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
        </nav>

        <div className="nav__cta">
          <a href={c.login.href} className="nav__login" target="_blank" rel="noopener noreferrer">
            {c.login.label}
          </a>
          <a href={c.cta.href} className="btn btn--primary btn--sm">
            {c.cta.label}
          </a>
        </div>
      </div>
    </header>
  )
}
