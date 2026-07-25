import { countdown, fmtRange, has } from '@/lib/format'
import { L, S } from '@/lib/defaults'
import { BRAND } from '@/lib/brand'
import { youTubeId } from '@/lib/youtube'
import { YouTubeFacade } from '../YouTubeFacade'
import type { EventDoc, SiteSettings } from '@/lib/types'

/**
 * HERO
 *
 * Two layouts from one component, decided by the data:
 *   heroVideo present -> 1.35fr / 1fr grid, video beside the H1
 *   heroVideo absent  -> single full-width column
 * That is the whole graceful-degradation idea in miniature.
 *
 * `now` is passed in from the page so the countdown chip, the CTA eyebrow and
 * the JSON-LD all agree on one timestamp within a render.
 */
export function Hero({
  event,
  settings,
  now,
  thumbs,
}: {
  event: EventDoc
  settings: SiteSettings | null
  now: Date
  /** videoId -> resolved thumbnail URL. */
  thumbs: Record<string, string>
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

  /* ---------------------------------------------------------------- LEFT */
  const left = (
    <>
      <div className="hero__crumb">
        <a href={BRAND.breadcrumb.home.href}>{BRAND.breadcrumb.home.label}</a> /{' '}
        <a href={BRAND.breadcrumb.events.href}>{BRAND.breadcrumb.events.label}</a> / {event.name}
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

  /* --------------------------------------------------------------- RIGHT
     Footage from a previous edition. The editor pastes a YouTube URL and
     nothing else — thumbnail, embed and watch link are all derived from it.
     No URL -> no right column, and the hero renders full-width.            */
  const v = event.heroVideo
  const videoId = youTubeId(v?.youtubeUrl)

  const visual = videoId ? (
    <div className="hero__visual">
      <div className="herovid">
        {has(v?.label) && <small className="herovid__eyebrow">* {v!.label}</small>}

        <YouTubeFacade
          variant="hero"
          videoId={videoId}
          thumbUrl={thumbs[videoId]}
          title={v?.caption || `${event.name} video`}
          openOnYouTube={Boolean(v?.openOnYouTube)}
        />

        {has(v?.caption) && (
          <div className="herovid__cap">
            {v!.caption}
            {v?.openOnYouTube && <span className="herovid__ext"> · Watch on YouTube ↗</span>}
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
  ) : null

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
