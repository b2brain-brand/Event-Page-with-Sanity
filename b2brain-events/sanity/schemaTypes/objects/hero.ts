import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * HERO OPERATOR VISUAL CARD  ->  .hero__visual / .hero__card in preview-v2.html
 *
 * Optional. When it is absent the hero collapses from a 2-column grid to a
 * single full-width column — exactly what `mHero()` does when `heroCard` is null.
 * (See the SMTS sample event in the reference file.)
 */

export const heroCardRow = defineType({
  name: 'heroCardRow',
  title: 'Card row',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Row label',
      type: 'string',
      description: 'Left-hand text. e.g. "Day 1 booth scans", "Meetings booked on-floor".',
      validation: (r) => r.required().max(40),
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      description: 'Right-hand value. e.g. "248", "18", "3.2 hr".',
      validation: (r) => r.required().max(16),
    }),
    defineField({
      name: 'tag',
      title: 'Value style',
      type: 'string',
      description:
        'Plain = Archivo number. Booked = green chip. Fast = orange chip. Matches the third slot of the `rows` tuple in the reference build.',
      options: {
        list: [
          { title: 'Plain number', value: 'none' },
          { title: 'Green chip (booked)', value: 'booked' },
          { title: 'Orange chip (fast)', value: 'fast' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'value' },
  },
})

export const heroCard = defineType({
  name: 'heroCard',
  title: 'Hero operator card',
  type: 'object',
  description:
    'The orange-tinted proof card on the right of the hero. Leave the whole object empty and the hero renders full-width instead — no empty box.',
  fields: [
    defineField({
      name: 'label',
      title: 'Card eyebrow',
      type: 'string',
      description:
        'Small uppercase label, rendered with a leading asterisk. e.g. "Booth floor · illustrative". Say "illustrative" whenever the numbers are modelled rather than sourced.',
      validation: (r) => r.required().max(48),
    }),
    defineField({
      name: 'big',
      title: 'Card headline',
      type: 'text',
      rows: 3,
      description:
        'Archivo 22px claim. Pair every number with a comparison (house voice rule). 90–140 chars.',
      validation: (r) => r.required().max(180),
    }),
    defineField({
      name: 'rows',
      title: 'Card rows',
      type: 'array',
      of: [defineArrayMember({ type: 'heroCardRow' })],
      description: '2–4 rows. The reference build ships 3.',
      validation: (r) => r.max(4),
    }),
  ],
  preview: {
    select: { title: 'big', subtitle: 'label' },
  },
})
