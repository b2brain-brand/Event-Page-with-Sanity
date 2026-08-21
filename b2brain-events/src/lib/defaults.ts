import type { SiteSettings } from './types'

/**
 * Fallback copy — identical to the strings hardcoded in preview-v2.html.
 *
 * The page reads every label through `L(settings, key)`, which prefers the value
 * in Sanity and falls back here. Net effect: the site renders correctly on a
 * brand-new dataset before anyone has opened Site settings, and it can never
 * render a blank heading because someone cleared a field.
 */
export const LABEL_DEFAULTS: Record<string, string> = {
  heroRefreshNote: 'pages are refreshed as the agenda is confirmed.',
  heroMetaDates: 'Dates',
  heroMetaLocation: 'Location',
  heroMetaFormat: 'Format',

  answerEyebrow: 'QUICK ANSWER',
  answerHeadingTemplate: 'What is {event}?',

  galleryEyebrow: 'FROM THE FLOOR',
  galleryHeading: 'Inside the event',
  galleryFootnote:
    'Photos from the previous edition. Slider adapts to however many images the event has — 1, 3, or 5.',
  galleryPlaceholder: 'Photo {n} — drop image here',

  whyEyebrow: 'WHY IT MATTERS',

  agendaEyebrow: 'AGENDA & SESSIONS',
  agendaHeading: "What's on the floor",
  agendaPendingNote:
    'Full session-by-session schedule for this edition is being confirmed. Tracks below.',

  speakersEyebrow: 'SPEAKERS',
  speakersHeading: "Who's on stage",
  speakerKeynoteChip: 'Keynote',

  exhibitorsEyebrow: 'EXHIBITORS & SPONSORS',
  exhibitorsHeading: "Who's setting up on the floor",
  exhibitorsNotableHeading: 'Which booths to map first',

  audienceEyebrow: 'WHO ATTENDS',
  audienceHeading: 'The audience your booth is buying access to',
  audienceTitleMixLabel: 'ATTENDEE TITLE MIX',
  audienceIndustriesLabel: 'INDUSTRIES ON THE FLOOR',
  audienceMatchHeading: 'Is your buyer here?',

  costEyebrow: 'COST & ROI',
  costHeading: 'Do the booth math before you commit the budget',

  // Template V2 addition (2026-07-22) — right after Cost & ROI.
  tacticsEyebrow: 'BEYOND THE BOOTH',
  tacticsHeading: 'Where the pipeline actually gets built',

  logisticsEyebrow: 'LOGISTICS',
  logisticsHeading: 'Everything you need before you fly in',
  passesLabel: 'PASSES & PRICING',

  sentimentEyebrow: 'WHAT PEOPLE SAY',
  sentimentHeading: 'Reviews that you need to know about this show',
  sentimentVideoLabel: 'Video — previous editions',
  sentimentRedditLabel: 'What people say on Reddit',
  sentimentTestimonialLabel: 'From past exhibitors',

  // Template V2 addition (2026-07-22) — between Reviews and the Playbook.
  compareEyebrow: 'B2BRAIN VS THE BADGE SCANNER',
  compareHeading: "What the event's own tool leaves on the table",
  compareDefaultScannerCol: 'On your own',
  compareDefaultUsCol: 'B2Brain',

  // Template V2 addition (2026-07-22) — the hero CTA link that appears only
  // when an event offer exists, pointing down to #offer.
  heroOfferLinkLabel: 'Claim the event offer',

  playbookEyebrowTemplate: 'HOW TO WIN AT {event}',
  playbookHeadingTemplate: 'Turn {event} from "event spend" to Pipeline Channel',
  // Motion 01 CTA line (links to the closing CTA banner). Per the request sheet.
  playbookMotion1Cta: 'Take a demo, learn how, and go back with the list for free.',
  // Exhibitors "which booths" CTA line (links to the closing CTA banner).
  exhibitorsCta: 'Want to discuss booth strategies? Book a demo and take back the updated exhibitor list.',
  playbookMotionPrefix: 'Motion 0{n} — ',
  playbookStep1: 'Pre-event · target list',
  playbookStep2: 'On the floor · capture + book',
  playbookStep3: 'Post-event · LTM + attribution',

  similarEyebrow: 'OTHER SHOWS WORTH PREPPING FOR',
  similarHeading: 'More events on the calendar.',
  similarLinkLabel: 'See The Event Playbook',

  articleEyebrow: 'THE FULL BRIEFING',
  articleHeading: 'Everything you need before you go',
  articleTocLabel: 'On this page',

  faqEyebrow: 'FAQ',
  faqHeading: 'Questions buyers actually ask',
  faqSideNote: 'Answers are self-contained and structured for Google and AI-answer engines.',

  footerStampPrefix: 'Page last updated',
  footerSourcesPrefix: 'Sources:',
}

