import type { CSSProperties } from 'react'

import type { IndexEventCard } from './types'
import { youTubeId } from './youtube'

export type CardArtStyle = CSSProperties & {
  '--ecard-art-bg': string
  '--ecard-art-accent': string
  '--ecard-art-ink': string
  '--ecard-art-pop': string
  '--ecard-art-angle': string
  '--ecard-art-x': string
}

export type EventCardCover =
  | { kind: 'sanity'; url: string; alt: string }
  | { kind: 'video'; videoId: string; alt: string }
  | { kind: 'art'; monogram: string; style: CardArtStyle }

const ART_PALETTES = [
  ['#f0ecff', '#7052d5', '#0b0b0b', '#ff382c'],
  ['#fff0ee', '#ff382c', '#0b0b0b', '#ffe53b'],
  ['#e8f7ed', '#15803d', '#0b0b0b', '#7052d5'],
  ['#fff7c7', '#ff382c', '#0b0b0b', '#7052d5'],
  ['#e8f3ff', '#2463eb', '#0b0b0b', '#ff382c'],
  ['#f2f2f2', '#0b0b0b', '#0b0b0b', '#ff382c'],
] as const

/**
 * Resolve a collection-card cover without network access.
 *
 * The caller renders the returned source. A malformed or absent video can
 * never produce a broken image because it falls through to deterministic art.
 */
export function resolveEventCardCover(
  event: IndexEventCard,
  industry?: string,
): EventCardCover {
  const imageUrl = event.cardImage?.asset?.url?.trim()
  if (imageUrl) {
    return { kind: 'sanity', url: imageUrl, alt: event.cardImageAlt?.trim() || event.name }
  }

  const videoId = youTubeId(event.coverVideoUrl)
  if (videoId) {
    return { kind: 'video', videoId, alt: `${event.name} event video cover` }
  }

  return { kind: 'art', ...cardArt(event, industry) }
}

export function cardArt(event: IndexEventCard, industry?: string) {
  const seed = hashText(`${event.slug}|${industry || ''}|${event.startDate || ''}`)
  const [bg, accent, ink, pop] = ART_PALETTES[seed % ART_PALETTES.length]
  const style: CardArtStyle = {
    '--ecard-art-bg': bg,
    '--ecard-art-accent': accent,
    '--ecard-art-ink': ink,
    '--ecard-art-pop': pop,
    '--ecard-art-angle': `${(seed % 19) - 9}deg`,
    '--ecard-art-x': `${18 + (seed % 36)}%`,
  }
  return { monogram: eventMonogram(event.name), style }
}

export function eventMonogram(name: string): string {
  const words = name
    .replace(/\b20\d{2}\b/g, '')
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
  if (!words.length) return 'EV'
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase()
  return words
    .slice(0, 3)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

/** Card metrics are numeric facts; text placeholders such as TBA stay hidden. */
export function hasNumericMetric(value?: string): boolean {
  return Boolean(value?.trim()) && /\d/.test(value || '')
}

function hashText(value: string): number {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}
