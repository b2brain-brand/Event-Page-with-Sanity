'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'
import { POSTHOG_KEY, POSTHOG_HOST, POSTHOG_DEFAULTS } from '@/lib/analytics'

/**
 * PostHog — behaviour analytics for the event pages (autocapture: clicks,
 * inputs, etc.), initialised client-side with the SAME project as the rest of
 * b2brain.com. `defaults` matches the main site's init, which enables autocapture
 * and history-change pageviews, so both the first load AND client-side
 * navigations between event pages are captured. Init is guarded so React Fast
 * Refresh / re-mounts don't double-initialise.
 */
export function PostHogAnalytics() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    // Guard against a second init on Fast Refresh / re-mount.
    if ((posthog as unknown as { __loaded?: boolean }).__loaded) return
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      defaults: POSTHOG_DEFAULTS,
    })
  }, [])

  return null
}
