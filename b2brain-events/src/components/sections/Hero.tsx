import Link from 'next/link'
import { countdown, fmtRange, has } from '@/lib/format'
import { B, L, S } from '@/lib/defaults'
import type { EventDoc, SiteSettings } from '@/lib/types'

/**
 * HERO  ->  mHero()
 *
 * Two layouts from one component, decided by the data:
 *   heroCard present -> 1.35fr / 1fr grid with the orange operator card
 *   heroCard absent  -> single full-width column
 * That is the whole graceful-degradation idea in miniature.
 *
 * `now` is passed in from the page so the countdown chip, the CTA eyebrow and
 * the JSON-LD all agree on one timestamp within a render.
 */
export function Hero({
  event,
  settings,
  now,
}: {
  event: EventDoc
  settings: SiteSettings | null
  now: Date
}) {
  if (!has(event?.name)) return null

  const cd = event.startDate ? countdown(event.startDate, now) : ''

  const metaPairs: [string, string][] = []
  if (has(event.startDate)) {
    metaPairs.push([L(settings, 'heroMetaDates'), fmtRange(event.startDate, event.endDate)])
  }
  const location = [event.venue?.name, event.venue?.city].filter((x) => has(x)).join(' · ')
  if (has(location)) metaPairs.push([L(settings, 'heroMetaLocation'), location])
  const format = event.formatNote || event.format
  if (has(format)) metaPairs.push([L(settings, 'heroMetaFormat'), format as string])

  const primaryLabel =
    event.heroPrimaryCtaLabel || S(settings, 'heroPrimaryCtaLabel') || 'Plan your booth'

  const left = (
    <>
      <div className="hero__crumb">
        <Link href={B(settings, 'homeHref')}>{B(settings, 'homeLabel')}</Link> /{' '}
        <Link href={B(settings, 'eventsHref')}>{B(settings, 'eventsLabel')}</Link> / {event.name}
      </div>

      <div className="hero__eyebrow">
        {has(event.type) && <span className="chip">{event.type}</span>}
        {has(cd) && (
          <span className="chip chip--orange">
            <span className="chip__dot" />
            {cd}
          </span>
        )}
        {has(event.hashtag) && <span className="chip chip--purple">{event.hashtag}</span>}
      </div>

      <h1>{event.name}</h1>
      {has(event.tagline) && <p className="hero__sub">{event.tagline}</p>}

      <div className="hero__ctas">
        <a href="#cta" className="btn btn--primary">
          {primaryLabel}
        </a>
        {has(event.registerUrl) && (
          <a
            href={event.registerUrl}
            className="btn btn--ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            {S(settings, 'heroSecondaryCtaLabel')}
          </a>
        )}
      </div>

      {metaPairs.length > 0 && (
        <dl className="hero__meta">
          {metaPairs.map(([dt, dd]) => (
            <div key={dt}>
              <dt>{dt}</dt>
              <dd>{dd}</dd>
            </div>
          ))}
        </dl>
      )}
    </>
  )

  const card = event.heroCard
  const visual = has(card) && has(card?.big) && (
    <div className="hero__visual">
      <div className="hero__card">
        {has(card?.label) && <small>* {card!.label}</small>}
        <div className="hero__card-big">{card!.big}</div>
        {has(card?.rows) && (
          <div className="hero__card-rows">
            {card!.rows!.map((r, i) => {
              const tagged = r.tag === 'booked' || r.tag === 'fast'
              return (
                <div className="hero__card-row" key={`${r.label}-${i}`}>
                  <span>{r.label}</span>
                  {tagged ? (
                    <span
                      className={
                        r.tag === 'fast'
                          ? 'hero__card-tag hero__card-tag--orange'
                          : 'hero__card-tag'
                      }
                    >
                      {r.value}
                    </span>
                  ) : (
                    <b className="mono-num">{r.value}</b>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {has(cd) && (
        <div className="hero__count">
          <span
            className="chip chip--orange"
            style={{ border: 'none', padding: 0, background: 'none' }}
          >
            <span className="chip__dot" />
          </span>{' '}
          <b className="mono-num">{cd.toUpperCase()}</b> — {L(settings, 'heroRefreshNote')}
        </div>
      )}
    </div>
  )

  return (
    <section id="overview" className="hero">
      <div className="container hero__pad">
        {visual ? (
          <div className="hero__grid">
            <div>{left}</div>
            {visual}
          </div>
        ) : (
          left
        )}
      </div>
    </section>
  )
}
