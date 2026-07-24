import React from 'react'
import { defineType, defineField, defineArrayMember } from 'sanity'
import { YouTubeThumb } from '../../components/YouTubeThumb'

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
  description: 'Paste a YouTube link. The thumbnail appears automatically — nothing to upload.',
  fields: [
    defineField({
      name: 'url',
      title: 'YouTube URL',
      type: 'url',
      description:
        'Any YouTube link works — watch?v=…, youtu.be/…, /shorts/…. The thumbnail is fetched from YouTube automatically. Leave blank and the card shows the grey placeholder.',
      validation: (r) =>
        r.uri({ scheme: ['http', 'https'] }).custom((value) => {
          if (!value) return true
          const ok =
            /(?:youtube\.com\/(?:watch\?[^#]*v=|embed\/|shorts\/|live\/)|youtu\.be\/)[\w-]{11}/.test(
              value,
            )
          return ok || 'That does not look like a YouTube video link.'
        }),
    }),
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
      name: 'openOnYouTube',
      title: 'Open on YouTube instead of playing inline',
      type: 'boolean',
      description:
        'Off (recommended): the player loads in place on click. On: the click opens YouTube in a new tab.',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'src', url: 'url' },
    prepare: ({ title, subtitle, url }) => ({
      title,
      subtitle,
      media: React.createElement(YouTubeThumb, { url }),
    }),
  },
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
