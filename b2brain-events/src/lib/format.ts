/**
 * Formatting helpers — ported 1:1 from the helper block in preview-v2.html so the
 * rendered strings are byte-identical to the reference build.
 */

/** The reference build's emptiness test. Empty string / empty array / empty object / null => false. */
export function has(v: unknown): boolean {
  if (v === null || v === undefined) return false
  if (Array.isArray(v)) return v.length > 0
  if (typeof v === 'string') return v.trim().length > 0
  if (typeof v === 'object') return Object.values(v as object).some((x) => has(x))
  return true
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * "Sep 15–17, 2026" · "Mar 9–12, 2026" · "Nov 12, 2026" (single day).
 * Dates are parsed at local midnight, exactly as the reference does.
 */
export function fmtRange(start?: string | null, end?: string | null): string {
  if (!start) return ''
  const a = new Date(`${start}T00:00:00`)
  const b = new Date(`${end || start}T00:00:00`)
  if (Number.isNaN(a.getTime())) return ''

  const sameDay = a.getTime() === b.getTime()
  const sameMonth = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()

  const d1 = `${MONTHS[a.getMonth()]} ${a.getDate()}`
  if (sameDay) return `${d1}, ${b.getFullYear()}`

  const d2 = `${sameMonth ? '' : `${MONTHS[b.getMonth()]} `}${b.getDate()}`
  return `${d1}–${d2}, ${b.getFullYear()}`
}

/** "12 days to go" · "8 weeks to go" · "Happening today" · "Past event · recap". */
export function countdown(start?: string | null, now: Date = new Date()): string {
  if (!start) return ''
  const startDate = new Date(`${start}T00:00:00`)
  if (Number.isNaN(startDate.getTime())) return ''
  const diff = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return 'Past event · recap'
  if (diff === 0) return 'Happening today'
  if (diff < 14) return `${diff} days to go`
  return `${Math.round(diff / 7)} weeks to go`
}

/** "$1.2M" · "$480K" · "$940". */
export function money(n: number): string {
  if (!Number.isFinite(n)) return '$0'
  if (n >= 1e6) return `$${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)}M`
  if (n >= 1e3) return `$${Math.round(n / 1e3)}K`
  return `$${Math.round(n)}`
}

/** "M. Benioff" -> "MB". Used when a speaker has no explicit initials. */
export function initialsFrom(name?: string | null): string {
  if (!name) return ''
  const parts = name.replace(/\./g, ' ').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Fill {event}-style tokens in the templated copy held in Site settings. */
export function tpl(template: string | null | undefined, vars: Record<string, string>): string {
  if (!template) return ''
  return template.replace(/\{(\w+)\}/g, (m, key) => (key in vars ? vars[key] : m))
}
