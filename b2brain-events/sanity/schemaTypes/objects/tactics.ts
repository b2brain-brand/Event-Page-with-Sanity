import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * BEYOND THE BOOTH  ->  .tact (5-card strip)
 *
 * New in Template V2 (2026-07-22). Sits right after Cost & ROI: the booth is
 * one venue, and a real share of the conversations that turn into pipeline
 * happen off the show floor — receptions, partner parties, exec dinners. This
 * is where the page says so and tells a rep where to be and when.
 *
 * Card count is not fixed at 3 or 5 like the other grids — ship however many
 * off-floor moments are real for this show. Zero items removes the section.
 */
export const tacticsMoment = defineType({
  name: 'tacticsMoment',
  title: 'Moment',
  type: 'object',
  fields: [
    defineField({
      name: 'when',
      title: 'When',
      type: 'string',
      description: 'Small orange label. e.g. "Day 1 · eve", "Nightly", "By invite", "Floor hours".',
      validation: (r) => r.max(24),
    }),
    defineField({
      name: 'name',
      title: 'Moment name',
      type: 'string',
      description: 'e.g. "Opening reception", "Partner & customer parties".',
      validation: (r) => r.required().max(60),
    }),
    defineField({
      name: 'desc',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'What it is and why a rep should be there. 1–2 sentences.',
      validation: (r) => r.required().max(240),
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'when' } },
})

export const tacticsBlock = defineType({
  name: 'tacticsBlock',
  title: 'Beyond the booth',
  type: 'object',
  fields: [
    defineField({
      name: 'intro',
      title: 'Intro paragraph',
      type: 'text',
      rows: 3,
      description: 'The case for looking past the booth itself. 1–2 sentences.',
      validation: (r) => r.max(400),
    }),
    defineField({
      name: 'items',
      title: 'Moments',
      type: 'array',
      of: [defineArrayMember({ type: 'tacticsMoment' })],
      description: 'The reference build ships 5 — one row on desktop. Fewer is fine; the grid reflows.',
    }),
    defineField({
      name: 'foot',
      title: 'Footnote',
      type: 'string',
      description: 'Small grey line under the grid, e.g. a caveat that the line-up is confirmed closer to the show.',
      validation: (r) => r.max(160),
    }),
  ],
  preview: {
    select: { items: 'items' },
    prepare: ({ items }) => ({
      title: 'Beyond the booth',
      subtitle: `${(items || []).length} moment(s)`,
    }),
  },
})
