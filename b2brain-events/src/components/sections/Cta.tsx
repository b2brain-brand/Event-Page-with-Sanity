import Link from 'next/link'
import { countdown, has, tpl } from '@/lib/format'
import { S } from '@/lib/defaults'
import type { EventDoc, SiteSettings } from '@/lib/types'

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
  const cd = event.startDate ? countdown(event.startDate, now) : ''
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
            <span className="eyebrow eyebrow--asterisk cta__weeks">{eyebrow}</span>
            <h2>{headline}</h2>
            <div className="cta__ctas">
              <Link href={S(settings, 'ctaPrimaryHref') || '#'} className="btn btn--primary">
                {S(settings, 'ctaPrimaryLabel')}
              </Link>
              <Link href={S(settings, 'ctaSecondaryHref') || '#'} className="btn btn--ghost">
                {secondary}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