/** The ten strings on the Cost & ROI calculator. */
export const ROI_LABEL_DEFAULTS: Record<string, string> = {
  spend: 'Booth investment ($)',
  reps: 'Booth reps',
  days: 'Show days',
  convos: 'Conversations / rep / day',
  qualRate: 'Qualified rate (%)',
  meetingRate: 'Meeting rate (%)',
  acv: 'Average ACV ($)',
  outQualified: 'Qualified conversations',
  outMeetings: 'Meetings booked',
  outPipeline: 'Modeled pipeline · {x} return',
}

export const BREADCRUMB_DEFAULTS = {
  homeLabel: 'Home',
  homeHref: '/',
  eventsLabel: 'Events',
  eventsHref: '/events',
}

export const TOC_DEFAULTS: Record<string, string> = {
  overview: 'Overview',
  gallery: 'Photos',
  why: 'Why it matters',
  agenda: 'Agenda',
  speakers: 'Speakers',
  exhibitors: 'Exhibitors',
  audience: 'Who attends',
  cost: 'Cost & ROI',
  tactics: 'Beyond the booth',
  logistics: 'Logistics',
  sentiment: 'Reviews',
  compare: 'B2Brain vs scanner',
  playbook: 'Win the show',
  offer: 'Event offer',
  similar: 'Similar events',
  article: 'Full briefing',
  faq: 'FAQ',
}

