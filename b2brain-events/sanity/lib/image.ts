import { createImageUrlBuilder } from '@sanity/image-url'
import type { Image } from 'sanity'
import { dataset, projectId } from '../env'

const builder = createImageUrlBuilder({ projectId, dataset })

/** urlFor(image).width(1600).height(800).fit('crop').url() */
export function urlFor(sourceImage: Image) {
  return builder.image(sourceImage).auto('format').fit('max')
}

/** Convenience for the 16:8 gallery slides. */
export function galleryUrl(sourceImage: Image, width = 1600) {
  return builder
    .image(sourceImage)
    .width(width)
    .height(Math.round(width / 2))
    .fit('crop')
    .auto('format')
    .url()
}

/** 1200×630 social card. */
export function ogUrl(sourceImage: Image) {
  return builder.image(sourceImage).width(1200).height(630).fit('crop').auto('format').url()
}
