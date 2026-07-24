/**
 * YouTube helpers.
 *
 * Editors paste whatever URL they copied from the browser, so every common
 * shape has to resolve to the same 11-character video id.
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
 * YouTube's own still, used when the editor has not uploaded a custom one.
 * `hqdefault` rather than `maxresdefault` because maxres does not exist for
 * every video and 404s produce a grey box; hq is guaranteed.
 */
export function youTubeThumb(id: string): string {
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
