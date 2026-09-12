import type { EventDoc } from '@/lib/types'
import {
  youTubeEmbed,
  youTubeId,
  youTubeThumbFallback,
  youTubeWatch,
} from '@/lib/youtube'

/**
 * A video that can support its own Google-indexable watch page.
 *
 * Videos flagged "open on YouTube" are deliberately excluded: editors use
 * that switch when the uploader has disabled embedding, and an empty player is
 * not a valid watch-page experience. Duplicate IDs are collapsed because the
 * hero video is sometimes repeated in the reviews row.
 */
export type EventWatchVideo = {
  id: string
  title: string
  description: string
  source?: string
  thumbnailUrl: string
  embedUrl: string
  youtubeUrl: string
  watchPath: string
}

type EventVideoSource = Pick<EventDoc, 'name' | 'slug' | 'heroVideo' | 'sentiment'>

export function getEventWatchVideos(event: EventVideoSource): EventWatchVideo[] {
  const candidates = [
    event.heroVideo?.youtubeUrl
      ? {
          url: event.heroVideo.youtubeUrl,
          title:
            event.heroVideo.caption ||
            event.heroVideo.label ||
            `${event.name} event video`,
          source: event.heroVideo.label,
          openOnYouTube: event.heroVideo.openOnYouTube,
        }
      : null,
    ...(event.sentiment?.videos || []).map((video) => ({
      url: video?.url,
      title: video?.title || `${event.name} event video`,
      source: video?.src,
      openOnYouTube: video?.openOnYouTube,
    })),
  ]

  const seen = new Set<string>()
  const videos: EventWatchVideo[] = []

  for (const candidate of candidates) {
    if (!candidate?.url || candidate.openOnYouTube) continue
    const id = youTubeId(candidate.url)
    if (!id || seen.has(id)) continue
    seen.add(id)

    const title = candidate.title.trim()
    videos.push({
      id,
      title,
      description: `Watch ${title}, then explore ${event.name} dates, venue, programme and exhibitor planning guidance from B2Brain.`,
      source: candidate.source?.trim() || undefined,
      thumbnailUrl: youTubeThumbFallback(id),
      embedUrl: youTubeEmbed(id, false),
      youtubeUrl: youTubeWatch(id),
      watchPath: `/events/${event.slug}/videos/${id}`,
    })
  }

  return videos
}
