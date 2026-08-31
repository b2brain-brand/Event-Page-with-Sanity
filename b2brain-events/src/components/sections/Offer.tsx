import Image from 'next/image'

import { has } from '@/lib/format'
import { EVENT_TRIAL_QR_SRC, EVENT_TRIAL_URL } from '@/lib/trialOffer'
import { Section } from '../SectionHead'
import type { EventDoc, SiteSettings } from '@/lib/types'

/**
 * EVENT OFFER  ->  mOffer()
 *
 * Shared free-trial prompt after the Playbook. Sanity can customize the copy,
 * while the QR destination is intentionally centralized in the frontend so a
 * future move to per-event QR codes does not require document migrations.
 */
export function Offer({ event }: { event: EventDoc; settings: SiteSettings | null }) {
  const o = event.offer
  const badge = has(o?.badge) ? o!.badge : 'Event offer for first-time customers'
  const headline = has(o?.headline)
    ? o!.headline
    : `Start a free B2Brain trial for ${event.name}`
  const body = has(o?.body)
    ? o!.body
    : 'Use B2Brain from your phone to prepare for the show, capture conversations, and keep follow-up moving.'

  return (
    <Section id="offer">
      <div className="offer__box">
        <div className="offer__copy">
          <span className="offer__badge">{badge}</span>
          <div className="offer__headline">{headline}</div>
          <div className="offer__body">{body}</div>
          {has(o?.fineprint) && <div className="offer__fine">{o!.fineprint}</div>}
        </div>
        <div className="offer__trial">
          <a
            href={EVENT_TRIAL_URL}
            className="offer__qr-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the B2Brain free trial sign-in page"
          >
            <Image
              className="offer__qr"
              src={EVENT_TRIAL_QR_SRC}
              width="180"
              height="180"
              alt="QR code to start a B2Brain free trial"
            />
          </a>
          <div className="offer__qr-label">Scan to start your free trial</div>
          <a
            href={EVENT_TRIAL_URL}
            className="offer__device-link link-arrow"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open on this device
          </a>
        </div>
      </div>
    </Section>
  )
}
