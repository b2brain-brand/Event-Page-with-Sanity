import type { Metadata } from 'next'
import { Archivo, Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'
import { DisableDraftMode } from '@/components/DisableDraftMode'
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'B2Brain — The Event Meeting Platform',
    template: '%s',
  },
  description:
    'Turn trade-show conversations into booked meetings and measurable pipeline.',
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
