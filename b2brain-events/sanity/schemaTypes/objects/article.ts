import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * EVENT ARTICLE — the editorial "blog" body for a landing page, before the FAQ.
 *
 * Portable Text, so an editor writes long-form content (H2/H3 sections,
 * paragraphs with bold lead-ins, lists, quotes, callouts) exactly like a blog.
 * The renderer builds a sticky "On this page" table of contents from the H2/H3
 * headings — the same layout the live site uses.
 *
 * Supported block styles: Normal, H2, H3, H4, Quote. Marks: bold, italic, links.
 * Plus a "Key takeaways" object for the highlighted TL;DR box.
 */
export const article = defineType({
  name: 'article',
  title: 'Event article',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Heading 4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (r) =>
                  r.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
              }),
            ],
          },
        ],
      },
    }),

    // A highlighted TL;DR / key-takeaways box (the purple panel on the live page).
    defineArrayMember({
      type: 'object',
      name: 'keyTakeaways',
      title: 'Key takeaways box',
      fields: [
        defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string', initialValue: 'KEY TAKEAWAYS' }),
        defineField({ name: 'heading', title: 'Heading', type: 'string', description: 'e.g. "Dreamforce 2026 TL;DR".' }),
        defineField({
          name: 'points',
          title: 'Points',
          type: 'array',
          of: [defineArrayMember({ type: 'text', rows: 2 })],
          description: 'One line per takeaway. Structured for AI-answer citation.',
        }),
      ],
      preview: {
        select: { title: 'heading', points: 'points' },
        prepare: ({ title, points }) => ({
          title: title || 'Key takeaways',
          subtitle: `${(points || []).length} point(s)`,
        }),
      },
    }),

    // Inline image with a caption.
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
        defineField({ name: 'caption', title: 'Caption', type: 'string' }),
      ],
    }),
  ],
})
