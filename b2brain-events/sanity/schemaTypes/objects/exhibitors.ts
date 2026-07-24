import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * EXHIBITORS & SPONSORS  ->  .exh__tiers / .exh__notable
 *
 * Two independent halves: the tier table and the orange-edged "which booths to
 * map first" note. Either one alone renders the section; neither removes it.
 *
 * Sponsor names are plain text, not logos — brand rule 6 (operator visuals, not
 * a logo soup) and it keeps a new event page to minutes rather than an asset hunt.
 */

export const exhibitorTier = defineType({
  name: 'exhibitorTier',
  title: 'Tier',
  type: 'object',
  fields: [
    defineField({
      name: 'tier',
      title: 'Tier name',
      type: 'string',
      description:
        'Left column of the row, uppercase on whitesmoke. e.g. "Platinum", "Gold", "Startup alley".',
      validation: (r) => r.required().max(24),
    }),
    defineField({
      name: 'names',
      title: 'Exhibitors',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      description:
        'Company names, wrapped as bordered cells. 4–6 per tier reads best. A count is fine for the long tail ("18 vertical SaaS startups").',
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { title: 'tier', names: 'names' },
    prepare: ({ title, names }) => ({ title, subtitle: (names || []).join(', ') }),
  },
})

export const exhibitorsBlock = defineType({
  name: 'exhibitorsBlock',
  title: 'Exhibitors & sponsors',
  type: 'object',
  fields: [
    defineField({
      name: 'tiers',
      title: 'Sponsor tiers',
      type: 'array',
      of: [defineArrayMember({ type: 'exhibitorTier' })],
      description: 'Top to bottom, highest tier first.',
    }),
    defineField({
      name: 'notable',
      title: 'Which booths to map first',
      type: 'text',
      rows: 4,
      description:
        'The B2Brain point of view on the exhibitor list — which booths matter to a revenue team and why. 2–3 sentences. This is the paragraph AI answer engines quote for "who exhibits at [event]".',
      validation: (r) => r.max(500),
    }),
  ],
  preview: {
    select: { tiers: 'tiers' },
    prepare: ({ tiers }) => ({
      title: 'Exhibitors & sponsors',
      subtitle: `${(tiers || []).length} tier(s)`,
    }),
  },
})
