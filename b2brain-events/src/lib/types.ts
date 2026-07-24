/**
 * Shapes returned by the GROQ queries in sanity/lib/queries.ts.
 *
 * These are hand-written on purpose: `npm run typegen` will generate exact types
 * from the schema + queries once the schema is deployed, and you can swap these
 * out for the generated ones. Until then these keep the components honest.
 */

import type { Image } from 'sanity'

export type SanityImage = Image & { asset?: { url?: string } }

export type EventCard = {
  _id: string
  name: string
  slug: string
  type?: string
  startDate?: string
  endDate?: string
  venueName?: string
  city?: string
  categories?: { _id: string; title: string; slug: string }[]
}

export type HeroCardRow = { label: string; value: string; tag?: 'none' | 'booked' | 'fast' }

export type EventDoc = {
  _id: string
  _updatedAt?: string
  name: string
  slug: string
  type?: string
  tagline?: string
  subhead?: string
  startDate?: string
  endDate?: string
  format?: string
  formatNote?: string
  hashtag?: string
  officialUrl?: string
  registerUrl?: string
  heroPrimaryCtaLabel?: string

  venue?: {
    name?: string
    city?: string
    streetAddress?: string
    postalCode?: string
    country?: string
    website?: string
    lat?: number
    lng?: number
  }
  series?: { title?: string; organizerName?: string; organizerUrl?: string }
  categoryIds?: string[]
  categories?: { _id: string; title: string; slug: string }[]

  heroCard?: { label?: string; big?: string; rows?: HeroCardRow[] }

  stats?: { num?: string; label?: string; meta?: string }[]
  tldr?: string

  gallery?: { caption?: string; alt?: string; accent?: string; image?: SanityImage; hasImage?: boolean }[]
  galleryFootnote?: string

  why?: {
    headline?: string
    body?: string[]
    pullquote?: { text?: string; attr?: string }
  }

  agenda?: {
    tracks?: string[]
    days?: {
      label?: string
      meta?: string
      items?: { time?: string; title?: string; loc?: string; track?: string }[]
    }[]
  }

  speakers?: { name?: string; role?: string; initials?: string; keynote?: boolean }[]

  exhibitors?: { tiers?: { tier?: string; names?: string[] }[]; notable?: string }

  audience?: {
    titleMix?: { label?: string; pct?: number }[]
    industries?: string[]
    match?: string
  }

  cost?: {
    boothRange?: string
    roi?: {
      spend: number
      reps: number
      days: number
      convosPerRepDay: number
      qualRate: number
      meetingRate: number
      acv: number
    }
  }

  logistics?: {
    cells?: { h?: string; body?: string; list?: string[] }[]
    passes?: { name?: string; note?: string; price?: string }[]
  }

  sentiment?: {
    videos?: { title?: string; src?: string; url?: string; thumbnail?: SanityImage }[]
    reddit?: { quote?: string; sub?: string; tone?: 'Positive' | 'Mixed' }[]
    testimonials?: { q?: string; a?: string }[]
  }

  playbook?: {
    pre?: { h?: string; b?: string }
    floor?: { h?: string; b?: string }
    post?: { h?: string; b?: string }
  }

  autoFillRelated?: boolean
  relatedEvents?: EventCard[]

  faq?: { q?: string; a?: string }[]
  ctaHeadline?: string
  ctaEyebrowOverride?: string

  seo?: {
    metaTitle?: string
    metaDescription?: string
    canonicalUrl?: string
    noIndex?: boolean
    ogImage?: SanityImage
  }
  lastUpdated?: string
  sources?: { label?: string }[]
  publishedAt?: string
}

export type SectionLabels = Record<string, string | undefined>

export type SiteSettings = {
  logoText?: string
  navLinks?: { label?: string; href?: string; isCurrent?: boolean }[]
  navLoginLabel?: string
  navLoginHref?: string
  navCtaLabel?: string
  navCtaHref?: string
  tocLabel?: string
  tocCtaLabel?: string
  footerBlurb?: string
  footerColumns?: { heading?: string; links?: { label?: string; href?: string }[] }[]
  footerCopyright?: string
  footerLegal?: string
  labels?: SectionLabels
  tocLabels?: SectionLabels
  roiLabels?: SectionLabels
  breadcrumb?: {
    homeLabel?: string
    homeHref?: string
    eventsLabel?: string
    eventsHref?: string
  }
  heroPrimaryCtaLabel?: string
  heroSecondaryCtaLabel?: string
  ctaHeadlineTemplate?: string
  ctaPrimaryLabel?: string
  ctaPrimaryHref?: string
  ctaSecondaryLabelTemplate?: string
  ctaSecondaryHref?: string
  ctaFallbackEyebrow?: string
  roiIndustryAverage?: number
  roiLtmCopy?: string
  siteUrl?: string
  organizationName?: string
  organizationLogo?: SanityImage
  organizationSameAs?: string[]
  defaultOgImage?: SanityImage
}
