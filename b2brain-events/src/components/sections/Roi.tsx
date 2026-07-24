'use client'

import { useMemo, useState } from 'react'
import { money } from '@/lib/format'

export type RoiDefaults = {
  spend: number
  reps: number
  days: number
  convosPerRepDay: number
  qualRate: number
  meetingRate: number
  acv: number
}

/**
 * COST & ROI CALCULATOR  ->  mROI() + the calculator half of wireInteractions()
 *
 * The maths is deliberately transparent and lives entirely in the browser:
 *   conversations = reps × days × conversations-per-rep-per-day
 *   qualified     = conversations × qualified-rate
 *   meetings      = qualified × meeting-rate  ← this rate IS the LTM number
 *   pipeline      = meetings × ACV
 *   return        = pipeline ÷ spend
 *
 * A visitor who changes the inputs to their own numbers and still sees a
 * defensible return is a visitor who has already made the internal case for
 * the booth. That is the whole point of the section.
 */
export function RoiCalculator({
  defaults,
  industryAverage,
  ltmCopy,
  labels,
}: {
  defaults: RoiDefaults
  industryAverage: number
  ltmCopy: string
  /** The ten calculator strings, resolved from Site settings on the server. */
  labels: Record<string, string>
}) {
  const [v, setV] = useState<RoiDefaults>(defaults)

  const set = (key: keyof RoiDefaults) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = parseFloat(e.target.value)
    setV((prev) => ({ ...prev, [key]: Number.isFinite(n) ? n : 0 }))
  }

  const out = useMemo(() => {
    const convos = v.reps * v.days * v.convosPerRepDay
    const qualified = convos * (v.qualRate / 100)
    const meetings = qualified * (v.meetingRate / 100)
    const pipeline = meetings * v.acv
    const mult = v.spend > 0 ? pipeline / v.spend : 0
    return { qualified, meetings, pipeline, mult }
  }, [v])

  const ltm = `${Math.round(v.meetingRate)}%`
  const avg = `${industryAverage}%`

  const field = (
    id: string,
    label: string,
    key: keyof RoiDefaults,
  ) => (
    <div className="roi__field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="number" value={v[key]} onChange={set(key)} inputMode="numeric" />
    </div>
  )

  return (
    <div className="roi" id="roiCalc">
      <div className="roi__inputs">
        <h3 className="sr-only">Booth ROI inputs</h3>
        {field('roiSpend', labels.spend, 'spend')}
        <div className="roi__row2">
          {field('roiReps', labels.reps, 'reps')}
          {field('roiDays', labels.days, 'days')}
        </div>
        {field('roiConvos', labels.convos, 'convosPerRepDay')}
        <div className="roi__row2">
          {field('roiQual', labels.qualRate, 'qualRate')}
          {field('roiMeet', labels.meetingRate, 'meetingRate')}
        </div>
        {field('roiAcv', labels.acv, 'acv')}
      </div>

      <div className="roi__out" aria-live="polite">
        <div className="roi__out-grid">
          <div>
            <div className="roi__stat-num">{Math.round(out.qualified)}</div>
            <div className="roi__stat-label">{labels.outQualified}</div>
          </div>
          <div>
            <div className="roi__stat-num">{Math.round(out.meetings)}</div>
            <div className="roi__stat-label">{labels.outMeetings}</div>
          </div>
        </div>

        <div className="roi__pipeline">
          <div className="roi__stat-label" style={{ marginBottom: 6 }}>
            {labels.outPipeline.replace('{x}', `${out.mult.toFixed(1)}x`)}
          </div>
          <div className="roi__stat-num">{money(out.pipeline)}</div>
          <div className="roi__ltm">
            <EmphasisedCopy template={ltmCopy} vars={{ ltm, avg }} />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * The comparison sentence is editable in Sanity, but two clauses must stay bold
 * — the reader's own LTM rate and the industry average they are being compared
 * against (never publish one without the other).
 *
 * Rather than accept HTML from the CMS, the field uses **double asterisks** for
 * emphasis and {ltm} / {avg} for the live numbers. Editors get full control of
 * the wording; the page can never be handed markup it did not expect.
 */
function EmphasisedCopy({
  template,
  vars,
}: {
  template: string
  vars: Record<string, string>
}) {
  const filled = template.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m))
  return (
    <>
      {filled.split(/\*\*/).map((chunk, i) =>
        i % 2 === 1 ? <b key={i}>{chunk}</b> : <span key={i}>{chunk}</span>,
      )}
    </>
  )
}
