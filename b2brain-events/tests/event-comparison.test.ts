import assert from 'node:assert/strict'
import test from 'node:test'
import { eventComparison, SAFE_COMPARISON_ROWS } from '../src/lib/event-comparison'
import type { EventDoc } from '../src/lib/types'

function event(overrides: Partial<EventDoc> = {}): EventDoc {
  return {
    _id: 'event.test-event-2026',
    name: 'Test Event 2026',
    slug: 'test-event-2026',
    ...overrides,
  }
}

test('legacy pages without authored rows receive an evidence-safe comparison', () => {
  const comparison = eventComparison(event())

  assert.equal(comparison.isFallback, true)
  assert.equal(comparison.colScanner, 'Official tool details to verify')
  assert.equal(comparison.colUs, 'B2Brain')
  assert.equal(comparison.rows.length, SAFE_COMPARISON_ROWS.length)
  assert.ok(comparison.rows.length >= 4)
  assert.ok(comparison.rows.every((row) => row.cap && row.scanner && row.us))
  assert.ok(comparison.rows.every((row) => row.cap.length <= 40))
  assert.ok(comparison.rows.every((row) => row.scanner.length <= 140 && row.us.length <= 140))
})

test('complete authored rows remain unchanged', () => {
  const row = { cap: 'Capture', scanner: 'Verified organiser capability', us: 'Verified B2Brain capability' }
  const comparison = eventComparison(
    event({
      compare: {
        intro: 'A sourced comparison.',
        colScanner: 'Verified organiser tool',
        colUs: 'B2Brain',
        rows: [row],
      },
    }),
  )

  assert.equal(comparison.isFallback, false)
  assert.deepEqual(comparison.rows, [row])
  assert.equal(comparison.intro, 'A sourced comparison.')
})

test('incomplete authored rows cannot create an empty comparison section', () => {
  const comparison = eventComparison(
    event({ compare: { rows: [{ cap: 'Capture', scanner: '', us: 'B2Brain' }] } }),
  )

  assert.equal(comparison.isFallback, true)
  assert.ok(comparison.rows.length >= 4)
})
