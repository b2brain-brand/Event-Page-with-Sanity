/**
 * =============================================================================
 * APPLY BRAND — push the real b2brain.com nav, footer, social and legal links
 * into the live Site settings document.
 * =============================================================================
 *
 *   node scripts/apply-brand.mjs
 *
 * Why this exists: the code carries these URLs as fallbacks, but a value stored
 * in Sanity always wins over a fallback — and Site settings was seeded early
 * with placeholder paths (/platform, /login, /blog). Those placeholders would
 * keep overriding the real URLs until the document is updated.
 *
 * SAFE TO RUN: it patches only the chrome fields on `siteSettings`. It does not
 * touch events, venues, categories, series, or any section label you have
 * edited. Unlike `npm run seed`, nothing is replaced wholesale.
 *
 * Requires SANITY_API_WRITE_TOKEN in .env.local.
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
if (!token) throw new Error('SANITY_API_WRITE_TOKEN is not set (needs write access)')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token,
  apiVersion: '2024-10-28',
  useCdn: false,
})

const SITE = 'https://www.b2brain.com'
const k = (p, i) => `${p}${i}`

const chrome = {
  logoText: 'B2Brain',
  logoHref: `${SITE}/`,

  navLinks: [
    {
      _type: 'navLink',
      _key: 'nav1',
      label: 'Platform',
      href: `${SITE}/platform`,
      children: [
        { _type: 'childLink', _key: 'c1', label: 'New Pipeline Generation', href: `${SITE}/new-pipeline-generation` },
        { _type: 'childLink', _key: 'c2', label: 'Event Attendees', href: `${SITE}/event-attendees` },
        { _type: 'childLink', _key: 'c3', label: 'Event Exhibitors', href: `${SITE}/event-exhibitors` },
      ],
    },
    { _type: 'navLink', _key: 'nav2', label: 'Pricing', href: `${SITE}/pricing` },
    { _type: 'navLink', _key: 'nav3', label: 'Events', href: `${SITE}/events`, isCurrent: true },
    { _type: 'navLink', _key: 'nav4', label: 'Blogs', href: `${SITE}/blogs` },
  ],

  navLoginLabel: 'Start Free Trial',
  navLoginHref: 'https://apps.apple.com/us/app/b2brain-event-lead-capture/id6757783820',
  navCtaLabel: 'Book a Demo',
  navCtaHref: `${SITE}/demo`,

  breadcrumb: {
    _type: 'object',
    homeLabel: 'Home',
    homeHref: `${SITE}/`,
    eventsLabel: 'Events',
    eventsHref: `${SITE}/events`,
  },

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

  footerColumns: [
    {
      _type: 'footerColumn',
      _key: 'fc1',
      heading: 'Platform',
      links: [
        { _type: 'navLink', _key: k('p', 1), label: 'Platform', href: `${SITE}/platform` },
        { _type: 'navLink', _key: k('p', 2), label: 'New Pipeline Generation', href: `${SITE}/new-pipeline-generation` },
        { _type: 'navLink', _key: k('p', 3), label: 'Event Attendees', href: `${SITE}/event-attendees` },
        { _type: 'navLink', _key: k('p', 4), label: 'Event Exhibitors', href: `${SITE}/event-exhibitors` },
      ],
    },
    {
      _type: 'footerColumn',
      _key: 'fc2',
      heading: 'Resources',
      links: [
        { _type: 'navLink', _key: k('r', 1), label: 'Events', href: `${SITE}/events` },
        { _type: 'navLink', _key: k('r', 2), label: 'Blogs', href: `${SITE}/blogs` },
        { _type: 'navLink', _key: k('r', 3), label: 'Pricing', href: `${SITE}/pricing` },
      ],
    },
    {
      _type: 'footerColumn',
      _key: 'fc3',
      heading: 'Company',
      links: [
        { _type: 'navLink', _key: k('c', 1), label: 'About us', href: `${SITE}/about` },
        { _type: 'navLink', _key: k('c', 2), label: 'Book a Demo', href: `${SITE}/demo` },
        { _type: 'navLink', _key: k('c', 3), label: 'Contact', href: 'mailto:support@b2brain.com' },
      ],
    },
  ],

  ctaPrimaryLabel: 'Book a Demo',
  ctaPrimaryHref: `${SITE}/demo`,
  ctaSecondaryHref: `${SITE}/demo`,

  organizationName: 'B2Brain',
  organizationSameAs: [
    'https://www.instagram.com/getb2brain/',
    'https://x.com/getb2brain',
    'https://www.linkedin.com/company/b2brain/',
    'https://www.youtube.com/@b2brain/videos',
  ],
}

const existing = await client.fetch(`*[_id == "siteSettings"][0]{ _id }`)
if (!existing) {
  await client.createOrReplace({ _id: 'siteSettings', _type: 'siteSettings', ...chrome })
  console.log('Created siteSettings with the b2brain.com chrome.')
} else {
  await client.patch('siteSettings').set(chrome).commit()
  console.log('Patched siteSettings.')
}

console.log('')
console.log('  nav        4 links (Platform has a 3-item dropdown)')
console.log('  footer     3 columns, 10 links')
console.log('  social     5 profiles')
console.log('  legal      Privacy, Terms')
console.log('  contact    support@b2brain.com')
console.log('')
console.log('Section labels, ROI copy and every event document were left untouched.')
