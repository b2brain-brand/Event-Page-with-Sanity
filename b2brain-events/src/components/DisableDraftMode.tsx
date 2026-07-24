'use client'

/**
 * Small escape hatch shown only while draft mode is on: a fixed pill that turns
 * preview off. Without it, an editor who opens a preview link in a normal tab
 * keeps seeing unpublished content and has no obvious way out.
 *
 * It hides itself inside the Presentation tool's iframe, where the Studio
 * already owns the perspective switch.
 */
export function DisableDraftMode() {
  if (typeof window !== 'undefined' && window !== window.parent) return null

  return (
    <a
      href="/api/draft-mode/disable"
      style={{
        position: 'fixed',
        left: 20,
        bottom: 20,
        zIndex: 200,
        background: 'var(--black)',
        color: 'var(--white)',
        border: '1px solid var(--black)',
        padding: '10px 16px',
        fontSize: 13,
        fontWeight: 500,
        fontFamily: 'var(--font-body)',
      }}
    >
      Previewing drafts — click to exit
    </a>
  )
}
