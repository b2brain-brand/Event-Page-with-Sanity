import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * WHY IT MATTERS  ->  .why__grid / .pullquote
 *
 * With a pullquote the section is a 1.3fr / 1fr split. Without one the body
 * runs full-width at max 760px. Drop both headline and body and the section
 * (plus its TOC link) is removed.
 */

export const pullquote = defineType({
  name: 'pullquote',
  title: 'Customer pullquote',
  type: 'object',
  description:
    'Purple-edged quote card. House rule: pair a before number with an after number (e.g. 540 leads / 8 meetings).',
  fields: [
    defineField({
      name: 'text',
      title: 'Quote',
      type: 'text',
      rows: 4,
      description: 'Quotation marks are added by the template — do not type them. 200–280 chars.',
      validation: (r) => r.max(320),
    }),
    defineField({
      name: 'attr',
      title: 'Attribution',
      type: 'string',
      description:
        'Role + company shape, no names unless approved. e.g. "Director of Field Marketing · mid-market manufacturing SaaS". Rendered uppercase.',
      validation: (r) => r.max(80),
    }),
  ],
  preview: { select: { title: 'text', subtitle: 'attr' } },
})

export const whyBlock = defineType({
  name: 'whyBlock',
  title: 'Why it matters',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Section headline',
      type: 'text',
      rows: 3,
      description:
        'The H2. A claim about pipeline density at this specific show, not a generic statement. e.g. "Roughly a third of the Salesforce-adjacent SaaS pipeline for the coming year gets sourced in this one week."',
      validation: (r) => r.max(180),
    }),
    defineField({
      name: 'body',
      title: 'Body paragraphs',
      type: 'array',
      of: [defineArrayMember({ type: 'text' })],
      description:
        'One entry per paragraph — the reference build ships two. Operator-to-operator voice, 400–600 chars total. Avoid: seamless, effortless, leverage, unlock, empower, supercharge, ecosystem, touchpoints.',
      validation: (r) => r.max(4),
    }),
    defineField({
      name: 'pullquote',
      title: 'Pullquote',
      type: 'pullquote',
      description: 'Optional. Leave blank and the body goes full-width.',
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare: ({ title }) => ({ title: title || 'Why it matters' }),
  },
})
