'use client'

import { useState } from 'react'
import {
  youTubeEmbed,
  youTubeThumb,
  youTubeThumbFallback,
} from '@/lib/youtube'

/**
 * The single YouTube behaviour used everywhere on the site.
 *
 * Paste a URL; everything else is derived. Until someone clicks there is no
 * iframe, no YouTube request and no third-party cookie — the card is an image
 * and a black play square. The embed mounts only on click, via
 * youtube-nocookie.com.
 *
 * Two variants, differing only in class names so each section keeps its own
 * styling:
 *   hero — the large panel beside the H1
 *   card — the 3-up cards in the Reviews section
 *
 * Event videos never navigate away. Content ingestion rejects videos whose
 * uploader has disabled embedding, so every accepted click stays inline.
 */

const VARIANTS = {
  hero: { btn: 'herovid__btn', thumb: 'herovid__thumb', frame: 'herovid__frame' },
  card: { btn: 'video__link', thumb: 'video__thumb', frame: 'video__frame' },
} as const

export function YouTubeFacade({
  videoId,
  thumbUrl,
  title,
  thumbnailAlt,
  variant = 'hero',
}: {
  videoId: string
  /** Resolved on the server so the HTML ships a URL that exists. */
  thumbUrl?: string
  title: string
  /** Describes the thumbnail before playback. The button still names the action. */
  thumbnailAlt?: string
  variant?: keyof typeof VARIANTS
}) {
  const c = VARIANTS[variant]
  const [playing, setPlaying] = useState(false)
  const [src, setSrc] = useState(thumbUrl || youTubeThumb(videoId))

  if (playing) {
    return (
      <div className={c.frame}>
        <iframe
          src={youTubeEmbed(videoId)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  const thumb = (
    <span className={c.thumb}>
      {/* Plain <img>: YouTube's CDN already serves an optimised JPEG, so the
          Next image optimiser would add latency for no gain — and the onError
          fallback needs a real DOM element. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={thumbnailAlt || `Video thumbnail: ${title}`}
        loading="lazy"
        onError={() => {
          const fb = youTubeThumbFallback(videoId)
          if (src !== fb) setSrc(fb)
        }}
      />
      <span className="video__play" aria-hidden="true" />
    </span>
  )

  return (
    <button
      type="button"
      className={c.btn}
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
    >
      {thumb}
    </button>
  )
}
