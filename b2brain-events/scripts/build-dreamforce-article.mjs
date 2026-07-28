/* eslint-disable no-console */
/**
 * Uploads the 4 Dreamforce blog images and writes the full article to the
 * Dreamforce event — the exact live-page content, with images placed in context
 * and given alt text + captions. Run once:  node scripts/build-dreamforce-article.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
for (const l of readFileSync(resolve(here, '..', '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = l.match(/^([A-Z_]+)=(.*)/)
  if (m) process.env[m[1]] = m[2].trim()
}
const c = createClient({
  projectId: 'gwr013fi',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-10-28',
  useCdn: false,
})

const IMG = resolve(here, '..', 'Dreamforce blog images')
let n = 0
const key = () => `b${(n++).toString(36)}${Date.now().toString(36).slice(-3)}`
const span = (text, marks = []) => ({ _type: 'span', _key: key(), text, marks })
const p = (parts) => ({ _type: 'block', _key: key(), style: 'normal', markDefs: [], children: Array.isArray(parts) ? parts : [span(parts)] })
const lead = (b, rest) => p([span(b, ['strong']), span(rest)])
const h2 = (t) => ({ _type: 'block', _key: key(), style: 'h2', markDefs: [], children: [span(t)] })
const bullets = (items) =>
  items.map(([b, rest]) => ({ _type: 'block', _key: key(), style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [span(b + ' ', ['strong']), span(rest)] }))

async function up(file, alt, caption) {
  const asset = await c.assets.upload('image', readFileSync(resolve(IMG, file)), { filename: file })
  return { _type: 'image', _key: key(), asset: { _type: 'reference', _ref: asset._id }, alt, caption }
}

const run = async () => {
  const img1 = await up('img1.png',
    'The illuminated red Dreamforce arch at the Moscone Center entrance at night.',
    'The Dreamforce arch outside Moscone Center — where arrivals begin.')
  const img2 = await up('img2.png',
    '"Welcome to the Agentic Enterprise" banner above the Moscone Center entrance doors.',
    '"Welcome to the Agentic Enterprise" — the 2026 theme, front and centre.')
  const img3 = await up('img3.png',
    'B2Brain booth-ROI calculator: booth cost inputs on the left, conversion and deal-size sliders on the right.',
    'The booth-ROI calculator — enter your real costs and conversion rates.')
  const img4 = await up('img4.png',
    'ROI calculator results: 192% twelve-month ROI, the lead funnel (250 leads, 88 meetings, 2 closed-won), and the numbers.',
    'The output: a 192% twelve-month ROI on the illustrative inputs.')
  console.log('  uploaded 4 images')

  const bookKey = key()
  const X = ' × ' // × spaced

  const article = [
    { _type: 'keyTakeaways', _key: key(), eyebrow: 'KEY TAKEAWAYS', heading: 'Dreamforce 2026 TL;DR', points: [
      'Dreamforce 2026 runs September 15–17 at Moscone Center in San Francisco.',
      'Salesforce lists 1,600+ sessions and expert-led trainings.',
      'The official FAQ lists pass inclusions and the Salesforce+ broadcast experience.',
      'Public pages do not publish official lead-retrieval pricing or scanner packages.',
      'Capture Salesforce cloud footprint, process pain, buying role, and next step.',
      'Merge multiple contacts from the same account before outreach.',
    ] },

    h2('Everything You Need to Know Before You Arrive in San Francisco'),
    lead('Dates and venue:', ' Dreamforce 2026 runs September 15–17, 2026 at Moscone Center in San Francisco, California, with a Salesforce+ broadcast experience.'),
    lead('Scale and audience:', " Salesforce's official pages list Dreamforce 2026 as a three-day San Francisco event with 1,600+ sessions and expert-led trainings, keynotes, workshops, roundtables, networking, the Welcome Reception, and Dreamfest."),
    lead('How to treat the floor:', ' Treat Dreamforce as an account-based event. Multiple people from one target account may touch different sessions, sponsor booths, and side meetings. Merge those signals before follow-up.'),
    img1,

    h2('Field Marketing Tip'),
    p('Capture the Salesforce object behind the pain. Ask whether the issue lives in Sales Cloud, Service Cloud, Marketing Cloud, Data Cloud, Slack, MuleSoft, Tableau, Agentforce, or a cross-cloud workflow. That answer makes follow-up specific.'),

    h2('Know the Buyer Before They Walk Up'),
    lead('Enterprise AI, data, and platform leaders —', ' They evaluate architecture, risk, integration, and speed to value. Capture use case, stack, data readiness, buying role, and timing.'),
    lead('C-suite and transformation executives —', ' They care about strategic outcomes, governance, ROI, and change management. Capture the business initiative and executive sponsor.'),
    lead('Partners, consultants, and system integrators —', ' They can become channel, referral, or co-sell opportunities. Capture customer overlap, partner motion, and next executive step.'),
    lead('Builders, product, and technical evaluators —', ' They ask the sharp implementation questions. Preserve technical detail so the follow-up can involve the right specialist.'),

    h2('Day-by-Day Floor Strategy'),
    lead('Day 1 —', ' Anchor pre-booked meetings and executive conversations before session traffic scatters across the campus.'),
    lead('Day 2 —', ' Use product-keynote themes to refresh booth questions and capture which Salesforce clouds matter to each account.'),
    lead('Day 3 —', ' Book follow-up workshops before Dreamfest hangovers become pipeline amnesia.'),

    h2('Zones and Themes to Track'),
    lead('Agentforce and agentic enterprise —', ' Capture which process the buyer wants agents to improve and who owns the workflow.'),
    lead('Data Cloud, integration, and trust —', ' Ask about data quality, source systems, compliance, and integration path.'),
    lead('Revenue, service, marketing, and customer success transformation —', ' Map the business owner and success metric for each cloud conversation.'),
    img2,

    h2('Lead Retrieval at Dreamforce 2026'),
    p("Dreamforce's public 2026 FAQ points attendees to the Salesforce Events app / Trailblazer account experience and the sponsorship page / prospectus for sponsor participation. The public pages reviewed do not disclose an official exhibitor lead-retrieval product name, badge-scanner license pricing, device pricing, CRM/API add-ons, or order deadlines. Sponsors should confirm the current lead-capture and scanner process inside the Dreamforce sponsor resources or with the Salesforce events sponsorship team."),
    p('Anecdotally, the lead-capture device at Dreamforce has been quite rudimentary — giving you a list of contacts with contact information. Contact-list CSVs are not commitment, nor are they qualification. Dreamforce already lives inside a CRM-centered ecosystem, so the "perceived" bar for contextual follow-up is high.'),
    p([
      span('B2Brain seriously helps you raise the bar on your A-game: go beyond contact capture by preserving what was discussed — '),
      span('Salesforce cloud footprint, business process, data/integration blocker, buying role, partner motion, and next meeting', ['em']),
      span('. That context turns a busy Dreamforce scan into a CRM-ready record and a personalized follow-up that sounds like the actual conversation. In addition to the automated enrichment of leads, the ability to book meetings with them, and the Monday-after report on the week that went by, your Q4 2026 pipeline should be secure.'),
    ]),

    h2('Build Your ROI and Pipeline Math'),
    lead('Illustrative assumption block:', ' assume a $90,000 total sponsor/event investment; 5 booth reps; 3 show days; 9 meaningful conversations per rep per day; 45% qualified-account rate; 35% lead-to-meeting rate; 55% meeting-to-opportunity rate; and $150,000 ACV. Replace these assumptions with your actual booth package, travel cost, ACV, and historical conversion rates.'),
    lead('Formula:', ' total event investment = booth + build + services + travel + sponsorship + lead capture. Meaningful conversations = booth-team capacity' + X + 'show days' + X + 'utilization. Qualified conversations = meaningful conversations' + X + 'qualified-account rate. Meetings booked = qualified conversations' + X + 'lead-to-meeting rate. Opportunities = meetings booked' + X + 'meeting-to-opportunity rate. Expected pipeline = opportunities' + X + 'average contract value. Pipeline multiple = expected pipeline ÷ total event investment.'),
    p([
      span('Worked example: ', ['strong']),
      span('5 reps' + X + '3 days' + X + '9 conversations = 135 meaningful conversations. 135' + X + '45% = 61 qualified conversations. 61' + X + '35% = 21 meetings. 21' + X + '55% = 12 opportunities. 12' + X + '$150,000 assumed ACV = '),
      span('$1.8M modeled pipeline', ['strong']),
      span('. Against $90,000 assumed spend, that is a '),
      span('20× pipeline-to-spend multiple', ['strong']),
      span('.'),
    ]),
    img3,
    ...bullets([
      ['Conservative:', '80 conversations' + X + '30% qualified' + X + '25% meeting rate' + X + '40% opportunity rate' + X + '$150,000 ACV = about $300,000 modeled pipeline.'],
      ['Target:', '135 conversations' + X + '45% qualified' + X + '35% meeting rate' + X + '55% opportunity rate' + X + '$150,000 ACV = about $1.8M modeled pipeline.'],
      ['Strong execution:', '190 conversations' + X + '55% qualified' + X + '45% meeting rate' + X + '60% opportunity rate' + X + '$150,000 ACV = about $4.2M modeled pipeline.'],
    ]),
    img4,
    p('This is planning math, not a guarantee. The practical lever is the number of qualified conversations that leave the venue with context, ownership, and a scheduled next step.'),

    h2('After the Show'),
    p('Follow up by account and Salesforce cloud, not by individual scan order. Combine admin, executive, developer, and partner conversations into one coordinated account plan.'),
    { _type: 'block', _key: key(), style: 'normal', markDefs: [{ _type: 'link', _key: bookKey, href: 'https://www.b2brain.com/demo' }], children: [
      span("We've heard that the Salesforce events team starts work on Dreamforce 2027 in the few days right after the current DF. Given the significance of this event for the Salesforce ecosystem, you can never be too prepared — kick off your strategy today. Brainstorming, or looking for a partner to exchange ideas? "),
      { _type: 'span', _key: key(), text: 'Book a call', marks: [bookKey] },
      span('.'),
    ] },
  ]

  await c.patch('event.dreamforce-2026').set({ article }).commit()
  console.log('  article written:', article.length, 'blocks (incl. 4 images with alt + captions)')
}

run().catch((e) => { console.error(e.message || e); process.exit(1) })
