'use client'

import { useState } from 'react'
import Image from 'next/image'
import { has, tpl } from '@/lib/format'
import type { EventDoc } from '@/lib/types'

type Slide = NonNullable<EventDoc['gallery']>[number]

/**
 * FROM THE FLOOR  ->  mGallery()
 *
 * Client component only because the slider needs state. Everything else about
 * the section — whether it renders at all, its heading, its footnote — is
 * decided on the server and passed in.
 *
 * Behaviour ported from the reference: >1 slide gets arrows + dots, exactly 1
 * slide gets neither, 0 slides never reaches this component.
 */
export function GallerySlider({
  slides,
  placeholder,
}: {
  slides: Slide[]
  placeholder: string
}) {
  const [idx, setIdx] = useState(0)
  const n = slides.length
  const multi = n > 1
  const go = (i: number) => setIdx(((i % n) + n) % n)

  return (
    <>
      <div className="slider" id="gallerySlider">
        <div
          className="slider__track"
          id="galleryTrack"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {slides.map((g, i) => {
            const url = g.image?.asset?.url
            return (
              <div className="slide" key={i}>
                {url ? (
                  <Image
                    src={url}
                    alt={g.alt || g.caption || ''}
                    fill
                    sizes="(max-width: 991px) 100vw, 1100px"
                    priority={i === 0}
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="slide__ph">
                    <span>{tpl(placeholder, { n: String(i + 1) })}</span>
                  </div>
                )}
                <span className="slide__idx mono-num">
                  {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
                </span>
                {has(g.caption) && <span className="slide__cap">{g.caption}</span>}
              </div>
            )
          })}
        </div>

        {multi && (
          <div className="slider__nav">
            <button
              type="button"
              className="slider__btn slider__btn--prev"
              onClick={() => go(idx - 1)}
              aria-label="Previous"
            >
              &#8592;
            </button>
            <button
              type="button"
              className="slider__btn slider__btn--next"
              onClick={() => go(idx + 1)}
              aria-label="Next"
            >
              &#8594;
            </button>
          </div>
        )}
      </div>

      {multi && (
        <div className="slider__dots">
          {slides.map((_, i) => (
            <button
              type="button"
              key={i}
              className={`slider__dot${i === idx ? ' is-active' : ''}`}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </>
  )
}
