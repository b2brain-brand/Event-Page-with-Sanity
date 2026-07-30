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
                  {/* Exact chevron path from the live b2brain.com "Use Cases"
                      dropdown (verified against its DOM) — not a CSS
                      border-triangle, so it matches stroke-for-stroke. */}
                  <svg className="nav__caret" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M8.00048 9.78145L11.3005 6.48145L12.2431 7.42411L8.00048 11.6668L3.75781 7.42411L4.70048 6.48145L8.00048 9.78145Z" />
                  </svg>
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
          {/* The live b2brain.com desktop header no longer shows a separate
              "Start Free Trial" link — verified against the current DOM on
              both the homepage and /events; it's App Store-only, mobile-nav
              only now. The single CTA button is the only nav__cta item. */}
          <a href={c.cta.href} className="btn btn--primary btn--sm">
            {c.cta.label}
          </a>
        </div>
      </div>
    </header>
  )
}
