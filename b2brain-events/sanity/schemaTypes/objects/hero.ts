import { defineType, defineField } from 'sanity'

/**
 * HERO VIDEO  ->  the right-hand column of the hero
 *
 * Replaces the old "operator card" (the stat panel). Every event page now leads
 * with footage of the actual show, which does two things the stat card could
 * not: it proves the event is real to someone who has never been, and it gives
 * the page a media asset worth linking to.
 *
 * Optional. Leave the whole object empty and the hero collapses to a single
 * full-width column — same graceful degradation as everything else here.
 *
 * Playback has two modes, controlled by "Open on YouTube instead of playing
 * inline":
 *   OFF (default) — click loads the embedded player in place. Nothing from
 *                   YouTube is requested until the click, so the page stays
 *                   fast and sets no third-party cookies on load.
 *   ON            — click opens YouTube in a new tab. Use when the video is
 *                   age-gated or embedding is disabled by the uploader.
 */
export const heroVideo = defineType({
  name: 'heroVideo',
  title: 'Hero video',
  type: 'object',
  description:
    'Footage from a previous edition, shown beside the H1. Leave empty for a full-width hero.',
  fields: [
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      description:
        'Paste any YouTube link — watch?v=…, youtu.be/…, /embed/… or /shorts/… all work.',
      validation: (r) =>
        r
          .required()
          .uri({ scheme: ['http', 'https'] })
          .custom((value) => {
            if (!value) return true
            const ok =
              /(?:youtube\.com\/(?:watch\?[^#]*v=|embed\/|shorts\/|live\/)|youtu\.be\/)[\w-]{11}/.test(
                value,
              )
            return ok || 'That does not look like a YouTube video link.'
          }),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Custom thumbnail',
      type: 'image',
      options: { hotspot: true },
      description:
        'Optional. 16:9, min 1280px wide. Leave empty and YouTube\'s own thumbnail is used automatically.',
    }),
    defineField({
      name: 'alt',
      title: 'Thumbnail alt text',
      type: 'string',
      description: 'Describes the still for screen readers. Falls back to the caption.',
      validation: (r) => r.max(125),
    }),
    defineField({
      name: 'label',
      title: 'Card eyebrow',
      type: 'string',
      description:
        'Small uppercase label above the video, rendered with a leading asterisk. e.g. "FROM DREAMFORCE 2025".',
      validation: (r) => r.max(48),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description:
        'One line under the video. e.g. "Opening keynote — the Agentforce era". Keep it under ~70 chars.',
      validation: (r) => r.max(90),
    }),
    defineField({
      name: 'openOnYouTube',
      title: 'Open on YouTube instead of playing inline',
      type: 'boolean',
      description:
        'Off (recommended): the player loads in place on click. On: the click opens YouTube in a new tab — use this if the uploader has disabled embedding.',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'caption', subtitle: 'youtubeUrl', media: 'thumbnail' },
    prepare: ({ title, subtitle, media }) => ({
      title: title || 'Hero video',
      subtitle,
      media,
    }),
  },
})
