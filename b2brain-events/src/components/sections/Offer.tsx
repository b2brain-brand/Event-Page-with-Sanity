import { has } from '@/lib/format'
import { Section } from '../SectionHead'
import type { EventDoc, SiteSettings } from '@/lib/types'

/**
 * EVENT OFFER  ->  mOffer()
 *
 * Template V2 addition (2026-07-22). Right after the Playbook. Unlike every
 * other section this has no eyebrow/H2 — it is one self-contained bordered
 * promo box. `headline` is the only required field; everything else is
 * optional trim around it.
 */
export function Offer({ event }: { event: EventDoc; settings: SiteSettings | null }) {
  const o = event.offer
  if (!has(o?.headline)) return null

  return (
    <Section id="offer">
      <div className="offer__box">
        <div>
          {has(o?.badge) && <span className="offer__badge">{o!.badge}</span>}
          <div className="offer__headline">{o!.headline}</div>
          {has(o?.body) && <div className="offer__body">{o!.body}</div>}
          {has(o?.fineprint) && <div className="offer__fine">{o!.fineprint}</div>}
        </div>
        {has(o?.cta) && (
          <a href="#cta" className="btn btn--primary offer__cta">
            {o!.cta}
          </a>
        )}
      </div>
    </Section>
  )
}
