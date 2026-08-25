import assert from 'node:assert/strict'
import test from 'node:test'

import {
  eventMonogram,
  hasNumericMetric,
  resolveEventCardCover,
} from '../src/lib/event-card-cover'
import type { IndexEventCard } from '../src/lib/types'

const baseEvent: IndexEventCard = {
  _id: 'event.test-event',
  name: 'Test Event 2026',
  slug: 'test-event',
  startDate: '2026-09-10',
  type: 'Trade Show',
}

test('best case: approved Sanity image takes precedence over a video', () => {
  const event = {
    ...baseEvent,
    cardImage: { asset: { url: 'https://cdn.sanity.io/approved.jpg' } },
    cardImageAlt: 'Approved event floor photograph',
    coverVideoUrl: 'https://www.youtube.com/watch?v=AAAAAAAAAAA',
  } as IndexEventCard

  assert.deepEqual(resolveEventCardCover(event, 'Manufacturing'), {
    kind: 'sanity',
    url: 'https://cdn.sanity.io/approved.jpg',
    alt: 'Approved event floor photograph',
  })
})

test('video-only events use stable artwork instead of a remote video thumbnail', () => {
  const cover = resolveEventCardCover(
    { ...baseEvent, coverVideoUrl: 'https://youtu.be/BBBBBBBBBBB' },
    'Technology',
  )

  assert.equal(cover.kind, 'art')
})

test('worst case: a malformed video URL also uses stable artwork', () => {
  const cover = resolveEventCardCover(
    { ...baseEvent, coverVideoUrl: 'https://www.youtube.com/watch?v=bad' },
    'Energy',
  )

  assert.equal(cover.kind, 'art')
})

test('worst case: missing optional data still creates stable artwork', () => {
  const sparse = { _id: 'event.sparse', name: '', slug: '' } as IndexEventCard
  const first = resolveEventCardCover(sparse)
  const second = resolveEventCardCover(sparse)

  assert.equal(first.kind, 'art')
  assert.deepEqual(first, second)
  if (first.kind === 'art') assert.equal(first.monogram, 'EV')
})

test('generated covers are deterministic and event-specific', () => {
  const first = resolveEventCardCover(baseEvent, 'Manufacturing')
  const second = resolveEventCardCover(
    { ...baseEvent, _id: 'event.second', name: 'Second Summit 2026', slug: 'second-summit' },
    'Manufacturing',
  )

  assert.equal(first.kind, 'art')
  assert.equal(second.kind, 'art')
  assert.notDeepEqual(first, second)
})

test('monograms remove the year and remain readable', () => {
  assert.equal(eventMonogram('The Battery Show and EV Technology Expo 2026'), 'TBS')
  assert.equal(eventMonogram('Groceryshop 2026'), 'GRO')
})

test('placeholder metrics stay hidden while numeric facts render', () => {
  assert.equal(hasNumericMetric('1,000+'), true)
  assert.equal(hasNumericMetric('52%'), true)
  assert.equal(hasNumericMetric('TBA'), false)
  assert.equal(hasNumericMetric('Qualified'), false)
  assert.equal(hasNumericMetric(''), false)
  assert.equal(hasNumericMetric(undefined), false)
})
