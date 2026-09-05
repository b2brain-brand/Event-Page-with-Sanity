'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
 * youtube-nocookie.com, inside a large same-page modal.
 *
 * Two variants, differing only in class names so each section keeps its own
 * styling:
 *   hero — the large panel beside the H1
 *   card — the 3-up cards in the Reviews section
 *
 * Event videos never navigate away. Content ingestion rejects videos whose
 * uploader has disabled embedding, so every accepted click stays on-page.
 */

const VARIANTS = {
  hero: { btn: 'herovid__btn', thumb: 'herovid__thumb' },
  card: { btn: 'video__link', thumb: 'video__thumb' },
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
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!playing) return

    const trigger = triggerRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPlaying(false)
    }
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', closeOnEscape)
      trigger?.focus()
    }
  }, [playing])

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
    <>
      <button
        ref={triggerRef}
        type="button"
        className={c.btn}
        onClick={() => setPlaying(true)}
        aria-label={`Play video: ${title}`}
        aria-haspopup="dialog"
      >
        {thumb}
      </button>

      {playing && typeof document !== 'undefined'
        ? createPortal(
            <div
              className="ytmodal"
              role="dialog"
              aria-modal="true"
              aria-label={`Playing video: ${title}`}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setPlaying(false)
              }}
            >
              <div className="ytmodal__dialog">
                <button
                  ref={closeRef}
                  type="button"
                  className="ytmodal__close"
                  onClick={() => setPlaying(false)}
                  aria-label="Close video"
                >
                  <span aria-hidden="true">×</span>
                </button>
                <div className="ytmodal__frame">
                  <iframe
                    src={youTubeEmbed(videoId)}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
