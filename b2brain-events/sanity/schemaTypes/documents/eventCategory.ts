import { defineType, defineField } from 'sanity'

/**
 * EVENT CATEGORY — the vertical taxonomy.
 *
 * Does three jobs:
 *  1. Filters the /events index.
 *  2. Powers the auto-fill for "Similar events" when an editor has not hand-picked
 *     three (same category, still upcoming, not this event).
 *  3. Gives the footer's Events column (Manufacturing / Supply chain / Technology)
 *     real destinations instead of dead links.
 */
export const eventCategory = defineType({
  name: 'eventCategory',
  title: 'Event category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "Manufacturing", "Supply chain", "Technology", "Retail / CPG".',
      validation: (r) => r.required().max(40),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'One or two sentences. Used on the category index page.',
      validation: (r) => r.max(300),
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
})
