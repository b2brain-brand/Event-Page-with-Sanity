/**
 * =============================================================================
 * SEED — ports the reference build's sample data into Sanity.
 * =============================================================================
 *
 *   node scripts/seed.mjs
 *
 * Creates, with deterministic ids so it is safe to re-run:
 *   siteSettings (1) · venue (2) · eventCategory (3) · eventSeries (2) · event (2)
 *
 * The two events are the two examples in preview-v2.html, copied field for
 * field: Dreamforce 2026 (every module populated) and the SE Manufacturing
 * Technology Show (deliberately sparse). Seeding both is the point — open them
 * side by side and you can see the graceful degradation working against real
 * documents rather than a mock data object.
 *
 * The sample numbers came with the reference file and are illustrative. Verify
 * every one against a real source before publishing a page.
 *
 * Requires SANITY_API_WRITE_TOKEN in .env.local.
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))

/* ------------------------------------------------------ tiny .env.local reader */
function loadEnv() {
  try {
    const raw = readFileSync(resolve(here, '..', '.env.local'), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch {
    /* no .env.local — rely on the ambient environment */
  }
}
loadEnv()

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId) throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is not set')
if (!token) throw new Error('SANITY_API_WRITE_TOKEN is not set (needs write access)')

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-10-28',
  useCdn: false,
})

const ref = (id) => ({ _type: 'reference', _ref: id })

