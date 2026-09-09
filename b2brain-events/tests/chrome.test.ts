import assert from 'node:assert/strict'
import test from 'node:test'

import {resolveChrome} from '../src/lib/chrome'

test('event pages use the current corporate header even when Sanity is stale', () => {
  const chrome = resolveChrome({
    logoText: 'Old logo',
    navLinks: [{label: 'Platform', href: '/old-platform'}],
    navCtaLabel: 'Old CTA',
    navCtaHref: '/old-cta',
  })

  assert.equal(chrome.logoText, 'B2Brain')
  assert.deepEqual(
    chrome.nav.map((item) => item.label),
    ['Event Lead Capture', 'Use Cases', 'Pricing', 'Events', 'Blogs'],
  )
  assert.deepEqual(chrome.cta, {
    label: 'Book a Demo',
    href: 'https://www.b2brain.com/demo',
  })
})

test('event pages use the complete current corporate footer', () => {
  const chrome = resolveChrome({
    footerColumns: [{heading: 'Old links', links: [{label: 'Old', href: '/old'}]}],
    newsletterHeading: 'Old newsletter',
    newsletterAction: 'https://newsletter.example/subscribe',
  })

  assert.deepEqual(
    chrome.footerColumns.map((column) => column.heading),
    ['Overview', 'Why B2Brain ?', 'Use Cases', 'Company'],
  )
  assert.deepEqual(
    chrome.footerColumns[1].links.map((link) => link.label),
    [
      'B2Brain vs HiHello',
      'B2Brain vs Blinq',
      'B2Brain vs Captello',
      'B2Brain vs iCapture',
      'B2Brain vs Mobly',
      'B2Brain vs Popl',
    ],
  )
  assert.equal(chrome.footerColumns[2].links[1].label, 'Marketing Leaders')
  assert.equal(chrome.footerColumns[3].links.at(-1)?.label, 'Help')
  assert.equal(chrome.newsletter.heading, 'Subscribe to Newsletter')
  assert.equal(chrome.newsletter.action, 'https://newsletter.example/subscribe')
})
