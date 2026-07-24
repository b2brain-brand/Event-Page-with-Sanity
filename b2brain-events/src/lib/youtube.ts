/**
 * YouTube helpers.
 *
 * Editors paste whatever URL they copied from the browser, so every common
 * shape has to resolve to the same 11-character video id. Everything else —
 * thumbnail, embed, watch link — is derived from that id. Nothing about the
 * video is entered by hand.
 */

const PATTERNS = [
  /youtube\.com\/watch\?[^#]*\bv=([\w-]{11})/,
  /youtu\.be\/([\w-]{11})/,
  /youtube\.com\/embed\/([\w-]{11})/,
  /youtube\.com\/shorts\/([\w-]{11})/,
  /youtube\.com\/live\/([\w-]{11})/,
]

export function youTubeId(url?: string | null): string | null {
  if (!url) return null
  for (const p of PATTERNS) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

/**
 * Best-quality still, with a fallback.
 *
 * `maxresdefault` is a true 1280×720 but YouTube only generates it for some
 * uploads — for the rest it 404s. `hqdefault` always exists but is 480×360 (4:3),
 * which the card crops to 16:9 with object-fit, removing the letterbox bars.
 *
 * So: request maxres, and swap to hq on error. The player component wires the
 * fallback up; both URLs are produced here.
 */
export function youTubeThumb(id: string): string {
  return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
}

export function youTubeThumbFallback(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}

/**
 * Privacy-preserving embed host — no cookies until the viewer actually plays.
 * `autoplay=1` is correct here because the iframe is only mounted after a click.
 */
export function youTubeEmbed(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`
}

export function youTubeWatch(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`
}
