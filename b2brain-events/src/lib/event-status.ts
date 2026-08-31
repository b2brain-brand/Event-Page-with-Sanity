import type { IndexEventCard } from './types'

export type EventTimeFilter = 'upcoming' | 'past' | 'all'
export type EventCardTiming = 'live' | 'coming-soon' | 'past' | 'unknown'

/**
 * More detailed status used by the visual badge on event cards. A missing
 * start date is never guessed: the card stays unlabelled unless its known end
 * date proves that it is already past.
 */
export function eventCardTiming(
  event: Pick<IndexEventCard, 'startDate' | 'endDate'>,
  today: string,
): EventCardTiming {
  const { startDate, endDate } = event
  const end = endDate || startDate

  if (end && end < today) return 'past'
  if (!startDate) return 'unknown'
  if (startDate > today) return 'coming-soon'
  return 'live'
}

/**
 * Classify against an ISO date supplied by the server so hydration never
 * changes a card's status because the browser is in a different timezone.
 * An event stays upcoming/current through its final day.
 */
export function eventTimeStatus(
  event: Pick<IndexEventCard, 'startDate' | 'endDate'>,
  today: string,
): Exclude<EventTimeFilter, 'all'> | 'unknown' {
  const end = event.endDate || event.startDate
  if (!end) return 'unknown'
  return end < today ? 'past' : 'upcoming'
}

export function eventsForTimeFilter(
  events: IndexEventCard[],
  filter: EventTimeFilter,
  today: string,
): IndexEventCard[] {
  if (filter === 'all') return [...events]

  const scoped = events.filter((event) => eventTimeStatus(event, today) === filter)
  return scoped.sort((a, b) => {
    const aDate = (filter === 'past' ? a.endDate || a.startDate : a.startDate || a.endDate) || ''
    const bDate = (filter === 'past' ? b.endDate || b.startDate : b.startDate || b.endDate) || ''
    return filter === 'past' ? bDate.localeCompare(aDate) : aDate.localeCompare(bDate)
  })
}

export function eventTimeCounts(events: IndexEventCard[], today: string) {
  return events.reduce(
    (counts, event) => {
      const status = eventTimeStatus(event, today)
      if (status !== 'unknown') counts[status] += 1
      return counts
    },
    { upcoming: 0, past: 0 },
  )
}
