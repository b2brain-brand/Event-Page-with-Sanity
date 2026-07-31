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
      {/* Envelope is 24px at 30% opacity on the live site; the opacity lives on
          the .nl__icon rule so the same asset stays full-black elsewhere. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="nl__icon" src="/newsletter-envelope.svg" alt="" aria-hidden="true" width={24} height={24} />
      <input
        type="email"
        name="email"
        required
        placeholder={placeholder}
        aria-label={heading}
      />
      <button type="submit" aria-label="Subscribe">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/newsletter-arrow.svg" alt="" width={20} height={20} />
      </button>
    </form>
  )
}
