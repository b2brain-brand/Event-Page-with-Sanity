import { defineType, defineField } from 'sanity'

/**
 * AT-A-GLANCE STAT CELL  ->  .glance__cell
 *
 * The grid is 4 columns at desktop, 2 at 991px, 1 at 640px. Ship 2 or 4 —
 * three cells leaves a visual hole in the 2-up breakpoint.
 * A cell with an empty number is dropped by the renderer (mStats filters on `num`).
 */
export const statCell = defineType({
  name: 'statCell',
  title: 'Stat',
  type: 'object',
  fields: [
    defineField({
      name: 'num',
      title: 'Number',
      type: 'string',
      description:
        'Kept as text so you can write "170K+", "1,600+", "3 days". Archivo 44px. Required — an empty number hides the whole cell.',
      validation: (r) => r.required().max(12),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Uppercase caption under the number. e.g. "Attendees", "Exhibitors", "Sessions", "Show floor".',
      validation: (r) => r.required().max(24),
    }),
    defineField({
      name: 'meta',
      title: 'Qualifier',
      type: 'string',
      description:
        'One short line of context under the label. e.g. "customers, partners, admins". Optional — the line disappears when blank.',
      validation: (r) => r.max(46),
    }),
  ],
  preview: {
    select: { title: 'num', subtitle: 'label' },
    prepare: ({ title, subtitle }) => ({ title: `${title} — ${subtitle}` }),
  },
})
