'use client'

import { FactorsAnalytics } from './FactorsAnalytics'
import { GoogleAnalytics } from './GoogleAnalytics'
import { PostHogAnalytics } from './PostHogAnalytics'

/**
 * Public-site analytics live in the website root layout, which is completely
 * separate from the embedded Studio root layout.
 *
 * Do not restore the D-ID agent here without retesting every interactive
 * control. Its current loader intercepts native click events at document level,
 * which prevents React buttons (FAQ, agenda, gallery, and nav) from receiving
 * normal mouse clicks.
 */
export function MarketingRuntime() {
  return (
    <>
      <PostHogAnalytics />
      <GoogleAnalytics />
      <FactorsAnalytics />
    </>
  )
}
