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
  attendees?: string
  attendeesMeta?: string
  exhibitors?: string
}

/** The event card shown on the /events collection page. */
export type IndexEventCard = EventCard & {
  tagline?: string
  cardStat?: string
  cardAudience?: string
  cardHeadline?: string
  description?: string
  isFeatured?: boolean
  attendees?: string
  attendeesMeta?: string
  exhibitors?: string
  cardImage?: SanityImage
  cardImageAlt?: string
}

/** One entry in the industry nav on /events and every /events/industry/[x] page. */
export type IndustryLink = { title: string; slug: string }

/** /events/industry/[category] — the category doc plus every event in it. */
export type CategoryPageData = {
  _id: string
  title: string
  slug: string
  description?: string
  events: IndexEventCard[]
}

export type EventsIndexPage = {
  heroEyebrow?: string
  heroHeading?: string
  heroIntro?: string
  stats?: { num?: string; label?: string }[]
  featuredEyebrow?: string
  featuredHeading?: string
  featured?: IndexEventCard[]
  allEyebrow?: string
  allHeading?: string
  cardCtaLabel?: string
  allCardCtaLabel?: string
  industryFilterLabel?: string
  searchPlaceholder?: string
  faqHeading?: string
  faq?: { q?: string; a?: string }[]
  ctaEyebrow?: string
  ctaHeading?: string
  metaTitle?: string
  metaDescription?: string
}

/** Everything except the URL is optional; the thumbnail is derived, never stored. */
export type HeroVideo = {
  youtubeUrl?: string
  label?: string
  caption?: string
  openOnYouTube?: boolean
}

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

  heroVideo?: HeroVideo

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

  /** Template V2 addition (2026-07-22). Off-floor moments, right after Cost & ROI. */
  tactics?: {
    intro?: string
    items?: { when?: string; name?: string; desc?: string }[]
    foot?: string
  }

  logistics?: {
    cells?: { h?: string; body?: string; list?: string[] }[]
    passes?: { name?: string; note?: string; price?: string }[]
  }

  sentiment?: {
    videos?: { title?: string; src?: string; url?: string; openOnYouTube?: boolean }[]
    reddit?: { quote?: string; sub?: string; tone?: 'Positive' | 'Mixed' }[]
    testimonials?: { q?: string; a?: string }[]
  }

  /** Template V2 addition (2026-07-22). Row-by-row, between Reviews and the Playbook. */
  compare?: {
    intro?: string
    colScanner?: string
    colUs?: string
    rows?: { cap?: string; scanner?: string; us?: string }[]
  }

  playbook?: {
    pre?: { h?: string; b?: string }
    floor?: { h?: string; b?: string }
    post?: { h?: string; b?: string }
  }

  /** Template V2 addition (2026-07-22). One promo box, right after the Playbook. */
  offer?: {
    badge?: string
    headline?: string
    body?: string
    fineprint?: string
    cta?: string
  }

  autoFillRelated?: boolean
  relatedEvents?: EventCard[]

  // Portable Text blocks + custom members (keyTakeaways, image).
  article?: ArticleBlock[]

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

/** A Portable Text block or one of the custom article members. */
export type ArticleBlock = {
  _type: string
  _key: string
  style?: string
  children?: { text?: string; _key?: string; marks?: string[] }[]
  // keyTakeaways
  eyebrow?: string
  heading?: string
  points?: string[]
  // image
  asset?: { url?: string }
  alt?: string
  caption?: string
  [k: string]: unknown
}

export type SectionLabels = Record<string, string | undefined>

export type SiteSettings = {
  logoText?: string
  logoHref?: string
  navLinks?: {
    label?: string
    href?: string
    isCurrent?: boolean
    children?: { label?: string; href?: string; icon?: string }[]
  }[]
  newsletterHeading?: string
  newsletterPlaceholder?: string
  newsletterAction?: string
  aiHeading?: string
  aiLinks?: { label?: string; url?: string; glyph?: string }[]
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
  socialLinks?: { platform?: string; url?: string }[]
  contactEmail?: string
  legalLinks?: { label?: string; href?: string }[]
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
