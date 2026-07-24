import type { SchemaTypeDefinition } from 'sanity'

// Documents
import { event } from './documents/event'
import { venue } from './documents/venue'
import { eventSeries } from './documents/eventSeries'
import { eventCategory } from './documents/eventCategory'
import { siteSettings } from './documents/siteSettings'

// Objects
import { heroVideo } from './objects/hero'
import { statCell } from './objects/stats'
import { galleryItem } from './objects/gallery'
import { whyBlock, pullquote } from './objects/why'
import { agendaBlock, agendaDay, agendaSession } from './objects/agenda'
import { speaker } from './objects/speakers'
import { exhibitorsBlock, exhibitorTier } from './objects/exhibitors'
import { audienceBlock, titleMixRow } from './objects/audience'
import { costBlock, roiInputs } from './objects/cost'
import { logisticsBlock, logisticsCell, passTier } from './objects/logistics'
import {
  sentimentBlock,
  videoReview,
  redditReview,
  testimonial,
} from './objects/sentiment'
import { playbookBlock, playbookMotion } from './objects/playbook'
import { faqItem } from './objects/faq'
import { seo, source, navLink, footerColumn, socialLink } from './objects/shared'

export const schemaTypes: SchemaTypeDefinition[] = [
  // documents
  event,
  venue,
  eventSeries,
  eventCategory,
  siteSettings,

  // objects — page modules, in page order
  heroVideo,
  statCell,
  galleryItem,
  whyBlock,
  pullquote,
  agendaBlock,
  agendaDay,
  agendaSession,
  speaker,
  exhibitorsBlock,
  exhibitorTier,
  audienceBlock,
  titleMixRow,
  costBlock,
  roiInputs,
  logisticsBlock,
  logisticsCell,
  passTier,
  sentimentBlock,
  videoReview,
  redditReview,
  testimonial,
  playbookBlock,
  playbookMotion,
  faqItem,

  // objects — shared
  seo,
  source,
  navLink,
  footerColumn,
  socialLink,
]
