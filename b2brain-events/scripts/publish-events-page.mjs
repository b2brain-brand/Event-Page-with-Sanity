/* eslint-disable no-console */
/**
 * Create + publish the Events-page (/events) singleton with the b2brain.com copy.
 *
 *   node scripts/publish-events-page.mjs
 *
 * Idempotent: createOrReplace, so re-running just refreshes it. Only touches the
 * one `eventsIndexPage` document — nothing else. Requires SANITY_API_WRITE_TOKEN.
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
for (const line of readFileSync(resolve(here, '..', '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim()
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

const doc = {
  _id: 'eventsIndexPage',
  _type: 'eventsIndexPage',
  heroEyebrow: 'THE 2026 EVENT CALENDAR',
  heroHeading: 'From offline conversations to attributable pipeline.',
  heroIntro:
    'Browse the events, conferences, and industry shows revenue teams are planning pipeline around in 2026.',
  stats: [
    { _type: 'indexStat', _key: 's1', num: '180+', label: 'Tracked shows' },
    { _type: 'indexStat', _key: 's2', num: '3', label: 'Event motions' },
    { _type: 'indexStat', _key: 's3', num: '2.8M', label: 'Leads captured' },
    { _type: 'indexStat', _key: 's4', num: '$2.1B', label: 'Pipeline influenced' },
  ],
  featuredEyebrow: 'FEATURED',
  featuredHeading: 'The buying committees worth planning around.',
  allEyebrow: 'ALL EVENTS',
  allHeading: 'Browse the 2026 event calendar.',
  cardCtaLabel: 'Open Event Playbook',
  allCardCtaLabel: 'See The Event Playbook',
  industryFilterLabel: 'Filter By Industry',
  searchPlaceholder: 'Search',
  faqHeading: 'Frequently asked questions',
  faq: [
    {
      _type: 'faqItem',
      _key: 'q1',
      q: 'What is the B2Brain event calendar?',
      a: 'A curated calendar of the B2B trade shows and conferences revenue teams plan pipeline around, with an event playbook for each — who attends, what a booth costs, and how to turn floor conversations into booked meetings.',
    },
    {
      _type: 'faqItem',
      _key: 'q2',
      q: 'How much does B2Brain cost?',
      a: 'Show Pass is $200 per user per event. Annual plans start at $1,500. See the pricing page for current details.',
    },
    {
      _type: 'faqItem',
      _key: 'q3',
      q: 'Does B2Brain integrate with my CRM?',
      a: 'Yes. Booth conversations sync to Salesforce and other CRMs with the use case, blockers and next step captured — not just a scanned badge.',
    },
    {
      _type: 'faqItem',
      _key: 'q4',
      q: 'Does it work offline on the show floor?',
      a: 'Yes. Capture is offline-ready for the convention-centre dead zones, and syncs when you are back on signal.',
    },
  ],
  ctaEyebrow: 'FROM OFFLINE TO PIPELINE',
  ctaHeading: 'Every event conversation should end in attributable revenue.',
  metaTitle: 'Trade shows & conferences for B2B revenue teams — B2Brain',
  metaDescription:
    'Browse the 2026 B2B event calendar — dates, venue, who attends, exhibitor costs and the booth math for every major trade show and conference.',
}

await client.createOrReplace(doc)
console.log('Published eventsIndexPage (/events content).')
console.log('  hero, 4 stats, featured + all headings, 4 FAQs, CTA — all set.')
