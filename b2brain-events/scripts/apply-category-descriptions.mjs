/* eslint-disable no-console */
/**
 * =============================================================================
 * APPLY CATEGORY DESCRIPTIONS — fill the 8 verticals that had none.
 * =============================================================================
 *
 *   node scripts/apply-category-descriptions.mjs --dry-run
 *   node scripts/apply-category-descriptions.mjs
 *
 * `eventCategory.description` ("Used on the category index page" per its own
 * schema help text) now actually IS used — it's the unique intro sentence on
 * each /events/industry/[category] page. 3 of 11 categories already had one
 * (Manufacturing, Supply chain, Technology); this fills the other 8 in the
 * same voice: short, genre-level, no invented numbers or claims.
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

const DESCRIPTIONS = {
  'category.automotive': 'Vehicle testing, EV and automotive supply-chain shows.',
  'category.aviation': 'Business aviation, MRO and airport-technology conferences.',
  'category.energy': 'Oil, gas, LNG and power-industry congresses.',
  'category.hospitality': 'Hotel, resort and hospitality-technology trade shows.',
  'category.marine': 'Boat shows and marine-industry trade events.',
  'category.packaging': 'Packaging, processing and material-handling trade shows.',
  'category.robotics-automation': 'Industrial robotics, automation and motion-control shows.',
  'category.space-tech': 'Satellite, launch and space-industry conferences.',
}

async function main() {
  console.log(`Writing ${Object.keys(DESCRIPTIONS).length} category descriptions:`)
  for (const [id, desc] of Object.entries(DESCRIPTIONS)) console.log(`  ${id.padEnd(28)} ${desc}`)

  if (DRY) {
    console.log('\n--dry-run: nothing written.')
    return
  }

  const tx = client.transaction()
  for (const [id, description] of Object.entries(DESCRIPTIONS)) {
    tx.patch(id, (p) => p.setIfMissing({ description }))
  }
  await tx.commit()
  console.log('\nDone.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
