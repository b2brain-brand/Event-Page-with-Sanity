import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * LOGISTICS  ->  .log__grid / .passes
 *
 * Cells are a 2-column bordered grid; each cell is EITHER a paragraph OR a
 * bulleted list (the reference renderer prefers the list when both exist).
 * Ship an even number of cells so the grid closes cleanly.
 */

export const logisticsCell = defineType({
  name: 'logisticsCell',
  title: 'Logistics cell',
  type: 'object',
  fields: [
    defineField({
      name: 'h',
      title: 'Heading',
      type: 'string',
      description:
        'Prefixed with a yellow square in the design. The four in the reference build: "Getting there", "Where to stay", "On-site", "Lead retrieval".',
      validation: (r) => r.required().max(30),
    }),
    defineField({
      name: 'body',
      title: 'Paragraph',
      type: 'text',
      rows: 3,
      description: 'Use this OR the list below, not both. 1–3 sentences of hard logistics.',
      validation: (r) => r.max(400),
    }),
    defineField({
      name: 'list',
      title: 'List',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description:
        'Hairline-separated rows. Better than a paragraph for hotels, opening times, on-site facts. Takes precedence over the paragraph when both are filled.',
    }),
  ],
  preview: {
    select: { title: 'h', body: 'body', list: 'list' },
    prepare: ({ title, body, list }) => ({
      title,
      subtitle: (list || []).length ? `${list.length} item(s)` : body,
    }),
  },
})

export const passTier = defineType({
  name: 'passTier',
  title: 'Pass',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Pass name',
      type: 'string',
      description: 'e.g. "Full Conference Pass", "Expo+ Pass", "Partner Pass".',
      validation: (r) => r.required().max(40),
    }),
    defineField({
      name: 'note',
      title: 'What it includes',
      type: 'string',
      description: 'One short line. e.g. "All keynotes, sessions, expo".',
      validation: (r) => r.max(60),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      description:
        'Text, not a number — so "$1,999", "Varies", and "Free with code" all work. Rendered in Archivo.',
      validation: (r) => r.required().max(20),
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'price' },
  },
})

export const logisticsBlock = defineType({
  name: 'logisticsBlock',
  title: 'Logistics',
  type: 'object',
  fields: [
    defineField({
      name: 'cells',
      title: 'Cells',
      type: 'array',
      of: [defineArrayMember({ type: 'logisticsCell' })],
      description: 'Two or four. An odd number leaves a gap in the 2-column grid.',
    }),
    defineField({
      name: 'passes',
      title: 'Passes & pricing',
      type: 'array',
      of: [defineArrayMember({ type: 'passTier' })],
      description:
        'Optional price table under the cells. Cheapest-to-most-expensive or organiser order. Restate the "as of" date in Page meta → Last updated, since these change.',
    }),
  ],
  preview: {
    select: { cells: 'cells', passes: 'passes' },
    prepare: ({ cells, passes }) => ({
      title: 'Logistics',
      subtitle: `${(cells || []).length} cell(s) · ${(passes || []).length} pass(es)`,
    }),
  },
})
