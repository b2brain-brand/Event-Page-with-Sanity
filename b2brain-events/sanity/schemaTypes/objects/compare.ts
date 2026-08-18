import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * B2BRAIN VS THE BADGE SCANNER  ->  .cmp (3-column comparison table)
 *
 * New in Template V2 (2026-07-22). Sits between Reviews and the Playbook: after
 * the social proof, before the "how to win" pitch, this is the row-by-row case
 * for why the event's own lead-retrieval tool is not enough on its own.
 *
 * Column headers are per-event on purpose — "Dreamforce badge scanner" reads
 * better than a generic "Their tool", and it is the show's OWN lead-retrieval
 * product being compared, not a straw man.
 */
export const compareRow = defineType({
  name: 'compareRow',
  title: 'Row',
  type: 'object',
  fields: [
    defineField({
      name: 'cap',
      title: 'Capability',
      type: 'string',
      description: 'Left column. e.g. "Lead capture", "Conversation context", "CRM sync".',
      validation: (r) => r.required().max(40),
    }),
    defineField({
      name: 'scanner',
      title: "The event's own tool",
      type: 'string',
      description: 'What the show\'s badge scanner / lead-retrieval product actually does here. Be accurate — this is a real comparison, not a strawman.',
      validation: (r) => r.required().max(140),
    }),
    defineField({
      name: 'us',
      title: 'B2Brain',
      type: 'string',
      validation: (r) => r.required().max(140),
    }),
  ],
  preview: { select: { title: 'cap', subtitle: 'us' } },
})

export const compareBlock = defineType({
  name: 'compareBlock',
  title: 'B2Brain vs the badge scanner',
  type: 'object',
  fields: [
    defineField({
      name: 'intro',
      title: 'Intro paragraph',
      type: 'text',
      rows: 3,
      description: 'What the event\'s own tool captures, and what it leaves on the table. 1–2 sentences.',
      validation: (r) => r.max(400),
    }),
    defineField({
      name: 'colScanner',
      title: 'Column header — their tool',
      type: 'string',
      description: 'e.g. "Dreamforce badge scanner". Falls back to "On your own" if left blank.',
      validation: (r) => r.max(40),
    }),
    defineField({
      name: 'colUs',
      title: 'Column header — B2Brain',
      type: 'string',
      description: 'Falls back to "B2Brain" if left blank.',
      validation: (r) => r.max(40),
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [defineArrayMember({ type: 'compareRow' })],
      description: 'The reference build ships 6. Zero rows removes the section.',
    }),
  ],
  preview: {
    select: { rows: 'rows' },
    prepare: ({ rows }) => ({
      title: 'B2Brain vs the badge scanner',
      subtitle: `${(rows || []).length} row(s)`,
    }),
  },
})
