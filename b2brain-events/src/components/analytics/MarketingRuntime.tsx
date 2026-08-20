'use client'

import { FactorsAnalytics } from './FactorsAnalytics'
import { GoogleAnalytics } from './GoogleAnalytics'
import { PostHogAnalytics } from './PostHogAnalytics'
import { DidAgent } from '../DidAgent'

/**
 * Public-site analytics live in the website root layout, which is completely
 * separate from the embedded Studio root layout.
 *
 * D-ID is iframe-isolated so its document-level listeners cannot intercept
 * website controls. This component is never rendered by the separate Studio
 * root layout.
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
