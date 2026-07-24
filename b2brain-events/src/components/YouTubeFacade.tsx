'use client'

import { useState } from 'react'
import {
  youTubeEmbed,
  youTubeThumb,
  youTubeThumbFallback,
  youTubeWatch,
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
 * `openOnYouTube` swaps inline playback for a new-tab link, for videos where
 * the uploader has disabled embedding.
 */

const VARIANTS = {
  hero: { btn: 'herovid__btn', thumb: 'herovid__thumb', frame: 'herovid__frame' },
  card: { btn: 'video__link', thumb: 'video__thumb', frame: 'video__frame' },
} as const

export function YouTubeFacade({
  videoId,
  thumbUrl,
  title,
  variant = 'hero',
  openOnYouTube = false,
}: {
  videoId: string
  /** Resolved on the server so the HTML ships a URL that exists. */
  thumbUrl?: string
  title: string
  variant?: keyof typeof VARIANTS
  openOnYouTube?: boolean
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
        alt=""
        loading="lazy"
        onError={() => {
          const fb = youTubeThumbFallback(videoId)
          if (src !== fb) setSrc(fb)
        }}
      />
      <span className="video__play" aria-hidden="true" />
    </span>
  )

  if (openOnYouTube) {
    return (
      <a
        className={c.btn}
        href={youTubeWatch(videoId)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Watch on YouTube: ${title}`}
      >
        {thumb}
      </a>
    )
  }

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
