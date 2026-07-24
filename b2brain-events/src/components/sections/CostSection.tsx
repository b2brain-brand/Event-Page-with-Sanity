import { has } from '@/lib/format'
import { L, R, S } from '@/lib/defaults'
import { ROI_LABEL_DEFAULTS } from '@/lib/defaults'
import { Section, SectionHead } from '../SectionHead'
import { RoiCalculator } from './Roi'
import type { EventDoc, SiteSettings } from '@/lib/types'

/** Server half of Cost & ROI. No ROI defaults in the CMS = no section. */
export function CostSection({
  event,
  settings,
}: {
  event: EventDoc
  settings: SiteSettings | null
}) {
  const roi = event.cost?.roi
  if (!roi) return null

  return (
    <Section id="cost">
      <SectionHead eyebrow={L(settings, 'costEyebrow')} title={L(settings, 'costHeading')} />
      {has(event.cost?.boothRange) && (
        <p
          style={{
            maxWidth: 760,
            marginBottom: 34,
            fontSize: 17,
            lineHeight: '27px',
            color: 'var(--black-70)',
          }}
        >
          {event.cost!.boothRange}
        </p>
      )}
      <RoiCalculator
        defaults={roi}
        industryAverage={S(settings, 'roiIndustryAverage') ?? 8}
        ltmCopy={S(settings, 'roiLtmCopy') ?? ''}
        labels={Object.fromEntries(
          Object.keys(ROI_LABEL_DEFAULTS).map((k) => [k, R(settings, k)]),
        )}
      />
    </Section>
  )
}
