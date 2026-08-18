import { has } from '@/lib/format'
import { L } from '@/lib/defaults'
import { Section, SectionHead } from '../SectionHead'
import type { EventDoc, SiteSettings } from '@/lib/types'

/**
 * B2BRAIN VS THE BADGE SCANNER  ->  mCompare()
 *
 * Template V2 addition (2026-07-22). Between Reviews and the Playbook: a
 * row-by-row case for what the event's own lead-retrieval tool leaves on the
 * table. Column headers are per-event (falls back to generic labels), rows
 * are not.
 */
export function Compare({ event, settings }: { event: EventDoc; settings: SiteSettings | null }) {
  const c = event.compare
  const rows = (c?.rows || []).filter((r) => has(r?.cap) && has(r?.scanner) && has(r?.us))
  if (!rows.length) return null

  const colScanner = has(c?.colScanner) ? c!.colScanner! : L(settings, 'compareDefaultScannerCol')
  const colUs = has(c?.colUs) ? c!.colUs! : L(settings, 'compareDefaultUsCol')

  return (
    <Section id="compare">
      <SectionHead eyebrow={L(settings, 'compareEyebrow')} title={L(settings, 'compareHeading')} />
      {has(c?.intro) && <p className="cmp__intro">{c!.intro}</p>}
      <div className="cmp">
        <div className="cmp__row cmp__head">
          <div className="cmp__cell cmp__cell--cap">Capability</div>
          <div className="cmp__cell">{colScanner}</div>
          <div className="cmp__cell cmp__col-us">{colUs}</div>
        </div>
        {rows.map((r, i) => (
          <div className="cmp__row" key={`${r.cap}-${i}`}>
            <div className="cmp__cell cmp__cell--cap">{r.cap}</div>
            <div className="cmp__cell cmp__cell--scanner">{r.scanner}</div>
            <div className="cmp__cell cmp__col-us cmp__cell--us">{r.us}</div>
          </div>
        ))}
      </div>
    </Section>
  )
}
