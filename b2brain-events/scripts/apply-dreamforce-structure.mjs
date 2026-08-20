/**
 * =============================================================================
 * APPLY DREAMFORCE STRUCTURE — bring imported events up to the full template.
 * =============================================================================
 *
 *   node scripts/apply-dreamforce-structure.mjs --dry-run
 *   node scripts/apply-dreamforce-structure.mjs            # write
 *
 * WHY THIS EXISTS
 * Every event renders through the SAME component (src/components/EventPage.tsx)
 * with a FIXED section order. A section only disappears when its data is empty —
 * that is the template's graceful-degradation contract. The Webflow import filled
 * the sections Webflow had fields for (hero, stats, quick answer, why, cost,
 * playbook, article, faq) and left the rest empty, so the imported pages look
 * structurally thinner than Dreamforce even though they use the identical layout.
 *
 * This fills the gap in two tiers:
 *
 *   LIVE  (patched onto the published doc) — sections we can source honestly and
 *         that render cleanly with no dead UI:
 *           · agenda    (day tabs + track chips; session times marked TBA)
 *           · audience  (industries + "is your buyer here")
 *           · exhibitors(the "which booths to map first" POV)
 *           · logistics (getting there / stay / on-site / lead retrieval)
 *
 *   DRAFT (staged on drafts.<id>, NOT published) — sections that need an asset
 *         the client will supply, so they must not sit half-empty on a live page:
 *           · gallery   (grey placeholder slides + captions — add photos)
 *           · sentiment (grey placeholder video cards — add YouTube links)
 *           · speakers  (placeholder cards — add the real line-up)
 *         The client opens each event in the Studio, drops the assets into the
 *         waiting slots, and hits Publish (now fast — webhook is fixed).
 *
 * NOT SET HERE
 *   · heroVideo — the schema requires a real YouTube URL, so there is no honest
 *     placeholder; paste a link in the Studio and the two-column hero appears.
 *   · audience.titleMix, exhibitor tiers, logistics passes, reddit/testimonials —
 *     all need real numbers, company names, prices or verbatim quotes we will not
 *     invent. Left for the client; the sections still render from the fields above.
 *
 * All content below is DERIVED from each event's own imported article/fields —
 * nothing about a specific show is fabricated. Times, photos, speakers, prices
 * and quotes are the things a human must confirm, and they are exactly what is
 * left blank or marked TBA.
 *
 * Deterministic keys, so re-running is idempotent.
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

/* ---- small helpers for keyed array members --------------------------------- */
const day = (k, label, meta, items) => ({
  _key: k,
  _type: 'agendaDay',
  label,
  meta,
  items: items.map((it, i) => ({ _type: 'agendaSession', _key: `${k}s${i}`, time: 'TBA', ...it })),
})
const slide = (k, accent, caption) => ({ _key: k, _type: 'galleryItem', accent, caption })
const vid = (k, title, src) => ({ _key: k, _type: 'videoReview', title, src })
const spk = (k, role) => ({ _key: k, _type: 'speaker', name: 'Add speaker', role })

/* ============================================================================
   AI4 2026
   ============================================================================ */
