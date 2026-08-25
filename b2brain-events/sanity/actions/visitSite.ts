import type {DocumentActionComponent, SanityDocument} from 'sanity'

type SluggedDocument = SanityDocument & {
  slug?: {current?: string}
}

/**
 * Resolve Sanity page documents to their public frontend route.
 *
 * Documents such as venues and event series are intentionally excluded because
 * they do not have standalone frontend pages in this application.
 */
export function getSitePath(type: string, document?: SanityDocument | null) {
  if (type === 'eventsIndexPage' || type === 'siteSettings') return '/events'

  const slug = (document as SluggedDocument | null | undefined)?.slug?.current
  if (!slug) return null

  if (type === 'event') return `/events/${slug}`
  if (type === 'eventCategory') return `/events/industry/${slug}`

  return null
}

/**
 * Adds "Visit site" to the document actions menu.
 *
 * Published documents with no pending draft open on the public site. Drafts
 * open through Sanity Presentation so the existing authenticated draft-mode
 * handshake can safely render unpublished content.
 */
export const VisitSiteAction: DocumentActionComponent = ({draft, published, type}) => {
  const document = draft || published
  const path = getSitePath(type, document)

  if (!path) return null

  return {
    label: 'Visit site',
    title: draft
      ? 'Preview this page with its latest draft changes'
      : 'Open the published page on the site',
    onHandle: () => {
      if (draft) {
        const presentationUrl = new URL('/studio/presentation', window.location.origin)
        presentationUrl.searchParams.set('preview', path)
        window.open(presentationUrl.toString(), '_blank', 'noopener,noreferrer')
        return
      }

      const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      window.open(new URL(path, siteOrigin).toString(), '_blank', 'noopener,noreferrer')
    },
  }
}
