'use client'

import { useEffect } from 'react'

/**
 * D-ID conversational agent — the same chat widget the rest of b2brain.com runs,
 * so it's present on the event pages too.
 *
 * It's a `type="module"` third-party script that configures itself from its own
 * data-* attributes, so those must be on the actual injected <script> element.
 * We inject it directly (rather than next/script) to guarantee the module type
 * and every attribute land exactly as the vendor specified. Injected once and
 * left in place — the widget persists across App Router client-side navigations
 * since the root layout never unmounts; the guard stops a second copy on
 * re-mount / Fast Refresh.
 */
const DID_ATTRS: Record<string, string> = {
  'data-mode': 'fabio',
  'data-client-key': 'ck_XqnxRo4A1Dm_YE9pgacrR',
  'data-agent-id': 'v2_agt_X4Qd9X_J',
  'data-name': 'did-agent',
  'data-monitor': 'true',
  'data-orientation': 'horizontal',
  'data-position': 'right',
  'data-open-mode': 'compact',
}

export function DidAgent() {
  useEffect(() => {
    if (document.querySelector('script[data-name="did-agent"]')) return
    const s = document.createElement('script')
    s.type = 'module'
    s.src = 'https://agent.d-id.com/v2/index.js'
    for (const [k, v] of Object.entries(DID_ATTRS)) s.setAttribute(k, v)
    document.body.appendChild(s)
  }, [])

  return null
}
