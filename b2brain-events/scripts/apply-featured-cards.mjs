/**
 * =============================================================================
 * APPLY FEATURED CARDS — match the /events "buying committees" section to live.
 * =============================================================================
 *
 *   node scripts/apply-featured-cards.mjs --dry-run
 *   node scripts/apply-featured-cards.mjs
 *
 * WHAT / WHY
 * The featured section on b2brain.com/events shows 16 events as full-width
 * "representative" cards (the Dreamforce-style card: tinted left panel with an
 * audience descriptor, right panel with the headline + meta + CTA). Our Vercel
 * page only featured 2 (Dreamforce, SMTS), because `eventsIndexPage.featuredEvents`
 * held just those two and every other event's `cardStat` was blank.
 *
 * This does two things, no code change (the FeaturedList component and the
 * featured logic already render whatever is referenced):
 *
 *   1. Sets `eventsIndexPage.featuredEvents` to the SAME 16 events as live, in
 *      the SAME order. (Live's set = Dreamforce + the 15 events whose Webflow
 *      `featured` switch is on, which we imported as `isFeatured`.)
 *
 *   2. Gives the 14 featured events that lack one a clean `cardStat` — the
 *      audience/vertical descriptor shown big in the card's left panel, the
 *      way Dreamforce reads "Salesforce Ecosystem" instead of a raw attendee
 *      number. Each is the event's actual domain, not an invented figure.
 *      (Dreamforce + AI4 already have theirs.) `cardAudience` and `cardHeadline`
 *      were already filled by the Webflow import, so only `cardStat` is needed.
 *
 * `cardStat` is used ONLY by the featured card — the grid card ignores it — so
 * this is scoped to the events that actually appear as representative cards.
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
try {
  const raw = readFileSync(resolve(here, '..', '.env.local'), 'utf8')
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
} catch {
  /* ambient env */
}

const DRY = process.argv.includes('--dry-run')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

/**
 * The live featured order, verified from b2brain.com/events' DOM (the order the
 * cards appear top to bottom). Dreamforce and AI4 lead as the marquee shows.
 */
const FEATURED_ORDER = [
  'dreamforce-2026',
  'ai4-2026',
  'intelligent-vehicle-expo-2026',
  'icmi-contact-center-expo-2026',
  'leap-2026',
  'automotive-testing-expo-north-america-2026',
  'small-satellite-conference-2026',
  'fort-lauderdale-international-boat-show-2026',
  'watersmart-innovations-2026',
  'nbaa-bace-2026',
  'americas-lng-summit-expo-2026',
  'pack-expo-international-2026',
  'fabtech-2026',
  'imts-2026',
  'international-woodworking-fair-iwf-2026',
  'stn-expo-west-2026',
]

/**
 * Clean audience/vertical descriptor for the left panel — each is the event's
 * real domain, matching the "Salesforce Ecosystem" / "Enterprise AI" register.
 * Only the events that were missing one are here (Dreamforce + AI4 keep theirs).
 * Max 40 chars (schema cap).
 */
const CARD_STAT = {
  'intelligent-vehicle-expo-2026': 'Vehicle Intelligence',
  'icmi-contact-center-expo-2026': 'Contact Center & CX',
  'leap-2026': 'Global Tech & AI',
  'automotive-testing-expo-north-america-2026': 'Vehicle Test & Validation',
  'small-satellite-conference-2026': 'Smallsat & Space',
  'fort-lauderdale-international-boat-show-2026': 'Marine & Yachting',
  'watersmart-innovations-2026': 'Water Efficiency',
  'nbaa-bace-2026': 'Business Aviation',
  'americas-lng-summit-expo-2026': 'LNG & Energy',
  'pack-expo-international-2026': 'Packaging & Processing',
  'fabtech-2026': 'Metal Forming & Fab',
  'imts-2026': 'Manufacturing Tech',
  'international-woodworking-fair-iwf-2026': 'Woodworking Industry',
  'stn-expo-west-2026': 'Student Transportation',
}

async function main() {
  console.log(`Featured set → ${FEATURED_ORDER.length} events (live order):`)
  FEATURED_ORDER.forEach((s, i) =>
    console.log(`  ${String(i + 1).padStart(2)}. ${s.padEnd(44)} ${CARD_STAT[s] ? `cardStat="${CARD_STAT[s]}"` : '(cardStat already set)'}`),
  )

  if (DRY) {
    console.log('\n--dry-run: nothing written.')
    return
  }

  // 1) Clean descriptors on the 14 events that lacked one.
  const tx = client.transaction()
  for (const [slug, cardStat] of Object.entries(CARD_STAT)) {
    tx.patch(`event.${slug}`, (p) => p.set({ cardStat }))
  }

  // 2) The featured reference list, in live order.
  const featuredEvents = FEATURED_ORDER.map((slug) => ({
    _type: 'reference',
    _key: slug.replace(/[^a-z0-9]/g, '').slice(0, 20),
    _ref: `event.${slug}`,
  }))
  tx.patch('eventsIndexPage', (p) => p.set({ featuredEvents }))

  await tx.commit()
  console.log(`\nWrote cardStat on ${Object.keys(CARD_STAT).length} events and set ${featuredEvents.length} featuredEvents.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
