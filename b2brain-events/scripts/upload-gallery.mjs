/**
 * =============================================================================
 * UPLOAD GALLERY IMAGES — attach local photos to an event's gallery.
 * =============================================================================
 *
 *   node scripts/upload-gallery.mjs <event-slug> <folder>
 *
 *   node scripts/upload-gallery.mjs dreamforce-2026 ./photos/dreamforce
 *
 * Files are sorted by filename and attached to the event's existing gallery
 * slots in that order — so name them 1-park.jpg, 2-astro.jpg, 3-welcome.jpg,
 * 4-mainstage.jpg and they land against the captions already seeded.
 *
 * If there are more files than slots, extra slides are appended with a blank
 * caption. Existing captions and alt text are never overwritten.
 *
 * Faster than drag-and-drop once you are doing this for 40 events, and it keeps
 * the caption/alt text authored in one place rather than typed into the UI.
 *
 * Requires SANITY_API_WRITE_TOKEN in .env.local.
 */

import { createClient } from '@sanity/client'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve, dirname, extname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))

for (const line of readFileSync(resolve(here, '..', '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim()
}

const [slug, folder] = process.argv.slice(2)
if (!slug || !folder) {
  console.error('Usage: node scripts/upload-gallery.mjs <event-slug> <folder>')
  process.exit(1)
}

const token = process.env.SANITY_API_WRITE_TOKEN
if (!token) throw new Error('SANITY_API_WRITE_TOKEN is not set (needs write access)')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token,
  apiVersion: '2024-10-28',
  useCdn: false,
})

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'])

const dir = resolve(process.cwd(), folder)
const files = readdirSync(dir)
  .filter((f) => IMAGE_EXT.has(extname(f).toLowerCase()))
  .filter((f) => statSync(resolve(dir, f)).isFile())
  .sort()

if (!files.length) {
  console.error(`No images found in ${dir}`)
  process.exit(1)
}

const event = await client.fetch(
  `*[_type == "event" && slug.current == $slug][0]{ _id, name, gallery }`,
  { slug },
)
if (!event) {
  console.error(`No event found with slug "${slug}"`)
  process.exit(1)
}

console.log(`${event.name}`)
console.log(`  ${files.length} image(s) from ${dir}`)
console.log(`  ${(event.gallery || []).length} existing gallery slot(s)\n`)

const gallery = [...(event.gallery || [])]

for (let i = 0; i < files.length; i++) {
  const file = files[i]
  const path = resolve(dir, file)
  process.stdout.write(`  [${i + 1}/${files.length}] ${file} … `)

  const asset = await client.assets.upload('image', readFileSync(path), {
    filename: basename(file),
  })

  const slot = gallery[i]
  if (slot) {
    // Keep the authored caption/alt; only attach the image.
    slot.image = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
    console.log(`attached to slot ${i + 1} ("${slot.caption || 'no caption'}")`)
  } else {
    gallery.push({
      _type: 'galleryItem',
      _key: `up${Date.now().toString(36)}${i}`,
      image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
      accent: 'purple',
    })
    console.log('appended as a new slide (no caption — add one in the Studio)')
  }
}

await client.patch(event._id).set({ gallery }).commit()

console.log(`\nDone. ${gallery.length} slide(s) on ${event.name}.`)
console.log('Publish the document in the Studio if it is still a draft.')
