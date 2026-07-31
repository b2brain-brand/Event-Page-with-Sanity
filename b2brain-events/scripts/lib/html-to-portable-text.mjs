/**
 * =============================================================================
 * WEBFLOW RICH TEXT  ->  PORTABLE TEXT
 * =============================================================================
 *
 * Webflow's rich text editor emits a flat, predictable subset of HTML:
 *
 *   <h2> <h3> <h4> <p> <ul><li> <ol><li> <blockquote>
 *   <strong> <em> <a href> <br>
 *   <figure …><a><div><img src alt></div></a><figcaption>…</figcaption></figure>
 *
 * That is small enough to parse directly, which is why this file exists instead
 * of a jsdom + @sanity/block-tools dependency: no DOM, no install, and the
 * failure modes are ours rather than a black box's.
 *
 * KNOWN LIMIT: nested lists (a <ul> inside an <li>) are not supported — the
 * inner list is flattened onto the parent item. Webflow's editor does not
 * produce them for this collection; if that ever changes, the importer's
 * `--dry-run` output will show it as a run-on bullet.
 *
 * Keys are counter-derived, not random, so re-running the importer against
 * unchanged source produces a byte-identical document and Sanity records no
 * revision.
 */

/* ------------------------------------------------------------------ entities */

const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”',
  ndash: '–', mdash: '—', hellip: '…', middot: '·',
  times: '×', divide: '÷', deg: '°', trade: '™',
  copy: '©', reg: '®', euro: '€', pound: '£', bull: '•',
}

export function decodeEntities(s = '') {
  return String(s)
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-z]+);/gi, (m, n) => (n.toLowerCase() in NAMED ? NAMED[n.toLowerCase()] : m))
}

/** Strip every tag and collapse whitespace. For fields that are plain strings. */
export function htmlToText(html = '') {
  return decodeEntities(
    String(html)
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<\/(p|h[1-6]|li|div|blockquote)>/gi, '\n')
      .replace(/<[^>]+>/g, ''),
  )
    .replace(/[ \t ]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim()
}

/** Every top-level <p>/<li> in `html`, as an array of plain strings. */
export function htmlToParagraphs(html = '') {
  const out = []
  for (const m of String(html).matchAll(/<(p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const t = htmlToText(m[2])
    if (t) out.push(t)
  }
  // No block tags at all — treat the whole string as one paragraph.
  if (!out.length) {
    const t = htmlToText(html)
    if (t) out.push(t)
  }
  return out
}

/* -------------------------------------------------------------- inline spans */

/**
 * Parse the inside of a block into Portable Text spans, carrying `strong`,
 * `em` and link annotations down through nesting.
 */
function parseInline(html, keyer, markDefs) {
  const spans = []
  const push = (text, marks) => {
    if (!text) return
    const last = spans[spans.length - 1]
    // Merge adjacent spans that carry the same marks — keeps the block tidy
    // and matches what the Studio itself would produce on save.
    if (last && sameMarks(last.marks, marks)) {
      last.text += text
      return
    }
    spans.push({ _type: 'span', _key: keyer(), text, marks: [...marks] })
  }

  const walk = (src, marks) => {
    let i = 0
    const re = /<(\/?)([a-zA-Z0-9]+)((?:[^>"']|"[^"]*"|'[^']*')*)>/g
    let m
    while ((m = re.exec(src))) {
      push(decodeEntities(src.slice(i, m.index)), marks)
      const [full, closing, rawTag, attrs] = m
      const tag = rawTag.toLowerCase()
      i = m.index + full.length

      if (closing) continue
      if (tag === 'br') {
        push('\n', marks)
        continue
      }

      // Find the matching close tag so we can recurse into the contents.
      const close = findClose(src, tag, re.lastIndex)
      if (close === -1) continue
      const inner = src.slice(re.lastIndex, close.start)

      if (tag === 'strong' || tag === 'b') walk(inner, [...marks, 'strong'])
      else if (tag === 'em' || tag === 'i') walk(inner, [...marks, 'em'])
      else if (tag === 'a') {
        const href = (attrs.match(/href\s*=\s*"([^"]*)"/i) || attrs.match(/href\s*=\s*'([^']*)'/i) || [])[1]
        if (href) {
          const key = keyer()
          markDefs.push({ _type: 'link', _key: key, href: decodeEntities(href) })
          walk(inner, [...marks, key])
        } else walk(inner, marks)
      } else {
        // span, div, anything else decorative — keep the text, drop the tag.
        walk(inner, marks)
      }

      re.lastIndex = close.end
      i = close.end
    }
    push(decodeEntities(src.slice(i)), marks)
  }

  walk(String(html), [])
  return spans.filter((s) => s.text !== '')
}

function sameMarks(a = [], b = []) {
  return a.length === b.length && a.every((x, i) => x === b[i])
}

/** Index of the close tag matching an already-opened `tag`, honouring nesting. */
function findClose(src, tag, from) {
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi')
  re.lastIndex = from
  let depth = 1
  let m
  while ((m = re.exec(src))) {
    depth += m[1] ? -1 : 1
    if (depth === 0) return { start: m.index, end: m.index + m[0].length }
  }
  return -1
}

/* ------------------------------------------------------------------- blocks */

const BLOCK_RE =
  /<(h2|h3|h4|p|blockquote|ul|ol|figure)\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/\1>/gi

const STYLE = { h2: 'h2', h3: 'h3', h4: 'h4', p: 'normal', blockquote: 'blockquote' }

/**
 * Convert one Webflow rich-text string into Portable Text.
 *
 * `onImage(src, alt, caption)` is awaited for every <figure> and should return
 * a Sanity image block (or null to drop it) — the importer uses it to upload
 * the asset. Omit it and figures are skipped entirely.
 */
export async function htmlToPortableText(html, { keyPrefix = 'b', onImage } = {}) {
  let n = 0
  const blocks = []
  const nextKey = () => `${keyPrefix}${n++}`

  const emit = (style, inner, listItem) => {
    const key = nextKey()
    const markDefs = []
    let sn = 0
    // Span keys and link-annotation keys share one counter — they only have to
    // be unique inside the block, and one counter cannot collide with itself.
    const children = parseInline(inner, () => `${key}s${sn++}`, markDefs)
    if (!children.length) return
    const block = { _type: 'block', _key: key, style, markDefs, children }
    if (listItem) {
      block.listItem = listItem
      block.level = 1
    }
    blocks.push(block)
  }

  for (const m of String(html || '').matchAll(BLOCK_RE)) {
    const tag = m[1].toLowerCase()
    const inner = m[3]

    if (tag === 'ul' || tag === 'ol') {
      const listItem = tag === 'ul' ? 'bullet' : 'number'
      for (const li of inner.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)) {
        emit('normal', li[1], listItem)
      }
      continue
    }

    if (tag === 'figure') {
      if (!onImage) continue
      const src = (inner.match(/<img\b[^>]*\ssrc\s*=\s*"([^"]*)"/i) || [])[1]
      if (!src) continue
      let alt = (inner.match(/<img\b[^>]*\salt\s*=\s*"([^"]*)"/i) || [])[1] || ''
      // Webflow writes this placeholder when the editor left alt text blank.
      if (alt === '__wf_reserved_inherit' || alt === '__wf_reserved_decorative') alt = ''
      const caption = htmlToText((inner.match(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i) || [])[1] || '')
      const node = await onImage({ src: decodeEntities(src), alt: decodeEntities(alt), caption })
      if (node) blocks.push({ ...node, _key: nextKey() })
      continue
    }

    emit(STYLE[tag] || 'normal', inner)
  }

  return blocks
}
