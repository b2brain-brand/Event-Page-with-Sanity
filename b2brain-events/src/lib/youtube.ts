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

export function youTubeThumbStandard(id: string): string {
  return `https://i.ytimg.com/vi/${id}/sddefault.jpg`
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
 * Card covers have a stricter quality bar than in-page video previews. Verify
 * that YouTube still recognises the video, then prefer its 1280x720 still and
 * fall back to the 640x480 standard still. We deliberately stop before the
 * low-resolution hq/default variants that produced the grey loading artwork on
 * older cards.
 */
export async function resolveYouTubeCardThumb(id: string): Promise<string | null> {
  try {
    const metadata = new URL('https://www.youtube.com/oembed')
    metadata.searchParams.set('url', `https://www.youtube.com/watch?v=${id}`)
    metadata.searchParams.set('format', 'json')
    const verified = await fetch(metadata, { next: { revalidate: 86400 } })
    if (!verified.ok) return null

    for (const thumbnail of [youTubeThumb(id), youTubeThumbStandard(id)]) {
      const res = await fetch(thumbnail, {
        method: 'HEAD',
        next: { revalidate: 86400 },
      })
      if (res.ok && res.headers.get('content-type')?.startsWith('image/')) return thumbnail
    }
  } catch {
    /* A stable generated cover is safer than a failed remote thumbnail. */
  }
  return null
}

/**
 * Resolve every YouTube still a page needs, in one parallel pass.
 *
 * The page collects each URL it is about to render — the hero video and the
 * review cards — and gets back an id -> thumbnail map. Duplicates are collapsed
 * first, so the same video linked twice costs one check.
 */
export async function resolveYouTubeThumbs(
  urls: (string | null | undefined)[],
): Promise<Record<string, string>> {
  const ids = [...new Set(urls.map(youTubeId).filter((x): x is string => Boolean(x)))]
  const entries = await Promise.all(
    ids.map(async (id) => [id, await resolveYouTubeThumb(id)] as const),
  )
  return Object.fromEntries(entries)
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
