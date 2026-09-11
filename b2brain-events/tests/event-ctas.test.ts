import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

import { eventCtaDemoHref, eventCtaSrc } from '../src/lib/event-cta'

const PUBLIC_DIR = 'public/events/b2brain-ctas'
const CTA_FILES = [
  '2026-09-10_b2brain_deliverable_bioprocess-cta1.html',
  '2026-09-10_b2brain_deliverable_bioprocess-cta2.html',
  '2026-09-10_b2brain_deliverable_bioprocess-cta3-v2.html',
]

test('all three CTA iframe assets are present', () => {
  for (const file of CTA_FILES) assert.ok(existsSync(`${PUBLIC_DIR}/${file}`), file)
})

test('CTA HTML scripts compile and every local asset reference resolves', () => {
  for (const file of CTA_FILES) {
    const html = readFileSync(`${PUBLIC_DIR}/${file}`, 'utf8')
    assert.match(html, /body\{margin:0;background:transparent;overflow-x:hidden\}/)
    const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
    assert.ok(scripts.length, `${file} has no inline scripts`)
    for (const [, source] of scripts) {
      assert.doesNotThrow(() => new Function(source), `${file} contains invalid JavaScript`)
    }

    const localAssets = [...html.matchAll(/(?:href|src)="([^"]+)"/g)]
      .map(([, value]) => value)
      .filter((value) => !/^(?:https?:|data:|#)/.test(value))
    for (const asset of localAssets) {
      const path = asset.split(/[?#]/, 1)[0]
      assert.ok(existsSync(`${PUBLIC_DIR}/${path}`), `${file} references missing ${path}`)
    }
  }
})

test('event CTA URLs carry the event, dates, start date and the canonical demo destination', () => {
  const src = eventCtaSrc({
    kind: 2,
    eventName: 'CAMX & Advanced Materials 2026',
    eventDates: 'Sep 21–24, 2026',
    startDate: '2026-09-21',
    demoHref: 'https://www.b2brain.com/book-a-demo',
  })
  const url = new URL(src, 'https://www.b2brain.com')

  assert.equal(url.pathname, '/events/b2brain-ctas/2026-09-10_b2brain_deliverable_bioprocess-cta2.html')
  assert.equal(url.searchParams.get('event'), 'CAMX & Advanced Materials 2026')
  assert.equal(url.searchParams.get('dates'), 'Sep 21–24, 2026')
  assert.equal(url.searchParams.get('start'), '2026-09-21')
  assert.equal(url.searchParams.get('demo'), 'https://www.b2brain.com/demo')
})

test('all three CTAs ignore overrides and stay locked to the approved B2Brain demo URL', () => {
  for (const kind of [1, 2, 3] as const) {
    const src = eventCtaSrc({
      kind,
      eventName: 'BioProcess International Conference & Exhibition 2026',
      demoHref: 'https://www.b2brain.com/book-a-demo',
    })
    const url = new URL(src, 'https://www.b2brain.com')
    assert.equal(url.searchParams.get('demo'), 'https://www.b2brain.com/demo')
  }

  assert.equal(eventCtaDemoHref('https://example.com/another-page'), 'https://www.b2brain.com/demo')
  assert.equal(eventCtaDemoHref('javascript:alert(1)'), 'https://www.b2brain.com/demo')
  assert.equal(eventCtaDemoHref(''), 'https://www.b2brain.com/demo')
})

test('CTA placement stays in the approved page order', () => {
  const page = readFileSync('src/components/EventPage.tsx', 'utf8')
  const article = readFileSync('src/components/sections/ArticleSidebar.tsx', 'utf8')

  assert.ok(page.indexOf("id: 'answer'") < page.indexOf("id: 'event-cta-scan-to-crm'"))
  assert.ok(page.indexOf("id: 'event-cta-scan-to-crm'") < page.indexOf("id: 'gallery'"))
  assert.ok(page.indexOf("id: 'compare'") < page.indexOf("id: 'event-cta-multi-format'"))
  assert.ok(page.indexOf("id: 'event-cta-multi-format'") < page.indexOf("id: 'playbook'"))
  assert.ok(article.indexOf('data-event-cta="cta3"') < article.indexOf('artside__ai'))
})

test('the article CTA uses the integrated pale AI footer, never the legacy black card', () => {
  const css = readFileSync('src/app/globals.css', 'utf8')

  assert.match(css, /\.artside\{[^}]*gap:0[^}]*background:#fff[^}]*border:1px solid #e6d9d2/)
  assert.match(css, /\.artside__ai\{background:#fcf6f2;color:#57463c/)
  assert.match(css, /\.artside__ai-icons a\{[^}]*background:#fff[^}]*color:#8f5947/)
  assert.doesNotMatch(css, /\.artside__ai\{[^}]*background:var\(--black\)/)
})

test('the parent verifies both message source and same-origin before resizing', () => {
  const frame = readFileSync('src/components/EventCtaFrame.tsx', 'utf8')
  assert.match(frame, /event\.source !== frame\.contentWindow/)
  assert.match(frame, /event\.origin !== window\.location\.origin/)
  assert.match(frame, /Number\.isFinite\(data\.height\)/)
})
