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

  logisticsEyebrow: 'LOGISTICS',
  logisticsHeading: 'Everything you need before you fly in',
  passesLabel: 'PASSES & PRICING',

  sentimentEyebrow: 'WHAT PEOPLE SAY',
  sentimentHeading: 'The reviews the event site will never publish',
  sentimentVideoLabel: 'Video — previous editions',
  sentimentRedditLabel: 'What people say on Reddit',
  sentimentTestimonialLabel: 'From past exhibitors',

  playbookEyebrowTemplate: 'HOW TO WIN AT {event}',
  playbookHeadingTemplate: 'Turn {event} from a cost line into a pipeline line',
  playbookMotionPrefix: 'Motion 0{n} — ',
  playbookStep1: 'Pre-event · target list',
  playbookStep2: 'On the floor · capture + book',
  playbookStep3: 'Post-event · LTM + attribution',

  similarEyebrow: 'SIMILAR EVENTS',
  similarHeading: 'Other shows your team is weighing',
  similarLinkLabel: 'View event page',

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
  logistics: 'Logistics',
  sentiment: 'Reviews',
  playbook: 'Win the show',
  similar: 'Similar events',
  faq: 'FAQ',
}

export const SETTINGS_DEFAULTS: SiteSettings = {
  logoText: 'B2Brain',
  navLinks: [
    { label: 'Platform', href: '/platform' },
    { label: 'Use Cases', href: '/use-cases' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Events', href: '/events', isCurrent: true },
    { label: 'Blog', href: '/blog' },
  ],
  navLoginLabel: 'Log In',
  navLoginHref: '/login',
  navCtaLabel: 'Book a Demo',
  navCtaHref: '#cta',
  tocLabel: 'On this page',
  tocCtaLabel: 'Plan your booth',
  footerBlurb:
    'The Event Meeting Platform. Turn trade-show conversations into booked meetings and measurable pipeline.',
  footerColumns: [
    {
      heading: 'Platform',
      links: [
        { label: 'Overview', href: '/platform' },
        { label: 'Pre-event', href: '/platform#pre-event' },
        { label: 'On the floor', href: '/platform#on-the-floor' },
        { label: 'Post-event', href: '/platform#post-event' },
      ],
    },
    {
      heading: 'Events',
      links: [
        { label: 'All events', href: '/events' },
        { label: 'Manufacturing', href: '/events?category=manufacturing' },
        { label: 'Supply chain', href: '/events?category=supply-chain' },
        { label: 'Technology', href: '/events?category=technology' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Book a demo', href: '/book-a-demo' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ],
  footerCopyright: '© 2026 B2Brain, Inc.',
  footerLegal: 'Privacy · Terms',
  heroPrimaryCtaLabel: 'Plan your booth',
  heroSecondaryCtaLabel: 'Register for the event',
  ctaHeadlineTemplate: 'Walk into {event} with a target list — and out with meetings booked.',
  ctaPrimaryLabel: 'Book a Demo',
  ctaPrimaryHref: '/book-a-demo',
  ctaSecondaryLabelTemplate: 'Get the {event} prep guide',
  ctaSecondaryHref: '/prep-guide',
  ctaFallbackEyebrow: 'BOOK A DEMO',
  roiIndustryAverage: 8,
  roiLtmCopy:
    'At these inputs your **Leads-to-Meeting (LTM) rate is {ltm}** — versus an **~{avg} industry average** for badge-scanner-only teams. LTM is the metric B2Brain is built to move.',
  organizationName: 'B2Brain',
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
