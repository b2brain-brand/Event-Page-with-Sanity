'use client'

import { useEffect, useState } from 'react'
import { countdown } from '@/lib/format'

/**
 * Live countdown text ("7 weeks to go" → "6 weeks to go" → …).
 *
 * The server computes an initial value at render (and the page revalidates
 * hourly), but that can lag if a page sits cached. This recomputes from the
 * REAL current date on the client after mount, so the chip is always accurate to
 * today and stays linked to the event's start date — it ticks down on its own as
 * the event approaches, with no rebuild needed.
 *
 * It renders `initial` (the server value) on first paint so hydration matches,
 * then swaps to the freshly computed value.
 */
export function CountdownText({
  startDate,
  endDate,
  initial,
  upper = false,
}: {
  startDate: string
  endDate?: string
  initial: string
  upper?: boolean
}) {
  const [text, setText] = useState(initial)

  useEffect(() => {
    const compute = () => {
      const t = countdown(startDate, new Date(), endDate)
      setText(upper ? t.toUpperCase() : t)
    }
    compute()
    // Re-check daily in case the tab stays open across a day boundary.
    const id = setInterval(compute, 60 * 60 * 1000)
    return () => clearInterval(id)
  }, [startDate, endDate, upper])

  return <>{text}</>
}
