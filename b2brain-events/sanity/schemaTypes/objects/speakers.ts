import { defineType, defineField } from 'sanity'

/**
 * SPEAKER  ->  .speaker
 *
 * 4-up grid at desktop, 2-up at 991px, 1-up at 640px. Ship in multiples of 4
 * where you can so the last row is not ragged. Zero speakers removes the section.
 *
 * Design note: the avatar square is INITIALS on a purple tint — the reference
 * build has no speaker photography (brand rule: no stock people). Initials are
 * derived from the name automatically if you leave the field blank.
 */
export const speaker = defineType({
  name: 'speaker',
  title: 'Speaker',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description:
        'As the organiser lists them. The reference build abbreviates first names ("M. Benioff") to keep the card on two lines.',
      validation: (r) => r.required().max(40),
    }),
    defineField({
      name: 'role',
      title: 'Role & company',
      type: 'string',
      description: 'e.g. "Chair & CEO, Salesforce". Wraps to two lines at 13px.',
      validation: (r) => r.required().max(60),
    }),
    defineField({
      name: 'initials',
      title: 'Avatar initials',
      type: 'string',
      description:
        'Optional override for the purple avatar square. Leave blank to derive from the name (e.g. "M. Benioff" → MB).',
      validation: (r) => r.max(3),
    }),
    defineField({
      name: 'keynote',
      title: 'Keynote speaker',
      type: 'boolean',
      description: 'Adds the purple KEYNOTE chip under the role.',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', keynote: 'keynote' },
    prepare: ({ title, subtitle, keynote }) => ({
      title: keynote ? `★ ${title}` : title,
      subtitle,
    }),
  },
})
