import Link from 'next/link'
import { L, S } from '@/lib/defaults'
import { has } from '@/lib/format'
import type { SiteSettings } from '@/lib/types'

/**
 * Footer. The "stamp" line under the blurb is the page's sourcing trail —
 * last-updated date plus the sources the numbers came from. It is small, and it
 * is the single cheapest trust signal on a programmatic page set.
 */
export function Footer({
  settings,
  lastUpdated,
  sources,
}: {
  settings: SiteSettings | null
  lastUpdated?: string | null
  sources?: { label?: string }[] | null
}) {
  const columns = S(settings, 'footerColumns') ?? []
  const sourceLabels = (sources || []).map((s) => s?.label).filter(Boolean) as string[]

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link href="/" className="nav__logo">
              <span className="nav__logo-mark" aria-hidden="true" />
              {S(settings, 'logoText')}
            </Link>
            <p>{S(settings, 'footerBlurb')}</p>
            {has(lastUpdated) && (
              <div className="footer__stamp">
                {L(settings, 'footerStampPrefix')} {lastUpdated}
                {sourceLabels.length > 0 && (
                  <>
                    {' '}
                    · {L(settings, 'footerSourcesPrefix')} {sourceLabels.join(', ')}
                  </>
                )}
              </div>
            )}
          </div>

          {columns.map((col, i) => (
            <div className="footer__col" key={`${col.heading}-${i}`}>
              <h5>{col.heading}</h5>
              {(col.links || []).map((l, j) => (
                <Link key={`${l.href}-${j}`} href={l.href || '#'}>
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <span>{S(settings, 'footerCopyright')}</span>
          <span>{S(settings, 'footerLegal')}</span>
        </div>
      </div>
    </footer>
  )
}
