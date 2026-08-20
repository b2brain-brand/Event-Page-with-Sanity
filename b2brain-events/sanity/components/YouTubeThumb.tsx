import React from 'react'

/**
 * Studio-only preview: renders the YouTube still for a pasted URL.
 *
 * Sanity's `prepare()` accepts a React element as `media`, so as soon as an
 * editor pastes a link the collapsed Hero video row shows the actual frame —
 * confirming the URL resolved without leaving the form or opening the site.
 */

const PATTERNS = [
  /youtube\.com\/watch\?[^#]*\bv=([\w-]{11})/,
  /youtu\.be\/([\w-]{11})/,
  /youtube\.com\/embed\/([\w-]{11})/,
  /youtube\.com\/shorts\/([\w-]{11})/,
  /youtube\.com\/live\/([\w-]{11})/,
]

export function idFromUrl(url?: string): string | null {
  if (!url) return null
  for (const p of PATTERNS) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export function YouTubeThumb({ url }: { url?: string }) {
  const id = idFromUrl(url)
  if (!id) return null
  return (
    // This is a Studio-only preview element, not a public-page image or LCP candidate.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
      alt=""
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  )
}
