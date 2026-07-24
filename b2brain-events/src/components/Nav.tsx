import Link from 'next/link'
import { S } from '@/lib/defaults'
import type { SiteSettings } from '@/lib/types'

/** Sticky white nav, 1px black bottom border. Links hide below 991px by design. */
export function Nav({ settings }: { settings: SiteSettings | null }) {
  const links = S(settings, 'navLinks') ?? []

  return (
    <header className="nav">
      <div className="nav__inner">
        <Link href="/" className="nav__logo">
          <span className="nav__logo-mark" aria-hidden="true" />
          {S(settings, 'logoText')}
        </Link>

        <nav className="nav__links">
          {links.map((l, i) => (
            <Link
              key={`${l.href}-${i}`}
              href={l.href || '#'}
              style={l.isCurrent ? { color: 'var(--black)' } : undefined}
              aria-current={l.isCurrent ? 'page' : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="nav__cta">
          <Link href={S(settings, 'navLoginHref') || '#'} className="nav__login">
            {S(settings, 'navLoginLabel')}
          </Link>
          <Link href={S(settings, 'navCtaHref') || '#cta'} className="btn btn--primary btn--sm">
            {S(settings, 'navCtaLabel')}
          </Link>
        </div>
      </div>
    </header>
  )
}
