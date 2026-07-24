import { defineType, defineField } from 'sanity'

/**
 * VENUE — a reusable document.
 *
 * Why a document and not two plain-text fields: Moscone, McCormick Place and
 * the Georgia World Congress Center each host several shows on the roadmap.
 * Typing the address once means every Event JSON-LD block carries a complete,
 * consistent `location` — which is what makes the "where is [event] held"
 * query answerable — and it opens a future /venues hub without a migration.
 */
export const venue = defineType({
  name: 'venue',
  title: 'Venue',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Venue name',
      type: 'string',
      description: 'Exactly as the organiser writes it. e.g. "Moscone Center", "Music City Center".',
      validation: (r) => r.required().max(80),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'city',
      title: 'City, State',
      type: 'string',
      description:
        'Rendered in the hero meta row next to the venue name. Format: "San Francisco, CA".',
      validation: (r) => r.required().max(48),
    }),
    defineField({
      name: 'streetAddress',
      title: 'Street address',
      type: 'string',
      description: 'Not rendered on the page — feeds the Event JSON-LD `location.address`.',
    }),
    defineField({
      name: 'postalCode',
      title: 'Postal code',
      type: 'string',
      description: 'Not rendered — JSON-LD only.',
    }),
    defineField({
      name: 'country',
      title: 'Country code',
      type: 'string',
      description: 'ISO two-letter. Not rendered — JSON-LD only.',
      initialValue: 'US',
      validation: (r) => r.max(2),
    }),
    defineField({
      name: 'geo',
      title: 'Coordinates',
      type: 'geopoint',
      description: 'Optional. Adds `geo` to the JSON-LD place.',
    }),
    defineField({
      name: 'website',
      title: 'Venue website',
      type: 'url',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'city' },
  },
})
