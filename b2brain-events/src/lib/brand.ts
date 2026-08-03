/**
 * =============================================================================
 * BRAND CHROME — the parent-site nav and footer, as code constants.
 * =============================================================================
 *
 * The real b2brain.com nav and footer, verified against the live site's DOM.
 * Code-owned (not CMS) so an event page's chrome always matches b2brain.com and
 * can never drift with stale Site-settings data. Editing the parent nav is a
 * code change — correct, because it must track the real site. When b2brain.com
 * changes its nav, update this file.
 */

const SITE = 'https://www.b2brain.com'

export const BRAND = {
  logoText: 'B2Brain',
  // Absolute Webflow-CDN URL, NOT a self-hosted /root path. Under the
  // b2brain.com/events reverse-proxy, only /events/* and /_next/* route to
  // Vercel; a root asset like /b2brain-logo.webp falls through to Webflow and
  // 404s (the "logo not loading" bug). An absolute CDN URL loads from anywhere.
  logoSrc:
    'https://cdn.prod.website-files.com/69e6119560a70ab3a0930480/69efa4bdf72ec4163c3d5632_B2Brain-Right-Logo-2.webp',
  logoHref: `${SITE}/`,

  /**
   * Nav. The dropdown is under "Use Cases" (verified on the live site), and its
   * items carry a coloured icon, matching b2brain.com.
   */
  nav: [
    { label: 'Platform', href: `${SITE}/platform` },
    {
      label: 'Use Cases',
      href: `${SITE}/platform`,
      children: [
        { label: 'New Pipeline Generation', href: `${SITE}/new-pipeline-generation`, icon: 'pipeline' },
        { label: 'Event Attendees', href: `${SITE}/event-attendees`, icon: 'attendees' },
        { label: 'Event Exhibitors', href: `${SITE}/event-exhibitors`, icon: 'exhibitors' },
      ],
    },
    { label: 'Pricing', href: `${SITE}/pricing` },
    { label: 'Events', href: `${SITE}/events`, isCurrent: true },
    { label: 'Blogs', href: `${SITE}/blogs` },
  ] as NavLink[],

  login: { label: 'Start Free Trial', href: 'https://apps.apple.com/us/app/b2brain-event-lead-capture/id6757783820' },
  cta: { label: 'Book a Demo', href: `${SITE}/demo` },

  breadcrumb: {
    home: { label: 'Home', href: `${SITE}/` },
    events: { label: 'Events', href: `${SITE}/events` },
  },

  // The newline is intentional: the live footer has a hard break after the first
  // sentence, so "Turn…" starts the second line. The Footer renders \n as <br>.
  footerBlurb:
    'The Event Intelligence Platform.\nTurn trade show conversations into booked meetings and measurable pipeline. From Offline to Pipeline.',

  /** Footer columns — OVERVIEW / USE CASES / COMPANY, matching b2brain.com. */
  footerColumns: [
    {
      heading: 'Overview',
      links: [
        { label: 'Platform', href: `${SITE}/platform` },
        { label: 'Events', href: `${SITE}/events` },
        { label: 'Blogs', href: `${SITE}/blogs` },
      ],
    },
    {
      heading: 'Use Cases',
      links: [
        { label: 'New Pipeline Generation', href: `${SITE}/new-pipeline-generation` },
        { label: 'Event Attendees', href: `${SITE}/event-attendees` },
        { label: 'Event Exhibitors', href: `${SITE}/event-exhibitors` },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'Book a Demo', href: `${SITE}/demo` },
        { label: 'Pricing', href: `${SITE}/pricing` },
        { label: 'About us', href: `${SITE}/about` },
      ],
    },
  ],

  newsletter: {
    heading: 'Subscribe Newsletter',
    placeholder: 'Enter your e-mail',
    // The live site posts to its own list. Point this at a real endpoint when you
    // have one; until then the form validates and shows a thank-you state only.
    action: '',
  },

  /** "Learn about B2Brain with AI" — links to answer engines that cite the site. */
  aiHeading: 'Learn about B2Brain with AI',
  // Order matches the live b2brain.com footer exactly (verified against its DOM):
  // ChatGPT · Gemini · Claude · Grok · Perplexity.
  aiLinks: [
    { label: 'ChatGPT', url: 'https://chatgpt.com/?q=What%20is%20B2Brain', glyph: 'openai' },
    { label: 'Gemini', url: 'https://gemini.google.com/app', glyph: 'gemini' },
    { label: 'Claude', url: 'https://claude.ai/new?q=What%20is%20B2Brain', glyph: 'claude' },
    { label: 'Grok', url: 'https://grok.com', glyph: 'grok' },
    { label: 'Perplexity', url: 'https://www.perplexity.ai/search?q=What%20is%20B2Brain', glyph: 'perplexity' },
  ],

  /** The two sticky promo cards in the event article's right rail. */
  articleSidebar: {
    heading: "Events & Trade Show can drive pipeline — don't miss out",
    subheading: "Here's why:",
    points: [
      'Digital CPA is skyrocketing',
      'Your buyers are discovering vendors at shows',
      'You can jumpstart discovery and qualification',
    ],
    buttonLabel: 'Book a 30m chat',
    buttonHref: `${SITE}/demo`,
    aiHeading: 'Get Event Insights with AI',
  },

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

  // Verbatim from the live b2brain.com footer. The middot-separated location
  // and support address are part of the line; the Footer component pulls the
  // email out and renders it as the 70%-black link the live site uses.
  copyright: '© 2026 B2Brain, Inc. · Wilmington, DE · support@b2brain.com',
} as const

export type NavLink = {
  label: string
  href: string
  isCurrent?: boolean
  children?: { label: string; href: string; icon?: string }[]
}
