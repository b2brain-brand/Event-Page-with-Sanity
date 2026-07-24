'use client'

import { useState } from 'react'
import Image from 'next/image'
import { youTubeEmbed } from '@/lib/youtube'

/**
 * Click-to-load YouTube facade.
 *
 * Until someone clicks, this is a still image and a black play square — no
 * iframe, no YouTube JavaScript, no third-party cookies. The embed is only
 * mounted on click, which keeps the hero fast and keeps the page from setting
 * tracking cookies on people who never watch.
 *
 * Styling reuses the .video__thumb / .video__play marks already in the design
 * system (the Reviews section uses the same pair), so this introduces no new
 * visual language.
 */
export function HeroVideoPlayer({
  videoId,
  thumbUrl,
  alt,
  caption,
  isSanityImage,
}: {
  videoId: string
  thumbUrl: string
  alt: string
  caption?: string
  isSanityImage: boolean
}) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <div className="herovid__frame">
        <iframe
          src={youTubeEmbed(videoId)}
          title={caption || 'Event video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      className="herovid__btn"
      onClick={() => setPlaying(true)}
      aria-label={caption ? `Play video: ${caption}` : 'Play video'}
    >
      <span className="herovid__thumb">
        {isSanityImage ? (
          <Image src={thumbUrl} alt={alt} fill sizes="(max-width: 991px) 100vw, 520px" />
        ) : (
          // YouTube's own still — a plain <img> avoids routing it through the
          // Next image optimiser for no benefit.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbUrl} alt={alt} loading="lazy" />
        )}
        <span className="video__play" aria-hidden="true" />
      </span>
    </button>
  )
}
