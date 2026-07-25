import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * =============================================================================
 * EVENTS INDEX PAGE — singleton. The content of /events.
 * =============================================================================
 *
 * This is the collection page modelled on b2brain.com/events — hero, the stats
 * strip, the two section headings, the FAQ, and the closing CTA. The event
 * CARDS on it are the Event documents themselves; this document holds only the
 * page's own copy, so a marketer can retitle a section or reword the hero
 * without a deploy.
 *
 * Every field has the b2brain.com copy as its initialValue, so the page renders
 * correctly the moment this document is created and degrades to that copy if a
 * field is cleared.
 *
 * Distinct from `siteSettings` (site-wide chrome) and from the per-event landing
 * pages, which this request explicitly does not touch.
 */
export const eventsIndexPage = defineType({
  name: 'eventsIndexPage',
  title: 'Events page (/events)',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero & stats', default: true },
    { name: 'sections', title: 'Section headings' },
    { name: 'faq', title: 'FAQ' },
    { name: 'cta', title: 'Closing CTA' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    /* -------------------------------------------------------------- HERO */
    defineField({
      name: 'heroEyebrow',
      title: 'Hero eyebrow',
      type: 'string',
      group: 'hero',
      description: 'Small asterisk label above the H1.',
      initialValue: 'THE 2026 EVENT CALENDAR',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero heading',
      type: 'text',
      rows: 2,
      group: 'hero',
      initialValue: 'From offline conversations to attributable pipeline.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroIntro',
      title: 'Hero intro',
      type: 'text',
      rows: 3,
      group: 'hero',
      initialValue:
        'Browse the events, conferences, and industry shows revenue teams are planning pipeline around in 2026.',
    }),
    defineField({
      name: 'stats',
      title: 'Stats strip',
      type: 'array',
      of: [defineArrayMember({ type: 'indexStat' })],
      group: 'hero',
      description: 'Four cells under the hero, matching the main site.',
      validation: (r) => r.max(4),
      initialValue: [
        { _type: 'indexStat', num: '180+', label: 'Tracked shows' },
        { _type: 'indexStat', num: '3', label: 'Event motions' },
        { _type: 'indexStat', num: '2.8M', label: 'Leads captured' },
        { _type: 'indexStat', num: '$2.1B', label: 'Pipeline influenced' },
      ],
    }),

    /* ---------------------------------------------------------- SECTIONS */
    defineField({
      name: 'featuredEyebrow',
      title: 'Featured section — eyebrow',
      type: 'string',
      group: 'sections',
      initialValue: 'FEATURED',
    }),
    defineField({
      name: 'featuredHeading',
      title: 'Featured section — heading',
      type: 'string',
      group: 'sections',
      initialValue: 'The buying committees worth planning around.',
    }),
    defineField({
      name: 'featuredEvents',
      title: 'Featured events',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'event' }] })],
      group: 'sections',
      description:
        'Hand-pick the shows to feature at the top. Leave empty and the section shows the next few upcoming events automatically.',
      validation: (r) => r.unique().max(6),
    }),
    defineField({
      name: 'allEyebrow',
      title: 'All-events section — eyebrow',
      type: 'string',
      group: 'sections',
      initialValue: 'ALL EVENTS',
    }),
    defineField({
      name: 'allHeading',
      title: 'All-events section — heading',
      type: 'string',
      group: 'sections',
      initialValue: 'Browse the 2026 event calendar.',
    }),
    defineField({
      name: 'cardCtaLabel',
      title: 'Featured card button label',
      type: 'string',
      group: 'sections',
      description: 'The filled button on featured cards. The main site uses "Open Event Playbook".',
      initialValue: 'Open Event Playbook',
    }),
    defineField({
      name: 'allCardCtaLabel',
      title: 'All-events card button label',
      type: 'string',
      group: 'sections',
      description: 'The ghost button on the grid cards. The main site uses "See The Event Playbook".',
      initialValue: 'See The Event Playbook',
    }),
    defineField({
      name: 'industryFilterLabel',
      title: 'Industry filter — label',
      type: 'string',
      group: 'sections',
      initialValue: 'Filter by industry',
    }),
    defineField({
      name: 'searchPlaceholder',
      title: 'Search — placeholder',
      type: 'string',
      group: 'sections',
      initialValue: 'Search events…',
    }),

    /* --------------------------------------------------------------- FAQ */
    defineField({
      name: 'faqHeading',
      title: 'FAQ heading',
      type: 'string',
      group: 'faq',
      initialValue: 'Frequently asked questions',
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      of: [defineArrayMember({ type: 'faqItem' })],
      group: 'faq',
      description: 'Emitted as both the accordion and FAQPage structured data.',
      initialValue: [
        {
          _type: 'faqItem',
          q: 'What is the B2Brain event calendar?',
          a: 'A curated calendar of the B2B trade shows and conferences revenue teams plan pipeline around, with an event playbook for each — who attends, what a booth costs, and how to turn floor conversations into booked meetings.',
        },
        {
          _type: 'faqItem',
          q: 'How much does B2Brain cost?',
          a: 'Show Pass is $200 per user per event. Annual plans start at $1,500. See the pricing page for current details.',
        },
        {
          _type: 'faqItem',
          q: 'Does B2Brain integrate with my CRM?',
          a: 'Yes. Booth conversations sync to Salesforce and other CRMs with the use case, blockers and next step captured — not just a scanned badge.',
        },
        {
          _type: 'faqItem',
          q: 'Does it work offline on the show floor?',
          a: 'Yes. Capture is offline-ready for the convention-centre dead zones, and syncs when you are back on signal.',
        },
      ],
    }),

    /* --------------------------------------------------------------- CTA */
    defineField({
      name: 'ctaEyebrow',
      title: 'CTA eyebrow',
      type: 'string',
      group: 'cta',
      initialValue: 'FROM OFFLINE TO PIPELINE',
    }),
    defineField({
      name: 'ctaHeading',
      title: 'CTA heading',
      type: 'text',
      rows: 2,
      group: 'cta',
      initialValue: 'Every event conversation should end in attributable revenue.',
    }),

    /* --------------------------------------------------------------- SEO */
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      group: 'seo',
      initialValue: 'Trade shows & conferences for B2B revenue teams — B2Brain',
      validation: (r) => r.max(70).warning('Over ~60 characters Google truncates this.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      group: 'seo',
      initialValue:
        'Browse the 2026 B2B event calendar — dates, venue, who attends, exhibitor costs and the booth math for every major trade show and conference.',
      validation: (r) => r.max(200).warning('Over ~160 characters Google truncates this.'),
    }),
  ],
  preview: { prepare: () => ({ title: 'Events page (/events)' }) },
})
