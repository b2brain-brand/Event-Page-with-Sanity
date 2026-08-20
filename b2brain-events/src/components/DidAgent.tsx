'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import styles from './DidAgent.module.css'

/**
 * D-ID runs in an isolated iframe so its document-level pointer listeners and
 * generated overlay can never become part of the event page document.
 *
 * This remains a local-only experiment until the complete interaction suite
 * passes and production activation is explicitly approved.
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
    ></script>
  </body>
</html>`

const subscribeToLocalTestState = () => () => undefined

const getLocalTestState = () =>
  process.env.NODE_ENV === 'development' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname) &&
  window.location.port === '3005'

export function DidAgent() {
  const isLocalTest = useSyncExternalStore(
    subscribeToLocalTestState,
    getLocalTestState,
    () => false,
  )
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isOpen])

  if (!isLocalTest) return null

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
