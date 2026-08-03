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
      {/* Envelope inlined (not an /root-path <img>): under the b2brain.com/events
          reverse-proxy a root asset routes to Webflow and 404s — that was the
          broken icon in the footer. Inline SVG needs no request, so it always
          renders. 24px, 30% opacity baked in, matching the live field. */}
      <svg className="nl__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <g opacity="0.3">
          <path
            d="M21 4.5H3C2.80109 4.5 2.61032 4.57902 2.46967 4.71967C2.32902 4.86032 2.25 5.05109 2.25 5.25V18C2.25 18.3978 2.40804 18.7794 2.68934 19.0607C2.97064 19.342 3.35218 19.5 3.75 19.5H20.25C20.6478 19.5 21.0294 19.342 21.3107 19.0607C21.592 18.7794 21.75 18.3978 21.75 18V5.25C21.75 5.05109 21.671 4.86032 21.5303 4.71967C21.3897 4.57902 21.1989 4.5 21 4.5ZM9.25312 12L3.75 17.0438V6.95625L9.25312 12ZM10.3594 13.0219L11.4937 14.0531C11.632 14.1796 11.8126 14.2498 12 14.2498C12.1874 14.2498 12.368 14.1796 12.5062 14.0531L13.6406 13.0219L19.0687 18H4.93125L10.3594 13.0219ZM14.7469 12L20.25 6.95625V17.0438L14.7469 12Z"
            fill="black"
          />
        </g>
      </svg>
      <input
        type="email"
        name="email"
        required
        placeholder={placeholder}
        aria-label={heading}
      />
      <button type="submit" aria-label="Subscribe">
        {/* Arrow inlined too (same reason). White stroke on the black button. */}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M8 5L13 10L8 15" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </form>
  )
}
