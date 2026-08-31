import assert from 'node:assert/strict'
import test from 'node:test'

import {
  eventCardTiming,
  eventTimeCounts,
  eventTimeStatus,
  eventsForTimeFilter,
} from '../src/lib/event-status'
import type { IndexEventCard } from '../src/lib/types'

const events = [
  { _id: 'past-old', name: 'Past Old', slug: 'past-old', startDate: '2026-05-01', endDate: '2026-05-03' },
  { _id: 'future', name: 'Future', slug: 'future', startDate: '2026-09-10', endDate: '2026-09-12' },
  { _id: 'past-new', name: 'Past New', slug: 'past-new', startDate: '2026-08-20', endDate: '2026-08-22' },
  { _id: 'live', name: 'Live', slug: 'live', startDate: '2026-08-30', endDate: '2026-08-31' },
  { _id: 'unknown', name: 'Unknown', slug: 'unknown' },
] as IndexEventCard[]

const today = '2026-08-31'

test('an event remains upcoming/current through its final day', () => {
  assert.equal(eventTimeStatus(events[3], today), 'upcoming')
  assert.equal(eventTimeStatus(events[2], today), 'past')
  assert.equal(eventTimeStatus(events[4], today), 'unknown')
})

test('card timing distinguishes coming soon, live, past, and unknown', () => {
  assert.equal(eventCardTiming(events[1], today), 'coming-soon')
  assert.equal(eventCardTiming(events[3], today), 'live')
  assert.equal(eventCardTiming(events[2], today), 'past')
  assert.equal(eventCardTiming(events[4], today), 'unknown')
})

test('upcoming events sort soonest first and exclude undated records', () => {
  assert.deepEqual(
    eventsForTimeFilter(events, 'upcoming', today).map((event) => event._id),
    ['live', 'future'],
  )
})

test('past events sort most recent first', () => {
  assert.deepEqual(
    eventsForTimeFilter(events, 'past', today).map((event) => event._id),
    ['past-new', 'past-old'],
  )
})

test('all preserves the supplied CMS order and counts stay complete', () => {
  assert.deepEqual(eventsForTimeFilter(events, 'all', today), events)
  assert.deepEqual(eventTimeCounts(events, today), { upcoming: 2, past: 2 })
})
