'use client'

import { useState } from 'react'
import {
  youTubeEmbed,
  youTubeThumb,
  youTubeThumbFallback,
  youTubeWatch,
} from '@/lib/youtube'

/**
 * The hero video module.
 *
 * Everything is derived from the pasted URL — the thumbnail is never uploaded.
 * Two behaviours, set by the "Open on YouTube instead of playing inline" toggle:
 *
 *   inline (default) — click swaps the still for the embedded player. Until then
 *                      there is no iframe, no YouTube request and no third-party
 *                      cookie, so the hero costs nothing on first paint.
 *   link-out         — click opens YouTube in a new tab.
 *
 * Thumbnail quality falls back on error: maxresdefault (1280×720) when YouTube
 * generated one, hqdefault (480×360, cropped to 16:9) when it did not.
 */
export function HeroVideoPlayer({
  videoId,
  caption,
  eventName,
  openOnYouTube = false,
}: {
  videoId: string
  caption?: string
  eventName: string
  openOnYouTube?: boolean
}) {
  const [playing, setPlaying] = useState(false)
  const [src, setSrc] = useState(youTubeThumb(videoId))

  const alt = caption ? `${caption} — video thumbnail` : `${eventName} video`

  if (playing) {
    return (
      <div className="herovid__frame">
        <iframe
          src={youTubeEmbed(videoId)}
          title={caption || `${eventName} video`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  const thumb = (
    <span className="herovid__thumb">
      {/* Plain <img>: YouTube's CDN already serves an optimised JPEG, so routing
          it through the Next image optimiser adds latency for no gain — and the
          onError fallback needs a real DOM element. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
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
        className="herovid__btn"
        href={youTubeWatch(videoId)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={caption ? `Watch on YouTube: ${caption}` : 'Watch on YouTube'}
      >
        {thumb}
      </a>
    )
  }

  return (
    <button
      type="button"
      className="herovid__btn"
      onClick={() => setPlaying(true)}
      aria-label={caption ? `Play video: ${caption}` : 'Play video'}
    >
      {thumb}
    </button>
  )
}