const AI4_LIVE = {
  agenda: {
    _type: 'agendaBlock',
    tracks: [
      'AI Agents & Automation',
      'Governance & Responsible AI',
      'Infrastructure & MLOps',
      'Enterprise AI Adoption',
      'Data & Model Ops',
      'Cybersecurity AI',
      'Startups & Investment',
    ],
    days: [
      day('d1', 'Day 1', 'Tue · Aug 4', [
        { title: 'Work pre-booked enterprise buyers and active opportunities', track: 'Enterprise AI Adoption' },
        { title: 'Capture use case, model stack, data constraint and owner per conversation', track: 'Data & Model Ops' },
      ]),
      day('d2', 'Day 2', 'Wed · Aug 5', [
        { title: 'Mid-show account review — merge duplicate visits, route specialists', track: 'AI Agents & Automation' },
        { title: 'Book deeper workshops with active evaluations', track: 'Enterprise AI Adoption' },
      ]),
      day('d3', 'Day 3', 'Thu · Aug 6', [
        { title: 'Convert interest into booked next steps before wheels-up', track: 'Enterprise AI Adoption' },
      ]),
    ],
  },
  audience: {
    _type: 'audienceBlock',
    industries: ['Financial services', 'Healthcare', 'Retail & e-commerce', 'Cybersecurity', 'Government', 'Manufacturing'],
    match:
      'AI4 is for revenue teams selling AI or AI-adjacent platforms to enterprise and mid-market buyers across many industries. It is a weaker fit if you need a single-vertical audience — the floor spans finance, healthcare, government and infrastructure, so qualifying by use case matters more than badge title.',
  },
  exhibitors: {
    _type: 'exhibitorsBlock',
    notable:
      "Treat AI4's 400+ exhibitor floor as a use-case map, not a vendor list. Prioritize booths whose buyers overlap yours — data and infrastructure platforms, governance and security vendors, and the enterprise-AI applications your prospects evaluate alongside you. The sponsor directory and 1-1 Meeting Program are the fastest way to pre-book the accounts that matter.",
  },
  logistics: {
    _type: 'logisticsBlock',
    cells: [
      { _key: 'l1', _type: 'logisticsCell', h: 'Getting there', body: 'The Venetian Convention & Expo Center, Las Vegas, NV. Fly into Harry Reid International (LAS), about 15 minutes from the Strip.' },
      { _key: 'l2', _type: 'logisticsCell', h: 'Where to stay', body: 'Strip hotels sell out for major tech weeks — book the Venetian / Palazzo block or an adjacent property early, and confirm the official room block when it opens.' },
      { _key: 'l3', _type: 'logisticsCell', h: 'On-site', body: 'Three days of conference sessions, sponsor booths, 1-1 meetings and networking across The Venetian.' },
      { _key: 'l4', _type: 'logisticsCell', h: 'Lead retrieval', body: "AI4's public pages do not name an official lead-retrieval provider or scanner package. Confirm the current lead-capture terms in the sponsor portal before the show." },
    ],
  },
}
const AI4_DRAFT = {
  gallery: [
    slide('g1', 'purple', 'Expo floor — The Venetian, Las Vegas'),
    slide('g2', 'orange', 'Keynote stage — AI4 2025'),
    slide('g3', 'green', '1-1 meetings & networking'),
  ],
  sentiment: {
    _type: 'sentimentBlock',
    videos: [
      vid('v1', 'What AI4 is like as an exhibitor', 'YouTube'),
      vid('v2', 'AI4 2025 keynote highlights', 'YouTube'),
      vid('v3', 'On the floor at AI4', 'YouTube'),
    ],
  },
  speakers: [
    spk('sp1', 'Enterprise AI leader'),
    spk('sp2', 'AI researcher / builder'),
    spk('sp3', 'Policy & governance voice'),
    spk('sp4', 'Founder / investor'),
  ],
}

/* ============================================================================
   TECHNET AUGUSTA 2026
   ============================================================================ */
