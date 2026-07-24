import { defineType, defineField } from 'sanity'

/**
 * HOW TO WIN AT [EVENT]  ->  .play (3-motion grid)
 *
 * The three motions are FIXED — Speed → Commitment → Pipeline is the narrative
 * spine of the whole site, and the card colours are locked to the motion
 * (01 purple · 02 orange · 03 green). Only the copy changes per show.
 *
 * The headline pattern stays consistent across every event page; the body is
 * where you name this show's specifics (exhibitor count, hall dead zones,
 * how soon the morning-after report lands relative to the close).
 */

export const playbookMotion = defineType({
  name: 'playbookMotion',
  title: 'Motion',
  type: 'object',
  fields: [
    defineField({
      name: 'h',
      title: 'Card headline',
      type: 'string',
      description: 'Archivo 20px, 1–2 lines. Keep the pattern consistent across event pages.',
      validation: (r) => r.required().max(110),
    }),
    defineField({
      name: 'b',
      title: 'Card body',
      type: 'text',
      rows: 4,
      description:
        '50–80 words, event-specific. Name a real detail of THIS show — the exhibitor count, the hall with no signal, the flight home on day three.',
      validation: (r) => r.required().max(420),
    }),
  ],
  preview: { select: { title: 'h', subtitle: 'b' } },
})

export const playbookBlock = defineType({
  name: 'playbookBlock',
  title: 'Playbook',
  type: 'object',
  fields: [
    defineField({
      name: 'pre',
      title: 'Motion 01 — Pre-event · target list',
      type: 'playbookMotion',
      description: 'Purple card. Speed: land with a ranked list instead of a blank scanner.',
    }),
    defineField({
      name: 'floor',
      title: 'Motion 02 — On the floor · capture + book',
      type: 'playbookMotion',
      description: 'Orange card. Commitment: voice in, CRM record out, meeting booked at the booth.',
    }),
    defineField({
      name: 'post',
      title: 'Motion 03 — Post-event · LTM + attribution',
      type: 'playbookMotion',
      description: 'Green card. Pipeline: the morning-after report that survives the QBR.',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'How to win at this event (3 motions)' }),
  },
})
