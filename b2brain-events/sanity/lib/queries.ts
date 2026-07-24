import { defineQuery } from 'next-sanity'

/**
 * =============================================================================
 * GROQ
 * =============================================================================
 * One page = one EVENT_QUERY round trip (plus the cached settings doc). The
 * "similar events" fallback is deliberately a SECOND, conditional query rather
 * than a correlated sub-query: it only runs on pages where the editor did not
 * hand-pick related events, and keeping it separate means a change to the
 * fallback logic can never break the main page query.
 */

/** Fields every event CARD needs — used by "Similar events" and the /events index. */
const EVENT_CARD_FIELDS = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  type,
  startDate,
  endDate,
  "venueName": venue->name,
  "city": venue->city,
  "categories": categories[]->{ _id, title, "slug": slug.current }
`

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    logoText,
    navLinks[]{ label, href, isCurrent },
    navLoginLabel, navLoginHref, navCtaLabel, navCtaHref,
    breadcrumb{ homeLabel, homeHref, eventsLabel, eventsHref },
    tocLabel, tocCtaLabel,
    footerBlurb,
    footerColumns[]{ heading, links[]{ label, href } },
    footerCopyright, footerLegal,
    labels,
    tocLabels,
    roiLabels,
    heroPrimaryCtaLabel, heroSecondaryCtaLabel,
    ctaHeadlineTemplate, ctaPrimaryLabel, ctaPrimaryHref,
    ctaSecondaryLabelTemplate, ctaSecondaryHref, ctaFallbackEyebrow,
    roiIndustryAverage, roiLtmCopy,
    siteUrl, organizationName, organizationLogo, organizationSameAs,
    defaultOgImage
  }
`)

export const EVENT_QUERY = defineQuery(`
  *[_type == "event" && slug.current == $slug][0]{
    _id,
    _updatedAt,
    name,
    "slug": slug.current,
    type,
    tagline,
    subhead,
    startDate,
    endDate,
    format,
    formatNote,
    hashtag,
    officialUrl,
    registerUrl,
    heroPrimaryCtaLabel,

    venue->{
      name, city, streetAddress, postalCode, country, website,
      "lat": geo.lat, "lng": geo.lng
    },
    series->{ title, organizerName, organizerUrl },
    "categoryIds": categories[]._ref,
    "categories": categories[]->{ _id, title, "slug": slug.current },

    heroVideo{
      youtubeUrl, alt, label, caption, openOnYouTube,
      "thumbnail": thumbnail{ ..., asset-> }
    },

    stats[]{ num, label, meta },
    tldr,

    gallery[]{
      caption, alt, accent,
      "image": image{ ..., asset-> },
      "hasImage": defined(image.asset)
    },
    galleryFootnote,

    why{
      headline,
      body,
      pullquote{ text, attr }
    },

    agenda{
      tracks,
      days[]{ label, meta, items[]{ time, title, loc, track } }
    },

    speakers[]{ name, role, initials, keynote },

    exhibitors{
      tiers[]{ tier, names },
      notable
    },

    audience{
      titleMix[]{ label, pct },
      industries,
      match
    },

    cost{
      boothRange,
      roi{ spend, reps, days, convosPerRepDay, qualRate, meetingRate, acv }
    },

    logistics{
      cells[]{ h, body, list },
      passes[]{ name, note, price }
    },

    sentiment{
      videos[]{ title, src, url, "thumbnail": thumbnail{ ..., asset-> } },
      reddit[]{ quote, sub, tone },
      testimonials[]{ q, a }
    },

    playbook{
      pre{ h, b },
      floor{ h, b },
      post{ h, b }
    },

    autoFillRelated,
    "relatedEvents": relatedEvents[]->{ ${EVENT_CARD_FIELDS} },

    faq[]{ q, a },
    ctaHeadline,
    ctaEyebrowOverride,

    seo{
      metaTitle, metaDescription, canonicalUrl, noIndex,
      "ogImage": ogImage{ ..., asset-> }
    },
    lastUpdated,
    sources[]{ label },
    publishedAt
  }
`)

/**
 * Fallback for "Similar events": upcoming shows that share at least one category.
 * Runs only when the editor picked none and autoFillRelated is not switched off.
 */
export const RELATED_FALLBACK_QUERY = defineQuery(`
  *[
    _type == "event"
    && _id != $id
    && seo.noIndex != true
    && defined(slug.current)
    && count(categories[@._ref in $categoryIds]) > 0
  ] | order(startDate asc)[0...3]{ ${EVENT_CARD_FIELDS} }
`)

/** generateStaticParams — every indexable event page. */
export const EVENT_SLUGS_QUERY = defineQuery(`
  *[_type == "event" && defined(slug.current)]{ "slug": slug.current }
`)

/** The /events index. Upcoming first, then past. */
export const EVENTS_INDEX_QUERY = defineQuery(`
  *[_type == "event" && defined(slug.current) && seo.noIndex != true]
  | order(startDate asc){
    ${EVENT_CARD_FIELDS},
    tldr,
    isFeatured,
    "attendees": stats[label match "Attendee*"][0].num
  }
`)

/** sitemap.xml */
export const SITEMAP_QUERY = defineQuery(`
  *[_type == "event" && defined(slug.current) && seo.noIndex != true]{
    "slug": slug.current,
    lastUpdated,
    _updatedAt,
    startDate
  }
`)
