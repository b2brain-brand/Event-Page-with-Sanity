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
 * Pick the best thumbnail that actually exists, ON THE SERVER.
 *
 * Guessing maxres and correcting in the browser costs a 404 round-trip and
 * leaves the hero's largest element blank while it swaps — measurable LCP
 * damage on the one image above the fold. So we check once at render time
 * instead, and ship the correct URL in the HTML.
 *
 * The check is cached for a day: these pages are statically generated, so in
 * practice this runs at build time and costs nothing at request time. Any
 * failure falls back to hqdefault, which YouTube guarantees for every video.
 */
export async function resolveYouTubeThumb(id: string): Promise<string> {
  const maxres = youTubeThumb(id)
  try {
    const res = await fetch(maxres, {
      method: 'HEAD',
      next: { revalidate: 86400 },
    })
    if (res.ok) return maxres
  } catch {
    /* network hiccup — fall through */
  }
  return youTubeThumbFallback(id)
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
