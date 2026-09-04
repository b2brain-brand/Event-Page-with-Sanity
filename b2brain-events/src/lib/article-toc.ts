/**
 * Short navigation markers for the canonical 28-question event article.
 *
 * The visible H2 stays long and answer-engine friendly. Only the sticky TOC
 * receives the compact keyword label, so navigation is scannable without
 * weakening the article heading or its anchor.
 */
export const EVENT_ARTICLE_TOC_MARKERS = [
  'Overview',
  'Who Should Attend',
  'Dates & Hours',
  'Daily Plan',
  'Venue Layout',
  'Local Navigation',
  'Registration',
  'Access Rules',
  'Hotels',
  'Travel Plan',
  'Exhibitors',
  'Directory Research',
  'Sessions & Speakers',
  'Meeting Windows',
  'Audience Fit',
  'Target Accounts',
  'Event App',
  'Planner vs Capture',
  'Exhibiting Cost',
  'Booth Operations',
  'Lead Retrieval',
  'Tool Limits',
  'B2Brain Alternative',
  'Tool Choice',
  'Capture Fields',
  'Lead Quality',
  'Follow-up',
  'ROI',
] as const

/** Keep non-canonical editor-authored headings useful without overflowing. */
function compactFallback(heading: string): string {
  const cleaned = heading
    .replace(/^\s*(?:how|what|when|where|who|why|which)\s+/i, '')
    .replace(/^(?:is|are|can|should|does|do)\s+/i, '')
    .replace(/[?!.]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (cleaned.length <= 36) return cleaned || 'Section'
  const clipped = cleaned.slice(0, 36)
  const lastSpace = clipped.lastIndexOf(' ')
  return `${clipped.slice(0, lastSpace > 20 ? lastSpace : 36).trim()}…`
}

export function articleTocMarker(heading: string, h2Index: number, level: 2 | 3): string {
  if (level === 2 && h2Index >= 0 && h2Index < EVENT_ARTICLE_TOC_MARKERS.length) {
    return EVENT_ARTICLE_TOC_MARKERS[h2Index]
  }
  return compactFallback(heading)
}
