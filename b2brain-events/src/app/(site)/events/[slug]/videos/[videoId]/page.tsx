import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Footer } from '@/components/Footer'
import { VideoJsonLd } from '@/components/JsonLd'
import { Nav } from '@/components/Nav'
import { getEventWatchVideos } from '@/lib/event-videos'
import type { EventDoc, SiteSettings } from '@/lib/types'
import { resolveYouTubeMetadata } from '@/lib/youtube'
import { siteUrl } from '@/sanity/env'
import { fetchSanity } from '@/sanity/lib/fetch'
import { EVENT_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'

export const revalidate = 60
export const dynamicParams = true

type Params = { slug: string; videoId: string }

async function getEvent(slug: string) {
  return fetchSanity<EventDoc | null>({
    query: EVENT_QUERY,
    params: { slug },
    tags: ['event', `event:${slug}`, 'venue', 'eventSeries'],
  })
}

async function getSettings() {
  return fetchSanity<SiteSettings | null>({
    query: SITE_SETTINGS_QUERY,
    tags: ['siteSettings'],
  })
}

function findVideo(event: EventDoc | null, videoId: string) {
  return event ? getEventWatchVideos(event).find((video) => video.id === videoId) : undefined
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug, videoId } = await params
  const event = await getEvent(slug)
  const video = findVideo(event, videoId)
  if (!event || !video) return { title: 'Event video not found' }

  const metadata = await resolveYouTubeMetadata(video.id)
  const title = metadata.title || video.title
  const description = video.description
  const canonical = `${siteUrl}${video.watchPath}`

  return {
    title: `${title} | ${event.name} video | B2Brain`,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'video.other',
      title,
      description,
      url: canonical,
      siteName: 'B2Brain',
      images: [
        {
          url: metadata.thumbnailUrl,
          width: 1280,
          height: 720,
          alt: `${title} — ${event.name}`,
        },
      ],
      videos: [{ url: video.embedUrl, type: 'text/html' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [metadata.thumbnailUrl],
    },
  }
}

export default async function EventVideoPage({ params }: { params: Promise<Params> }) {
  const { slug, videoId } = await params
  const [event, settings] = await Promise.all([getEvent(slug), getSettings()])
  const video = findVideo(event, videoId)
  if (!event || !video) notFound()

  const metadata = await resolveYouTubeMetadata(video.id)
  const title = metadata.title || video.title
  const pageUrl = `${siteUrl}${video.watchPath}`

  return (
    <>
      <VideoJsonLd event={event} video={video} metadata={metadata} pageUrl={pageUrl} />
      <Nav settings={settings} />
      <main className="video-watch">
        <div className="container video-watch__inner">
          <nav className="video-watch__breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/events">Events</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/events/${event.slug}`}>{event.name}</Link>
            <span aria-hidden="true">/</span>
            <span>Video</span>
          </nav>

          <p className="eyebrow">* {video.source || `${event.name} video`}</p>
          <h1>{title}</h1>

          <div className="video-watch__player">
            <iframe
              src={video.embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>

          <div className="video-watch__copy">
            <p>{video.description}</p>
            <Link className="btn btn--primary" href={`/events/${event.slug}`}>
              View the {event.name} guide
            </Link>
          </div>
        </div>
      </main>
      <Footer settings={settings} lastUpdated={event.lastUpdated} sources={event.sources} />
    </>
  )
}
