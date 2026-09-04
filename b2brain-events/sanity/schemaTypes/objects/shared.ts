import { defineType, defineField, defineArrayMember } from 'sanity'

/** Shared small objects: SEO, sourcing, nav and footer links. */

export const seo = defineType({
  name: 'seo',
  title: 'SEO & sharing',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      description:
        '50–60 chars. Pattern: "[Event] [Year] — dates, who attends, and the booth math". Falls back to "[Event name] — B2Brain — The Event Meeting Platform".',
      validation: (r) =>
        r.max(70).warning('Over ~60 characters Google will truncate this in results.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description:
        '160–260 chars. Cover the event intent first, then add the relevant lead-capture or verified alternative intent. Falls back to the hero sub-headline, then the Quick answer.',
      validation: (r) =>
        r
          .min(160)
          .max(260)
          .warning('Use 160–260 characters to match the event-page SEO content contract.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Share image',
      type: 'image',
      options: { hotspot: true },
      description: '1200×630. Falls back to the site default in Site settings.',
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL override',
      type: 'url',
      description:
        'Only set this when the same event is intentionally covered by another page. Otherwise leave blank — the template writes the correct self-canonical.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      description:
        'Adds noindex and drops the page from the sitemap. Use for pages that are still being sourced.',
      initialValue: false,
    }),
  ],
})

export const source = defineType({
  name: 'source',
  title: 'Source',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description:
        'Rendered in the footer stamp as plain text. e.g. "salesforce.com/dreamforce", "Dreamforce 2025 recap deck", "r/salesforce".',
      validation: (r) => r.required().max(60),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'For your own verification trail. Not rendered — the stamp stays plain text.',
    }),
  ],
  preview: { select: { title: 'label', subtitle: 'url' } },
})

export const navLink = defineType({
  name: 'navLink',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'href',
      title: 'URL or path',
      type: 'string',
      description: 'Absolute (https://b2brain.com/pricing) or relative (/events).',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'isCurrent',
      title: 'Mark as current section',
      type: 'boolean',
      description: 'Renders the label in full black instead of 70% — used for "Events".',
      initialValue: false,
    }),
    defineField({
      name: 'children',
      title: 'Dropdown items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'childLink',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'href', title: 'URL or path', type: 'string', validation: (r) => r.required() }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Optional coloured icon square (nav dropdown only).',
              options: {
                list: [
                  { title: 'Pipeline (green)', value: 'pipeline' },
                  { title: 'Attendees (purple)', value: 'attendees' },
                  { title: 'Exhibitors (orange)', value: 'exhibitors' },
                ],
              },
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        }),
      ],
      description:
        'Nav only. Add items here and this link becomes a dropdown — e.g. Platform → New Pipeline Generation / Event Attendees / Event Exhibitors. Leave empty for a plain link.',
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'href', children: 'children' },
    prepare: ({ title, subtitle, children }) => ({
      title: (children || []).length ? `${title}  ▾` : title,
      subtitle,
    }),
  },
})

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social profile',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      description: 'Picks the icon. Only these five have glyphs.',
      options: {
        list: [
          { title: 'Instagram', value: 'instagram' },
          { title: 'X (Twitter)', value: 'x' },
          { title: 'Facebook', value: 'facebook' },
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'YouTube', value: 'youtube' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'url',
      title: 'Profile URL',
      type: 'url',
      validation: (r) => r.required().uri({ scheme: ['http', 'https'] }),
    }),
  ],
  preview: { select: { title: 'platform', subtitle: 'url' } },
})

export const footerColumn = defineType({
  name: 'footerColumn',
  title: 'Footer column',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Uppercase. The reference build uses Platform / Events / Company.',
      validation: (r) => r.required().max(24),
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [defineArrayMember({ type: 'navLink' })],
    }),
  ],
  preview: {
    select: { title: 'heading', links: 'links' },
    prepare: ({ title, links }) => ({ title, subtitle: `${(links || []).length} link(s)` }),
  },
})
