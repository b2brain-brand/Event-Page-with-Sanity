import { has } from '@/lib/format'
import { L } from '@/lib/defaults'
import { youTubeId } from '@/lib/youtube'
import { Section, SectionHead } from '../SectionHead'
import { YouTubeFacade } from '../YouTubeFacade'
import type { EventDoc, SiteSettings } from '@/lib/types'

/**
 * WHAT PEOPLE SAY  ->  mSentiment()
 *
 * Three stacked blocks, each independently optional. This is the section the
 * organiser's own site will never run, which is exactly why it earns links and
 * citations — and why the Reddit block should always include a Mixed tone.
 */
export function Sentiment({
  event,
  settings,
  thumbs,
}: {
  event: EventDoc
  settings: SiteSettings | null
  /** videoId -> resolved thumbnail URL, from the page. */
  thumbs: Record<string, string>
}) {
  const s = event.sentiment
  if (!s) return null

  const videos = (s.videos || []).filter((v) => has(v?.title))
  const reddit = (s.reddit || []).filter((r) => has(r?.quote))
  const testimonials = (s.testimonials || []).filter((t) => has(t?.q))
  if (!videos.length && !reddit.length && !testimonials.length) return null

  return (
    <Section id="sentiment">
      <SectionHead
        eyebrow={L(settings, 'sentimentEyebrow')}
        title={L(settings, 'sentimentHeading')}
      />

      {videos.length > 0 && (
        <div className="sent__block">
          <div className="sent__label">{L(settings, 'sentimentVideoLabel')}</div>
          <div className="videos">
            {videos.map((v, i) => {
              // Same behaviour as the hero: a YouTube URL gives a real
              // thumbnail and a working player. No URL keeps the reference
              // build's grey placeholder rather than rendering a dead card.
              const id = youTubeId(v.url)
              return (
                <div className="video" key={i}>
                  {id ? (
                    <YouTubeFacade
                      variant="card"
                      videoId={id}
                      thumbUrl={thumbs[id]}
                      title={v.title || 'Event video'}
                      thumbnailAlt={`${event.name} event video preview for exhibitors evaluating B2Brain lead capture`}
                    />
                  ) : (
                    <div className="video__thumb">
                      <div className="video__play" />
                    </div>
                  )}
                  <div className="video__body">
                    <div className="video__title">{v.title}</div>
                    {has(v.src) && <div className="video__src">{v.src}</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {reddit.length > 0 && (
        <div className="sent__block">
          <div className="sent__label">{L(settings, 'sentimentRedditLabel')}</div>
          <div className="reddit">
            {reddit.map((r, i) => (
              <div className="rcard" key={i}>
                <div className="rcard__quote">&ldquo;{r.quote}&rdquo;</div>
                <div className="rcard__meta">
                  <span>{r.sub}</span>
                  <span
                    className={`rcard__tone${r.tone === 'Mixed' ? ' rcard__tone--mixed' : ''}`}
                  >
                    {r.tone}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {testimonials.length > 0 && (
        <div className="sent__block">
          <div className="sent__label">{L(settings, 'sentimentTestimonialLabel')}</div>
          <div className="tstml">
            {testimonials.map((t, i) => (
              <div className="tcard" key={i}>
                <div className="tcard__q">&ldquo;{t.q}&rdquo;</div>
                <div className="tcard__a">{t.a}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Section>
  )
}