const TECHNET_LIVE = {
  agenda: {
    _type: 'agendaBlock',
    tracks: [
      'C2 & Counter-C2',
      'Cyber Resilience & Zero Trust',
      'Interoperable Tactical Networks',
      'AI, Data & Decision Advantage',
      'Command Post & Mission Systems',
    ],
    days: [
      day('d1', 'Day 1', 'Mon · Aug 17', [
        { title: 'Protect the Tier 1 calendar — work pre-booked accounts and active opportunities', track: 'C2 & Counter-C2' },
        { title: 'Keep a senior rep free for unexpected decision-makers', track: 'Command Post & Mission Systems' },
      ]),
      day('d2', 'Day 2', 'Tue · Aug 18', [
        { title: 'Build account coverage — short team resets, review stakeholders seen', track: 'Cyber Resilience & Zero Trust' },
      ]),
      day('d3', 'Day 3', 'Wed · Aug 19', [
        { title: 'Convert interest — revisit warm accounts, sweep untouched targets', track: 'AI, Data & Decision Advantage' },
      ]),
      day('d4', 'Day 4', 'Thu · Aug 20', [
        { title: 'Close out — confirm next steps and log every conversation to CRM', track: 'Interoperable Tactical Networks' },
      ]),
    ],
  },
  audience: {
    _type: 'audienceBlock',
    industries: ['U.S. Army', 'Department of Defense', 'Government & academia', 'Defense primes', 'Cyber & C2 vendors', 'System integrators'],
    match:
      'TechNet Augusta is for teams selling cyber, C2, communications, network, data and mission systems into the U.S. Army and DoD. It is a poor fit for purely commercial B2B with no public-sector motion — nearly every conversation traces back to a mission, program and acquisition path.',
  },
  exhibitors: {
    _type: 'exhibitorsBlock',
    notable:
      "TechNet Augusta's ~321 exhibitors cluster around cyber, C2, communications, data, network and mission systems. Prioritize booths tied to the programs and mission owners in your pipeline, plus the primes and integrators who can pull you into a contract vehicle. Map the pavilion and mission-focused exhibitors before the floor opens.",
  },
  logistics: {
    _type: 'logisticsBlock',
    cells: [
      { _key: 'l1', _type: 'logisticsCell', h: 'Getting there', body: 'Augusta Marriott at the Convention Center, Augusta, GA. Augusta Regional (AGS) is closest; many attendees fly into Atlanta (ATL) and drive about 2.5 hours.' },
      { _key: 'l2', _type: 'logisticsCell', h: 'Where to stay', body: 'Downtown Augusta hotels near the Convention Center fill fast during TechNet week — book early and confirm the official room block.' },
      { _key: 'l3', _type: 'logisticsCell', h: 'On-site', body: 'Keynotes, panels, training and continuing-education sessions alongside exhibit halls, a pavilion, kiosks, tabletops and outdoor demonstrations.' },
      { _key: 'l4', _type: 'logisticsCell', h: 'Lead retrieval', body: 'The official lead-retrieval product is CAPTURE! powered by SPARGO — handheld scanning, qualification questions, notes and CRM export. Confirm the Augusta package, device rate and order deadline in the exhibitor portal.' },
    ],
  },
}
const TECHNET_DRAFT = {
  gallery: [
    slide('g1', 'purple', 'Exhibit hall — Augusta Convention Center'),
    slide('g2', 'orange', 'Keynotes & panels'),
    slide('g3', 'green', 'Outdoor demonstrations'),
  ],
  sentiment: {
    _type: 'sentimentBlock',
    videos: [
      vid('v1', 'Inside TechNet Augusta — exhibitor view', 'YouTube'),
      vid('v2', 'AFCEA TechNet Augusta highlights', 'YouTube'),
      vid('v3', 'On the floor at TechNet Augusta', 'YouTube'),
    ],
  },
  speakers: [
    spk('sp1', 'Army / DoD mission owner'),
    spk('sp2', 'Program / acquisition lead'),
    spk('sp3', 'Cyber / C2 architect'),
    spk('sp4', 'Prime / channel partner'),
  ],
}

const EVENTS = [
  { id: 'event.ai4-2026', live: AI4_LIVE, draft: AI4_DRAFT },
  { id: 'event.technet-augusta-2026', live: TECHNET_LIVE, draft: TECHNET_DRAFT },
]

/* --------------------------------------------------------------------------- */
async function main() {
  for (const ev of EVENTS) {
    const liveFields = Object.keys(ev.live)
    const draftFields = Object.keys(ev.draft)
    console.log(`\n${ev.id}`)
    console.log(`  LIVE  → ${liveFields.join(', ')}`)
    console.log(`  DRAFT → ${draftFields.join(', ')}`)

    if (DRY) continue

    // 1) Patch the published document with the live-safe sections.
    await client.patch(ev.id).set(ev.live).commit()

    // 2) Stage the asset-dependent sections on the draft: published content
    //    (now including the live sections) + placeholders, as drafts.<id>.
    const published = await client.getDocument(ev.id)
    if (!published) throw new Error(`${ev.id} not found after patch`)
    const draftDoc = { ...published, _id: `drafts.${ev.id}`, ...ev.draft }
    delete draftDoc._rev
    delete draftDoc._createdAt
    delete draftDoc._updatedAt
    await client.createOrReplace(draftDoc)
    console.log('  ✓ published patched · draft staged')
  }

  if (DRY) {
    console.log('\n--dry-run: nothing written.')
    return
  }
  console.log('\nDone. Live pages gained agenda/audience/exhibitors/logistics.')
  console.log('Each event has a DRAFT with gallery + sentiment + speakers placeholders')
  console.log('for the client to fill and publish.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
