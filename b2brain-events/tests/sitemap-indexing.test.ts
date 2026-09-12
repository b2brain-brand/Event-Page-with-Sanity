import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { escapeSitemapXml } from '../src/lib/sitemap-xml'

const eventSitemapRoute = readFileSync(
  'src/app/(site)/events/pages/sitemap.ts',
  'utf8',
)
const rootSitemapRoute = readFileSync('src/app/(site)/sitemap.ts', 'utf8')
const sitemapQuery = readFileSync('sanity/lib/queries.ts', 'utf8')
const sitemapEntries = readFileSync('src/lib/sitemap-entries.ts', 'utf8')

test('event sitemaps cannot serve a stale deployment snapshot', () => {
  for (const route of [eventSitemapRoute, rootSitemapRoute]) {
    assert.match(route, /export const dynamic = 'force-dynamic'/)
    assert.match(route, /export const revalidate = 0/)
  }
})

test('the sitemap query includes every field needed for video watch pages', () => {
  assert.match(sitemapQuery, /heroVideo\{ youtubeUrl, label, caption, openOnYouTube \}/)
  assert.match(sitemapQuery, /sentiment\{ videos\[\]\{ title, src, url, openOnYouTube \} \}/)
})

test('video sitemap player URLs cannot emit raw query-string ampersands', () => {
  assert.match(sitemapEntries, /player_loc: escapeSitemapXml\(video\.embedUrl\.split\('\?'\)\[0\]\)/)
  assert.doesNotMatch(sitemapEntries, /player_loc: video\.embedUrl,/)
})

test('video sitemap values escape XML-reserved characters without double encoding', () => {
  assert.equal(
    escapeSitemapXml('Power & Energy <Expo> "2026" \'Guide\''),
    'Power &amp; Energy &lt;Expo&gt; &quot;2026&quot; &apos;Guide&apos;',
  )
  assert.equal(escapeSitemapXml('Power &amp; Energy'), 'Power &amp; Energy')
})
