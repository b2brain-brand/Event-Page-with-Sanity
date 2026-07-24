import React from 'react'
import { defineType, defineField } from 'sanity'
import { YouTubeThumb } from '../../components/YouTubeThumb'

/**
 * HERO VIDEO  ->  the right-hand column of the hero
 *
 * Replaces the old "operator card" (the stat panel). Every event page now leads
 * with footage of the actual show: it proves the event is real to someone who
 * has never been, and gives the page a media asset worth linking to.
 *
 * PASTE A URL, THAT IS THE WHOLE JOB. The thumbnail is pulled from YouTube
 * automatically — there is deliberately no image to upload. One field can go
 * stale or mismatch the video; a derived one cannot.
 *
 * Optional overall. Leave the object empty and the hero collapses to a single
 * full-width column, like every other module here.
 *
 * Playback, via "Open on YouTube instead of playing inline":
 *   OFF (default) — click loads the embedded player in place. Nothing is
 *                   requested from YouTube until that click, so the hero costs
 *                   nothing on first paint and sets no third-party cookies.
 *   ON            — click opens YouTube in a new tab. Use when the uploader has
 *                   disabled embedding.
 */
export const heroVideo = defineType({
  name: 'heroVideo',
  title: 'Hero video',
  type: 'object',
  description:
    'Paste a YouTube link. The thumbnail appears automatically — nothing to upload.',
  fields: [
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      description:
        'Any YouTube link works — watch?v=…, youtu.be/…, /embed/…, /shorts/…. The thumbnail is fetched from YouTube automatically once you save.',
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
        'One line under the video — the only text describing it to a crawler, so make it count. e.g. "Opening keynote — the Agentforce era".',
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
    select: { url: 'youtubeUrl', caption: 'caption', label: 'label' },
    prepare: ({ url, caption, label }) => ({
      title: caption || label || 'Hero video',
      subtitle: url,
      // Live thumbnail from the pasted URL — confirms it resolved.
      media: React.createElement(YouTubeThumb, { url }),
    }),
  },
})
