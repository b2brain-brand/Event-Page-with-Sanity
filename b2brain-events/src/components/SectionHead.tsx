import { has } from '@/lib/format'

/**
 * The `head()` helper from preview-v2.html: asterisk eyebrow -> H2 -> optional
 * sub-paragraph. Every section on the page opens with this, no exceptions —
 * it is design-system rule 3.
 */
export function SectionHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string
  title?: string | null
  sub?: string | null
}) {
  return (
    <div className="sec__head">
      <span className="eyebrow eyebrow--asterisk">{eyebrow}</span>
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
