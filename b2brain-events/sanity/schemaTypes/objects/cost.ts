import { defineType, defineField } from 'sanity'

/**
 * COST & ROI  ->  .roi (interactive calculator)
 *
 * These seven numbers are the calculator's STARTING values — the visitor can
 * change every one of them in the browser. Outputs are derived, never stored:
 *   conversations = reps × days × convosPerRepDay
 *   qualified     = conversations × qualRate%
 *   meetings      = qualified × meetingRate%
 *   pipeline      = meetings × acv
 *   return        = pipeline ÷ spend
 * The section only renders when this ROI object is present.
 */

export const roiInputs = defineType({
  name: 'roiInputs',
  title: 'ROI calculator defaults',
  type: 'object',
  options: { columns: 2 },
  fields: [
    defineField({
      name: 'spend',
      title: 'Booth investment ($)',
      type: 'number',
      description: 'All-in: space, build, travel, staff. Midpoint of the booth range above.',
      validation: (r) => r.required().min(0),
      initialValue: 90000,
    }),
    defineField({
      name: 'reps',
      title: 'Booth reps',
      type: 'number',
      validation: (r) => r.required().min(1).max(50),
      initialValue: 4,
    }),
    defineField({
      name: 'days',
      title: 'Show days',
      type: 'number',
      description: 'Should match the event date range.',
      validation: (r) => r.required().min(1).max(14),
      initialValue: 3,
    }),
    defineField({
      name: 'convosPerRepDay',
      title: 'Conversations / rep / day',
      type: 'number',
      description: 'Real booth conversations, not badge scans. 8–12 is the honest range.',
      validation: (r) => r.required().min(1).max(100),
      initialValue: 10,
    }),
    defineField({
      name: 'qualRate',
      title: 'Qualified rate (%)',
      type: 'number',
      description: 'Share of conversations that are actually ICP.',
      validation: (r) => r.required().min(0).max(100),
      initialValue: 50,
    }),
    defineField({
      name: 'meetingRate',
      title: 'Meeting rate — LTM (%)',
      type: 'number',
      description:
        'Leads-to-Meeting. This is the category metric. The output panel compares it against the industry average set in Site settings (~8% for badge-scanner-only teams).',
      validation: (r) => r.required().min(0).max(100),
      initialValue: 52,
    }),
    defineField({
      name: 'acv',
      title: 'Average ACV ($)',
      type: 'number',
      validation: (r) => r.required().min(0),
      initialValue: 40000,
    }),
  ],
})

export const costBlock = defineType({
  name: 'costBlock',
  title: 'Cost & ROI',
  type: 'object',
  fields: [
    defineField({
      name: 'boothRange',
      title: 'Booth cost paragraph',
      type: 'text',
      rows: 3,
      description:
        'Sits above the calculator. Give a real range and say what it excludes. e.g. "A 10x10 booth at Dreamforce lands around $18K–$45K before build, travel, and staff — a fully-loaded presence is commonly $80K–$150K." This is the paragraph that wins "how much does it cost to exhibit at [event]".',
      validation: (r) => r.max(400),
    }),
    defineField({
      name: 'roi',
      title: 'Calculator defaults',
      type: 'roiInputs',
      description: 'Remove this object to hide the entire Cost & ROI section.',
    }),
  ],
  preview: {
    select: { subtitle: 'boothRange' },
    prepare: ({ subtitle }) => ({ title: 'Cost & ROI', subtitle }),
  },
})
