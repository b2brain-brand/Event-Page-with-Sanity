/**
 * Small inline glyphs for the nav dropdown (coloured icon squares) and the
 * footer's "Learn about B2Brain with AI" row. Inline SVG — the design system
 * forbids icon fonts, and these are cheaper than a font request anyway.
 */

/**
 * Nav dropdown icons — the exact 48×48 SVGs from b2brain.com's Use Cases menu.
 * Each SVG is a complete tile: its own pastel background rect (green / purple /
 * beige) plus the black glyph with a red (#FF382C) accent. Rendered verbatim, so
 * they are pixel-identical to the live site.
 */
export function UseCaseIcon({ icon }: { icon?: string }) {
  return (
    <span className="uc-icon" aria-hidden="true">
      {icon === 'pipeline' && (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" fill="#CEE680" />
          <path d="M19 28H12V38H19V28Z" stroke="black" strokeWidth="2" strokeLinejoin="round" />
          <path d="M28 20H21V38H28V20Z" stroke="black" strokeWidth="2" strokeLinejoin="round" />
          <path d="M37 10H30V38H37V10Z" fill="#FF382C" stroke="black" strokeWidth="2" strokeLinejoin="round" />
          <path d="M8 38H39" stroke="black" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
      {icon === 'attendees' && (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" fill="#D6C0E7" />
          <path
            d="M24 23C27.3137 23 30 20.3137 30 17C30 13.6863 27.3137 11 24 11C20.6863 11 18 13.6863 18 17C18 20.3137 20.6863 23 24 23Z"
            fill="black"
          />
          <path
            d="M12 39V37C12 33.8174 13.2643 30.7652 15.5147 28.5147C17.7652 26.2643 20.8174 25 24 25C27.1826 25 30.2348 26.2643 32.4853 28.5147C34.7357 30.7652 36 33.8174 36 37V39"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M33 16C34.6569 16 36 14.6569 36 13C36 11.3431 34.6569 10 33 10C31.3431 10 30 11.3431 30 13C30 14.6569 31.3431 16 33 16Z"
            fill="#FF382C"
          />
        </svg>
      )}
      {icon === 'exhibitors' && (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" fill="#E8E3CA" />
          <path d="M40 10H8V19H40V10Z" fill="#FF382C" stroke="black" strokeWidth="2" strokeLinejoin="round" />
          <path d="M13 19V27" stroke="black" strokeWidth="2" strokeLinecap="round" />
          <path d="M35 19V27" stroke="black" strokeWidth="2" strokeLinecap="round" />
          <path d="M39 27H9V38H39V27Z" stroke="black" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      )}
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
