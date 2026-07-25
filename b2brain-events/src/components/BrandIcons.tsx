/**
 * Small inline glyphs for the nav dropdown (coloured icon squares) and the
 * footer's "Learn about B2Brain with AI" row. Inline SVG — the design system
 * forbids icon fonts, and these are cheaper than a font request anyway.
 */

/** Nav dropdown icons: a coloured square with a simple black glyph, matching b2brain.com. */
export function UseCaseIcon({ icon }: { icon?: string }) {
  const tint =
    icon === 'pipeline' ? 'var(--green)' : icon === 'attendees' ? 'var(--purple-light)' : 'var(--orange-light)'
  return (
    <span className="uc-icon" style={{ background: tint }} aria-hidden="true">
      <svg viewBox="0 0 20 20" width="18" height="18">
        {icon === 'pipeline' && (
          // bar chart / pipeline growth
          <g fill="currentColor">
            <rect x="3" y="12" width="3" height="5" />
            <rect x="8.5" y="8" width="3" height="9" />
            <rect x="14" y="4" width="3" height="13" />
          </g>
        )}
        {icon === 'attendees' && (
          // person
          <g fill="currentColor">
            <circle cx="10" cy="6" r="3" />
            <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6z" />
          </g>
        )}
        {icon === 'exhibitors' && (
          // booth / exhibitor stand
          <g fill="currentColor">
            <rect x="3" y="4" width="14" height="3" />
            <rect x="4.5" y="8" width="2.5" height="8" />
            <rect x="13" y="8" width="2.5" height="8" />
            <rect x="4.5" y="14" width="11" height="2" />
          </g>
        )}
      </svg>
    </span>
  )
}

/** Monochrome marks for the answer-engine links in the footer. */
export function AiGlyph({ glyph }: { glyph: string }) {
  const paths: Record<string, React.ReactNode> = {
    openai: (
      <path d="M12 2a5 5 0 014.9 4A5 5 0 0119 12a5 5 0 01-2 6 5 5 0 01-5 4 5 5 0 01-5-4 5 5 0 01-2-6 5 5 0 012.1-6A5 5 0 0112 2zm0 3.2L8 7.5v4L12 14l4-2.5v-4L12 5.2z" />
    ),
    claude: (
      <path d="M12 3l1.9 5.5L19 10l-4.6 2 .6 5.5L12 15l-3 2.5.6-5.5L5 10l5.1-1.5L12 3z" />
    ),
    perplexity: <path d="M12 3l7 4v10l-7 4-7-4V7l7-4zm0 2.3L7 8v8l5 2.7L17 16V8l-5-2.7z" />,
    gemini: <path d="M12 2c1 5.5 4.5 9 10 10-5.5 1-9 4.5-10 10-1-5.5-4.5-9-10-10 5.5-1 9-4.5 10-10z" />,
    grok: <path d="M4 4h5l11 16h-5L4 4zm10 0h6l-6 8-3-4 3-4z" />,
  }
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <g fill="currentColor">{paths[glyph] ?? <circle cx="12" cy="12" r="9" />}</g>
    </svg>
  )
}
