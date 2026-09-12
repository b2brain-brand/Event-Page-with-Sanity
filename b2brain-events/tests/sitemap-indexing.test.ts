import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const eventSitemapRoute = readFileSync(
  'src/app/(site)/events/pages/sitemap.ts',
  'utf8',
)
const rootSitemapRoute = readFileSync('src/app/(site)/sitemap.ts', 'utf8')
const sitemapQuery = readFileSync('sanity/lib/queries.ts', 'utf8')

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
