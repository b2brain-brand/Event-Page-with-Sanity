/**
 * Applies the request-sheet changes + the full b2brain chrome to Sanity.
 *
 *   node scripts/apply-requests.mjs
 *
 * Idempotent. Patches:
 *   - siteSettings: the complete, current b2brain nav/footer chrome (so the
 *     CMS matches the code exactly), plus the copy changes from the sheet
 *     (playbook heading, ROI copy, Motion-01 CTA, exhibitors CTA).
 *   - Dreamforce event: booth range, LTM rate 30%, lead-retrieval copy.
 *   - SE Manufacturing event: lead-retrieval copy.
 *
 * Requires SANITY_API_WRITE_TOKEN.
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

const SITE = 'https://www.b2brain.com'

/* -------------------------------------------------- 1. CHROME + COPY (siteSettings) */
const chrome = {
  logoText: 'B2Brain',
  logoHref: `${SITE}/`,
  navLinks: [
    { _type: 'navLink', _key: 'n1', label: 'Platform', href: `${SITE}/platform` },
    {
      _type: 'navLink',
      _key: 'n2',
      label: 'Use Cases',
      href: `${SITE}/platform`,
      children: [
        { _type: 'childLink', _key: 'c1', label: 'New Pipeline Generation', href: `${SITE}/new-pipeline-generation`, icon: 'pipeline' },
        { _type: 'childLink', _key: 'c2', label: 'Event Attendees', href: `${SITE}/event-attendees`, icon: 'attendees' },
        { _type: 'childLink', _key: 'c3', label: 'Event Exhibitors', href: `${SITE}/event-exhibitors`, icon: 'exhibitors' },
      ],
    },
    { _type: 'navLink', _key: 'n3', label: 'Pricing', href: `${SITE}/pricing` },
    { _type: 'navLink', _key: 'n4', label: 'Events', href: `${SITE}/events`, isCurrent: true },
    { _type: 'navLink', _key: 'n5', label: 'Blogs', href: `${SITE}/blogs` },
  ],
  navLoginLabel: 'Start Free Trial',
  navLoginHref: 'https://apps.apple.com/us/app/b2brain-event-lead-capture/id6757783820',
  navCtaLabel: 'Book a Demo',
  navCtaHref: `${SITE}/demo`,
  footerBlurb:
    'The Event Intelligence Platform. Turn trade show conversations into booked meetings and measurable pipeline. From Offline to Pipeline.',
  footerColumns: [
    { _type: 'footerColumn', _key: 'fc1', heading: 'Overview', links: [
      { _type: 'navLink', _key: 'a', label: 'Platform', href: `${SITE}/platform` },
      { _type: 'navLink', _key: 'b', label: 'Events', href: `${SITE}/events` },
      { _type: 'navLink', _key: 'c', label: 'Blogs', href: `${SITE}/blogs` },
    ]},
    { _type: 'footerColumn', _key: 'fc2', heading: 'Use Cases', links: [
      { _type: 'navLink', _key: 'a', label: 'New Pipeline Generation', href: `${SITE}/new-pipeline-generation` },
      { _type: 'navLink', _key: 'b', label: 'Event Attendees', href: `${SITE}/event-attendees` },
      { _type: 'navLink', _key: 'c', label: 'Event Exhibitors', href: `${SITE}/event-exhibitors` },
    ]},
    { _type: 'footerColumn', _key: 'fc3', heading: 'Company', links: [
      { _type: 'navLink', _key: 'a', label: 'Book a Demo', href: `${SITE}/demo` },
      { _type: 'navLink', _key: 'b', label: 'Pricing', href: `${SITE}/pricing` },
      { _type: 'navLink', _key: 'c', label: 'About us', href: `${SITE}/about` },
    ]},
  ],
  socialLinks: [
    { _type: 'socialLink', _key: 's1', platform: 'instagram', url: 'https://www.instagram.com/getb2brain/' },
    { _type: 'socialLink', _key: 's2', platform: 'x', url: 'https://x.com/getb2brain' },
    { _type: 'socialLink', _key: 's3', platform: 'facebook', url: 'http://facebook.com/b2brain/' },
    { _type: 'socialLink', _key: 's4', platform: 'linkedin', url: 'https://www.linkedin.com/company/b2brain/' },
    { _type: 'socialLink', _key: 's5', platform: 'youtube', url: 'https://www.youtube.com/@b2brain/videos' },
  ],
  contactEmail: 'support@b2brain.com',
  legalLinks: [
    { _type: 'navLink', _key: 'l1', label: 'Privacy', href: `${SITE}/privacy-policy` },
    { _type: 'navLink', _key: 'l2', label: 'Terms', href: `${SITE}/terms-of-service` },
  ],
  newsletterHeading: 'Subscribe Newsletter',
  newsletterPlaceholder: 'Enter your e-mail',
  aiHeading: 'Learn about B2Brain with AI',
  aiLinks: [
    { _type: 'aiLink', _key: 'ai1', label: 'ChatGPT', url: 'https://chatgpt.com/?q=What%20is%20B2Brain', glyph: 'openai' },
    { _type: 'aiLink', _key: 'ai2', label: 'Claude', url: 'https://claude.ai/new?q=What%20is%20B2Brain', glyph: 'claude' },
    { _type: 'aiLink', _key: 'ai3', label: 'Perplexity', url: 'https://www.perplexity.ai/search?q=What%20is%20B2Brain', glyph: 'perplexity' },
    { _type: 'aiLink', _key: 'ai4', label: 'Gemini', url: 'https://gemini.google.com/app', glyph: 'gemini' },
    { _type: 'aiLink', _key: 'ai5', label: 'Grok', url: 'https://grok.com', glyph: 'grok' },
  ],
  footerCopyright: '© 2026 B2Brain, Inc.',
  // ---- request-sheet copy changes (global labels) ----
  'labels.playbookHeadingTemplate': 'Turn {event} from "event spend" to Pipeline Channel',   // Row 2
  'labels.playbookMotion1Cta': 'Take a demo, learn how, and go back with the list for free.', // Row 3
  'labels.exhibitorsCta': 'Want to discuss booth strategies? Book a demo and take back the updated exhibitor list.', // Row 1
  roiLtmCopy:
    'Your **Leads-to-Meeting (LTM) rate is {ltm}** versus an **{avg} industry average** for badge-scanner-only teams. LTM metric moves your Pipeline. B2Brain moves your LTM.', // Row 5 (copy)
}

