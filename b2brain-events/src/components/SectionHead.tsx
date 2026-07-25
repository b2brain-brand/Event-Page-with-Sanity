import { has } from '@/lib/format'

/**
 * Section head: eyebrow -> H2 -> optional sub-paragraph.
 *
 * Two eyebrow styles:
 *   'asterisk' (default) — black `* LABEL`, the landing-page brutalist style
 *   'dash'               — orange `- LABEL`, the b2brain.com/events style
 * The /events collection page uses 'dash' to match the main site; the landing
 * pages keep 'asterisk'.
 */
export function SectionHead({
  eyebrow,
  title,
  sub,
  variant = 'asterisk',
}: {
  eyebrow: string
  title?: string | null
  sub?: string | null
  variant?: 'asterisk' | 'dash'
}) {
  return (
    <div className="sec__head">
      <span className={`eyebrow ${variant === 'dash' ? 'eyebrow--dash' : 'eyebrow--asterisk'}`}>
        {eyebrow}
      </span>
      {has(title) && <h2>{title}</h2>}
      {has(sub) && <p>{sub}</p>}
    </div>
  )
}

/** The `sec()` wrapper: bordered section + centred container. */
export function Section({
  id,
  children,
  style,
}: {
  id: string
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <section id={id} className="sec" style={style}>
      <div className="container">{children}</div>
    </section>
  )
}
