import type { IndexEventCard } from './types'
import { resolveYouTubeCardThumb, youTubeId } from './youtube'

/**
 * Add high-resolution video stills only to cards that have no approved Sanity
 * image (including the gallery-photo fallback projected by GROQ).
 */
export async function enrichEventCardMedia(events: IndexEventCard[]): Promise<IndexEventCard[]> {
  return Promise.all(
    events.map(async (event) => {
      if (event.cardImage?.asset?.url) return event

      const id = youTubeId(event.coverVideoUrl)
      if (!id) return event

      const cardThumbnailUrl = await resolveYouTubeCardThumb(id)
      return cardThumbnailUrl ? { ...event, cardThumbnailUrl } : event
    }),
  )
}
