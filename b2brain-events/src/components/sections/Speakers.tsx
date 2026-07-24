import { has, initialsFrom } from '@/lib/format'
import { L } from '@/lib/defaults'
import { Section, SectionHead } from '../SectionHead'
import type { EventDoc, SiteSettings } from '@/lib/types'

/**
 * SPEAKERS  ->  mSpeakers()
 *
 * Initials on a purple square, never photography — brand rule 6. If the editor
 * leaves the initials field blank we derive them from the name, so the avatar
 * is never an empty box.
 */
export function Speakers({ event, settings }: { event: EventDoc; settings: SiteSettings | null }) {
  const list = (event.speakers || []).filter((s) => has(s?.name))
  if (!list.length) return null

  return (
    <Section id="speakers">
      <SectionHead
        eyebrow={L(settings, 'speakersEyebrow')}
        title={L(settings, 'speakersHeading')}
      />
      <div className="speakers">
        {list.map((s, i) => (
          <div className="speaker" key={`${s.name}-${i}`}>
            <div className="speaker__av" aria-hidden="true">
              {s.initials || initialsFrom(s.name)}
            </div>
            <div className="speaker__name">{s.name}</div>
            {has(s.role) && <div className="speaker__role">{s.role}</div>}
            {s.keynote && (
              <span className="speaker__key">{L(settings, 'speakerKeynoteChip')}</span>
            )}
          </div>
        ))}
      </div>
    </Section>
  )
}
