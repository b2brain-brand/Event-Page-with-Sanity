import { createClient } from '@sanity/client'

const siteUrl = 'https://www.b2brain.com'

function required(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name}`)
  return value
}

const client = createClient({
  projectId: required('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  dataset: required('NEXT_PUBLIC_SANITY_DATASET'),
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-28',
  token: process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN,
  useCdn: false,
})

function sitemapUrls(xml) {
  return new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]))
}

function metaContent(html, name) {
  const tags = html.match(/<meta\b[^>]*>/gi) || []
  const tag = tags.find((item) =>
    new RegExp(`(?:name|property)=["']${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'i').test(
      item,
    ),
  )
  return tag?.match(/content=["']([^"']*)["']/i)?.[1]
}

function canonicalUrl(html) {
  const tags = html.match(/<link\b[^>]*>/gi) || []
  const tag = tags.find((item) => /rel=["'][^"']*canonical[^"']*["']/i.test(item))
  return tag?.match(/href=["']([^"']+)["']/i)?.[1]
}

function structuredDataTypes(html) {
  const types = new Set()
  for (const match of html.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      const root = JSON.parse(match[1])
      const visit = (value) => {
        if (!value || typeof value !== 'object') return
        if (typeof value['@type'] === 'string') types.add(value['@type'])
        for (const child of Object.values(value)) visit(child)
      }
      visit(root)
    } catch {
      types.add('INVALID_JSON_LD')
    }
  }
  return [...types]
}

async function inspectUrl(url, kind, submitted) {
  try {
    const response = await fetch(url, {
      redirect: 'manual',
      headers: { 'user-agent': 'B2BrainIndexabilityAudit/1.0 (+https://www.b2brain.com/)' },
    })
    const html = response.status === 200 ? await response.text() : ''
    const canonical = canonicalUrl(html)
    const robots = `${metaContent(html, 'robots') || ''},${response.headers.get('x-robots-tag') || ''}`
    const types = structuredDataTypes(html)
    const issues = []

    if (response.status !== 200) issues.push(`HTTP_${response.status}`)
    if (/noindex/i.test(robots)) issues.push('NOINDEX')
    if (!canonical) issues.push('MISSING_CANONICAL')
    else if (canonical.replace(/\/$/, '') !== url.replace(/\/$/, '')) issues.push('CANONICAL_MISMATCH')
    if (!submitted) issues.push('MISSING_FROM_SITEMAP')
    if (kind === 'event' && !types.includes('Event')) issues.push('MISSING_EVENT_JSON_LD')
    if (types.includes('INVALID_JSON_LD')) issues.push('INVALID_JSON_LD')

    return {
      url,
      kind,
      status: response.status,
      canonical,
      robots: robots.replace(/^,|,$/g, ''),
      structuredDataTypes: types,
      internalWatchLinks:
        kind === 'event'
          ? new Set(
              [...html.matchAll(/href=["'](\/events\/[^"']+\/videos\/[\w-]{11})["']/g)].map(
                (match) => match[1],
              ),
            ).size
          : undefined,
      issues,
    }
  } catch (error) {
    return { url, kind, status: 0, issues: [`FETCH_ERROR: ${error.message}`] }
  }
}

async function mapLimited(items, limit, task) {
  const results = new Array(items.length)
  let cursor = 0
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (cursor < items.length) {
        const index = cursor++
        results[index] = await task(items[index])
      }
    }),
  )
  return results
}

const [events, rootSitemapResponse, eventSitemapResponse] = await Promise.all([
  client.fetch(`
    *[_type == "event" && !(_id in path("drafts.**")) && defined(slug.current)]
      | order(slug.current asc){ name, "slug": slug.current }
  `),
  fetch(`${siteUrl}/sitemap.xml`),
  fetch(`${siteUrl}/events/pages/sitemap.xml`),
])

if (!rootSitemapResponse.ok || !eventSitemapResponse.ok) {
  throw new Error(
    `Sitemap fetch failed: root=${rootSitemapResponse.status}, events=${eventSitemapResponse.status}`,
  )
}

const [rootSitemapXml, eventSitemapXml] = await Promise.all([
  rootSitemapResponse.text(),
  eventSitemapResponse.text(),
])
const rootUrls = sitemapUrls(rootSitemapXml)
const eventUrls = sitemapUrls(eventSitemapXml)
const publishedEvents = events.map((event) => ({
  name: event.name,
  slug: event.slug,
  url: `${siteUrl}/events/${event.slug}`,
}))
const learningUrls = [...rootUrls].filter((url) => /\/blogs(?:\/|$)/.test(url))

const [eventChecks, learningChecks] = await Promise.all([
  mapLimited(publishedEvents, 8, (event) => inspectUrl(event.url, 'event', eventUrls.has(event.url))),
  mapLimited(learningUrls, 8, (url) => inspectUrl(url, 'learning', rootUrls.has(url))),
])

const allChecks = [...eventChecks, ...learningChecks]
const issues = allChecks.filter((result) => result.issues.length)

console.log(
  JSON.stringify(
    {
      auditedAt: new Date().toISOString(),
      summary: {
        publishedSanityEvents: publishedEvents.length,
        submittedEventPages: publishedEvents.filter((event) => eventUrls.has(event.url)).length,
        submittedVideoWatchPages: [...eventUrls].filter((url) => /\/events\/[^/]+\/videos\//.test(url))
          .length,
        submittedLearningPages: learningUrls.length,
        checkedUrls: allChecks.length,
        issueUrls: issues.length,
      },
      issues,
    },
    null,
    2,
  ),
)
