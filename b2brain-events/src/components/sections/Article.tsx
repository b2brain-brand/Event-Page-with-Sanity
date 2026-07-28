import Image from 'next/image'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { has } from '@/lib/format'
import { L } from '@/lib/defaults'
import { Section, SectionHead } from '../SectionHead'
import type { ArticleBlock, EventDoc, SiteSettings } from '@/lib/types'

/**
 * EVENT ARTICLE — the editorial "blog" body, before the FAQ.
 *
 * Renders the Portable Text with a sticky "On this page" TOC built from the H2
 * and H3 headings, matching the live layout. Each heading gets a slug id so the
 * TOC links and in-page anchors resolve. A "Key takeaways" block renders as the
 * highlighted TL;DR panel.
 */

/** "Day-by-Day Floor Strategy" -> "day-by-day-floor-strategy". */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80)
}

/** Plain text of a Portable Text block's children. */
function blockText(block: ArticleBlock): string {
  return (block.children || []).map((c) => c.text || '').join('')
}

type TocEntry = { id: string; text: string; level: 2 | 3 }

export function Article({
  event,
  settings,
}: {
  event: EventDoc
  settings: SiteSettings | null
}) {
  const blocks = (event.article || []).filter(Boolean)
  if (!blocks.length) return null

  // Build the TOC + a heading-block -> id map (ids must match what we render).
  const toc: TocEntry[] = []
  const idFor = new Map<string, string>()
  const used = new Set<string>()
  for (const b of blocks) {
    if (b._type !== 'block' || (b.style !== 'h2' && b.style !== 'h3')) continue
    const text = blockText(b).trim()
    if (!text) continue
    let id = slugify(text) || `s-${b._key}`
    while (used.has(id)) id = `${id}-${b._key.slice(0, 4)}`
    used.add(id)
    idFor.set(b._key, id)
    toc.push({ id, text, level: b.style === 'h2' ? 2 : 3 })
  }

  const components: PortableTextComponents = {
    block: {
      h2: ({ value, children }) => (
        <h2 id={idFor.get((value as unknown as ArticleBlock)._key)} className="article__h2">
          {children}
        </h2>
      ),
      h3: ({ value, children }) => (
        <h3 id={idFor.get((value as unknown as ArticleBlock)._key)} className="article__h3">
          {children}
        </h3>
      ),
      h4: ({ children }) => <h4 className="article__h4">{children}</h4>,
      normal: ({ children }) => <p className="article__p">{children}</p>,
      blockquote: ({ children }) => <blockquote className="article__quote">{children}</blockquote>,
    },
    list: {
      bullet: ({ children }) => <ul className="article__ul">{children}</ul>,
      number: ({ children }) => <ol className="article__ol">{children}</ol>,
    },
    marks: {
      strong: ({ children }) => <strong>{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
      link: ({ value, children }) => {
        const href = (value as { href?: string })?.href || '#'
        const external = /^https?:\/\//.test(href)
        return (
          <a
            href={href}
            className="link-underline"
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {children}
          </a>
        )
      },
    },
    types: {
      keyTakeaways: ({ value }) => {
        const v = value as ArticleBlock
        return (
          <div className="article__tldr">
            {has(v.eyebrow) && <div className="article__tldr-eyebrow">{v.eyebrow}</div>}
            {has(v.heading) && <h2 className="article__tldr-heading">{v.heading}</h2>}
            {(v.points || []).length > 0 && (
              <ul className="article__tldr-list">
                {(v.points || []).map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            )}
          </div>
        )
      },
      image: ({ value }) => {
        const v = value as ArticleBlock
        const url = v.asset?.url
        if (!url) return null
        return (
          <figure className="article__figure">
            <Image src={url} alt={v.alt || ''} width={1200} height={675} className="article__img" />
            {has(v.caption) && <figcaption className="article__cap">{v.caption}</figcaption>}
          </figure>
        )
      },
    },
  }

  return (
    <Section id="article">
      <SectionHead
        eyebrow={L(settings, 'articleEyebrow')}
        title={L(settings, 'articleHeading')}
      />
      <div className="article">
        {toc.length > 0 && (
          <aside className="article__toc" aria-label="On this page">
            <div className="article__toc-label">{L(settings, 'articleTocLabel')}</div>
            <nav>
              {toc.map((t) => (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  className={t.level === 3 ? 'article__toc-link article__toc-link--sub' : 'article__toc-link'}
                >
                  {t.text}
                </a>
              ))}
            </nav>
          </aside>
        )}
        <div className="article__body">
          <PortableText value={blocks as never} components={components} />
        </div>
      </div>
    </Section>
  )
}
