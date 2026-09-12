import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { VideoJsonLd } from '../src/components/JsonLd'
import { YouTubeFacade } from '../src/components/YouTubeFacade'
import { getEventWatchVideos } from '../src/lib/event-videos'
import { resolveYouTubeMetadata } from '../src/lib/youtube'

const originalFetch = globalThis.fetch

test.afterEach(() => {
  globalThis.fetch = originalFetch
})

test('event videos get unique internal watch pages and exclude non-embeddable videos', () => {
  const videos = getEventWatchVideos({
    name: 'Example Expo 2026',
    slug: 'example-expo-2026',
    heroVideo: {
      youtubeUrl: 'https://www.youtube.com/watch?v=AAAAAAAAAAA',
      caption: 'Official event preview',
    },
    sentiment: {
      videos: [
        {
          url: 'https://youtu.be/AAAAAAAAAAA',
          title: 'Duplicate hero video',
        },
        {
          url: 'https://www.youtube.com/watch?v=BBBBBBBBBBB',
          title: 'Embedding disabled',
          openOnYouTube: true,
        },
        { url: 'not-a-video', title: 'Invalid URL' },
      ],
    },
  })

  assert.equal(videos.length, 1)
  assert.equal(videos[0].id, 'AAAAAAAAAAA')
  assert.equal(
    videos[0].watchPath,
    '/events/example-expo-2026/videos/AAAAAAAAAAA',
  )
  assert.equal(videos[0].embedUrl.includes('autoplay=0'), true)
})

test('event thumbnails expose the internal watch URL while clicks retain modal playback', () => {
  const html = renderToStaticMarkup(
    createElement(YouTubeFacade, {
      videoId: 'AAAAAAAAAAA',
      title: 'Official event preview',
      watchHref: '/events/example-expo-2026/videos/AAAAAAAAAAA',
    }),
  )

  assert.match(html, /href="\/events\/example-expo-2026\/videos\/AAAAAAAAAAA"/)
  assert.doesNotMatch(html, /<iframe/)
})

test('YouTube metadata uses the real upload timestamp and duration', async () => {
  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = String(input)
    if (url.includes('/oembed?')) {
      return Response.json({ title: 'STN EXPO West 2026 Promo' })
    }
    if (url.includes('/watch?v=')) {
      return new Response(
        '<html>"uploadDate":"2026-03-23T16:45:57-07:00" "lengthSeconds":"134"</html>',
        { status: 200 },
      )
    }
    return new Response(null, { status: 200, headers: { 'content-type': 'image/jpeg' } })
  }) as typeof fetch

  const metadata = await resolveYouTubeMetadata('FMrq4fda9W4')

  assert.equal(metadata.title, 'STN EXPO West 2026 Promo')
  assert.equal(metadata.uploadDate, '2026-03-23T16:45:57-07:00')
  assert.equal(metadata.duration, 'PT2M14S')
})

test('VideoObject is emitted only when a genuine upload date is available', () => {
  const event = { name: 'Example Expo 2026', slug: 'example-expo-2026' }
  const [video] = getEventWatchVideos({
    ...event,
    heroVideo: {
      youtubeUrl: 'https://www.youtube.com/watch?v=AAAAAAAAAAA',
      caption: 'Official event preview',
    },
  })

  const valid = renderToStaticMarkup(
    createElement(VideoJsonLd, {
      event,
      video,
      pageUrl: 'https://www.b2brain.com/events/example-expo-2026/videos/AAAAAAAAAAA',
      metadata: {
        id: video.id,
        title: video.title,
        thumbnailUrl: video.thumbnailUrl,
        uploadDate: '2026-03-23T16:45:57-07:00',
        duration: 'PT2M14S',
      },
    }),
  )
  const incomplete = renderToStaticMarkup(
    createElement(VideoJsonLd, {
      event,
      video,
      pageUrl: 'https://www.b2brain.com/events/example-expo-2026/videos/AAAAAAAAAAA',
      metadata: { id: video.id, thumbnailUrl: video.thumbnailUrl },
    }),
  )

  assert.match(valid, /VideoObject/)
  assert.match(valid, /2026-03-23T16:45:57-07:00/)
  assert.equal(incomplete, '')
})
