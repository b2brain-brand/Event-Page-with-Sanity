import type { EventDoc } from './types'

export type EventComparisonRow = {
  cap: string
  scanner: string
  us: string
}

export type EventComparison = {
  intro?: string
  colScanner?: string
  colUs?: string
  rows: EventComparisonRow[]
  isFallback: boolean
}

/**
 * Legacy event documents predate the mandatory comparison contract. Keep those
 * pages complete without inventing capabilities for an unverified organiser
 * tool: the organiser column asks the reader what to confirm, while the
 * B2Brain column uses the approved product claims already used by the site.
 */
export const SAFE_COMPARISON_ROWS: EventComparisonRow[] = [
  {
    cap: 'Contact and context',
    scanner: 'Confirm what the current organiser tool records beyond the attendee contact.',
    us: 'Captures the conversation context, blocker, buying role and next step with the contact.',
  },
  {
    cap: 'Capture time',
    scanner: 'Confirm the current capture workflow and the time required at the booth.',
    us: 'B2Brain reports booth capture in under 30 seconds per conversation.',
  },
  {
    cap: 'Meeting commitment',
    scanner: 'Confirm whether a rep can book the next meeting during the floor conversation.',
    us: 'B2Brain supports booking the next meeting during the floor conversation.',
  },
  {
    cap: 'Pre-event targeting',
    scanner: 'Confirm whether account-level briefings are available before the event opens.',
    us: 'B2Brain briefs reps on target accounts before the doors open.',
  },
  {
    cap: 'CRM attribution',
    scanner: 'Confirm what reaches the CRM beyond a contact record.',
    us: 'B2Brain reports event-to-CRM deal and opportunity attribution, not contact sync alone.',
  },
  {
    cap: 'Morning-after report',
    scanner: 'Confirm which post-event reports are available and when they are delivered.',
    us: 'B2Brain delivers its offline-to-pipeline report to the CMO by 9am.',
  },
]

export function eventComparison(event: EventDoc): EventComparison {
  const authoredRows = (event.compare?.rows || []).filter(
    (row): row is EventComparisonRow =>
      Boolean(row?.cap?.trim() && row?.scanner?.trim() && row?.us?.trim()),
  )

  if (authoredRows.length) {
    return {
      intro: event.compare?.intro,
      colScanner: event.compare?.colScanner,
      colUs: event.compare?.colUs,
      rows: authoredRows,
      isFallback: false,
    }
  }

  return {
    intro:
      `${event.name} does not yet have verified current-edition feature evidence for a named ` +
      'official lead-capture tool in this page. The organiser column therefore lists the details ' +
      'an exhibitor should confirm before ordering.',
    colScanner: 'Official tool details to verify',
    colUs: 'B2Brain',
    rows: SAFE_COMPARISON_ROWS,
    isFallback: true,
  }
}
