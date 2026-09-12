/**
 * Next's metadata sitemap serializer emits video extension values verbatim.
 * Encode XML-reserved characters before handing values to it so one video
 * title, description, or URL cannot invalidate the complete sitemap.
 */
export function escapeSitemapXml(value: string): string {
  return value
    .replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-f]+);)/gi, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