/* ---------------------------------------------- helper: patch a logistics cell body */
async function patchLeadRetrieval(slug, newBody) {
  const ev = await client.fetch(`*[_type=="event" && slug.current==$slug][0]{ _id, logistics }`, { slug })
  if (!ev) { console.log(`  ! event not found: ${slug}`); return }
  const cells = (ev.logistics?.cells || []).map((c) =>
    /lead retrieval/i.test(c.h || '') ? { ...c, body: newBody, list: undefined } : c,
  )
  await client.patch(ev._id).set({ 'logistics.cells': cells }).commit()
  console.log(`  ${slug}: lead-retrieval copy updated`)
}

async function run() {
  console.log('Applying chrome + request-sheet changes …\n')

  await client.patch('siteSettings').set(chrome).commit()
  console.log('  siteSettings: chrome + copy patched')

  // Row 4 + Row 5 (rate): Dreamforce booth range + LTM meeting rate 30%
  await client
    .patch('event.dreamforce-2026')
    .set({
      'cost.boothRange': 'A 10x10 booth at Dreamforce lands around $35K–$45K before build, travel, and staff.',
      'cost.roi.meetingRate': 30,
    })
    .commit()
  console.log('  dreamforce-2026: booth range + LTM rate 30%')

  // Row 6 + Row 7: lead-retrieval copy
  await patchLeadRetrieval(
    'dreamforce-2026',
    'Dreamforce provides a badge-scan app to sponsors. It gets you contact information of the visitor, not any Context — that is on your team (use cases, needs, blockers, next steps). And it is over 40% more expensive than B2Brain per seat.',
  )
  await patchLeadRetrieval(
    'smts-2026',
    'The organizer offers a basic badge scanner add-on. Confirm pricing with the sponsorship team. Almost none of the badge scanner apps and devices get you Context. They also tend to be 30–60% more expensive than B2Brain, per seat.',
  )

  console.log('\nDone. Publish nothing else — these are the published documents.')
}

run().catch((e) => { console.error(e.message || e); process.exit(1) })
