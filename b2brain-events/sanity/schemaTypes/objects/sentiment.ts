import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * WHAT PEOPLE SAY  ->  .videos / .reddit / .tstml
 *
 * Three stacked blocks, each independently optional:
 *   videos[]       — 3-up cards with a black play square
 *   reddit[]       — 3-up green-topped quote cards
 *   testimonials[] — 2-up Archivo quote cards from past exhibitors
 * All three empty removes the section and its "Reviews" TOC link.
 *
 * This is the section the event's own website will never publish, and it is a
 * large part of why these pages get cited by AI answer engines.
 */

export const videoReview = defineType({
  name: 'videoReview',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Video title',
      type: 'string',
      description: 'As published. e.g. "What Dreamforce is actually like as an exhibitor".',
      validation: (r) => r.required().max(90),
    }),
    defineField({
      name: 'src',
      title: 'Source line',
      type: 'string',
      description: 'Small grey credit under the title. e.g. "YouTube · Salesforce".',
      validation: (r) => r.required().max(48),
    }),
    defineField({
      name: 'url',
      title: 'Link (optional)',
      type: 'url',
      description:
        'Makes the card clickable. Leave blank and the card renders exactly as in the reference build — a static thumb with the play mark.',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail (optional)',
      type: 'image',
      options: { hotspot: true },
      description: '16:9. Without one the card shows the grey placeholder with the play square.',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'src', media: 'thumbnail' } },
})

export const redditReview = defineType({
  name: 'redditReview',
  title: 'Reddit quote',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 3,
      description:
        'Quote verbatim, trimmed for length only. Quotation marks are added by the template. Do not paraphrase — the credibility is in the raw voice.',
      validation: (r) => r.required().max(300),
    }),
    defineField({
      name: 'sub',
      title: 'Subreddit',
      type: 'string',
      description: 'e.g. "r/salesforce".',
      validation: (r) => r.required().max(30),
    }),
    defineField({
      name: 'tone',
      title: 'Tone',
      type: 'string',
      description:
        'Drives the chip colour. Publish at least one Mixed quote per page — an all-positive review block reads as marketing and gets discounted.',
      options: {
        list: [
          { title: 'Positive', value: 'Positive' },
          { title: 'Mixed', value: 'Mixed' },
        ],
        layout: 'radio',
      },
      initialValue: 'Positive',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'url',
      title: 'Permalink (optional)',
      type: 'url',
      description: 'Kept for your own sourcing trail. Not rendered.',
    }),
  ],
  preview: { select: { title: 'quote', subtitle: 'sub' } },
})

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Exhibitor testimonial',
  type: 'object',
  fields: [
    defineField({
      name: 'q',
      title: 'Quote',
      type: 'text',
      rows: 3,
      description:
        'From a B2Brain customer who exhibited. Pair a number with a comparison where you can. Quotation marks are added by the template.',
      validation: (r) => r.required().max(280),
    }),
    defineField({
      name: 'a',
      title: 'Attribution',
      type: 'string',
      description: 'Rendered uppercase. e.g. "VP Marketing · supply-chain SaaS".',
      validation: (r) => r.required().max(60),
    }),
  ],
  preview: { select: { title: 'q', subtitle: 'a' } },
})

export const sentimentBlock = defineType({
  name: 'sentimentBlock',
  title: 'What people say',
  type: 'object',
  fields: [
    defineField({
      name: 'videos',
      title: 'Video — previous editions',
      type: 'array',
      of: [defineArrayMember({ type: 'videoReview' })],
      description: 'Three fills the row.',
    }),
    defineField({
      name: 'reddit',
      title: 'What people say on Reddit',
      type: 'array',
      of: [defineArrayMember({ type: 'redditReview' })],
      description: 'Three fills the row. Mix the tone.',
    }),
    defineField({
      name: 'testimonials',
      title: 'From past exhibitors',
      type: 'array',
      of: [defineArrayMember({ type: 'testimonial' })],
      description: 'Two fills the row.',
    }),
  ],
  preview: {
    select: { v: 'videos', r: 'reddit', t: 'testimonials' },
    prepare: ({ v, r, t }) => ({
      title: 'What people say',
      subtitle: `${(v || []).length} video · ${(r || []).length} reddit · ${(t || []).length} testimonial`,
    }),
  },
})
