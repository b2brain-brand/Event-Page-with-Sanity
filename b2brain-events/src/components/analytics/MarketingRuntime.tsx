'use client'

import { FactorsAnalytics } from './FactorsAnalytics'
import { GoogleAnalytics } from './GoogleAnalytics'
import { PostHogAnalytics } from './PostHogAnalytics'
import { DidAgent } from '../DidAgent'

/**
 * Public-site analytics live in the website root layout, which is completely
 * separate from the embedded Studio root layout.
 *
 * D-ID uses the same horizontal conversation surface as b2brain.com inside a
 * pointer-isolated iframe. This component is never rendered by the separate
 * Studio root layout.
 */
export function MarketingRuntime() {
  return (
    <>
      <PostHogAnalytics />
      <GoogleAnalytics />
      <FactorsAnalytics />
      <DidAgent />
    </>
  )
}
