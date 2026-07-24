import { defineType, defineField } from 'sanity'

/**
 * EVENT SERIES — the show across years (Dreamforce, MODEX, Pack Expo…).
 *
 * Programmatic-SEO reason to exist: "Dreamforce 2026" and "Dreamforce 2027" are
 * separate pages competing for overlapping queries. Grouping them under a series
 * lets you (a) carry the organiser once, for the Event JSON-LD `organizer`,
 * and (b) point last year's page at this year's edition rather than letting an
 * outdated page keep the rankings.
 */
export const eventSeries = defineType({
  name: 'eventSeries',
  title: 'Event series',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Series name',
      type: 'string',
      description: 'The show without the year. e.g. "Dreamforce", "MODEX".',
      validation: (r) => r.required().max(60),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'organizerName',
      title: 'Organiser',
      type: 'string',
      description:
        'Who runs the show. e.g. "Salesforce", "MHI". Not rendered on the page — feeds Event JSON-LD `organizer`.',
    }),
    defineField({
      name: 'organizerUrl',
      title: 'Organiser URL',
      type: 'url',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (r) => r.max(300),
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'organizerName' } },
})
