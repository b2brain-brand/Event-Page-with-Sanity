import { defineType, defineField } from 'sanity'

/**
 * FAQ  ->  .faq__list  +  FAQPage JSON-LD
 *
 * Every Q/A pair here is emitted twice: once as the visible accordion, once as
 * schema.org FAQPage structured data in the page head. That is what makes these
 * pages eligible for Google rich results and quotable by answer engines.
 *
 * Rules that matter for that second use:
 *  - Answers must be SELF-CONTAINED. "See above" is worthless to a crawler.
 *  - Answer the question in the first sentence, then add context.
 *  - Restate the event name and year in the first answer.
 */
export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({
      name: 'q',
      title: 'Question',
      type: 'string',
      description:
        'Phrase it the way a buyer types it, not the way marketing writes it. The five that earn their place on every event page: When and where is [event]? · Who attends? · How much does it cost to exhibit? · Does it provide lead retrieval? · How should an exhibitor prepare?',
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: 'a',
      title: 'Answer',
      type: 'text',
      rows: 4,
      description:
        '1–3 sentences, self-contained, answer first. 160–320 chars is the sweet spot for citation.',
      validation: (r) => r.required().max(600),
    }),
  ],
  preview: { select: { title: 'q', subtitle: 'a' } },
})
