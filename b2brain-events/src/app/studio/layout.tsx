/**
 * Keep the embedded Studio in its own root layout.
 *
 * The marketing site intentionally has a large global reset and several
 * browser-only integrations. Loading those around Sanity Studio can change
 * its controls and pointer behaviour, so /studio gets a clean document shell.
 */
export default function StudioRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
