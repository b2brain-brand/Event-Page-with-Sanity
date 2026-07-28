import { BRAND } from './brand'
import type { SiteSettings } from './types'

/**
 * =============================================================================
 * CHROME RESOLVER — merges the CMS-editable nav/footer over the code defaults.
 * =============================================================================
 *
 * The header and footer are now editable in Sanity, but BRAND (the verified
 * b2brain.com chrome) is the FALLBACK for every field. So:
 *
 *   - out of the box the page renders the exact b2brain.com nav/footer;
 *   - an editor can add a nav link, a footer column, a button, a social link;
 *   - clearing a field in the Studio degrades to the real b2brain value rather
 *     than rendering blank or a dead link.
 *
 * That fallback is what keeps this from drifting the way it did when the chrome
 * was seeded with placeholder paths. The seed writes the BRAND values in, so
 * CMS == code == the real site on day one, and edits only ever extend it.
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

const nonEmpty = <T,>(v: T[] | undefined | null, fallback: T[]): T[] =>
  v && v.length ? v : fallback
const str = (v: string | undefined | null, fallback: string): string =>
  v && v.trim() ? v : fallback

export function resolveChrome(settings: SiteSettings | null): Resolved {
  const s = settings ?? {}

  return {
    logoText: str(s.logoText, BRAND.logoText),
    logoSrc: BRAND.logoSrc, // the asset ships with the app, not the CMS
    logoHref: str(s.logoHref, BRAND.logoHref),

    nav: nonEmpty(
      s.navLinks
        ?.filter((l) => l?.label && l?.href)
        .map((l) => ({
          label: l.label!,
          href: l.href!,
          isCurrent: l.isCurrent,
          children: l.children
            ?.filter((c) => c?.label && c?.href)
            .map((c) => ({ label: c.label!, href: c.href!, icon: c.icon })),
        })),
      BRAND.nav as unknown as Resolved['nav'],
    ),

    login: {
      label: str(s.navLoginLabel, BRAND.login.label),
      href: str(s.navLoginHref, BRAND.login.href),
    },
    cta: {
      label: str(s.navCtaLabel, BRAND.cta.label),
      href: str(s.navCtaHref, BRAND.cta.href),
    },

    footerBlurb: str(s.footerBlurb, BRAND.footerBlurb),
    footerColumns: nonEmpty(
      s.footerColumns
        ?.filter((c) => c?.heading)
        .map((c) => ({
          heading: c.heading!,
          links: (c.links ?? []).filter((l) => l?.label && l?.href).map((l) => ({ label: l.label!, href: l.href! })),
        })),
      BRAND.footerColumns as unknown as Resolved['footerColumns'],
    ),

    social: nonEmpty(
      s.socialLinks?.filter((x) => x?.platform && x?.url).map((x) => ({ platform: x.platform!, url: x.url! })),
      BRAND.social as unknown as Resolved['social'],
    ),
    contactEmail: str(s.contactEmail, BRAND.contactEmail),
    legal: nonEmpty(
      s.legalLinks?.filter((l) => l?.label && l?.href).map((l) => ({ label: l.label!, href: l.href! })),
      BRAND.legal as unknown as Resolved['legal'],
    ),

    newsletter: {
      heading: str(s.newsletterHeading, BRAND.newsletter.heading),
      placeholder: str(s.newsletterPlaceholder, BRAND.newsletter.placeholder),
      action: str(s.newsletterAction, BRAND.newsletter.action),
    },
    aiHeading: str(s.aiHeading, BRAND.aiHeading),
    aiLinks: nonEmpty(
      s.aiLinks?.filter((a) => a?.label && a?.url).map((a) => ({ label: a.label!, url: a.url!, glyph: a.glyph || 'openai' })),
      BRAND.aiLinks as unknown as Resolved['aiLinks'],
    ),
    copyright: str(s.footerCopyright, BRAND.copyright),
  }
}
