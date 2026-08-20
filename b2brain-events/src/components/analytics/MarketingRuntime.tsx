'use client'

import { FactorsAnalytics } from './FactorsAnalytics'
import { GoogleAnalytics } from './GoogleAnalytics'
import { PostHogAnalytics } from './PostHogAnalytics'
import { DidAgent } from '../DidAgent'

/**
 * Public-site analytics live in the website root layout, which is completely
 * separate from the embedded Studio root layout.
 *
 * D-ID is rendered here only because DidAgent has a strict development + local
 * port 3005 guard. It remains inactive in every deployed environment until its
 * interaction suite passes and production activation is explicitly approved.
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
