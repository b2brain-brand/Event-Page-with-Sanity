'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import { GA_MEASUREMENT_ID } from '@/lib/analytics'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * The App Router navigates client-side, so GA4's automatic page_view only fires
 * on the first load. We disable auto page_view (`send_page_view:false`) and send
 * one manually on every route change — including the first — so each event page
 * a visitor opens is a distinct GA pageview. useSearchParams needs a Suspense
 * boundary, hence the wrapper.
 */
function GaPageviews() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!window.gtag) return
    const qs = searchParams?.toString()
    const path = qs ? `${pathname}?${qs}` : pathname
    window.gtag('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname, searchParams])

  return null
}

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });`}
      </Script>
      <Suspense fallback={null}>
        <GaPageviews />
      </Suspense>
    </>
  )
}
