import type { Metadata } from 'next'
import { Archivo, Inter } from 'next/font/google'
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
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
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
