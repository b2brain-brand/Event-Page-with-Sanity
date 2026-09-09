import { BRAND } from './brand'
import type { SiteSettings } from './types'

/**
 * =============================================================================
 * CHROME RESOLVER — supplies the code-owned parent-site nav/footer.
 * =============================================================================
 *
 * The parent-site header and footer are code-owned through BRAND. Sanity can
 * still provide the newsletter endpoint, but it cannot leave event pages on a
 * stale copy of the corporate navigation whenever b2brain.com changes. So:
 *
 *   - every event page renders the same current corporate chrome;
 *   - an old Site settings document cannot override it;
 *   - the Sanity Studio route and schema remain untouched.
 *
 * Keeping one source of truth prevents stale seeded settings from drifting away
 * from the parent site. Only `newsletterAction` remains environment-specific.
 */

type Resolved = {
  logoText: string
  logoSrc: string
  logoHref: string
  nav: {
    label: string
    href: string
    isCurrent?: boolean
    children?: { label: string; href: string; icon?: string }[]
  }[]
  login: { label: string; href: string }
  cta: { label: string; href: string }
  footerBlurb: string
  footerColumns: { heading: string; links: { label: string; href: string }[] }[]
  social: { platform: string; url: string }[]
  contactEmail: string
  legal: { label: string; href: string }[]
  newsletter: { heading: string; placeholder: string; action: string }
  aiHeading: string
  aiLinks: { label: string; url: string; glyph: string }[]
  copyright: string
}

const str = (v: string | undefined | null, fallback: string): string =>
  v && v.trim() ? v : fallback

export function resolveChrome(settings: SiteSettings | null): Resolved {
  const s = settings ?? {}

  return {
    logoText: BRAND.logoText,
    logoSrc: BRAND.logoSrc, // the asset ships with the app, not the CMS
    logoHref: BRAND.logoHref,

    nav: BRAND.nav as unknown as Resolved['nav'],

    login: {
      label: BRAND.login.label,
      href: BRAND.login.href,
    },
    cta: {
      label: BRAND.cta.label,
      href: BRAND.cta.href,
    },

    footerBlurb: BRAND.footerBlurb,
    footerColumns: BRAND.footerColumns as unknown as Resolved['footerColumns'],

    social: BRAND.social as unknown as Resolved['social'],
    contactEmail: BRAND.contactEmail,
    legal: BRAND.legal as unknown as Resolved['legal'],

    newsletter: {
      heading: BRAND.newsletter.heading,
      placeholder: BRAND.newsletter.placeholder,
      action: str(s.newsletterAction, BRAND.newsletter.action),
    },
    aiHeading: BRAND.aiHeading,
    aiLinks: BRAND.aiLinks as unknown as Resolved['aiLinks'],
    copyright: BRAND.copyright,
  }
}
