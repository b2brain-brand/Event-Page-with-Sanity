/**
 * Apply the approved Build Show LIVE client feedback to published content.
 *
 * Dry-run (default):
 *   node scripts/apply-build-show-client-feedback.mjs
 * Apply:
 *   node scripts/apply-build-show-client-feedback.mjs --apply
 *
 * Patches only:
 *   - the global reviews heading in published/draft Site Settings documents;
 *   - the target-account FAQ in published/draft Build Show LIVE documents.
 *
 * The closing CTA presentation is code-owned in Cta.tsx and is not mutated here.
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
for (const line of readFileSync(resolve(here, '..', '.env.local'), 'utf8').split(/\r?\n/)) {
  const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
  if (match && !process.env[match[1]]) {
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, '').trim()
  }
}

const token = process.env.SANITY_API_WRITE_TOKEN
if (!token) throw new Error('SANITY_API_WRITE_TOKEN is not set')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token,
  apiVersion: '2024-10-28',
  useCdn: false,
})

const apply = process.argv.includes('--apply')
const reviewHeading = 'Reviews that you need to know about this show'
const targetFaq = {
  _key: 'faq-target-accounts',
  _type: 'faqItem',
  q: 'Is it possible to identify my target accounts for Build Show LIVE 2026?',
  a: 'Yes. Book a B2Brain demo to identify ICP-matched target accounts for Build Show LIVE 2026 and leave with a prioritized account list your team can use before the show floor opens.',
}

const docs = await client.fetch(`*[_id in [
  "siteSettings",
  "drafts.siteSettings",
  "event.build-show-live-2026",
  "drafts.event.build-show-live-2026"
]]{ _id, _rev, _type, faq, "sentimentHeading": labels.sentimentHeading }`)

const settings = docs.filter((doc) => doc._type === 'siteSettings')
const events = docs.filter((doc) => doc._type === 'event')
if (!settings.length) throw new Error('No Site Settings document found')
if (!events.length) throw new Error('No Build Show LIVE event document found')

const eventChanges = events.map((doc) => {
  const faq = (doc.faq || []).filter((item) => item?._key !== targetFaq._key)
  const exhibitorIndex = faq.findIndex((item) => /exhibitor list available/i.test(item?.q || ''))
  const insertAt = exhibitorIndex >= 0 ? exhibitorIndex + 1 : faq.length
  faq.splice(insertAt, 0, targetFaq)
  return { doc, faq }
})

console.log(`${apply ? 'Applying' : 'Dry run for'} Build Show LIVE client feedback:`)
for (const doc of settings) console.log(`  ${doc._id}: reviews heading -> ${reviewHeading}`)
for (const { doc, faq } of eventChanges) {
  console.log(`  ${doc._id}: FAQ count ${doc.faq?.length || 0} -> ${faq.length}`)
  console.log(`    + ${targetFaq.q}`)
}

if (!apply) {
  console.log('No Sanity documents changed. Re-run with --apply after review.')
  process.exit(0)
}

const tx = client.transaction()
for (const doc of settings) {
  tx.patch(doc._id, (patch) => patch.ifRevisionId(doc._rev).set({
    'labels.sentimentHeading': reviewHeading,
  }))
}
for (const { doc, faq } of eventChanges) {
  tx.patch(doc._id, (patch) => patch.ifRevisionId(doc._rev).set({ faq }))
}
await tx.commit()
console.log('Sanity update committed successfully.')