export const SETTINGS_DEFAULTS: SiteSettings = {
  logoText: 'B2Brain',
  logoHref: 'https://www.b2brain.com/',
  navLinks: [
    {
      label: 'Platform',
      href: 'https://www.b2brain.com/platform',
      children: [
        { label: 'New Pipeline Generation', href: 'https://www.b2brain.com/new-pipeline-generation' },
        { label: 'Event Attendees', href: 'https://www.b2brain.com/event-attendees' },
        { label: 'Event Exhibitors', href: 'https://www.b2brain.com/event-exhibitors' },
      ],
    },
    { label: 'Pricing', href: 'https://www.b2brain.com/pricing' },
    { label: 'Events', href: 'https://www.b2brain.com/events', isCurrent: true },
    { label: 'Blogs', href: 'https://www.b2brain.com/blogs' },
  ],
  navLoginLabel: 'Start Free Trial',
  navLoginHref: 'https://apps.apple.com/us/app/b2brain-event-lead-capture/id6757783820',
  navCtaLabel: 'Book a Demo',
  navCtaHref: 'https://www.b2brain.com/demo',
  breadcrumb: {
    homeLabel: 'Home',
    homeHref: 'https://www.b2brain.com/',
    eventsLabel: 'Events',
    eventsHref: 'https://www.b2brain.com/events',
  },
  tocLabel: 'On this page',
  tocCtaLabel: 'Plan your booth',
  footerBlurb:
    'The Event Meeting Platform. Turn trade-show conversations into booked meetings and measurable pipeline.',
  socialLinks: [
    { platform: 'instagram', url: 'https://www.instagram.com/getb2brain/' },
    { platform: 'x', url: 'https://x.com/getb2brain' },
    { platform: 'facebook', url: 'http://facebook.com/b2brain/' },
    { platform: 'linkedin', url: 'https://www.linkedin.com/company/b2brain/' },
    { platform: 'youtube', url: 'https://www.youtube.com/@b2brain/videos' },
  ],
  contactEmail: 'support@b2brain.com',
  legalLinks: [
    { label: 'Privacy', href: 'https://www.b2brain.com/privacy-policy' },
    { label: 'Terms', href: 'https://www.b2brain.com/terms-of-service' },
  ],
  footerColumns: [
    {
      heading: 'Platform',
      links: [
        { label: 'Platform', href: 'https://www.b2brain.com/platform' },
        { label: 'New Pipeline Generation', href: 'https://www.b2brain.com/new-pipeline-generation' },
        { label: 'Event Attendees', href: 'https://www.b2brain.com/event-attendees' },
        { label: 'Event Exhibitors', href: 'https://www.b2brain.com/event-exhibitors' },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { label: 'Events', href: 'https://www.b2brain.com/events' },
        { label: 'Blogs', href: 'https://www.b2brain.com/blogs' },
        { label: 'Pricing', href: 'https://www.b2brain.com/pricing' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About us', href: 'https://www.b2brain.com/about' },
        { label: 'Book a Demo', href: 'https://www.b2brain.com/demo' },
        { label: 'Contact', href: 'mailto:support@b2brain.com' },
      ],
    },
  ],
  footerCopyright: '© 2026 B2Brain, Inc. · Wilmington, DE · support@b2brain.com',
  footerLegal: 'Privacy · Terms',
  heroPrimaryCtaLabel: 'Plan your booth',
  heroSecondaryCtaLabel: 'Register for the event',
  ctaHeadlineTemplate: 'Walk into {event} with a target list — and out with meetings booked.',
  ctaPrimaryLabel: 'Book a Demo',
  ctaPrimaryHref: 'https://www.b2brain.com/demo',
  ctaSecondaryLabelTemplate: 'Get the {event} prep guide',
  ctaSecondaryHref: 'https://www.b2brain.com/demo',
  ctaFallbackEyebrow: 'BOOK A DEMO',
  roiIndustryAverage: 8,
  roiLtmCopy:
    'Your **Leads-to-Meeting (LTM) rate is {ltm}** versus an **{avg} industry average** for badge-scanner-only teams. LTM metric moves your Pipeline. B2Brain moves your LTM.',
  organizationName: 'B2Brain',
  organizationSameAs: [
    'https://www.instagram.com/getb2brain/',
    'https://x.com/getb2brain',
    'https://www.linkedin.com/company/b2brain/',
    'https://www.youtube.com/@b2brain/videos',
  ],
}

/** Read a section label: Sanity value, else the reference-build default. */
export function L(settings: SiteSettings | null | undefined, key: string): string {
  const fromCms = settings?.labels?.[key]
  if (typeof fromCms === 'string' && fromCms.trim()) return fromCms
  return LABEL_DEFAULTS[key] ?? ''
}

/** Read an "On this page" link label. */
export function T(settings: SiteSettings | null | undefined, key: string): string {
  const fromCms = settings?.tocLabels?.[key]
  if (typeof fromCms === 'string' && fromCms.trim()) return fromCms
  return TOC_DEFAULTS[key] ?? ''
}

/** Read a ROI calculator label. */
export function R(settings: SiteSettings | null | undefined, key: string): string {
  const fromCms = settings?.roiLabels?.[key]
  if (typeof fromCms === 'string' && fromCms.trim()) return fromCms
  return ROI_LABEL_DEFAULTS[key] ?? ''
}

/** Read a breadcrumb label or href. */
export function B(
  settings: SiteSettings | null | undefined,
  key: keyof typeof BREADCRUMB_DEFAULTS,
): string {
  const fromCms = settings?.breadcrumb?.[key]
  if (typeof fromCms === 'string' && fromCms.trim()) return fromCms
  return BREADCRUMB_DEFAULTS[key]
}

/** Read a top-level setting with the reference-build fallback. */
export function S<K extends keyof SiteSettings>(
  settings: SiteSettings | null | undefined,
  key: K,
): SiteSettings[K] {
  const v = settings?.[key]
  if (v === undefined || v === null || (typeof v === 'string' && !v.trim())) {
    return SETTINGS_DEFAULTS[key]
  }
  return v
}
