/**
 * =============================================================================
 * IMPORT — Webflow `Events` CMS collection  ->  Sanity `event` documents.
 * =============================================================================
 *
 *   node scripts/import-webflow.mjs --slug=ai4-2026,technet-augusta-2026 --dry-run
 *   node scripts/import-webflow.mjs --slug=ai4-2026 --publish
 *   node scripts/import-webflow.mjs --upcoming --dry-run
 *
 * WHY THIS EXISTS
 * The 29 event pages on b2brain.com are Webflow CMS items, not hand-built
 * pages, so the whole set can be lifted field-by-field instead of retyped. The
 * slug is preserved exactly — /events/<slug> resolves to the same URL after the
 * cutover, so nothing 404s and no redirect is needed.
 *
 * SOURCE (either one)
 *   WEBFLOW_API_TOKEN in .env.local  ->  pulls live from the Webflow Data API
 *   --file=path/to/items.json        ->  reads a saved dump (array of items,
 *                                        or the raw list_collection_items body)
 *
 * FLAGS
 *   --slug=a,b     only these slugs            --upcoming   startDate >= today
 *   --all          every item in the source    --dry-run    print, write nothing
 *   --publish      write live docs (default)   --draft      write as drafts.<id>
 *   --skip=a,b     never touch these slugs (defaults to the hand-built pages)
 *   --file=…       read items from disk instead of the API
 *
 * SAFETY
 *  - Deterministic ids (`event.<slug>`) — re-running updates in place, it never
 *    duplicates. `createOrReplace` on the event, `createIfNotExists` on venues
 *    and categories so hand-edits to those survive.
 *  - `--skip` defaults to dreamforce-2026, whose Sanity document is the richer
 *    hand-built reference. Importing over it would be a downgrade.
 *  - Every value that had to be trimmed, dropped or inferred is printed at the
 *    end under REVIEW. Nothing is silently invented.
 *
 * WHAT WEBFLOW DOES NOT CARRY
 * The Sanity template has sections the Webflow collection has no fields for:
 * gallery, agenda, speakers, exhibitors, audience, logistics, sentiment,
 * heroVideo, officialUrl, registerUrl, sources. Those are left empty on
 * purpose — the template hides an empty module along with its "On this page"
 * link, so the page renders complete either way. Fill them in the Studio as
 * you source them; do not invent numbers to close the gap.
 */

import { createClient } from '@sanity/client'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  htmlToText,
  htmlToParagraphs,
  htmlToPortableText,
} from './lib/html-to-portable-text.mjs'

const here = dirname(fileURLToPath(import.meta.url))

/* ------------------------------------------------------ tiny .env.local reader */
function loadEnv() {
  try {
    const raw = readFileSync(resolve(here, '..', '.env.local'), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch {
    /* no .env.local — rely on the ambient environment */
  }
}
loadEnv()

/* ------------------------------------------------------------------ constants */

const WEBFLOW_EVENTS_COLLECTION_ID =
  process.env.WEBFLOW_EVENTS_COLLECTION_ID || '6a0e1a40cdc0e38eff55fc22'
const WEBFLOW_CATEGORIES_COLLECTION_ID =
  process.env.WEBFLOW_CATEGORIES_COLLECTION_ID || '6a0e1ca6cc7659661161290b'

/** Webflow's `event-type` is an Option field; these are its two option ids. */
const TYPE_BY_OPTION_ID = {
  '8a1fcad691e63f767afa438f4e7f5e5a': 'Trade Show',
  '13f9bb6fc126c944511e56d60b63ffdd': 'Technology Conference',
}

/**
 * Judgement calls the source data cannot make for us. Everything here is a
 * label shown on the /events collection card — Webflow has no equivalent field,
 * and deriving one from `attendees-metrics` ("Thousands", "Mission-focused")
 * produces nonsense. Add a slug here before importing a featured event.
 */
const OVERRIDES = {
  'ai4-2026': { cardStat: 'Enterprise AI' },
  'technet-augusta-2026': { cardStat: 'Army & DoD Mission' },
}

/** Hand-built Sanity documents that must not be overwritten by an import. */
const DEFAULT_SKIP = ['dreamforce-2026', 'smts-2026']

/* ----------------------------------------------------------------------- args */

const argv = process.argv.slice(2)
const flag = (n) => argv.includes(`--${n}`)
const opt = (n, d = '') => {
  const hit = argv.find((a) => a.startsWith(`--${n}=`))
  return hit ? hit.slice(n.length + 3) : d
}
const list = (n, d = []) => {
  const v = opt(n)
  return v ? v.split(',').map((s) => s.trim()).filter(Boolean) : d
}

const ARGS = {
  slugs: list('slug'),
  all: flag('all'),
  upcoming: flag('upcoming'),
  dryRun: flag('dry-run'),
  draft: flag('draft'),
  skip: list('skip', DEFAULT_SKIP),
  file: opt('file'),
  out: opt('out'),
}

/* --------------------------------------------------------------------- sanity */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId) throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is not set.')
if (!token && !ARGS.dryRun) throw new Error('SANITY_API_WRITE_TOKEN is not set (or pass --dry-run).')

const sanity = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

/* ------------------------------------------------------------ small utilities */

const REVIEW = []
const note = (slug, msg) => REVIEW.push(`${slug}  ·  ${msg}`)

const slugify = (s = '') =>
  String(s)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 96)

