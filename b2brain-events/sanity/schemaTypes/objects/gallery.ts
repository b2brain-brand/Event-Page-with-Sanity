import { defineType, defineField } from 'sanity'

/**
 * GALLERY SLIDE  ->  .slide
 *
 * The slider adapts to however many images exist — 1, 3 or 5. With a single
 * image the arrows and dots are not rendered. With zero images the entire
 * "From the floor" section (and its TOC entry) disappears.
 */
export const galleryItem = defineType({
  name: 'galleryItem',
  title: 'Photo',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      description:
        'Shot from the previous edition. 16:8 crop, min 1600px wide. If you leave this empty the slide renders the grey "drop image here" placeholder from the reference build.',
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description:
        'Describe the photo for screen readers and image search. Falls back to the caption when blank.',
      validation: (r) => r.max(125),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description:
        'White caption bar, bottom-left of the slide. e.g. "Expo floor, Moscone South". Keep under ~48 chars so it stays on one line.',
      validation: (r) => r.max(64),
    }),
    defineField({
      name: 'accent',
      title: 'Accent (reserved)',
      type: 'string',
      description:
        'Carried over from the reference data model for future per-slide tinting. Not rendered today — safe to ignore.',
      options: {
        list: [
          { title: 'Purple', value: 'purple' },
          { title: 'Orange', value: 'orange' },
          { title: 'Green', value: 'green' },
          { title: 'Yellow', value: 'yellow' },
          { title: 'Pink', value: 'pink' },
        ],
      },
      initialValue: 'purple',
    }),
  ],
  preview: {
    select: { title: 'caption', media: 'image' },
    prepare: ({ title, media }) => ({ title: title || 'Untitled photo', media }),
  },
})
