'use client'

import { useState } from 'react'

/**
 * Footer newsletter signup — the email field + arrow button from b2brain.com.
 *
 * With no `action` it shows an inline thank-you rather than pretending to store
 * the address. Set the action (in Site settings) to a real endpoint to POST.
 */
export function NewsletterForm({
  placeholder,
  action,
  heading,
}: {
  placeholder: string
  action: string
  heading: string
}) {
  const [done, setDone] = useState(false)

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
        placeholder={placeholder}
        aria-label={heading}
      />
      <button type="submit" aria-label="Subscribe">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path fill="none" stroke="currentColor" strokeWidth="2" d="M5 12h13M13 6l6 6-6 6" />
        </svg>
      </button>
    </form>
  )
}