/**
 * Words a truncated phrase must never end on. Cutting "…innovators across
 * enterprise AI" at 46 characters leaves "…innovators across", which reads like
 * a rendering bug; dropping the dangling token leaves a phrase that still
 * parses as English.
 */
const DANGLING = new Set([
  'and', 'or', 'but', 'across', 'with', 'within', 'listed', 'for', 'to', 'of',
  'the', 'a', 'an', 'at', 'in', 'on', 'by', 'from', 'plus', 'via', 'per',
])

/** Trim to `max` on a word boundary, then drop dangling punctuation and words. */
function clip(s, max, { slug, field } = {}) {
  const t = String(s || '').trim()
  if (!t) return undefined
  if (t.length <= max) return t
  let cut = t.slice(0, max)
  const sp = cut.lastIndexOf(' ')
  if (sp > max * 0.5) cut = cut.slice(0, sp)
  for (;;) {
    const next = cut.replace(/[\s,;:.\-–—]+$/, '')
    const last = next.split(' ').pop()?.toLowerCase()
    if (last && DANGLING.has(last)) {
      cut = next.slice(0, next.length - last.length)
      continue
    }
    cut = next
    break
  }
  if (slug && field) note(slug, `${field} trimmed ${t.length}→${cut.length} chars: "${cut}"`)
  return cut
}

/**
 * Split one long sentence into a headline and a body at its last clause break,
 * so a playbook card never prints its headline again as its own paragraph.
 * Returns null when no split leaves two readable halves.
 */
function splitClause(text, max) {
  const t = String(text || '').trim()
  let best = -1
  for (const m of t.matchAll(/[;,]\s+/g)) {
    const end = m.index
    if (end <= max && t.length - (end + m[0].length) >= 15) best = end
  }
  if (best === -1) return null
  const head = t.slice(0, best).replace(/[\s,;:]+$/, '')
  let tail = t.slice(best + 1).trim().replace(/^(?:and|then)\s+/i, '')
  tail = tail.charAt(0).toUpperCase() + tail.slice(1)
  if (!/[.!?]$/.test(tail)) tail += '.'
  return { head, tail }
}

/**
 * Sentence boundaries, minus the obvious false positive. `(?<!\b[A-Z]\.)` looks
 * back past the period at a single capital letter standing on its own, which
 * keeps "the U.S. Army" and "Washington, D.C. next spring" in one piece — this
 * collection is full of both. A real sentence end ("…mission systems. The")
 * has a lowercase letter there, so it still splits.
 */
