/**
 * =============================================================================
 * BRAND CHROME — the parent-site nav and footer, as code constants.
 * =============================================================================
 *
 * These are the real b2brain.com links. They live in code, NOT in Sanity, on
 * purpose:
 *
 *   The nav and footer of an event page must match b2brain.com exactly. When
 *   they were CMS-driven, the seeded Site settings document held placeholder
 *   paths (/platform, /login, /blog) and — because a stored Sanity value always
 *   beats a code fallback — those placeholders kept rendering no matter what the
 *   defaults said. The links silently drifted from the real site.
 *
 *   Making them code-owned removes that whole class of bug: a deploy guarantees
 *   the links are correct, nothing can override them, and there is no token to
 *   run or document to keep in sync. Editing the parent-brand nav is a code
 *   change — which is right, because it has to track the real site, not an
 *   event editor's whim.
 *
 * The event CONTENT stays in Sanity. Only this structural chrome is fixed.
 * When b2brain.com changes its nav, update this file.
 */

const SITE = 'https://www.b2brain.com'

export const BRAND = {
  logoText: 'B2Brain',
  logoSrc: '/b2brain-logo.webp',
  logoHref: `${SITE}/`,

  /** Nav. A link with `children` renders a dropdown. */
  nav: [
    {
      label: 'Platform',
      href: `${SITE}/platform`,
      children: [
        { label: 'New Pipeline Generation', href: `${SITE}/new-pipeline-generation` },
        { label: 'Event Attendees', href: `${SITE}/event-attendees` },
        { label: 'Event Exhibitors', href: `${SITE}/event-exhibitors` },
      ],
    },
    { label: 'Pricing', href: `${SITE}/pricing` },
    { label: 'Events', href: `${SITE}/events`, isCurrent: true },
    { label: 'Blogs', href: `${SITE}/blogs` },
  ] as NavLink[],

  login: { label: 'Start Free Trial', href: 'https://apps.apple.com/us/app/b2brain-event-lead-capture/id6757783820' },
  cta: { label: 'Book a Demo', href: `${SITE}/demo` },

  /** Breadcrumb roots on the event landing pages. */
  breadcrumb: {
    home: { label: 'Home', href: `${SITE}/` },
    events: { label: 'Events', href: `${SITE}/events` },
  },

  footerBlurb:
    'The Event Meeting Platform. Turn trade-show conversations into booked meetings and measurable pipeline.',

  footerColumns: [
    {
      heading: 'Platform',
      links: [
        { label: 'Platform', href: `${SITE}/platform` },
        { label: 'New Pipeline Generation', href: `${SITE}/new-pipeline-generation` },
        { label: 'Event Attendees', href: `${SITE}/event-attendees` },
        { label: 'Event Exhibitors', href: `${SITE}/event-exhibitors` },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { label: 'Events', href: `${SITE}/events` },
        { label: 'Blogs', href: `${SITE}/blogs` },
        { label: 'Pricing', href: `${SITE}/pricing` },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About us', href: `${SITE}/about` },
        { label: 'Book a Demo', href: `${SITE}/demo` },
        { label: 'Contact', href: 'mailto:support@b2brain.com' },
      ],
    },
  ],

  social: [
    { platform: 'instagram', url: 'https://www.instagram.com/getb2brain/' },
    { platform: 'x', url: 'https://x.com/getb2brain' },
    { platform: 'facebook', url: 'http://facebook.com/b2brain/' },
    { platform: 'linkedin', url: 'https://www.linkedin.com/company/b2brain/' },
    { platform: 'youtube', url: 'https://www.youtube.com/@b2brain/videos' },
  ] as { platform: string; url: string }[],

  contactEmail: 'support@b2brain.com',

  legal: [
    { label: 'Privacy', href: `${SITE}/privacy-policy` },
    { label: 'Terms', href: `${SITE}/terms-of-service` },
  ],

  copyright: '© 2026 B2Brain, Inc.',
} as const

export type NavLink = {
  label: string
  href: string
  isCurrent?: boolean
  children?: { label: string; href: string }[]
}
