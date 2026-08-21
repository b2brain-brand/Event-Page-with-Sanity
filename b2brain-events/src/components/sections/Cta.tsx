import { countdown, has, tpl } from '@/lib/format'
import { S } from '@/lib/defaults'
import { BRAND } from '@/lib/brand'
import { CountdownText } from '../CountdownText'
import type { EventDoc, SiteSettings } from '@/lib/types'
import styles from './Cta.module.css'

/**
 * CLOSING CTA  ->  mCta()
 *
 * The signature mosaic banner: orange-light fill, 1px black border, two solid
 * orange blocks pinned to opposite corners. The eyebrow is the live countdown,
 * which is what turns a generic CTA into a deadline.
 *
 * This section always renders — it is the page's conversion surface and has no
 * data dependency beyond the event name.
 */
export function Cta({
  event,
  settings,
  now,
}: {
  event: EventDoc
  settings: SiteSettings | null
  now: Date
}) {
  const name = has(event.name) ? event.name! : 'your next show'
  const cd = event.startDate ? countdown(event.startDate, now, event.endDate) : ''
  const liveCountdown = !event.ctaEyebrowOverride && has(cd)
  const eyebrow =
    event.ctaEyebrowOverride ||
    (has(cd) ? cd.toUpperCase() : S(settings, 'ctaFallbackEyebrow') || 'BOOK A DEMO')

  const headline =
    event.ctaHeadline || tpl(S(settings, 'ctaHeadlineTemplate'), { event: name })
  const secondary = tpl(S(settings, 'ctaSecondaryLabelTemplate'), { event: name })

  return (
    <section id="cta" className="cta">
      <div className="container">
        <div className="cta__inner">
          <span className="cta__px cta__px--tl" aria-hidden="true" />
          <span className="cta__px cta__px--br" aria-hidden="true" />
          <div>
            <span className="eyebrow eyebrow--asterisk cta__weeks">
              {liveCountdown ? (
                <CountdownText
                  startDate={event.startDate!}
                  endDate={event.endDate}
                  initial={eyebrow}
                  upper
                />
              ) : (
                eyebrow
              )}
            </span>
            <h2>{headline}</h2>
            {/* The demo is the only action. The prep-guide line is supporting
                copy, not a second destination, so it cannot drift to an
                unrelated App Store listing. */}
            <div className="cta__ctas">
              <a href={BRAND.cta.href} className="btn btn--primary">
                {S(settings, 'ctaPrimaryLabel')}
              </a>
            </div>
            {has(secondary) && <p className={styles.supportingText}>{secondary}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