const SENTENCE_BREAK = /(?<!\b[A-Z]\.)(?<=[.!?])\s+(?=[A-Z“"(])/

function splitSentences(s) {
  return String(s || '')
    .split(SENTENCE_BREAK)
    .map((x) => x.trim())
    .filter(Boolean)
}

/** Whole sentences up to `max` characters. Falls back to a hard clip. */
function sentences(s, max) {
  const t = String(s || '').replace(/\s+/g, ' ').trim()
  if (!t) return undefined
  if (t.length <= max) return t
  let out = ''
  for (const part of splitSentences(t)) {
    if ((out + ' ' + part).trim().length > max) break
    out = (out + ' ' + part).trim()
  }
  return out || clip(t, max)
}

const num = (s) => Number(String(s || '').replace(/[^0-9.]/g, '')) || undefined

/* ------------------------------------------------------------- webflow source */

async function webflow(path) {
  const res = await fetch(`https://api.webflow.com/v2${path}`, {
    headers: {
      Authorization: `Bearer ${process.env.WEBFLOW_API_TOKEN}`,
      'accept-version': '2.0.0',
    },
  })
  if (!res.ok) throw new Error(`Webflow ${path} → ${res.status} ${await res.text()}`)
  return res.json()
}

async function loadItems() {
  if (ARGS.file) {
    const raw = JSON.parse(readFileSync(resolve(process.cwd(), ARGS.file), 'utf8'))
    const items = Array.isArray(raw) ? raw : raw.items || raw.result?.items
    if (!items) throw new Error(`${ARGS.file} does not look like a Webflow items dump.`)
    return items
  }
  if (!process.env.WEBFLOW_API_TOKEN)
    throw new Error('Set WEBFLOW_API_TOKEN in .env.local, or pass --file=<dump.json>.')

  const items = []
  for (let offset = 0; ; offset += 100) {
    const page = await webflow(
      `/collections/${WEBFLOW_EVENTS_COLLECTION_ID}/items?limit=100&offset=${offset}`,
    )
    items.push(...page.items)
    if (items.length >= (page.pagination?.total ?? items.length)) break
  }
  return items
}

async function loadCategories() {
  // Maps a Webflow category item id -> { title, slug }. Falls back to a static
  // map when reading from a file dump with no API token available.
  if (!process.env.WEBFLOW_API_TOKEN) return null
  const page = await webflow(`/collections/${WEBFLOW_CATEGORIES_COLLECTION_ID}/items?limit=100`)
  const out = {}
  for (const it of page.items) out[it.id] = { title: it.fieldData.name, slug: it.fieldData.slug }
  return out
}

const CATEGORY_FALLBACK = {
  '6a593a6e58338f04487e3df0': { title: 'Marine', slug: 'marine' },
  '6a59389091aa8be11d850d59': { title: 'Automotive', slug: 'automotive' },
  '6a571c1583e3891925682ff6': { title: 'Space Tech', slug: 'space-tech' },
  '6a4ce95db4baea74514b432f': { title: 'Aviation', slug: 'aviation' },
  '6a293540aac8585a2a203e7d': { title: 'Robotics & Automation', slug: 'robotics-automation' },
  '6a2154018e2d0fda1b9f7665': { title: 'Hospitality', slug: 'hospitality' },
  '6a1717c87607ff99c473c8f3': { title: 'Packaging', slug: 'packaging' },
  '6a14846c275b7e86915ae32e': { title: 'Technology', slug: 'technology' },
  '6a14845b0e07ee3419c4be5e': { title: 'Manufacturing', slug: 'manufacturing' },
  '6a148445bfcd341c48a0cbef': { title: 'Construction', slug: 'construction' },
  '6a1484346096f372ba9c0f5a': { title: 'Energy', slug: 'energy' },
  '6a14840e16d8b87387643369': { title: 'Supply Chain', slug: 'supply-chain' },
}

/* --------------------------------------------------------------- asset upload */

const assetCache = new Map()

async function uploadImage(url, filename) {
  if (!url) return undefined
  if (assetCache.has(url)) return assetCache.get(url)
  if (ARGS.dryRun) {
    assetCache.set(url, { _type: 'reference', _ref: `image-DRYRUN-${assetCache.size}` })
    return assetCache.get(url)
  }
  const res = await fetch(url)
  if (!res.ok) {
    console.warn(`  ! image ${res.status} ${url}`)
    return undefined
  }
  const buf = Buffer.from(await res.arrayBuffer())
  const asset = await sanity.assets.upload('image', buf, {
    filename: filename || decodeURIComponent(url.split('/').pop()),
  })
  const ref = { _type: 'reference', _ref: asset._id }
  assetCache.set(url, ref)
  return ref
}

/* ------------------------------------------------------------------- ROI math */

/**
 * The article body carries an "Illustrative assumption block" with the exact
 * seven numbers the Cost & ROI calculator needs. Parsing them is what turns
 * that prose into a working calculator instead of a second, contradictory set
 * of figures on the same page.
 *
 * Two shapes appear in the collection:
 *   prose  — "…$45,000 total…; 4 booth reps; 3 show days; 8 meaningful
 *             conversations per rep per day; 40% qualified-account rate; …"
 *   labelled — "Assumed total event investment: $38,000 / Meaningful
 *             conversations: 120 / Qualified-account rate: 62% / …"
 */
function parseRoi(text, { slug, days }) {
  const t = String(text || '').replace(/\s+/g, ' ')
  const grab = (...res) => {
    for (const re of res) {
      const m = t.match(re)
      if (m) return num(m[1])
    }
    return undefined
  }

  const spend = grab(
    /assume a \$([\d,]+)/i,
    /total event investment:?\s*\$([\d,]+)/i,
    /investment[^.$]*\$([\d,]+)/i,
  )
  const acv = grab(
    /\$([\d,]+)\s*(?:assumed\s*)?ACV/i,
    /average contract value:?\s*\$([\d,]+)/i,
    /ACV[^.$]*\$([\d,]+)/i,
  )
  const qualRate = grab(/(\d+)%\s*qualified-account rate/i, /qualified-account rate:?\s*(\d+)%/i)
  const meetingRate = grab(
    /(\d+)%\s*lead-to-meeting rate/i,
    /meeting conversion:?\s*(\d+)%/i,
    /(\d+)%\s*meeting rate/i,
  )
  let reps = grab(/(\d+)\s*booth reps/i)
  let convosPerRepDay = grab(/(\d+)\s*meaningful conversations per rep per day/i)
  const showDays = grab(/(\d+)\s*(?:show|programme\/expo|expo|conference)\s*days/i) || days

  // The labelled shape gives a single total instead of reps × convos. Split it
  // into whole numbers that multiply back to exactly that total, so the
  // calculator's opening state reproduces the figure printed in the article.
  if ((!reps || !convosPerRepDay) && showDays) {
    const total = grab(/meaningful conversations:?\s*([\d,]+)/i)
    if (total) {
      for (const r of [4, 5, 6, 3, 7, 8]) {
        if (total % (r * showDays) === 0) {
          reps = r
          convosPerRepDay = total / (r * showDays)
          note(slug, `ROI: article gives ${total} total conversations — split as ${r} reps × ${showDays} days × ${convosPerRepDay}/day`)
          break
        }
      }
    }
  }

  const roi = { spend, reps, days: showDays, convosPerRepDay, qualRate, meetingRate, acv }
  const missing = Object.entries(roi).filter(([, v]) => v == null).map(([k]) => k)
  if (missing.length) {
    note(slug, `Cost & ROI section left empty — could not parse: ${missing.join(', ')}`)
    return undefined
  }

  // The article models five stages (…→ meetings → opportunities → pipeline);
  // the calculator models four and stops at meetings × ACV. Feeding each number
  // into the field that genuinely means that thing therefore produces a bigger
  // multiple than the article's own worked example. That is a schema gap, not a
  // parse error — but an implausible multiple on a live page costs credibility,
  // so say so rather than quietly shipping it.
  const meetings = reps * showDays * convosPerRepDay * (qualRate / 100) * (meetingRate / 100)
  const multiple = (meetings * acv) / spend
  if (multiple > 20) {
    note(
      slug,
      `CHECK THE ROI CALCULATOR — defaults imply ${multiple.toFixed(0)}× return ($${Math.round(
        (meetings * acv) / 1000,
      )}K pipeline on $${Math.round(spend / 1000)}K). The calculator stops at meetings × ACV, ` +
        `while the article also applies a meeting-to-opportunity rate. Lower ACV to an ` +
        `opportunity-weighted figure, or accept the divergence.`,
    )
  }

  return { _type: 'roiInputs', ...roi }
}

/**
 * The paragraph that sits above the calculator and answers "how much does it
 * cost to exhibit at [event]". Taken from the article rather than written: the
 * first line that names a dollar investment figure. Stacked label lists
 * ("Assumed spend: $X / Conversations: N / …") are rejected — they read as a
 * table, not a paragraph, and the calculator already shows those numbers.
 */
function boothParagraph(text, slug) {
  const lines = String(text || '')
    .split(/\n+|(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
  for (const line of lines) {
    if (!line.includes('$')) continue
    if (!/invest|booth|sponsor|spend/i.test(line)) continue
    if (line.length > 400 || (line.match(/:/g) || []).length > 1) {
      note(slug, `booth-cost paragraph left empty — the article's cost line is a label list, not prose`)
      return undefined
    }
    return line
  }
  note(slug, 'booth-cost paragraph left empty — no dollar figure found in the article')
  return undefined
}

/* ------------------------------------------------------------------- mapping */

async function mapEvent(item, categories) {
  const f = item.fieldData
  const slug = f.slug
  const name = f.name
  const ov = OVERRIDES[slug] || {}

  const startDate = (f['event-start-date-schema'] || '').slice(0, 10)
  const endDate = (f['event-end-date-schema'] || '').slice(0, 10)
  const dayCount =
    startDate && endDate
      ? Math.round((Date.parse(endDate) - Date.parse(startDate)) / 86400000) + 1
      : undefined

  /* ---- venue -------------------------------------------------------------- */
  const venueName = (f.venue || '').trim()
  const venueId = venueName ? `venue.${slugify(venueName)}` : undefined
  const venueDoc = venueName
    ? {
        _id: venueId,
        _type: 'venue',
        name: clip(venueName, 80, { slug, field: 'venue.name' }),
        slug: { _type: 'slug', current: slugify(venueName) },
        city: clip(f['city-state'] || '', 48, { slug, field: 'venue.city' }),
        country: /,\s*(UAE|Saudi Arabia|UK|Germany|France|Spain|Italy|Netherlands|Canada|India|Singapore|Japan|Australia)$/i.test(
          f['city-state'] || '',
        )
          ? undefined
          : 'US',
      }
    : undefined
  if (venueDoc && !venueDoc.country) delete venueDoc.country

  /* ---- category ----------------------------------------------------------- */
  const cat = (categories || CATEGORY_FALLBACK)[f['event-category']]
  const catId = cat ? `category.${cat.slug}` : undefined
  const catDoc = cat
    ? { _id: catId, _type: 'eventCategory', title: cat.title, slug: { _type: 'slug', current: cat.slug } }
    : undefined
  if (!cat && f['event-category']) note(slug, `unknown Webflow category id ${f['event-category']} — categories left empty`)

  // Read ahead of the hero: the quick answer below needs to know what the Why
  // section is going to say so it does not repeat it.
  const whyBody = htmlToParagraphs(f['why-section-paragraph']).slice(0, 4)

  /* ---- hero --------------------------------------------------------------- */
  // Webflow's H1 repeats the event name, which the template already renders as
  // the H1 from `name`. Strip the prefix so the sub-headline is not a stutter.
  const stripped = String(f['hero-title-h1'] || '')
    .replace(new RegExp(`^\\s*${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*[-–—:]\\s*`, 'i'), '')
    .trim()
  const tagline = clip(stripped.charAt(0).toUpperCase() + stripped.slice(1), 200, {
    slug,
    field: 'tagline',
  })

  const heroPara = String(f['hero-paragraph'] || '').replace(/\s+/g, ' ').trim()
  const subhead = sentences(heroPara, 260)

  /* ---- quick answer ------------------------------------------------------- */
  // The purple box has to work as a standalone, liftable answer: dates, venue,
  // city, then why an exhibitor cares. Several Webflow items reuse the hero
  // paragraph verbatim as the "why it matters" body, and printing it twice a
  // screen apart looks like a bug — so sentences already used by the Why
  // section are not carried into the quick answer.
  const where = [venueName, f['city-state']].filter(Boolean).join(', ')
  const dateLine = [f['date-range'], f.year].filter(Boolean).join(', ')
  const tldrHead = `${name} runs ${dateLine}${where ? ` at ${where}` : ''}.`
  // Compare on normalised text: the same sentence is routinely pasted into both
  // fields with a different dash ("theme - C2" vs "theme—C2"), and a literal
  // comparison lets it through to be printed twice, a screen apart.
  const norm = (s) =>
    String(s || '').toLowerCase().replace(/[–—-]/g, ' ').replace(/\s+/g, ' ').trim()
  const whyText = norm(whyBody.join(' '))
  const heroSentences = splitSentences(heroPara)
  const fresh = heroSentences.filter((s) => !whyText.includes(norm(s).slice(0, 60)))
  const deduped = fresh.length !== heroSentences.length
  let tldrBody = ''
  // Nothing left means the hero and Why copy are the same paragraph. Do NOT
  // take a sentence back — the stats and attendee top-ups below fill the box
  // with facts that appear nowhere else on the page, which is worth more than
  // reprinting the Why opener one screen above itself.
  for (const s of fresh) {
    if ((tldrHead + ' ' + tldrBody + ' ' + s).trim().length > 700) break
    tldrBody = (tldrBody + ' ' + s).trim()
  }
  if (deduped)
    note(slug, 'quick answer de-duplicated — Webflow reuses the hero paragraph as the Why body')
  let tldr = `${tldrHead} ${tldrBody}`.trim()

  /* ---- stats -------------------------------------------------------------- */
  // `num` is a 12-character slot (Archivo 44px). Webflow lets editors type a
  // phrase there ("Mission-focused"); those cells are dropped rather than
  // truncated into something meaningless, and reported under REVIEW.
  const statSpec = [
    ['Attendees', f['attendees-metrics'], f['attendees-details']],
    ['Exhibitors', f['exhibitors-metrics'], f['exhibitors-details']],
    ['Sessions', f['sessions-metrics'], f['sessions-details']],
    ['Show floor', f['show-floor-metrics'], f['show-floor-details']],
  ]
  const stats = []
  for (const [label, n, meta] of statSpec) {
    const v = String(n || '').trim()
    if (!v) continue
    if (v.length > 12) {
      note(slug, `stat "${label}" dropped — value "${v}" does not fit the 12-char number slot`)
      continue
    }
    // "3 days" and "170K+" are both fine in the 44px slot; "400+ market" and
    // "Multi-format" are editor prose that reads oddly as a headline number.
    if (!/^[\d.,]+\s*[KMB]?\+?$/i.test(v) && !/^\d+\s*(days?|halls?|hrs?)$/i.test(v))
      note(slug, `stat "${label}" number is "${v}" — reads as prose, not a figure; consider a sourced number`)
    stats.push({
      _type: 'statCell',
      _key: `s${stats.length + 1}`,
      num: v,
      label,
      meta: clip(meta, 46, { slug, field: `stats.${label}.meta` }),
    })
  }
  if (stats.length === 3) note(slug, 'only 3 stat cells — the strip is a 4-up grid, consider sourcing a 4th or cutting to 2')

  // De-duplicating the quick answer can leave it too thin to work as a liftable
  // paragraph. Top it up with the scale numbers already sourced into the stats
  // strip — the shape the reference Dreamforce page uses — never a new claim.
  if (tldr.length < 300) {
    const figures = stats
      .filter((s) => /^[\d.,]+\s*[KMB]?\+?$/i.test(s.num))
      .map((s) => `${s.num} ${s.label.toLowerCase()}`)
    if (figures.length) {
      const phrase =
        figures.length > 1
          ? `${figures.slice(0, -1).join(', ')} and ${figures[figures.length - 1]}`
          : figures[0]
      tldr = `${tldr} The ${f.year || 'current'} edition lists ${phrase}.`
      note(slug, `quick answer topped up with sourced stats: ${figures.join(', ')}`)
    }
    // Still thin — add who attends. On shows whose attendee "number" was prose
    // this is the only place that audience descriptor lands on the page at all.
    let who = String(f['attendees-details'] || '').trim()
    // Lower-case the lead word only when it is ordinary prose — "U.S. Army"
    // and "DoD" must keep their capitals.
    if (/^[A-Z][a-z]/.test(who)) who = who.charAt(0).toLowerCase() + who.slice(1)
    if (tldr.length < 300 && who) {
      tldr = `${tldr} Attendees are ${who}${/[.!?]$/.test(who) ? '' : '.'}`
      note(slug, 'quick answer topped up with the attendee descriptor')
    }
    // Last resort: a date line on its own is not an answer. Better a repeated
    // sentence than an empty box — and it gets flagged for a human rewrite.
    if (tldr.length < 140 && heroSentences.length) {
      tldr = `${tldr} ${heroSentences[0]}`.trim()
      note(slug, 'QUICK ANSWER NEEDS A REWRITE — every source sentence is reused by the Why section')
    }
  }

  /* ---- why ---------------------------------------------------------------- */
  const why =
    f['why-section-title-h2---should-come-under-the-tag-of-why-event-matters'] || whyBody.length
      ? {
          _type: 'whyBlock',
          headline: clip(
            f['why-section-title-h2---should-come-under-the-tag-of-why-event-matters'],
            180,
            { slug, field: 'why.headline' },
          ),
          body: whyBody,
        }
      : undefined

  /* ---- playbook ----------------------------------------------------------- */
  // Two shapes in the collection: some items put the motion eyebrow in the
  // title field ("PRE-EVENT · TARGET LIST"), which the template already renders
  // itself; others put a real headline there. When it is an eyebrow the first
  // sentence of the body is promoted to the headline instead of printing the
  // label twice.
  const motion = (title, html) => {
    const body = htmlToText(html)
    if (!title && !body) return undefined
    const isEyebrow = /^[A-Z0-9 ·•+&/,'’\-–—]+$/.test(String(title || '').trim())
    if (isEyebrow || !title) {
      const parts = splitSentences(body)
      const first = parts.shift() || body
      const rest = parts.join(' ')
      // Multi-sentence body: lead sentence becomes the headline, the rest the
      // paragraph. Single long sentence: break it at its last clause instead,
      // which keeps every word without printing the headline twice.
      if (rest) return { _type: 'playbookMotion', h: clip(first, 110, { slug, field: 'playbook.h' }), b: clip(rest, 420) }
      const split = first.length > 110 ? splitClause(first, 110) : null
      if (split) return { _type: 'playbookMotion', h: split.head, b: split.tail }
      return { _type: 'playbookMotion', h: clip(first, 110, { slug, field: 'playbook.h' }) }
    }
    return {
      _type: 'playbookMotion',
      h: clip(title, 110, { slug, field: 'playbook.h' }),
      b: clip(body, 420, { slug, field: 'playbook.b' }),
    }
  }
  const pre = motion(
    f['playbook-item-1-title-would-be-card-based-for-eg-for-pre-event-target-list'],
    f['playbook-item-1-paragraph'],
  )
  const floor = motion(
    f['playbook-item-2-title-would-be-card-based-for-eg-for-on-the-floor-capture-book'],
    f['playbook-item-2-paragraph'],
  )
  const post = motion(
    f['playbook-item-3-title-would-be-card-based-for-eg-post-event-ltm-attribution'],
    f['playbook-item-3-paragraph'],
  )
  const playbook = pre || floor || post ? { _type: 'playbookBlock', pre, floor, post } : undefined

  /* ---- article ------------------------------------------------------------ */
  const bodyHtml = f['5th-section-paragraph---rich-text'] || ''
  const onImage = async ({ src, alt, caption }) => {
    const asset = await uploadImage(src)
    if (!asset) return null
    return { _type: 'image', asset, alt: alt || caption || undefined, caption: caption || undefined }
  }

  const article = []

  const takeaways = htmlToParagraphs(f['key-takeaways-from-event'])
  if (takeaways.length) {
    article.push({
      _type: 'keyTakeaways',
      _key: 'kt',
      eyebrow: 'KEY TAKEAWAYS',
      heading: `${name} TL;DR`,
      points: takeaways,
    })
  }

  article.push(...(await htmlToPortableText(bodyHtml, { keyPrefix: 'a', onImage })))

  // "B2Brain at [event]" — Webflow renders this as its own section; the Sanity
  // template has no equivalent slot, so it lands as the closing H2 of the
  // article, immediately before the FAQ and the site-wide CTA banner.
  const b2bTitle = f['3rd-section-title-h2-for-example-should-come-under-tag-of-b2brain-at-event']
  const b2bBody = f['3rd-section-paragraph']
  if (b2bTitle || b2bBody) {
    const blocks = await htmlToPortableText(`<h2>${b2bTitle || ''}</h2>${b2bBody || ''}`, {
      keyPrefix: 'z',
    })
    article.push(...blocks)
  }

  /* ---- faq ---------------------------------------------------------------- */
  const faq = []
  for (let i = 1; i <= 7; i++) {
    const q = f[`faq---question-${i}`]
    const a = htmlToText(f[`faq---answer-${i}`])
    if (!q || !a) continue
    faq.push({
      _type: 'faqItem',
      _key: `q${i}`,
      q: clip(q, 120, { slug, field: `faq.${i}.q` }),
      a: clip(a, 600, { slug, field: `faq.${i}.a` }),
    })
  }

  /* ---- cost --------------------------------------------------------------- */
  const articleText = htmlToText(bodyHtml)
  const roi = parseRoi(articleText, { slug, days: dayCount })
  const cost = roi
    ? { _type: 'costBlock', boothRange: boothParagraph(articleText, slug), roi }
    : undefined

  /* ---- seo ---------------------------------------------------------------- */
  const ogImage = f['open-graph-image-cro']?.url
    ? { _type: 'image', asset: await uploadImage(f['open-graph-image-cro'].url) }
    : undefined

  const doc = {
    _id: `event.${slug}`,
    _type: 'event',
    name,
    slug: { _type: 'slug', current: slug },
    type: TYPE_BY_OPTION_ID[f['event-type']] || 'Trade Show',
    tagline,
    subhead,
    startDate,
    endDate,
    venue: venueId ? { _type: 'reference', _ref: venueId } : undefined,
    format: 'In-person',
    hashtag: clip(f.hashtag, 24, { slug, field: 'hashtag' }),
    categories: catId ? [{ _type: 'reference', _key: 'c1', _ref: catId }] : undefined,
    cardStat: clip(ov.cardStat, 40),
    cardAudience: clip(f['attendees-details'], 90, { slug, field: 'cardAudience' }),
    cardHeadline: clip(f['hero-title-h1'], 160, { slug, field: 'cardHeadline' }),
    stats: stats.length ? stats : undefined,
    tldr: clip(tldr, 900),
    why,
    cost,
    playbook,
    autoFillRelated: true,
    article: article.length ? article : undefined,
    faq: faq.length ? faq : undefined,
    ctaHeadline: clip(f['footer-cta-title'], 160, { slug, field: 'ctaHeadline' }),
    seo: {
      _type: 'seo',
      metaTitle: clip(f['meta-title-seo'], 120, { slug, field: 'seo.metaTitle' }),
      metaDescription: clip(f['meta-description-seo'], 260, { slug, field: 'seo.metaDescription' }),
      ogImage,
      noIndex: false,
    },
    lastUpdated: (item.lastUpdated || item.lastPublished || new Date().toISOString()).slice(0, 10),
    publishedAt: item.createdOn || undefined,
    isFeatured: Boolean(f.featured),
  }

  // Sanity rejects explicit undefined inside a document body.
  for (const k of Object.keys(doc)) if (doc[k] === undefined) delete doc[k]
  if (doc.seo) for (const k of Object.keys(doc.seo)) if (doc.seo[k] === undefined) delete doc.seo[k]

  if (!f['open-graph-image-cro']?.url) note(slug, 'no OG image in Webflow — falls back to the site default')
  if (f['hero-image']?.url) note(slug, 'Webflow hero image not imported — the Sanity hero uses a video, and /events cards are text-only (set cardImage in the Studio if you want it)')

  return { doc, venueDoc, catDoc }
}

/* --------------------------------------------------------------------- main */

async function main() {
  const today = new Date().toISOString().slice(0, 10)
  const items = await loadItems()
  const categories = ARGS.file && !process.env.WEBFLOW_API_TOKEN ? null : await loadCategories()

  let selected = items
  if (ARGS.slugs.length) selected = items.filter((i) => ARGS.slugs.includes(i.fieldData.slug))
  else if (ARGS.upcoming)
    selected = items.filter((i) => (i.fieldData['event-start-date-schema'] || '').slice(0, 10) >= today)
  else if (!ARGS.all) {
    console.error('Pass --slug=a,b, --upcoming, or --all.')
    process.exit(1)
  }

  const skipped = selected.filter((i) => ARGS.skip.includes(i.fieldData.slug))
  selected = selected.filter((i) => !ARGS.skip.includes(i.fieldData.slug))
  selected.sort((a, b) =>
    (a.fieldData['event-start-date-schema'] || '').localeCompare(b.fieldData['event-start-date-schema'] || ''),
  )

  console.log(`\nSource: ${ARGS.file || 'Webflow API'} — ${items.length} items, ${selected.length} selected`)
  for (const s of skipped) console.log(`  skip  ${s.fieldData.slug} (hand-built in Sanity)`)
  if (!selected.length) return

  const tx = sanity.transaction()
  const seenSupport = new Set()
  const mapped = []

  for (const item of selected) {
    const { doc, venueDoc, catDoc } = await mapEvent(item, categories)
    const id = ARGS.draft ? `drafts.${doc._id}` : doc._id
    mapped.push(doc)

    console.log(
      `\n  ${doc.slug.current}\n` +
        `    ${doc.startDate} → ${doc.endDate}  ·  ${doc.type}\n` +
        `    stats ${doc.stats?.length ?? 0} · faq ${doc.faq?.length ?? 0} · article ${doc.article?.length ?? 0} blocks` +
        ` · why ${doc.why ? 'yes' : 'no'} · playbook ${doc.playbook ? 'yes' : 'no'} · cost ${doc.cost ? 'yes' : 'no'}`,
    )

    if (ARGS.dryRun) continue

    for (const support of [venueDoc, catDoc]) {
      if (support && !seenSupport.has(support._id)) {
        seenSupport.add(support._id)
        tx.createIfNotExists(support)
      }
    }
    tx.createOrReplace({ ...doc, _id: id })
  }

  if (ARGS.out) {
    writeFileSync(resolve(process.cwd(), ARGS.out), JSON.stringify(mapped, null, 2))
    console.log(`\nMapped documents written to ${ARGS.out} for review.`)
  }

  if (ARGS.dryRun) {
    console.log('\n--dry-run: nothing written.')
  } else {
    await tx.commit()
    console.log(`\nWrote ${selected.length} event document(s)${ARGS.draft ? ' as drafts' : ''}.`)
  }

  if (REVIEW.length) {
    console.log('\nREVIEW — values trimmed, dropped or inferred:')
    for (const r of REVIEW) console.log(`  · ${r}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
