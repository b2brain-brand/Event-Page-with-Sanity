import type { Metadata } from 'next'
import { Archivo, Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'
import { DisableDraftMode } from '@/components/DisableDraftMode'
import { PostHogAnalytics } from '@/components/analytics/PostHogAnalytics'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { FactorsAnalytics } from '@/components/analytics/FactorsAnalytics'
import { DidAgent } from '@/components/DidAgent'
import { siteUrl } from '@/sanity/env'
import './globals.css'

/**
 * Archivo for display, Inter for body — the two families the reference build
 * loads from Google Fonts, served self-hosted by next/font so there is no
 * render-blocking third-party request and no layout shift.
 */
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-archivo',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

/**
 * InterDisplay — the header uses this, not plain Inter. It is the display-optical
 * cut of Inter that the live b2brain.com nav loads; these are the exact same
 * woff2 files (self-hosted here so there is no third-party request). Google Fonts
 * does not expose "Inter Display" through next/font/google, so it is loaded
 * locally. `--font-inter-display` is applied only to the nav (see .nav__links).
 */
const interDisplay = localFont({
  variable: '--font-inter-display',
  display: 'swap',
  src: [
    { path: './fonts/InterDisplay-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/InterDisplay-Medium.woff2', weight: '500', style: 'normal' },
    { path: './fonts/InterDisplay-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: './fonts/InterDisplay-Bold.woff2', weight: '700', style: 'normal' },
  ],
})

// Favicon — the exact same B2Brain symbol PNGs the main Webflow site uses,
// served from the Webflow CDN. NOT a /icon.png root path: under the
// b2brain.com/events reverse-proxy a root path routes to Webflow and 404s, so
// the tab icon was missing on the event pages. Absolute CDN URLs load anywhere,
// so /events now shows the same favicon as every other page. (The file-based
// src/app/icon.png convention is removed so Next doesn't also emit the broken
// /icon.png link.)
const WF_ICON = 'https://cdn.prod.website-files.com/69e6119560a70ab3a0930480'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'B2Brain — The Event Meeting Platform',
    template: '%s',
  },
  description:
    'Turn trade-show conversations into booked meetings and measurable pipeline.',
  icons: {
    icon: [
      { url: `${WF_ICON}/6a19cab255d2ae94bd212f60_B2Brain%20Logo_Symbol%20(1).png`, sizes: '32x32', type: 'image/png' },
      { url: `${WF_ICON}/6a19cab2c9f4a6c0ccbdc674_B2Brain%20Logo_Symbol%20(1).png`, sizes: '48x48', type: 'image/png' },
      { url: `${WF_ICON}/6a19cab22adb2f53feaca611_B2Brain%20Logo_Symbol%20(1).png`, sizes: '192x192', type: 'image/png' },
      { url: `${WF_ICON}/6a19cab2ceb6c05fe5791492_B2Brain%20Logo_Symbol%20(1).png`, sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: `${WF_ICON}/6a19cab2bfcb55423aa39b58_B2Brain%20Logo_Symbol%20(1).png`, sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isEnabled: isDraft } = await draftMode()

  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable} ${interDisplay.variable}`}>
      <body>
        {/* Analytics — same GA4 / PostHog / Factors as the rest of b2brain.com,
            so the event pages are tracked in the same dashboards. Skipped in
            draft/preview so Studio sessions don't pollute production data. */}
        {!isDraft && (
          <>
            <PostHogAnalytics />
            <GoogleAnalytics />
            <FactorsAnalytics />
            <DidAgent />
          </>
        )}
        {children}
        {isDraft && (
          <>
            <VisualEditing />
            <DisableDraftMode />
          </>
        )}
      </body>
    </html>
  )
}
