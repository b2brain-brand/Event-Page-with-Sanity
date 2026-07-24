import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * AGENDA & SESSIONS  ->  .tabs / .agenda__panel / .tracks
 *
 * Two independent halves:
 *  - days[]   -> the tabbed schedule
 *  - tracks[] -> the row of bordered track chips
 * Either one alone renders the section. With tracks but no days the template
 * shows the "schedule is being confirmed" sub-line automatically. With neither,
 * the section is removed.
 */

export const agendaSession = defineType({
  name: 'agendaSession',
  title: 'Session',
  type: 'object',
  fields: [
    defineField({
      name: 'time',
      title: 'Time',
      type: 'string',
      description: 'As printed by the organiser. e.g. "9:00 AM". Rendered in Archivo.',
      validation: (r) => r.required().max(12),
    }),
    defineField({
      name: 'title',
      title: 'Session title',
      type: 'string',
      description: 'Use the organiser\'s exact session name — this is what people search for.',
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: 'loc',
      title: 'Room / location',
      type: 'string',
      description: 'e.g. "Moscone North · Hall D". Optional.',
      validation: (r) => r.max(60),
    }),
    defineField({
      name: 'track',
      title: 'Track',
      type: 'string',
      description:
        'Shown as a bordered chip on the right of the row. Should match one of the track names below.',
      validation: (r) => r.max(30),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'time', track: 'track' },
    prepare: ({ title, subtitle, track }) => ({
      title,
      subtitle: [subtitle, track].filter(Boolean).join(' · '),
    }),
  },
})

export const agendaDay = defineType({
  name: 'agendaDay',
  title: 'Day',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Tab label',
      type: 'string',
      description: 'e.g. "Day 1". Large text in the tab.',
      validation: (r) => r.required().max(20),
    }),
    defineField({
      name: 'meta',
      title: 'Tab sub-label',
      type: 'string',
      description: 'Small text under the tab label. e.g. "Tue · Sep 15".',
      validation: (r) => r.max(24),
    }),
    defineField({
      name: 'items',
      title: 'Sessions',
      type: 'array',
      of: [defineArrayMember({ type: 'agendaSession' })],
      description:
        'The 3–6 sessions worth blocking time for — not the whole programme. A day with zero sessions still renders its tab, so delete empty days.',
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'meta', items: 'items' },
    prepare: ({ title, subtitle, items }) => ({
      title,
      subtitle: `${subtitle || ''} — ${(items || []).length} session(s)`,
    }),
  },
})

export const agendaBlock = defineType({
  name: 'agendaBlock',
  title: 'Agenda',
  type: 'object',
  fields: [
    defineField({
      name: 'tracks',
      title: 'Tracks',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      description:
        'Programme tracks as bordered chips. Fill these first — they are cheap to source and keep the section alive before the full schedule is published.',
    }),
    defineField({
      name: 'days',
      title: 'Days',
      type: 'array',
      of: [defineArrayMember({ type: 'agendaDay' })],
      description: 'One entry per show day. Renders the tab strip + panels.',
    }),
  ],
  preview: {
    select: { days: 'days', tracks: 'tracks' },
    prepare: ({ days, tracks }) => ({
      title: 'Agenda',
      subtitle: `${(days || []).length} day(s) · ${(tracks || []).length} track(s)`,
    }),
  },
})
