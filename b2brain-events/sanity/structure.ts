import type { StructureResolver } from 'sanity/structure'

/**
 * Studio desk structure.
 *
 * Two things worth keeping:
 *  1. Site settings is a true singleton — one fixed document id, no "create"
 *     button, so nobody can end up with two competing settings docs.
 *  2. Events are split Upcoming / Past / Needs sourcing. That third list is the
 *     production queue: anything still flagged noindex or missing its quick
 *     answer is not finished, and this makes that visible without opening docs.
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
                    .filter('_type == "event" && startDate >= $today')
                    .params({ today: new Date().toISOString().slice(0, 10) })
                    .defaultOrdering([{ field: 'startDate', direction: 'asc' }]),
                ),
              S.listItem()
                .title('Past')
                .child(
                  S.documentList()
                    .title('Past events')
                    .filter('_type == "event" && startDate < $today')
                    .params({ today: new Date().toISOString().slice(0, 10) })
                    .defaultOrdering([{ field: 'startDate', direction: 'desc' }]),
                ),
              S.listItem()
                .title('Needs sourcing')
                .child(
                  S.documentList()
                    .title('Needs sourcing')
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
        .title('Site settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site settings'),
        ),
    ])
