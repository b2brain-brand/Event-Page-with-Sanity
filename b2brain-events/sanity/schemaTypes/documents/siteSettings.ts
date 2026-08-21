import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * =============================================================================
 * SITE SETTINGS — singleton. Everything the reference HTML hardcoded.
 * =============================================================================
 *
 * preview-v2.html bakes a lot of copy straight into the renderer: the nav, the
 * "On this page" strip, every section eyebrow and heading, the three playbook
 * step labels, the LTM comparison sentence, the CTA headline pattern, and the
 * whole footer. On a programmatic page set that is a liability — changing the
 * word "Exhibitors" would otherwise mean editing 40 pages.
 *
 * So all of it lives here, once. Per-event overrides exist where they make
 * sense (hero CTA label, CTA headline, gallery footnote); everything else is
 * global by design, which is what keeps 40 pages looking like one system.
 *
 * The initialValue on every field is the exact string from the reference build,
 * so an untouched Site settings document renders the page pixel-identically.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'chrome', title: 'Nav, TOC & footer', default: true },
    { name: 'labels', title: 'Section labels' },
    { name: 'cta', title: 'CTAs & ROI copy' },
    { name: 'org', title: 'Organisation & defaults' },
  ],
  fields: [
    /* ------------------------------------------------------------------ NAV */
    defineField({
      name: 'logoText',
      title: 'Logo wordmark',
      type: 'string',
      group: 'chrome',
      description: 'Text beside the black/orange logo square, in the nav and the footer.',
      initialValue: 'B2Brain',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'navLinks',
      title: 'Nav links',
      type: 'array',
      of: [defineArrayMember({ type: 'navLink' })],
      group: 'chrome',
      description:
        'The nav. Add children to a link to make it a dropdown (Use Cases). Empty falls back to the exact b2brain.com nav. Hidden below 991px.',
      initialValue: [
        { label: 'Platform', href: 'https://www.b2brain.com/platform' },
        {
          label: 'Use Cases',
          href: 'https://www.b2brain.com/platform',
          children: [
            { label: 'New Pipeline Generation', href: 'https://www.b2brain.com/new-pipeline-generation', icon: 'pipeline' },
            { label: 'Event Attendees', href: 'https://www.b2brain.com/event-attendees', icon: 'attendees' },
            { label: 'Event Exhibitors', href: 'https://www.b2brain.com/event-exhibitors', icon: 'exhibitors' },
          ],
        },
        { label: 'Pricing', href: 'https://www.b2brain.com/pricing' },
        { label: 'Events', href: 'https://www.b2brain.com/events', isCurrent: true },
        { label: 'Blogs', href: 'https://www.b2brain.com/blogs' },
      ],
    }),
    defineField({
      name: 'logoHref',
      title: 'Logo link',
      type: 'string',
      group: 'chrome',
      description: 'Where the logo goes. The main site root.',
      initialValue: 'https://www.b2brain.com/',
    }),
    defineField({
      name: 'navLoginLabel',
      title: 'Nav log-in / trial label',
      type: 'string',
      group: 'chrome',
      initialValue: 'Start Free Trial',
    }),
    defineField({
      name: 'navLoginHref',
      title: 'Nav log-in / trial URL',
      type: 'string',
      group: 'chrome',
      initialValue: 'https://apps.apple.com/us/app/b2brain-event-lead-capture/id6757783820',
    }),
    defineField({
      name: 'navCtaLabel',
      title: 'Nav button label',
      type: 'string',
      group: 'chrome',
      initialValue: 'Book a Demo',
    }),
    defineField({
      name: 'navCtaHref',
      title: 'Nav button URL',
      type: 'string',
      group: 'chrome',
      description: 'The nav CTA button.',
      initialValue: 'https://www.b2brain.com/demo',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social profiles',
      type: 'array',
      of: [defineArrayMember({ type: 'socialLink' })],
      group: 'chrome',
      description:
        'Rendered as 36px bordered squares in the footer, and emitted as Organization "sameAs" — an entity signal search engines use to connect this site to your real profiles.',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
      group: 'chrome',
      description: 'Shown in the footer as a mailto link.',
      initialValue: 'support@b2brain.com',
    }),
    defineField({
      name: 'legalLinks',
      title: 'Legal links',
      type: 'array',
      of: [defineArrayMember({ type: 'navLink' })],
      group: 'chrome',
      description: 'Bottom-right of the footer. Privacy, Terms.',
    }),

    /* ---------------------------------------------------------- BREADCRUMB */
    defineField({
      name: 'breadcrumb',
      title: 'Hero breadcrumb',
      type: 'object',
      group: 'chrome',
      description:
        'The "Home / Events / [event name]" line above the H1. Point "Events" at whichever events collection page you already run — it does not have to be a page in this project.',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'homeLabel', title: 'Home label', type: 'string', initialValue: 'Home' }),
        defineField({ name: 'homeHref', title: 'Home URL', type: 'string', initialValue: '/' }),
        defineField({ name: 'eventsLabel', title: 'Events label', type: 'string', initialValue: 'Events' }),
        defineField({
          name: 'eventsHref',
          title: 'Events URL',
          type: 'string',
          description: 'Your existing events collection page. Absolute or relative.',
          initialValue: '/events',
        }),
      ],
    }),

    /* ------------------------------------------------------------------ TOC */
    defineField({
      name: 'tocLabel',
      title: 'Sticky sub-nav label',
      type: 'string',
      group: 'chrome',
      initialValue: 'On this page',
    }),
    defineField({
      name: 'tocCtaLabel',
      title: 'Sticky sub-nav button label',
      type: 'string',
      group: 'chrome',
      initialValue: 'Plan your booth',
    }),

    /* --------------------------------------------------------------- FOOTER */
    defineField({
      name: 'footerBlurb',
      title: 'Footer blurb',
      type: 'text',
      rows: 3,
      group: 'chrome',
      initialValue:
        'The Event Intelligence Platform. Turn trade show conversations into booked meetings and measurable pipeline. From Offline to Pipeline.',
      validation: (r) => r.max(240),
    }),
    defineField({
      name: 'footerColumns',
      title: 'Footer columns',
      type: 'array',
      of: [defineArrayMember({ type: 'footerColumn' })],
      group: 'chrome',
      description: 'Three columns in the reference build: Platform, Events, Company.',
      validation: (r) => r.max(3),
    }),
    defineField({
      name: 'newsletterHeading',
      title: 'Newsletter — heading',
      type: 'string',
      group: 'chrome',
      description: 'Footer newsletter block.',
      initialValue: 'Subscribe Newsletter',
    }),
    defineField({
      name: 'newsletterPlaceholder',
      title: 'Newsletter — input placeholder',
      type: 'string',
      group: 'chrome',
      initialValue: 'Enter your e-mail',
    }),
    defineField({
      name: 'newsletterAction',
      title: 'Newsletter — form action URL',
      type: 'url',
      group: 'chrome',
      description:
        'Where the email is POSTed. Leave blank and the form shows a thank-you without storing anything.',
    }),
    defineField({
      name: 'aiHeading',
      title: '"Learn about B2Brain with AI" — heading',
      type: 'string',
      group: 'chrome',
      initialValue: 'Learn about B2Brain with AI',
    }),
    defineField({
      name: 'aiLinks',
      title: 'AI answer-engine links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'aiLink',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'url', title: 'URL', type: 'url', validation: (r) => r.required() }),
            defineField({
              name: 'glyph',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  { title: 'ChatGPT', value: 'openai' },
                  { title: 'Claude', value: 'claude' },
                  { title: 'Perplexity', value: 'perplexity' },
                  { title: 'Gemini', value: 'gemini' },
                  { title: 'Grok', value: 'grok' },
                ],
              },
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'url' } },
        }),
      ],
      group: 'chrome',
    }),
    defineField({
      name: 'footerCopyright',
      title: 'Copyright line',
      type: 'string',
      group: 'chrome',
      initialValue: '© 2026 B2Brain, Inc.',
    }),
    defineField({
      name: 'footerLegal',
      title: 'Legal line',
      type: 'string',
      group: 'chrome',
      initialValue: 'Privacy · Terms',
    }),

    /* -------------------------------------------------------- SECTION LABELS */
    defineField({
      name: 'labels',
      title: 'Section eyebrows & headings',
      type: 'object',
      group: 'labels',
      description:
        'Every asterisk eyebrow and H2 on the event template. Change one here and all event pages follow.',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'heroRefreshNote',
          title: 'Hero card — refresh note',
          type: 'string',
          description:
            'Tail of the countdown line under the hero operator card: "8 WEEKS TO GO — {this text}".',
          initialValue: 'pages are refreshed as the agenda is confirmed.',
        }),

        defineField({
          name: 'heroMetaDates',
          title: 'Hero meta — dates label',
          type: 'string',
          description: 'First cell of the bordered row under the hero buttons.',
          initialValue: 'Dates',
        }),
        defineField({ name: 'heroMetaLocation', title: 'Hero meta — location label', type: 'string', initialValue: 'Location' }),
        defineField({ name: 'heroMetaFormat', title: 'Hero meta — format label', type: 'string', initialValue: 'Format' }),

        defineField({ name: 'answerEyebrow', title: 'Quick answer — eyebrow', type: 'string', initialValue: 'QUICK ANSWER' }),
        defineField({
          name: 'answerHeadingTemplate',
          title: 'Quick answer — heading template',
          type: 'string',
          description: 'Use {event} for the event name.',
          initialValue: 'What is {event}?',
        }),

        defineField({ name: 'galleryEyebrow', title: 'Gallery — eyebrow', type: 'string', initialValue: 'FROM THE FLOOR' }),
        defineField({ name: 'galleryHeading', title: 'Gallery — heading', type: 'string', initialValue: 'Inside the event' }),
        defineField({
          name: 'galleryFootnote',
          title: 'Gallery — footnote',
          type: 'string',
          initialValue:
            'Photos from the previous edition. Slider adapts to however many images the event has — 1, 3, or 5.',
        }),
        defineField({
          name: 'galleryPlaceholder',
          title: 'Gallery — empty-slide placeholder',
          type: 'string',
          description:
            'Shown on a slide that has a caption but no image yet. {n} is the slide number.',
          initialValue: 'Photo {n} — drop image here',
        }),

        defineField({ name: 'whyEyebrow', title: 'Why it matters — eyebrow', type: 'string', initialValue: 'WHY IT MATTERS' }),

        defineField({ name: 'agendaEyebrow', title: 'Agenda — eyebrow', type: 'string', initialValue: 'AGENDA & SESSIONS' }),
        defineField({ name: 'agendaHeading', title: 'Agenda — heading', type: 'string', initialValue: "What's on the floor" }),
        defineField({
          name: 'agendaPendingNote',
          title: 'Agenda — note when only tracks are known',
          type: 'text',
          rows: 2,
          initialValue:
            'Full session-by-session schedule for this edition is being confirmed. Tracks below.',
        }),

        defineField({ name: 'speakersEyebrow', title: 'Speakers — eyebrow', type: 'string', initialValue: 'SPEAKERS' }),
        defineField({ name: 'speakersHeading', title: 'Speakers — heading', type: 'string', initialValue: "Who's on stage" }),
        defineField({
          name: 'speakerKeynoteChip',
          title: 'Speakers — keynote chip',
          type: 'string',
          description: 'The purple chip on a speaker card flagged as a keynote.',
          initialValue: 'Keynote',
        }),

        defineField({ name: 'exhibitorsEyebrow', title: 'Exhibitors — eyebrow', type: 'string', initialValue: 'EXHIBITORS & SPONSORS' }),
        defineField({ name: 'exhibitorsHeading', title: 'Exhibitors — heading', type: 'string', initialValue: "Who's setting up on the floor" }),
        defineField({ name: 'exhibitorsNotableHeading', title: 'Exhibitors — note card heading', type: 'string', initialValue: 'Which booths to map first' }),
        defineField({
          name: 'exhibitorsCta',
          title: 'Exhibitors — CTA line (links to demo)',
          type: 'text',
          rows: 2,
          description: 'Shown after the "which booths" box, linked to the closing demo banner.',
          initialValue: 'Want to discuss booth strategies? Book a demo and take back the updated exhibitor list.',
        }),

        defineField({ name: 'audienceEyebrow', title: 'Who attends — eyebrow', type: 'string', initialValue: 'WHO ATTENDS' }),
        defineField({ name: 'audienceHeading', title: 'Who attends — heading', type: 'string', initialValue: 'The audience your booth is buying access to' }),
        defineField({ name: 'audienceTitleMixLabel', title: 'Who attends — left column label', type: 'string', initialValue: 'ATTENDEE TITLE MIX' }),
        defineField({ name: 'audienceIndustriesLabel', title: 'Who attends — right column label', type: 'string', initialValue: 'INDUSTRIES ON THE FLOOR' }),
        defineField({ name: 'audienceMatchHeading', title: 'Who attends — purple card heading', type: 'string', initialValue: 'Is your buyer here?' }),

        defineField({ name: 'costEyebrow', title: 'Cost & ROI — eyebrow', type: 'string', initialValue: 'COST & ROI' }),
        defineField({ name: 'costHeading', title: 'Cost & ROI — heading', type: 'string', initialValue: 'Do the booth math before you commit the budget' }),

        defineField({ name: 'tacticsEyebrow', title: 'Beyond the booth — eyebrow', type: 'string', initialValue: 'BEYOND THE BOOTH', description: 'Template V2 addition (2026-07-22).' }),
        defineField({ name: 'tacticsHeading', title: 'Beyond the booth — heading', type: 'string', initialValue: 'Where the pipeline actually gets built' }),

        defineField({ name: 'logisticsEyebrow', title: 'Logistics — eyebrow', type: 'string', initialValue: 'LOGISTICS' }),
        defineField({ name: 'logisticsHeading', title: 'Logistics — heading', type: 'string', initialValue: 'Everything you need before you fly in' }),
        defineField({ name: 'passesLabel', title: 'Logistics — passes label', type: 'string', initialValue: 'PASSES & PRICING' }),

        defineField({ name: 'sentimentEyebrow', title: 'Reviews — eyebrow', type: 'string', initialValue: 'WHAT PEOPLE SAY' }),
        defineField({ name: 'sentimentHeading', title: 'Reviews — heading', type: 'string', initialValue: 'Reviews that you need to know about this show' }),
        defineField({ name: 'sentimentVideoLabel', title: 'Reviews — video block label', type: 'string', initialValue: 'Video — previous editions' }),
        defineField({ name: 'sentimentRedditLabel', title: 'Reviews — Reddit block label', type: 'string', initialValue: 'What people say on Reddit' }),
        defineField({ name: 'sentimentTestimonialLabel', title: 'Reviews — testimonial block label', type: 'string', initialValue: 'From past exhibitors' }),

        defineField({ name: 'compareEyebrow', title: 'B2Brain vs scanner — eyebrow', type: 'string', initialValue: 'B2BRAIN VS THE BADGE SCANNER', description: 'Template V2 addition (2026-07-22).' }),
        defineField({ name: 'compareHeading', title: 'B2Brain vs scanner — heading', type: 'string', initialValue: "What the event's own tool leaves on the table" }),
        defineField({ name: 'compareDefaultScannerCol', title: 'B2Brain vs scanner — default column header (their tool)', type: 'string', initialValue: 'On your own', description: 'Used when an event leaves its own column-header field blank.' }),
        defineField({ name: 'compareDefaultUsCol', title: 'B2Brain vs scanner — default column header (us)', type: 'string', initialValue: 'B2Brain' }),

        defineField({ name: 'heroOfferLinkLabel', title: 'Hero — "claim the offer" link', type: 'string', initialValue: 'Claim the event offer', description: 'Only appears in the hero when the event has an Event offer filled in.' }),

        defineField({
          name: 'playbookEyebrowTemplate',
          title: 'Playbook — eyebrow template',
          type: 'string',
          description: '{event} is uppercased automatically.',
          initialValue: 'HOW TO WIN AT {event}',
        }),
        defineField({
          name: 'playbookHeadingTemplate',
          title: 'Playbook — heading template',
          type: 'string',
          initialValue: 'Turn {event} from "event spend" to Pipeline Channel',
        }),
        defineField({
          name: 'playbookMotionPrefix',
          title: 'Playbook — step prefix',
          type: 'string',
          description:
            'Prefix on each card\'s small step line. {n} is the motion number (1, 2, 3). Rendered as "Motion 01 — Pre-event · target list".',
          initialValue: 'Motion 0{n} — ',
        }),
        defineField({
          name: 'playbookMotion1Cta',
          title: 'Playbook — Motion 01 CTA line (links to demo)',
          type: 'text',
          rows: 2,
          description: 'A CTA sentence at the end of the Motion 01 card, linked to the closing demo banner.',
          initialValue: 'Take a demo, learn how, and go back with the list for free.',
        }),
        defineField({ name: 'playbookStep1', title: 'Playbook — motion 01 label', type: 'string', initialValue: 'Pre-event · target list' }),
        defineField({ name: 'playbookStep2', title: 'Playbook — motion 02 label', type: 'string', initialValue: 'On the floor · capture + book' }),
        defineField({ name: 'playbookStep3', title: 'Playbook — motion 03 label', type: 'string', initialValue: 'Post-event · LTM + attribution' }),

        defineField({ name: 'similarEyebrow', title: 'Similar events — eyebrow', type: 'string', initialValue: 'OTHER SHOWS WORTH PREPPING FOR' }),
        defineField({ name: 'similarHeading', title: 'Similar events — heading', type: 'string', initialValue: 'More events on the calendar.' }),
        defineField({ name: 'similarLinkLabel', title: 'Similar events — card link', type: 'string', initialValue: 'See The Event Playbook' }),

        defineField({ name: 'articleEyebrow', title: 'Article — eyebrow', type: 'string', initialValue: 'THE FULL BRIEFING' }),
        defineField({ name: 'articleHeading', title: 'Article — heading', type: 'string', initialValue: 'Everything you need before you go' }),
        defineField({ name: 'articleTocLabel', title: 'Article — TOC label', type: 'string', initialValue: 'On this page' }),
        defineField({ name: 'faqEyebrow', title: 'FAQ — eyebrow', type: 'string', initialValue: 'FAQ' }),
        defineField({ name: 'faqHeading', title: 'FAQ — heading', type: 'string', initialValue: 'Questions buyers actually ask' }),
        defineField({
          name: 'faqSideNote',
          title: 'FAQ — side note',
          type: 'text',
          rows: 2,
          initialValue:
            'Answers are self-contained and structured for Google and AI-answer engines.',
        }),

        defineField({
          name: 'footerStampPrefix',
          title: 'Footer — last-updated prefix',
          type: 'string',
          initialValue: 'Page last updated',
        }),
        defineField({
          name: 'footerSourcesPrefix',
          title: 'Footer — sources prefix',
          type: 'string',
          initialValue: 'Sources:',
        }),
      ],
    }),

    /* ------------------------------------------------------- ROI CALCULATOR */
    defineField({
      name: 'roiLabels',
      title: 'ROI calculator labels',
      type: 'object',
      group: 'labels',
      description:
        'The seven input labels and three output labels on the Cost & ROI calculator. Global — the numbers behind them are set per event.',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'spend', title: 'Input — booth investment', type: 'string', initialValue: 'Booth investment ($)' }),
        defineField({ name: 'reps', title: 'Input — booth reps', type: 'string', initialValue: 'Booth reps' }),
        defineField({ name: 'days', title: 'Input — show days', type: 'string', initialValue: 'Show days' }),
        defineField({ name: 'convos', title: 'Input — conversations per rep per day', type: 'string', initialValue: 'Conversations / rep / day' }),
        defineField({ name: 'qualRate', title: 'Input — qualified rate', type: 'string', initialValue: 'Qualified rate (%)' }),
        defineField({ name: 'meetingRate', title: 'Input — meeting rate', type: 'string', initialValue: 'Meeting rate (%)' }),
        defineField({ name: 'acv', title: 'Input — average ACV', type: 'string', initialValue: 'Average ACV ($)' }),
        defineField({ name: 'outQualified', title: 'Output — qualified conversations', type: 'string', initialValue: 'Qualified conversations' }),
        defineField({ name: 'outMeetings', title: 'Output — meetings booked', type: 'string', initialValue: 'Meetings booked' }),
        defineField({
          name: 'outPipeline',
          title: 'Output — pipeline line',
          type: 'string',
          description: '{x} is the calculated return multiple, e.g. "13.9x".',
          initialValue: 'Modeled pipeline · {x} return',
        }),
      ],
    }),

    /* ------------------------------------------------------- TOC NAV LABELS */
    defineField({
      name: 'tocLabels',
      title: '"On this page" link labels',
      type: 'object',
      group: 'labels',
      description:
        'The sticky sub-nav. A link only appears when its section actually rendered — these are just the words.',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'overview', type: 'string', title: 'Hero', initialValue: 'Overview' }),
        defineField({ name: 'gallery', type: 'string', title: 'Gallery', initialValue: 'Photos' }),
        defineField({ name: 'why', type: 'string', title: 'Why it matters', initialValue: 'Why it matters' }),
        defineField({ name: 'agenda', type: 'string', title: 'Agenda', initialValue: 'Agenda' }),
        defineField({ name: 'speakers', type: 'string', title: 'Speakers', initialValue: 'Speakers' }),
        defineField({ name: 'exhibitors', type: 'string', title: 'Exhibitors', initialValue: 'Exhibitors' }),
        defineField({ name: 'audience', type: 'string', title: 'Who attends', initialValue: 'Who attends' }),
        defineField({ name: 'cost', type: 'string', title: 'Cost & ROI', initialValue: 'Cost & ROI' }),
        defineField({ name: 'tactics', type: 'string', title: 'Beyond the booth', initialValue: 'Beyond the booth' }),
        defineField({ name: 'logistics', type: 'string', title: 'Logistics', initialValue: 'Logistics' }),
        defineField({ name: 'sentiment', type: 'string', title: 'Reviews', initialValue: 'Reviews' }),
        defineField({ name: 'compare', type: 'string', title: 'B2Brain vs scanner', initialValue: 'B2Brain vs scanner' }),
        defineField({ name: 'playbook', type: 'string', title: 'Playbook', initialValue: 'Win the show' }),
        defineField({ name: 'offer', type: 'string', title: 'Event offer', initialValue: 'Event offer' }),
        defineField({ name: 'similar', type: 'string', title: 'Similar events', initialValue: 'Similar events' }),
        defineField({ name: 'article', type: 'string', title: 'Full briefing', initialValue: 'Full briefing' }),
        defineField({ name: 'faq', type: 'string', title: 'FAQ', initialValue: 'FAQ' }),
      ],
    }),

    /* --------------------------------------------------------- CTAs and ROI */
    defineField({
      name: 'heroPrimaryCtaLabel',
      title: 'Hero primary CTA label',
      type: 'string',
      group: 'cta',
      initialValue: 'Plan your booth',
    }),
    defineField({
      name: 'heroSecondaryCtaLabel',
      title: 'Hero secondary CTA label',
      type: 'string',
      group: 'cta',
      description: 'Only rendered when the event has a registration URL.',
      initialValue: 'Register for the event',
    }),
    defineField({
      name: 'ctaHeadlineTemplate',
      title: 'Closing CTA headline template',
      type: 'text',
      rows: 2,
      group: 'cta',
      description: '{event} is replaced with the event name.',
      initialValue: 'Walk into {event} with a target list — and out with meetings booked.',
    }),
    defineField({
      name: 'ctaPrimaryLabel',
      title: 'Closing CTA — primary label',
      type: 'string',
      group: 'cta',
      initialValue: 'Book a Demo',
    }),
    defineField({
      name: 'ctaPrimaryHref',
      title: 'Closing CTA — primary URL',
      type: 'string',
      group: 'cta',
      initialValue: '/book-a-demo',
    }),
    defineField({
      name: 'ctaSecondaryLabelTemplate',
      title: 'Closing CTA — supporting text template',
      type: 'string',
      group: 'cta',
      description: 'Non-clickable supporting text displayed beneath the Book a Demo button. Use {event} for the event name.',
      initialValue: 'Get the {event} prep guide',
    }),
    defineField({
      name: 'ctaSecondaryHref',
      title: 'Closing CTA — secondary URL',
      type: 'string',
      group: 'cta',
      initialValue: '/prep-guide',
    }),
    defineField({
      name: 'ctaFallbackEyebrow',
      title: 'Closing CTA — eyebrow when there is no date',
      type: 'string',
      group: 'cta',
      initialValue: 'BOOK A DEMO',
    }),
    defineField({
      name: 'roiIndustryAverage',
      title: 'Industry LTM average (%)',
      type: 'number',
      group: 'cta',
      description:
        'The comparison number in the ROI panel — the baseline for badge-scanner-only teams. House rule: never publish a percentage without the comparison beside it.',
      initialValue: 8,
      validation: (r) => r.required().min(0).max(100),
    }),
    defineField({
      name: 'roiLtmCopy',
      title: 'ROI comparison sentence',
      type: 'text',
      rows: 3,
      group: 'cta',
      description:
        'Tokens: {ltm} = the visitor\'s calculated rate, {avg} = the industry average above. Wrap text in **double asterisks** to bold it — keep the rate and the comparison bold, because the house rule is that a percentage never appears without the number it is being compared against.',
      initialValue:
        'Your **Leads-to-Meeting (LTM) rate is {ltm}** versus an **{avg} industry average** for badge-scanner-only teams. LTM metric moves your Pipeline. B2Brain moves your LTM.',
    }),

    /* ---------------------------------------------------- ORG AND DEFAULTS */
    defineField({
      name: 'siteUrl',
      title: 'Canonical site URL (reference only)',
      type: 'url',
      group: 'org',
      description:
        'No trailing slash. NOTE: the live canonical/OG/sitemap base is the NEXT_PUBLIC_SITE_URL env var, NOT this field — set that to https://www.b2brain.com for the /events rewrite. This field is kept for reference.',
      initialValue: 'https://www.b2brain.com',
    }),
    defineField({
      name: 'organizationName',
      title: 'Organisation name',
      type: 'string',
      group: 'org',
      initialValue: 'B2Brain',
    }),
    defineField({
      name: 'organizationLogo',
      title: 'Organisation logo',
      type: 'image',
      group: 'org',
      description: 'Square, min 512px. Used in the Organization JSON-LD block.',
    }),
    defineField({
      name: 'organizationSameAs',
      title: 'Social / profile URLs',
      type: 'array',
      of: [defineArrayMember({ type: 'url' })],
      group: 'org',
      description: 'LinkedIn, X, Crunchbase. Emitted as Organization `sameAs` — an entity signal.',
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Default share image',
      type: 'image',
      group: 'org',
      description: '1200×630. Used by any event page without its own.',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site settings' }),
  },
})
