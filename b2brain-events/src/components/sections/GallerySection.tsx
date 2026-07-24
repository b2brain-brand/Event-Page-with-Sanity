import { has } from '@/lib/format'
import { L } from '@/lib/defaults'
import { Section, SectionHead } from '../SectionHead'
import { GallerySlider } from './Gallery'
import type { EventDoc, SiteSettings } from '@/lib/types'

/** Server half of the gallery: decides whether the section exists at all. */
export function GallerySection({
  event,
  settings,
}: {
  event: EventDoc
  settings: SiteSettings | null
}) {
  const slides = event.gallery || []
  if (!slides.length) return null

  const footnote = event.galleryFootnote || L(settings, 'galleryFootnote')

  return (
    <Section id="gallery">
      <SectionHead eyebrow={L(settings, 'galleryEyebrow')} title={L(settings, 'galleryHeading')} />
      <GallerySlider slides={slides} placeholder={L(settings, 'galleryPlaceholder')} />
      {has(footnote) && <div className="gallery__foot">{footnote}</div>}
    </Section>
  )
}