/* ============================================================ SITE SETTINGS */
const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  logoText: 'B2Brain',
  navLinks: [
    { _type: 'navLink', _key: 'n1', label: 'Platform', href: '/platform' },
    { _type: 'navLink', _key: 'n2', label: 'Use Cases', href: '/use-cases' },
    { _type: 'navLink', _key: 'n3', label: 'Pricing', href: '/pricing' },
    { _type: 'navLink', _key: 'n4', label: 'Events', href: '/events', isCurrent: true },
    { _type: 'navLink', _key: 'n5', label: 'Blog', href: '/blog' },
  ],
  navLoginLabel: 'Log In',
  navLoginHref: '/login',
  navCtaLabel: 'Book a Demo',
  navCtaHref: '#cta',
  breadcrumb: {
    homeLabel: 'Home',
    homeHref: '/',
    eventsLabel: 'Events',
    // Point this at your existing events collection page.
    eventsHref: '/events',
  },
  tocLabel: 'On this page',
  tocCtaLabel: 'Plan your booth',

  // Every string the template prints that is NOT event-specific.
  labels: {
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
    sentimentHeading: 'Reviews that you need to know about this show',
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
  },

  tocLabels: {
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
  },

  roiLabels: {
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
  },
  footerBlurb:
    'The Event Meeting Platform. Turn trade-show conversations into booked meetings and measurable pipeline.',
  footerColumns: [
    {
      _type: 'footerColumn',
      _key: 'f1',
      heading: 'Platform',
      links: [
        { _type: 'navLink', _key: 'a', label: 'Overview', href: '/platform' },
        { _type: 'navLink', _key: 'b', label: 'Pre-event', href: '/platform#pre-event' },
        { _type: 'navLink', _key: 'c', label: 'On the floor', href: '/platform#on-the-floor' },
        { _type: 'navLink', _key: 'd', label: 'Post-event', href: '/platform#post-event' },
      ],
    },
    {
      _type: 'footerColumn',
      _key: 'f2',
      heading: 'Events',
      links: [
        { _type: 'navLink', _key: 'a', label: 'All events', href: '/events' },
        { _type: 'navLink', _key: 'b', label: 'Manufacturing', href: '/events?category=manufacturing' },
        { _type: 'navLink', _key: 'c', label: 'Supply chain', href: '/events?category=supply-chain' },
        { _type: 'navLink', _key: 'd', label: 'Technology', href: '/events?category=technology' },
      ],
    },
    {
      _type: 'footerColumn',
      _key: 'f3',
      heading: 'Company',
      links: [
        { _type: 'navLink', _key: 'a', label: 'About', href: '/about' },
        { _type: 'navLink', _key: 'b', label: 'Pricing', href: '/pricing' },
        { _type: 'navLink', _key: 'c', label: 'Book a demo', href: '/book-a-demo' },
        { _type: 'navLink', _key: 'd', label: 'Contact', href: '/contact' },
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
  siteUrl: 'https://events.b2brain.com',
  organizationName: 'B2Brain',
}

/* ================================================================== VENUES */
const venues = [
  {
    _id: 'venue.moscone-center',
    _type: 'venue',
    name: 'Moscone Center',
    slug: { _type: 'slug', current: 'moscone-center' },
    city: 'San Francisco, CA',
    streetAddress: '747 Howard St',
    postalCode: '94103',
    country: 'US',
    geo: { _type: 'geopoint', lat: 37.7841, lng: -122.4014 },
  },
  {
    _id: 'venue.music-city-center',
    _type: 'venue',
    name: 'Music City Center',
    slug: { _type: 'slug', current: 'music-city-center' },
    city: 'Nashville, TN',
    streetAddress: '201 Rep. John Lewis Way S',
    postalCode: '37203',
    country: 'US',
    geo: { _type: 'geopoint', lat: 36.1567, lng: -86.7762 },
  },
]

/* ============================================================== CATEGORIES */
const categories = [
  {
    _id: 'category.technology',
    _type: 'eventCategory',
    title: 'Technology',
    slug: { _type: 'slug', current: 'technology' },
    description: 'Platform, SaaS and developer conferences where the buying committee runs on software.',
  },
  {
    _id: 'category.manufacturing',
    _type: 'eventCategory',
    title: 'Manufacturing',
    slug: { _type: 'slug', current: 'manufacturing' },
    description: 'Plant, automation and industrial technology shows.',
  },
  {
    _id: 'category.supply-chain',
    _type: 'eventCategory',
    title: 'Supply chain',
    slug: { _type: 'slug', current: 'supply-chain' },
    description: 'Logistics, materials handling and distribution events.',
  },
]

/* ================================================================== SERIES */
const series = [
  {
    _id: 'series.dreamforce',
    _type: 'eventSeries',
    title: 'Dreamforce',
    slug: { _type: 'slug', current: 'dreamforce' },
    organizerName: 'Salesforce',
    organizerUrl: 'https://www.salesforce.com',
  },
  {
    _id: 'series.se-manufacturing-technology-show',
    _type: 'eventSeries',
    title: 'SE Manufacturing Technology Show',
    slug: { _type: 'slug', current: 'se-manufacturing-technology-show' },
  },
]

/* =================================================== EVENT · DATA-RICH ==== */
const dreamforce = {
  _id: 'event.dreamforce-2026',
  _type: 'event',
  name: 'Dreamforce 2026',
  slug: { _type: 'slug', current: 'dreamforce-2026' },
  type: 'Technology Conference',
  tagline:
    "The Salesforce ecosystem's biggest week — 170,000 operators, admins, and executives in one San Francisco week.",
  subhead:
    'If your buyers run on Salesforce, a large share of next year’s pipeline walks this floor. Here is the full picture — agenda, who exhibits, who attends, and the booth math — in one place.',
  startDate: '2026-09-15',
  endDate: '2026-09-17',
  venue: ref('venue.moscone-center'),
  format: 'In-person + broadcast',
  formatNote: 'In-person + Salesforce+ broadcast',
  hashtag: '#DF26',
  officialUrl: 'https://www.salesforce.com/dreamforce/',
  registerUrl: 'https://www.salesforce.com/dreamforce/',
  series: ref('series.dreamforce'),
  categories: [{ ...ref('category.technology'), _key: 'c1' }],

  heroVideo: {
    _type: 'heroVideo',
    // The thumbnail is derived from this URL — there is nothing else to set.
    youtubeUrl: 'https://www.youtube.com/watch?v=qJLAzhDomGg',
    label: 'FROM DREAMFORCE 2025',
    caption: 'Agents, Data and Apps in action — Salesforce',
    openOnYouTube: false,
  },

  // Featured-card content for /events — authored, concise, like the main site.
  cardStat: 'Salesforce Ecosystem',
  cardAudience: 'Customers, partners, admins, developers and executives',
  cardHeadline:
    'Dreamforce 2026 — the Salesforce ecosystem gathers in San Francisco for the Agentic Enterprise.',

  stats: [
    { _type: 'statCell', _key: 's1', num: '170K+', label: 'Attendees', meta: 'customers, partners, admins' },
    { _type: 'statCell', _key: 's2', num: '110+', label: 'Exhibitors', meta: 'across the campus' },
    { _type: 'statCell', _key: 's3', num: '1,600+', label: 'Sessions', meta: 'keynotes to workshops' },
    { _type: 'statCell', _key: 's4', num: '3 days', label: 'Show floor', meta: 'Moscone campus' },
  ],

  tldr:
    "Dreamforce 2026 runs September 15–17 at San Francisco's Moscone Center — Salesforce's flagship event drawing 170,000+ attendees, 110+ exhibitors, and 1,600+ sessions across Agentforce, Data Cloud, and revenue-transformation tracks. For exhibitors, the draw is buyer density: RevOps, IT, and CX decision-makers concentrate here, making booth-conversation-to-meeting speed the metric that decides ROI.",

  /* Four slides matching the supplied Dreamforce photos. Captions and alt text
     are seeded here; drop the images onto these slots in the Studio, or run
     `npm run upload:gallery` to attach them from a local folder in this order. */
  gallery: [
    {
      _type: 'galleryItem',
      _key: 'g1',
      caption: 'Dreamforce National Park — the Moscone campus transformed',
      alt: 'Landscaped park entrance with a large sculpture and the Dreamforce National Park arch, attendees walking through',
      accent: 'green',
    },
    {
      _type: 'galleryItem',
      _key: 'g2',
      caption: 'Attendees with Astro on the campus lawn',
      alt: 'An attendee taking a selfie with the oversized Astro mascot outside a Moscone building',
      accent: 'orange',
    },
    {
      _type: 'galleryItem',
      _key: 'g3',
      caption: 'Welcome to Dreamforce — Moscone South',
      alt: 'Crowds on the lawn below a large Welcome to Dreamforce banner on the Moscone South facade',
      accent: 'purple',
    },
    {
      _type: 'galleryItem',
      _key: 'g4',
      caption: 'Main stage — the Agentforce keynote',
      alt: 'Two people in conversation on the Dreamforce main stage beside three humanoid robots',
      accent: 'yellow',
    },
  ],

  why: {
    _type: 'whyBlock',
    headline:
      'Roughly a third of the Salesforce-adjacent SaaS pipeline for the coming year gets sourced in this one week.',
    body: [
      'Dreamforce is not a lead-volume event; it is a buyer-density event. The people walking Moscone are the exact committee that signs $25K+ ACV deals — RevOps leads, IT owners, and the executives who sponsor them.',
      'That changes the exhibitor job. The win is not scanning the most badges; it is leaving the floor with the most qualified conversations that already have context, an owner, and a scheduled next step.',
    ],
    pullquote: {
      _type: 'pullquote',
      text:
        'We captured 540 leads at our last big show. Eight became meetings. At Dreamforce we needed a different number — and a different workflow to get it.',
      attr: 'Director of Field Marketing · mid-market manufacturing SaaS',
    },
  },

  agenda: {
    _type: 'agendaBlock',
    tracks: ['Agentforce', 'Data Cloud', 'Sales', 'Service', 'Marketing', 'Platform & Dev', 'Industries'],
    days: [
      {
        _type: 'agendaDay',
        _key: 'd1',
        label: 'Day 1',
        meta: 'Tue · Sep 15',
        items: [
          { _type: 'agendaSession', _key: 'i1', time: '9:00 AM', title: 'Opening Keynote — the Agentforce era', loc: 'Moscone North · Hall D', track: 'Agentforce' },
          { _type: 'agendaSession', _key: 'i2', time: '1:00 PM', title: 'Data Cloud in production: patterns that scale', loc: 'Moscone West · 2005', track: 'Data Cloud' },
          { _type: 'agendaSession', _key: 'i3', time: '4:00 PM', title: 'Pipeline attribution for field & events teams', loc: 'Moscone South · 210', track: 'Marketing' },
        ],
      },
      {
        _type: 'agendaDay',
        _key: 'd2',
        label: 'Day 2',
        meta: 'Wed · Sep 16',
        items: [
          { _type: 'agendaSession', _key: 'i1', time: '10:00 AM', title: 'RevOps main stage: the compound-efficiency play', loc: 'Moscone North · Hall D', track: 'Sales' },
          { _type: 'agendaSession', _key: 'i2', time: '2:00 PM', title: 'Service agents that resolve, not deflect', loc: 'Moscone West · 3001', track: 'Service' },
        ],
      },
      {
        _type: 'agendaDay',
        _key: 'd3',
        label: 'Day 3',
        meta: 'Thu · Sep 17',
        items: [
          { _type: 'agendaSession', _key: 'i1', time: '11:00 AM', title: 'Industries deep-dive: manufacturing & supply chain', loc: 'Moscone South · 156', track: 'Industries' },
          { _type: 'agendaSession', _key: 'i2', time: '3:00 PM', title: 'Closing keynote + roadmap', loc: 'Moscone North · Hall D', track: 'Platform & Dev' },
        ],
      },
    ],
  },

  speakers: [
    { _type: 'speaker', _key: 'p1', name: 'M. Benioff', role: 'Chair & CEO, Salesforce', initials: 'MB', keynote: true },
    { _type: 'speaker', _key: 'p2', name: 'P. Rahill', role: 'VP, Agentforce Product', initials: 'PR', keynote: false },
    { _type: 'speaker', _key: 'p3', name: 'S. Kang', role: 'SVP, Data Cloud', initials: 'SK', keynote: false },
    { _type: 'speaker', _key: 'p4', name: 'D. Okafor', role: 'CMO, enterprise manufacturing', initials: 'DO', keynote: false },
    { _type: 'speaker', _key: 'p5', name: 'L. Moreau', role: 'Head of RevOps, logistics SaaS', initials: 'LM', keynote: false },
    { _type: 'speaker', _key: 'p6', name: 'T. Vasquez', role: 'Field Marketing Director', initials: 'TV', keynote: false },
    { _type: 'speaker', _key: 'p7', name: 'R. Iyer', role: 'Partner, GTM advisory', initials: 'RI', keynote: false },
    { _type: 'speaker', _key: 'p8', name: 'K. Novak', role: 'VP Sales, industrial tech', initials: 'KN', keynote: false },
  ],

  exhibitors: {
    _type: 'exhibitorsBlock',
    tiers: [
      { _type: 'exhibitorTier', _key: 't1', tier: 'Platinum', names: ['Slack', 'Tableau', 'MuleSoft', 'AWS', 'Google Cloud'] },
      { _type: 'exhibitorTier', _key: 't2', tier: 'Gold', names: ['Snowflake', 'Databricks', 'Accenture', 'Deloitte Digital', 'Vonage'] },
      { _type: 'exhibitorTier', _key: 't3', tier: 'Startup alley', names: ['18 vertical SaaS startups'] },
    ],
    notable:
      'For B2B revenue teams, the exhibitors worth mapping are the ones your buyers already evaluate: data platforms, CPQ, and the systems-integrators who influence the deal. Cross-reference the exhibitor list against your open opportunities before you land.',
  },

  audience: {
    _type: 'audienceBlock',
    titleMix: [
      { _type: 'titleMixRow', _key: 'a1', label: 'RevOps / Sales Ops', pct: 24 },
      { _type: 'titleMixRow', _key: 'a2', label: 'IT / Platform owners', pct: 21 },
      { _type: 'titleMixRow', _key: 'a3', label: 'Marketing / Field', pct: 19 },
      { _type: 'titleMixRow', _key: 'a4', label: 'C-suite / VP', pct: 17 },
      { _type: 'titleMixRow', _key: 'a5', label: 'Admins / Developers', pct: 19 },
    ],
    industries: ['Manufacturing', 'Financial services', 'Healthcare', 'Retail / CPG', 'Logistics', 'Technology'],
    match:
      'If your ICP is a Salesforce-run B2B company with 200+ employees and a committee-based buy, your buyer is here at higher density than any other week of the year. If you sell to non-Salesforce SMBs, spend your booth budget elsewhere.',
  },

  cost: {
    _type: 'costBlock',
    boothRange:
      'A 10x10 booth at Dreamforce lands around $18K–$45K before build, travel, and staff — a fully-loaded presence is commonly $80K–$150K.',
    roi: {
      _type: 'roiInputs',
      spend: 90000,
      reps: 4,
      days: 3,
      convosPerRepDay: 10,
      qualRate: 50,
      meetingRate: 52,
      acv: 40000,
    },
  },

  logistics: {
    _type: 'logisticsBlock',
    cells: [
      { _type: 'logisticsCell', _key: 'l1', h: 'Getting there', body: 'SFO (15 min) and OAK (25 min) both serve downtown. Moscone is walkable from Union Square hotels; use BART to Powell St.' },
      { _type: 'logisticsCell', _key: 'l2', h: 'Where to stay', list: ['Marriott Marquis — connected to Moscone', 'Hotel Nikko — 4-min walk', 'InterContinental — official room block'] },
      { _type: 'logisticsCell', _key: 'l3', h: 'On-site', list: ['Registration opens 7:00 AM daily', 'Free Wi-Fi campus-wide', 'Meal service in South & West'] },
      { _type: 'logisticsCell', _key: 'l4', h: 'Lead retrieval', body: 'Dreamforce provides a badge-scan app to sponsors. It captures the badge — not the conversation. The context (use case, blockers, next step) is on your team to keep.' },
    ],
    passes: [
      { _type: 'passTier', _key: 'x1', name: 'Full Conference Pass', note: 'All keynotes, sessions, expo', price: '$1,999' },
      { _type: 'passTier', _key: 'x2', name: 'Expo+ Pass', note: 'Expo floor + select sessions', price: '$499' },
      { _type: 'passTier', _key: 'x3', name: 'Partner Pass', note: 'For registered partners', price: 'Varies' },
    ],
  },

  sentiment: {
    _type: 'sentimentBlock',
    videos: [
      { _type: 'videoReview', _key: 'v1', title: 'Dreamforce 2025 — full opening keynote recap', src: 'YouTube · Salesforce' },
      { _type: 'videoReview', _key: 'v2', title: 'What Dreamforce is actually like as an exhibitor', src: 'YouTube · GTM creator' },
      { _type: 'videoReview', _key: 'v3', title: 'Best booth strategies we saw at DF25', src: 'YouTube · field-marketing vlog' },
    ],
    reddit: [
      { _type: 'redditReview', _key: 'r1', quote: "Worth it if you have customers on SF already. The expo floor is overwhelming — plan your booth route or you'll waste day one.", sub: 'r/salesforce', tone: 'Positive' },
      { _type: 'redditReview', _key: 'r2', quote: 'Insane scale. Great for pipeline if you exhibit, less so if you just attend without a plan.', sub: 'r/sales', tone: 'Mixed' },
      { _type: 'redditReview', _key: 'r3', quote: 'The after-hours networking is where the real conversations happen. Book those meetings in advance.', sub: 'r/marketing', tone: 'Positive' },
    ],
    testimonials: [
      { _type: 'testimonial', _key: 't1', q: 'We booked 22 qualified meetings from the booth in three days — our best show of the year by a wide margin.', a: 'VP Marketing · supply-chain SaaS' },
      { _type: 'testimonial', _key: 't2', q: 'The difference was follow-up speed. Every conversation was in Salesforce with context before the rep left the floor.', a: 'RevOps Lead · industrial tech' },
    ],
  },

  playbook: {
    _type: 'playbookBlock',
    pre: {
      _type: 'playbookMotion',
      h: 'Land with a ranked target list, not a blank badge scanner.',
      b: 'Pull the exhibitor and attendee lists, cross-reference your CRM, and walk in with a tiered list of who to meet and what they last bought.',
    },
    floor: {
      _type: 'playbookMotion',
      h: 'Voice in, Salesforce record out — book the meeting before they leave the booth.',
      b: 'Capture the use case, blockers, and next step in seconds. On-spot meeting booking beats a business card that goes cold by Tuesday.',
    },
    post: {
      _type: 'playbookMotion',
      h: 'Morning-after report. Pipeline tied to the booth. Defensible at QBR.',
      b: 'Every conversation synced with context and owner, so the pipeline you report from Dreamforce holds up when the CFO asks.',
    },
  },

  autoFillRelated: true,
  relatedEvents: [{ ...ref('event.smts-2026'), _key: 'rel1' }],

  faq: [
    { _type: 'faqItem', _key: 'q1', q: 'When and where is Dreamforce 2026?', a: 'Dreamforce 2026 runs September 15–17, 2026 at the Moscone Center in San Francisco, CA, with a Salesforce+ broadcast for remote attendees.' },
    { _type: 'faqItem', _key: 'q2', q: 'Who attends Dreamforce?', a: 'About 170,000 Salesforce customers, partners, admins, developers, and executives — skewing heavily toward RevOps, IT, marketing, and C-suite decision-makers at mid-market and enterprise companies.' },
    { _type: 'faqItem', _key: 'q3', q: 'How much does it cost to exhibit at Dreamforce?', a: 'A basic 10x10 booth typically runs $18K–$45K before build, travel, and staffing; a fully-loaded presence is commonly $80K–$150K all-in.' },
    { _type: 'faqItem', _key: 'q4', q: 'Does Dreamforce provide lead retrieval?', a: 'Yes — sponsors get a badge-scan app. It records the badge, not the conversation context, so exhibitors still need a way to capture use case, blockers, and next steps.' },
    { _type: 'faqItem', _key: 'q5', q: 'How should an exhibitor prepare for Dreamforce?', a: 'Build a ranked target list against your CRM before the show, staff the booth to capture conversation context on the spot, and follow up within 24 hours while the context is fresh.' },
  ],

  seo: {
    _type: 'seo',
    metaTitle: 'Dreamforce 2026 — dates, who attends, and the booth math',
    metaDescription:
      'Dreamforce 2026 runs September 15–17 at Moscone Center, San Francisco. Agenda, exhibitors, attendee mix, pass prices and the exhibitor ROI math.',
  },
  lastUpdated: '2026-07-18',
  sources: [
    { _type: 'source', _key: 'sr1', label: 'salesforce.com/dreamforce' },
    { _type: 'source', _key: 'sr2', label: 'Dreamforce 2025 recap deck' },
    { _type: 'source', _key: 'sr3', label: 'r/salesforce' },
  ],
  publishedAt: '2026-07-18T09:00:00.000Z',
}

/* ================================================= EVENT · DATA-SPARSE ==== */
const smts = {
  _id: 'event.smts-2026',
  _type: 'event',
  name: 'SE Manufacturing Technology Show 2026',
  slug: { _type: 'slug', current: 'smts-2026' },
  type: 'Trade Show',
  tagline: "The Southeast's regional gathering for manufacturing and automation buyers.",
  subhead:
    'A focused two-day regional show. Here is what we could confirm — with the booth math for exhibitors.',
  startDate: '2026-10-20',
  endDate: '2026-10-21',
  venue: ref('venue.music-city-center'),
  format: 'In-person',
  series: ref('series.se-manufacturing-technology-show'),
  categories: [
    { ...ref('category.manufacturing'), _key: 'c1' },
    { ...ref('category.supply-chain'), _key: 'c2' },
  ],

  // No heroVideo on purpose — this is the full-width hero variant.

  cardStat: 'Southeast Manufacturers',
  cardAudience: 'Plant, operations and engineering leaders',
  cardHeadline:
    "SE Manufacturing Technology Show 2026 — the Southeast's regional manufacturing and automation gathering.",

  stats: [
    { _type: 'statCell', _key: 's1', num: '6,500+', label: 'Attendees', meta: 'regional operators' },
    { _type: 'statCell', _key: 's2', num: '140+', label: 'Exhibitors' },
  ],

  tldr:
    "The SE Manufacturing Technology Show 2026 runs October 20–21 at Nashville's Music City Center — a regional trade show for manufacturing and automation buyers across the Southeast, with 140+ exhibitors and roughly 6,500 attendees.",

  // gallery, speakers, exhibitor tiers, sentiment: all intentionally absent.

  why: {
    _type: 'whyBlock',
    headline:
      'A regional show where the buyers are local plant and operations leaders — smaller, but high-intent.',
    body: [
      'Regional manufacturing shows over-index on decision-makers who came specifically to source equipment and software. Lower foot traffic, higher purchase intent per conversation.',
    ],
  },

  agenda: {
    _type: 'agendaBlock',
    tracks: ['Automation', 'Robotics', 'Supply chain', 'Maintenance'],
    days: [],
  },

  audience: {
    _type: 'audienceBlock',
    titleMix: [
      { _type: 'titleMixRow', _key: 'a1', label: 'Plant / Ops management', pct: 41 },
      { _type: 'titleMixRow', _key: 'a2', label: 'Engineering', pct: 33 },
      { _type: 'titleMixRow', _key: 'a3', label: 'Procurement', pct: 26 },
    ],
    industries: ['Manufacturing', 'Automotive', 'Aerospace', 'Logistics'],
    match:
      'If you sell to Southeast US plant and operations leaders, this is a concentrated regional buying audience. Nationally-focused vendors may find the volume too low to justify a large booth.',
  },

  cost: {
    _type: 'costBlock',
    boothRange: 'Regional booths here typically run $3K–$9K before travel and staff.',
    roi: {
      _type: 'roiInputs',
      spend: 12000,
      reps: 2,
      days: 2,
      convosPerRepDay: 9,
      qualRate: 55,
      meetingRate: 50,
      acv: 28000,
    },
  },

  logistics: {
    _type: 'logisticsBlock',
    cells: [
      { _type: 'logisticsCell', _key: 'l1', h: 'Getting there', body: 'BNA airport is 15 minutes from Music City Center in downtown Nashville.' },
      { _type: 'logisticsCell', _key: 'l2', h: 'Lead retrieval', body: 'The organizer offers a basic badge scanner add-on. Confirm pricing with the sponsorship team.' },
    ],
    passes: [],
  },

  playbook: {
    _type: 'playbookBlock',
    pre: {
      _type: 'playbookMotion',
      h: 'Pull the 140-exhibitor and attendee list. Filter to your ICP. Land with briefings.',
      b: 'Even at regional scale, walking in with a ranked list beats working the floor cold.',
    },
    floor: {
      _type: 'playbookMotion',
      h: 'Voice in, CRM record out. Book the meeting before they walk away.',
      b: 'Offline-ready capture matters in convention-center dead zones.',
    },
    post: {
      _type: 'playbookMotion',
      h: 'Morning-after report. Pipeline tied to the booth.',
      b: 'Sync every conversation with context so the regional show earns its budget line.',
    },
  },

  autoFillRelated: true,
  relatedEvents: [{ ...ref('event.dreamforce-2026'), _key: 'rel1' }],

  faq: [
    { _type: 'faqItem', _key: 'q1', q: 'When and where is the SE Manufacturing Technology Show 2026?', a: 'It runs October 20–21, 2026 at the Music City Center in Nashville, TN.' },
    { _type: 'faqItem', _key: 'q2', q: 'Who attends?', a: 'Roughly 6,500 regional manufacturing and automation buyers — heavily plant management, engineering, and procurement roles across the Southeast US.' },
    { _type: 'faqItem', _key: 'q3', q: 'How much does it cost to exhibit?', a: 'Regional booths typically run $3K–$9K before travel and staffing.' },
  ],

  seo: {
    _type: 'seo',
    metaDescription:
      'SE Manufacturing Technology Show 2026 runs October 20–21 at Music City Center, Nashville. Who attends, booth costs and the exhibitor ROI math.',
  },
  lastUpdated: '2026-07-10',
  sources: [{ _type: 'source', _key: 'sr1', label: 'organizer site' }],
  publishedAt: '2026-07-10T09:00:00.000Z',
}

/* ==================================================================== RUN */
async function run() {
  console.log(`Seeding ${projectId}/${dataset} …`)

  const tx = client.transaction()

  // Order matters only for readability — Sanity resolves references lazily.
  for (const doc of [siteSettings, ...venues, ...categories, ...series]) {
    tx.createOrReplace(doc)
  }
  // Events reference each other, so write them without their cross-refs first…
  tx.createOrReplace({ ...dreamforce, relatedEvents: [] })
  tx.createOrReplace({ ...smts, relatedEvents: [] })

  await tx.commit()

  // …then patch the cross-references in once both documents exist.
  await client
    .transaction()
    .patch(dreamforce._id, (p) => p.set({ relatedEvents: dreamforce.relatedEvents }))
    .patch(smts._id, (p) => p.set({ relatedEvents: smts.relatedEvents }))
    .commit()

  console.log('Done.')
  console.log('  siteSettings   1')
  console.log(`  venue          ${venues.length}`)
  console.log(`  eventCategory  ${categories.length}`)
  console.log(`  eventSeries    ${series.length}`)
  console.log('  event          2  (dreamforce-2026, smts-2026)')
  console.log('')
  console.log('Open  http://localhost:3000/events/dreamforce-2026   (all modules)')
  console.log('      http://localhost:3000/events/smts-2026         (sparse — sections drop out)')
}

run().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
