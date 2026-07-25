'use client'

import { useState } from 'react'
import { BRAND } from '@/lib/brand'

/**
 * Footer newsletter signup — the email field + arrow button from b2brain.com.
 *
 * The live site posts to its own mailing list. This has no backend, so on submit
 * it shows an inline thank-you rather than pretending to store the address. Set
 * BRAND.newsletter.action to a real endpoint to make it POST for real.
 */
export function NewsletterForm() {
  const [done, setDone] = useState(false)
  const action = BRAND.newsletter.action

  if (done) {
    return <div className="nl__done">Thanks — we&rsquo;ll be in touch.</div>
  }

  return (
    <form
      className="nl"
      action={action || undefined}
      method={action ? 'post' : undefined}
      onSubmit={(e) => {
        if (!action) {
          e.preventDefault()
          setDone(true)
        }
      }}
    >
      <span className="nl__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            d="M3 6h18v12H3zM3 7l9 6 9-6"
          />
        </svg>
      </span>
      <input
        type="email"
        name="email"
        required
        placeholder={BRAND.newsletter.placeholder}
        aria-label={BRAND.newsletter.heading}
      />
      <button type="submit" aria-label="Subscribe">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path fill="none" stroke="currentColor" strokeWidth="2" d="M5 12h13M13 6l6 6-6 6" />
        </svg>
      </button>
    </form>
  )
}
