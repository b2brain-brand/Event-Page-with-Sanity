'use client'

import { useEffect, useState } from 'react'
import styles from './DidAgent.module.css'

/**
 * D-ID runs in an isolated iframe so its document-level pointer listeners and
 * generated overlay can never become part of the event page document.
 *
 * This component is mounted only by the public website layout. Sanity Studio
 * has a separate root layout and never imports or renders this runtime.
 */
const DID_FRAME_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body, #did-agent-container { width: 100%; height: 100%; margin: 0; overflow: hidden; background: #fff; }
    </style>
  </head>
  <body>
    <div id="did-agent-container"></div>
    <script
      type="module"
      src="https://agent.d-id.com/v2/index.js"
      data-mode="full"
      data-client-key="ck_qPIyvgzFHQIuoiKeb8zC9"
      data-agent-id="v2_agt_H4O1YDpP"
      data-name="did-agent"
      data-target-id="did-agent-container"
      data-orientation="horizontal"
      data-track="true"
    ></script>
  </body>
</html>`

export function DidAgent() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isOpen])

  return (
    <div className={styles.root}>
      {isOpen && (
        <section
          id="did-agent-panel"
          className={styles.panel}
          role="dialog"
          aria-label="B2Brain AI assistant"
        >
          <header className={styles.header}>
            <span>Talk to B2Brain AI</span>
            <button
              type="button"
              className={styles.close}
              aria-label="Close B2Brain AI assistant"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </header>
          <iframe
            className={styles.frame}
            title="B2Brain AI assistant"
            srcDoc={DID_FRAME_HTML}
            allow="autoplay; camera; microphone"
          />
        </section>
      )}

      <button
        type="button"
        className={styles.launcher}
        aria-controls="did-agent-panel"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className={styles.badge} aria-hidden="true">
          AI
        </span>
        <span>{isOpen ? 'Close AI' : 'Talk to AI'}</span>
      </button>
    </div>
  )
}
