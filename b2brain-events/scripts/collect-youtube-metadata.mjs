import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-05-01'

if (!projectId) throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is required')

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})
const rows = await client.fetch(`
  *[_type == "event" && defined(slug.current)]{
    heroVideo{ youtubeUrl, openOnYouTube },
    sentiment{ videos[]{ url, openOnYouTube } }
  }
`)

function youtubeId(url) {
  if (!url) return null
  const patterns = [
    /youtube\.com\/watch\?[^#]*\bv=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/(?:embed|shorts|live)\/([\w-]{11})/,
  ]
  return patterns.map((pattern) => url.match(pattern)?.[1]).find(Boolean) || null
}

function duration(seconds) {
  const total = Number.parseInt(seconds || '', 10)
  if (!Number.isFinite(total) || total < 0) return undefined
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const remaining = total % 60
  return `PT${hours ? `${hours}H` : ''}${minutes ? `${minutes}M` : ''}${remaining || (!hours && !minutes) ? `${remaining}S` : ''}`
}

const ids = [
  ...new Set(
    rows
      .flatMap((row) => [
        row.heroVideo && !row.heroVideo.openOnYouTube
          ? youtubeId(row.heroVideo.youtubeUrl)
          : null,
        ...(row.sentiment?.videos || []).map((video) =>
          video && !video.openOnYouTube ? youtubeId(video.url) : null,
        ),
      ])
      .filter(Boolean),
  ),
].sort()

const output = {}
const missing = []
let next = 0

async function worker() {
  while (next < ids.length) {
    const id = ids[next++]
    try {
      const response = await fetch('https://www.youtube.com/youtubei/v1/player', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          videoId: id,
          context: {
            client: {
              clientName: 'WEB',
              clientVersion: '2.20250911.00.00',
              hl: 'en',
              gl: 'US',
            },
          },
        }),
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      const player = data.microformat?.playerMicroformatRenderer
      const uploadDate = player?.uploadDate || player?.publishDate
      const title = data.videoDetails?.title?.trim()
      if (!title || !uploadDate || Number.isNaN(Date.parse(uploadDate))) {
        throw new Error('missing required title or upload date')
      }

      const isoDuration = duration(data.videoDetails?.lengthSeconds)
      output[id] = {
        title,
        uploadDate,
        ...(isoDuration ? { duration: isoDuration } : {}),
      }
    } catch (error) {
      missing.push({ id, reason: error instanceof Error ? error.message : String(error) })
    }
  }
}

await Promise.all(Array.from({ length: 6 }, () => worker()))

process.stdout.write(
  JSON.stringify(
    {
      metadata: Object.fromEntries(Object.entries(output).sort(([a], [b]) => a.localeCompare(b))),
      missing: missing.sort((a, b) => a.id.localeCompare(b.id)),
      expected: ids.length,
    },
    null,
    2,
  ),
)
