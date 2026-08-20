import type { StructureResolver } from 'sanity/structure'
import { apiVersion } from './env'

/**
 * Studio desk structure.
 *
 * Three things worth keeping:
 *  1. Site settings is a true singleton — one fixed document id, no "create"
 *     button, so nobody can end up with two competing settings docs.
 *  2. Events are split Upcoming / Live / Past / Needs sourcing. There is no
 *     stored "status" field — each list is a live GROQ filter against
 *     startDate/endDate, evaluated against today every time the list opens.
 *     So an event moves itself between buckets automatically as the calendar
 *     turns, with nothing to edit. The boundaries are mutually exclusive and
 *     cover every event (endDate is always >= startDate, enforced by the
 *     schema's validation):
 *       Upcoming: startDate > today            (hasn't started yet)
 *       Live:     startDate <= today <= endDate (in progress right now)
 *       Past:     endDate < today               (already finished)
 *  3. "Needs sourcing" is the production queue: anything still flagged
 *     noindex or missing its quick answer is not finished, and this makes
 *     that visible without opening docs.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('B2Brain')
    .items([
      S.listItem()
        .title('Events')
        .child(
          S.list()
            .title('Events')
            .items([
              S.listItem()
                .title('Upcoming')
                .child(
                  S.documentList()
                    .title('Upcoming events')
                    .apiVersion(apiVersion)
                    .filter('_type == "event" && startDate > $today')
                    .params({ today: new Date().toISOString().slice(0, 10) })
                    .defaultOrdering([{ field: 'startDate', direction: 'asc' }]),
                ),
              S.listItem()
                .title('Live')
                .child(
                  S.documentList()
                    .title('Live events')
                    .apiVersion(apiVersion)
                    .filter('_type == "event" && startDate <= $today && endDate >= $today')
                    .params({ today: new Date().toISOString().slice(0, 10) })
                    .defaultOrdering([{ field: 'startDate', direction: 'asc' }]),
                ),
              S.listItem()
                .title('Past')
                .child(
                  S.documentList()
                    .title('Past events')
                    .apiVersion(apiVersion)
                    .filter('_type == "event" && endDate < $today')
                    .params({ today: new Date().toISOString().slice(0, 10) })
                    .defaultOrdering([{ field: 'startDate', direction: 'desc' }]),
                ),
              S.listItem()
                .title('Needs sourcing')
                .child(
                  S.documentList()
                    .title('Needs sourcing')
                    .apiVersion(apiVersion)
                    .filter(
                      '_type == "event" && (seo.noIndex == true || !defined(tldr) || count(faq) < 3 || count(sources) == 0)',
                    )
                    .defaultOrdering([{ field: 'startDate', direction: 'asc' }]),
                ),
              S.divider(),
              S.listItem()
                .title('All events')
                .child(S.documentTypeList('event').title('All events')),
            ]),
        ),

      S.divider(),

      S.listItem().title('Venues').child(S.documentTypeList('venue').title('Venues')),
      S.listItem()
        .title('Event series')
        .child(S.documentTypeList('eventSeries').title('Event series')),
      S.listItem()
        .title('Categories')
        .child(S.documentTypeList('eventCategory').title('Categories')),

      S.divider(),

      S.listItem()
        .title('Events page (/events)')
        .id('eventsIndexPage')
        .child(
          S.document()
            .schemaType('eventsIndexPage')
            .documentId('eventsIndexPage')
            .title('Events page (/events)'),
        ),

      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site settings'),
        ),
    ])
