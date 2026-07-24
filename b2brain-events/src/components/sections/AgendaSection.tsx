import { has } from '@/lib/format'
import { L } from '@/lib/defaults'
import { Section, SectionHead } from '../SectionHead'
import { AgendaTabs } from './Agenda'
import type { EventDoc, SiteSettings } from '@/lib/types'

/**
 * AGENDA & SESSIONS  ->  mAgenda()
 *
 * The half-data case is the one that matters: months before a show you can
 * usually source the TRACKS but not the schedule. Tracks alone still render the
 * section, with the "being confirmed" note in the sub-head — so the page has a
 * real agenda answer on day one and gets richer as the organiser publishes.
 */
export function AgendaSection({
  event,
  settings,
}: {
  event: EventDoc
  settings: SiteSettings | null
}) {
  const a = event.agenda
  if (!a) return null

  const days = (a.days || []).filter((d) => has(d?.label))
  const tracks = (a.tracks || []).filter((t) => has(t))
  const hasDays = days.length > 0
  if (!hasDays && !tracks.length) return null

  return (
    <Section id="agenda">
      <SectionHead
        eyebrow={L(settings, 'agendaEyebrow')}
        title={L(settings, 'agendaHeading')}
        sub={hasDays ? undefined : L(settings, 'agendaPendingNote')}
      />

      {hasDays && <AgendaTabs days={days} />}

      {tracks.length > 0 && (
        <>
          {hasDays && <div style={{ marginTop: 6 }} />}
          <div className="tracks">
            {tracks.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </>
      )}
    </Section>
  )
}
