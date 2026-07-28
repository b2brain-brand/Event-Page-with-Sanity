import { Fragment, type ReactElement } from 'react'

import { S, T } from '@/lib/defaults'
import type { EventCard, EventDoc, SiteSettings } from '@/lib/types'

import { Nav } from './Nav'
import { Toc, type TocEntry } from './Toc'
import { Footer } from './Footer'

import { Hero } from './sections/Hero'
import { Stats } from './sections/Stats'
import { Answer } from './sections/Answer'
import { GallerySection } from './sections/GallerySection'
import { Why } from './sections/Why'
import { AgendaSection } from './sections/AgendaSection'
import { Speakers } from './sections/Speakers'
import { Exhibitors } from './sections/Exhibitors'
import { Audience } from './sections/Audience'
import { CostSection } from './sections/CostSection'
import { Logistics } from './sections/Logistics'
import { Sentiment } from './sections/Sentiment'
import { Playbook } from './sections/Playbook'
import { Similar } from './sections/Similar'
import { Article } from './sections/Article'
import { FaqSection } from './sections/FaqSection'
import { Cta } from './sections/Cta'

/**
 * =============================================================================
 * THE BUILD PIPELINE  ->  the MODULES array + renderEvent() in preview-v2.html
 * =============================================================================
 *
 * Each section renderer returns its markup or `null`. We call them as plain
 * functions, drop the nulls, and build the "On this page" strip from whatever
 * survived — which is the whole graceful-degradation contract in four lines:
 *
 *      empty data -> no section -> no nav link -> no empty box.
 *
 * Section order is fixed and matches the reference build exactly. The order is
 * an argument, not a layout: identity, then the facts a stranger needs, then the
 * programme, then the commercial case, then proof, then the ask.
 */

type Module = {
  id: string
  /** Key into Site settings → "On this page" labels. Omitted = renders, but no nav link. */
  navKey?: string
  node: ReactElement | null
}

export function EventPage({
  event,
  settings,
  related,
  now,
  thumbs,
}: {
  event: EventDoc
  settings: SiteSettings | null
  related: EventCard[]
  now: Date
  /** videoId -> resolved thumbnail URL, for every YouTube embed on the page. */
  thumbs: Record<string, string>
}) {
  const modules: Module[] = [
    { id: 'overview', navKey: 'overview', node: Hero({ event, settings, now, thumbs }) },
    { id: 'stats', node: Stats({ event }) },
    { id: 'answer', node: Answer({ event, settings }) },
    { id: 'gallery', navKey: 'gallery', node: GallerySection({ event, settings }) },
    { id: 'why', navKey: 'why', node: Why({ event, settings }) },
    { id: 'agenda', navKey: 'agenda', node: AgendaSection({ event, settings }) },
    { id: 'speakers', navKey: 'speakers', node: Speakers({ event, settings }) },
    { id: 'exhibitors', navKey: 'exhibitors', node: Exhibitors({ event, settings }) },
    { id: 'audience', navKey: 'audience', node: Audience({ event, settings }) },
    { id: 'cost', navKey: 'cost', node: CostSection({ event, settings }) },
    { id: 'logistics', navKey: 'logistics', node: Logistics({ event, settings }) },
    { id: 'sentiment', navKey: 'sentiment', node: Sentiment({ event, settings, thumbs }) },
    { id: 'playbook', navKey: 'playbook', node: Playbook({ event, settings }) },
    { id: 'article', navKey: 'article', node: Article({ event, settings }) },
    { id: 'similar', navKey: 'similar', node: Similar({ events: related, settings }) },
    { id: 'faq', navKey: 'faq', node: FaqSection({ event, settings }) },
    { id: 'cta', node: Cta({ event, settings, now }) },
  ]

  const rendered = modules.filter((m) => m.node !== null)

  const tocEntries: TocEntry[] = rendered
    .filter((m) => m.navKey)
    .map((m) => ({ id: m.id, label: T(settings, m.navKey!) }))
    .filter((e) => e.label)

  return (
    <>
      <Nav settings={settings} />
      <Toc
        entries={tocEntries}
        label={S(settings, 'tocLabel') || 'On this page'}
        ctaLabel={S(settings, 'tocCtaLabel') || 'Plan your booth'}
      />
      <main id="root">
        {rendered.map((m) => (
          <Fragment key={m.id}>{m.node}</Fragment>
        ))}
      </main>
      <Footer settings={settings} lastUpdated={event.lastUpdated} sources={event.sources} />
    </>
  )
}
