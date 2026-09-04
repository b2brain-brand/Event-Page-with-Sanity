import assert from 'node:assert/strict'
import test from 'node:test'
import { articleTocMarker, EVENT_ARTICLE_TOC_MARKERS } from '../src/lib/article-toc'

test('maps the canonical 28 H2 blocks to concise keyword markers', () => {
  assert.equal(EVENT_ARTICLE_TOC_MARKERS.length, 28)
  assert.equal(articleTocMarker('What is this event and why does it matter?', 0, 2), 'Overview')
  assert.equal(articleTocMarker('How can exhibitors identify target accounts?', 15, 2), 'Target Accounts')
  assert.equal(articleTocMarker('How should exhibitors measure event ROI?', 27, 2), 'ROI')
  assert.ok(EVENT_ARTICLE_TOC_MARKERS.every((marker) => marker.length <= 22))
})

test('compacts a non-canonical heading without changing the visible H2', () => {
  assert.equal(articleTocMarker('How can teams prepare for this unusually detailed event workflow?', 28, 2), 'teams prepare for this unusually…')
  assert.equal(articleTocMarker('Where to eat?', 0, 3), 'to eat')
})
