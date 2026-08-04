'use client'

import { Suspense, useEffect, useRef } from 'react'
import posthog from 'posthog-js'
import { usePathname, useSearchParams } from 'next/navigation'
import { POSTHOG_KEY, POSTHOG_HOST, POSTHOG_DEFAULTS } from '@/lib/analytics'

/**
 * PostHog — behaviour analytics for the event pages, same project as the rest of
 * b2brain.com.
 *
 * Init runs at MODULE LOAD (client only), not in an effect: if we init in an
 * effect it happens after the page has already loaded, so `history_change`
 * pageview capture never sees the initial load and the landing page is missed.
 * Initialising at module load — then firing `$pageview` ourselves on every route
 * change — reliably captures both the first page AND client-side navigations.
 * `capture_pageview:false` overrides the `defaults` bundle's auto-pageview so we
 * don't double-count; autocapture (clicks/inputs) and pageleave from `defaults`
 * stay on.
 */
if (typeof window !== 'undefined' && !(posthog as unknown as { __loaded?: boolean }).__loaded) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    defaults: POSTHOG_DEFAULTS,
    capture_pageview: false,
  })
}

function PostHogPageviews() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastUrl = useRef<string | null>(null)

  useEffect(() => {
    const qs = searchParams?.toString()
    const path = qs ? `${pathname}?${qs}` : pathname
    if (lastUrl.current === path) return
    lastUrl.current = path
    posthog.capture('$pageview')
  }, [pathname, searchParams])

  return null
}

export function PostHogAnalytics() {
  return (
    <Suspense fallback={null}>
      <PostHogPageviews />
    </Suspense>
  )
}
