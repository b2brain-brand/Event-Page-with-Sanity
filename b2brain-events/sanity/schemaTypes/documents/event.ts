import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * =============================================================================
 * EVENT — one document per show. One document renders one landing page.
 * =============================================================================
 *
 * This document is a 1:1 port of `window.EVENTS[slug]` in preview-v2.html.
 * Every field below maps to a slot in that template, and the template's core
 * promise is preserved end to end:
 *
 *      EMPTY DATA HIDES ITS SLOT — AND, IF THE WHOLE MODULE IS EMPTY,
 *      THE SECTION AND ITS "ON THIS PAGE" LINK DISAPPEAR TOO.
 *
 * So a sparse regional show and a 170,000-person conference render from the same
 * document type and neither one ever shows an empty box. Fill what you can
 * source; leave the rest blank. Do not invent numbers to fill a section.
 *
 * FIELD GROUPS (tabs at the top of the editor) follow the page top to bottom.
 */
export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  groups: [
    { name: 'identity', title: '1 · Hero & identity', default: true },
    { name: 'facts', title: '2 · Facts' },
    { name: 'programme', title: '3 · Programme' },
    { name: 'commercial', title: '4 · Audience & cost' },
    { name: 'proof', title: '5 · Proof & FAQ' },
    { name: 'seo', title: '6 · SEO & page meta' },
  ],
  fields: [
    /* ======================================================================
       1 · HERO & IDENTITY   ->  mHero()
       ====================================================================== */
    defineField({
      name: 'name',
      title: 'Event name',
      type: 'string',
      group: 'identity',
      description:
        'The H1, the breadcrumb, the browser title, and the token inside the playbook and CTA headlines. Always include the year — "Dreamforce 2026", not "Dreamforce". This is the exact string people search for.',
      validation: (r) => r.required().max(70),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      group: 'identity',
      description: 'Becomes /events/[slug]. Lowercase, hyphenated, with the year: "dreamforce-2026".',
      options: {
        source: 'name',
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .slice(0, 96),
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'type',
      title: 'Event type',
      type: 'string',
      group: 'identity',
      description:
        'The first chip in the hero. Also the JSON-LD event subtype. e.g. "Technology Conference", "Trade Show".',
      options: {
        list: [
          'Trade Show',
          'Technology Conference',
          'User Conference',
          'Summit',
          'Expo',
          'Regional Show',
          'Virtual Event',
        ].map((v) => ({ title: v, value: v })),
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Hero sub-headline',
      type: 'text',
      rows: 3,
      group: 'identity',
      description:
        'The 19px line directly under the H1 — this is the one that renders. One sentence, concrete: what the show is and how big. e.g. "The Salesforce ecosystem\'s biggest week — 170,000 operators, admins, and executives in one San Francisco week."',
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: 'subhead',
      title: 'Positioning line (not rendered)',
      type: 'text',
      rows: 3,
      group: 'identity',
      description:
        'Carried over from the reference data model, where it is stored but never printed in the hero. Kept because it is the best raw material for the meta description — the template uses it as the fallback when SEO → Meta description is blank. Write it as the "why should an exhibitor care" line.',
      validation: (r) => r.max(260),
    }),
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'date',
      group: 'identity',
      description:
        'Drives four things: the hero date range, the countdown chip ("8 weeks to go" / "Past event · recap"), the CTA eyebrow, and Event JSON-LD `startDate`.',
      options: { dateFormat: 'YYYY-MM-DD' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End date',
      type: 'date',
      group: 'identity',
      options: { dateFormat: 'YYYY-MM-DD' },
      validation: (r) =>
        r.required().custom((end, ctx) => {
          const start = (ctx.document as { startDate?: string } | undefined)?.startDate
          if (!start || !end) return true
          return end >= start || 'End date cannot be before the start date.'
        }),
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'reference',
      to: [{ type: 'venue' }],
      group: 'identity',
      description:
        'Reused across shows. Supplies the hero "Location" cell (venue · city) and the full address for JSON-LD.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      group: 'identity',
      description:
        'Third cell of the hero meta row. e.g. "In-person", "In-person + Salesforce+ broadcast". Also sets the JSON-LD attendance mode.',
      options: {
        list: [
          { title: 'In-person', value: 'In-person' },
          { title: 'In-person + broadcast', value: 'In-person + broadcast' },
          { title: 'Hybrid', value: 'Hybrid' },
          { title: 'Virtual', value: 'Virtual' },
        ],
      },
      initialValue: 'In-person',
    }),
    defineField({
      name: 'formatNote',
      title: 'Format label override',
      type: 'string',
      group: 'identity',
      description:
        'Optional. Prints instead of the value above when the show has a branded stream. e.g. "In-person + Salesforce+ broadcast".',
      validation: (r) => r.max(48),
    }),
    defineField({
      name: 'hashtag',
      title: 'Hashtag',
      type: 'string',
      group: 'identity',
      description: 'Purple chip in the hero. Include the #. Leave blank and the chip disappears.',
      validation: (r) => r.max(24),
    }),
    defineField({
      name: 'officialUrl',
      title: 'Official event site',
      type: 'url',
      group: 'identity',
      description: 'The organiser\'s page. Feeds Event JSON-LD `url`.',
    }),
    defineField({
      name: 'registerUrl',
      title: 'Registration URL',
      type: 'url',
      group: 'identity',
      description:
        'Powers the ghost "Register for the event" button in the hero. Blank hides that button and the hero shows a single CTA.',
    }),
    defineField({
      name: 'series',
      title: 'Series',
      type: 'reference',
      to: [{ type: 'eventSeries' }],
      group: 'identity',
      description: 'The show across years. Supplies the JSON-LD organiser.',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'eventCategory' }] })],
      group: 'identity',
      description:
        'Verticals this show belongs to. Used by the /events index filter and by the automatic "Similar events" fallback.',
      validation: (r) => r.unique(),
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero video',
      type: 'heroVideo',
      group: 'identity',
      description:
        'Footage from a previous edition, shown to the right of the H1. Present = two-column hero. Absent = full-width hero.',
    }),
    defineField({
      name: 'heroPrimaryCtaLabel',
      title: 'Hero primary CTA — label override',
      type: 'string',
      group: 'identity',
      description: 'Defaults to Site settings ("Plan your booth"). Only fill to override for this show.',
      validation: (r) => r.max(32),
    }),

    /* ======================================================================
       2 · FACTS   ->  mStats(), mAnswer()
       ====================================================================== */
    defineField({
      name: 'stats',
      title: 'At-a-glance stats',
      type: 'array',
      of: [defineArrayMember({ type: 'statCell' })],
      group: 'facts',
      description:
        'The bordered strip under the hero. Ship 4 (or 2 for a sparse show) — the grid is 4-up desktop, 2-up tablet. Sourced numbers only; put the source in the SEO tab.',
      validation: (r) => r.max(4).warning('The strip is a 4-column grid — a 5th cell will not fit.'),
    }),
    defineField({
      name: 'tldr',
      title: 'Quick answer',
      type: 'text',
      rows: 5,
      group: 'facts',
      description:
        'The purple box, and the single highest-value paragraph on the page: it is what AI answer engines lift when asked "what is [event]". Rules: answer in the first sentence, name the dates, city and venue, then the scale numbers, then the one line about why exhibitors care. 400–600 chars. No marketing adjectives.',
      validation: (r) =>
        r
          .max(900)
          .warning('Over ~600 characters this stops working as a liftable answer paragraph.'),
    }),

    /* ======================================================================
       3 · PROGRAMME   ->  mGallery(), mWhy(), mAgenda(), mSpeakers(), mExhibitors()
       ====================================================================== */
    defineField({
      name: 'gallery',
      title: 'Photos from the floor',
      type: 'array',
      of: [defineArrayMember({ type: 'galleryItem' })],
      group: 'programme',
      description:
        'Slider. 1 image renders without arrows or dots; 0 images removes the section. Use shots from the previous edition and say so in the footnote.',
    }),
    defineField({
      name: 'galleryFootnote',
      title: 'Gallery footnote override',
      type: 'string',
      group: 'programme',
      description:
        'Small grey line under the slider. Defaults to the Site settings copy ("Photos from the previous edition…").',
      validation: (r) => r.max(160),
    }),
    defineField({
      name: 'why',
      title: 'Why it matters',
      type: 'whyBlock',
      group: 'programme',
      description: 'The editorial argument for spending budget on this specific show.',
    }),
    defineField({
      name: 'agenda',
      title: 'Agenda & sessions',
      type: 'agendaBlock',
      group: 'programme',
    }),
    defineField({
      name: 'speakers',
      title: 'Speakers',
      type: 'array',
      of: [defineArrayMember({ type: 'speaker' })],
      group: 'programme',
      description: 'The names worth knowing, not the full roster. 4 or 8 fills the grid cleanly.',
    }),
    defineField({
      name: 'exhibitors',
      title: 'Exhibitors & sponsors',
      type: 'exhibitorsBlock',
      group: 'programme',
    }),

    /* ======================================================================
       4 · AUDIENCE & COST   ->  mAudience(), mROI(), mLogistics()
       ====================================================================== */
    defineField({
      name: 'audience',
      title: 'Who attends',
      type: 'audienceBlock',
      group: 'commercial',
      description: 'The audience the booth budget is actually buying access to.',
    }),
    defineField({
      name: 'cost',
      title: 'Cost & ROI',
      type: 'costBlock',
      group: 'commercial',
    }),
    defineField({
      name: 'logistics',
      title: 'Logistics',
      type: 'logisticsBlock',
      group: 'commercial',
    }),

    /* ======================================================================
       5 · PROOF & FAQ   ->  mSentiment(), mPlaybook(), mSimilar(), mFaq(), mCta()
       ====================================================================== */
    defineField({
      name: 'sentiment',
      title: 'What people say',
      type: 'sentimentBlock',
      group: 'proof',
    }),
    defineField({
      name: 'playbook',
      title: 'How to win at this event',
      type: 'playbookBlock',
      group: 'proof',
      description:
        'The three-motion grid. Fill all three or none — a partial set renders a lopsided grid.',
    }),
    defineField({
      name: 'relatedEvents',
      title: 'Similar events',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'event' }] })],
      group: 'proof',
      description:
        'Pick up to 3 other event pages. Each card pulls its own name, dates and city — nothing to retype. Leave empty and the template auto-fills from the same category (see below).',
      validation: (r) =>
        r.max(3).unique().custom((refs, ctx) => {
          const self = (ctx.document as { _id?: string } | undefined)?._id?.replace(/^drafts\./, '')
          const clash = (refs as { _ref?: string }[] | undefined)?.some((x) => x?._ref === self)
          return clash ? 'An event cannot be similar to itself.' : true
        }),
    }),
    defineField({
      name: 'autoFillRelated',
      title: 'Auto-fill similar events',
      type: 'boolean',
      group: 'proof',
      description:
        'On (default): if you have not picked any, the template fills the row with up to 3 upcoming events sharing a category. Off: an empty pick removes the section entirely.',
      initialValue: true,
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      of: [defineArrayMember({ type: 'faqItem' })],
      group: 'proof',
      description:
        '5–7 pairs. Emitted as both the visible accordion and FAQPage structured data. Order matters — the first question should be "when and where".',
      validation: (r) => r.max(10),
    }),
    defineField({
      name: 'ctaHeadline',
      title: 'Closing CTA headline override',
      type: 'text',
      rows: 2,
      group: 'proof',
      description:
        'Defaults to the Site settings template: "Walk into [event] with a target list — and out with meetings booked." Only fill to override.',
      validation: (r) => r.max(160),
    }),
    defineField({
      name: 'ctaEyebrowOverride',
      title: 'Closing CTA eyebrow override',
      type: 'string',
      group: 'proof',
      description:
        'The eyebrow is normally the live countdown ("8 WEEKS TO GO"). Set a fixed string here only if you need to freeze it.',
      validation: (r) => r.max(40),
    }),

    /* ======================================================================
       6 · SEO & PAGE META   ->  <head>, JSON-LD, footer stamp
       ====================================================================== */
    defineField({
      name: 'seo',
      title: 'SEO & sharing',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last updated',
      type: 'date',
      group: 'seo',
      description:
        'Printed in the footer stamp and emitted as `dateModified`. Bump it every time you re-verify the numbers — freshness is a ranking and a trust signal on event queries.',
      options: { dateFormat: 'YYYY-MM-DD' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'sources',
      title: 'Sources',
      type: 'array',
      of: [defineArrayMember({ type: 'source' })],
      group: 'seo',
      description:
        'Where the attendee counts, prices and dates came from. Printed as plain text in the footer stamp. Every number on the page should trace back to one of these.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'First published',
      type: 'datetime',
      group: 'seo',
      description: 'Emitted as `datePublished`. Set once, then leave it alone.',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Feature on the events index',
      type: 'boolean',
      group: 'seo',
      initialValue: false,
    }),
  ],

  orderings: [
    {
      title: 'Event date, soonest first',
      name: 'startDateAsc',
      by: [{ field: 'startDate', direction: 'asc' }],
    },
    {
      title: 'Recently updated',
      name: 'lastUpdatedDesc',
      by: [{ field: 'lastUpdated', direction: 'desc' }],
    },
    { title: 'Name A–Z', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
  ],

  preview: {
    select: {
      title: 'name',
      start: 'startDate',
      city: 'venue.city',
      media: 'seo.ogImage',
      noIndex: 'seo.noIndex',
    },
    prepare: ({ title, start, city, media, noIndex }) => ({
      title: noIndex ? `${title}  ·  [noindex]` : title,
      subtitle: [start, city].filter(Boolean).join('  ·  '),
      media,
    }),
  },
})
