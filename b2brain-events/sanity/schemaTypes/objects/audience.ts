import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * WHO ATTENDS  ->  .aud__grid
 *
 * Left column  = title-mix bars (purple fill)
 * Right column = industry chips + the purple "Is your buyer here?" card
 * If only one column has data the grid collapses to a single bordered box
 * rather than leaving a dead half — that is the behaviour in mAudience().
 */

export const titleMixRow = defineType({
  name: 'titleMixRow',
  title: 'Title mix row',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Job family',
      type: 'string',
      description: 'e.g. "RevOps / Sales Ops", "IT / Platform owners", "C-suite / VP".',
      validation: (r) => r.required().max(36),
    }),
    defineField({
      name: 'pct',
      title: 'Share of attendees (%)',
      type: 'number',
      description:
        'Whole number. Drives the bar width, so the set should total roughly 100. Cite the source in Page meta → Sources.',
      validation: (r) => r.required().min(0).max(100),
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'pct' },
    prepare: ({ title, subtitle }) => ({ title, subtitle: `${subtitle}%` }),
  },
})

export const audienceBlock = defineType({
  name: 'audienceBlock',
  title: 'Who attends',
  type: 'object',
  fields: [
    defineField({
      name: 'titleMix',
      title: 'Attendee title mix',
      type: 'array',
      of: [defineArrayMember({ type: 'titleMixRow' })],
      description: '4–5 rows. Ordered highest share first.',
      validation: (r) => r.max(6),
    }),
    defineField({
      name: 'industries',
      title: 'Industries on the floor',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      description: 'Bordered chips. 4–6 reads best.',
    }),
    defineField({
      name: 'match',
      title: 'Is your buyer here?',
      type: 'text',
      rows: 4,
      description:
        'The qualifying paragraph in the purple card. Say who this show IS for and — the part that builds trust — who it is NOT for. 2 sentences.',
      validation: (r) => r.max(420),
    }),
  ],
  preview: {
    select: { rows: 'titleMix' },
    prepare: ({ rows }) => ({
      title: 'Who attends',
      subtitle: `${(rows || []).length} title row(s)`,
    }),
  },
})
