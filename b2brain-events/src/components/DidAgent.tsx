'use client'

import {useEffect, useRef, useState} from 'react'
import styles from './DidAgent.module.css'

/**
 * D-ID installs document-level pointer listeners and a fixed overlay. The
 * conversation UI therefore lives in a dedicated same-origin document: it
 * retains the website origin required by D-ID's API while preventing those
 * listeners from intercepting event-page and Studio controls.
 */
const DID_FRAME_URL = 'https://www.b2brain.com/events/did-agent-frame.html'
const DID_FRAME_ORIGIN = 'https://www.b2brain.com'

const DID_IDLE_VIDEO =
  'https://agents-results.d-id.com/google-oauth2%7C104707151394975296647/v2_agt_H4O1YDpP/idle_1785920578294.mp4?modified_at=2026-08-20T07%3A28%3A26.035Z'
const DID_IDLE_POSTER =
  'https://create-images-results.d-id.com/DefaultPresenters/Noelle_f/v2_with_background_thumbnail.jpeg'

export function DidAgent() {
  const [isOpen, setIsOpen] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const frameRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    const closeFromAgent = (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow) return
      if (event.origin !== DID_FRAME_ORIGIN) return
      if (event.data?.type === 'b2brain-did-close') setIsOpen(false)
      if (event.data?.type === 'b2brain-did-ready') setIsReady(true)
    }

    window.addEventListener('keydown', closeOnEscape)
    window.addEventListener('message', closeFromAgent)
    const readyFallback = window.setTimeout(() => setIsReady(true), 5000)
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('message', closeFromAgent)
      window.clearTimeout(readyFallback)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return
    frameRef.current?.contentWindow?.postMessage({type: 'b2brain-did-open'}, DID_FRAME_ORIGIN)
  }, [isOpen])

  return (
    <div className={styles.root}>
      <section
        id="did-agent-panel"
        className={`${styles.panel} ${isOpen ? styles.panelOpen : styles.panelWarming}`}
        aria-label="B2Brain AI assistant"
        aria-hidden={!isOpen}
        aria-busy={isOpen && !isReady}
        inert={!isOpen}
      >
        <iframe
          ref={frameRef}
          className={styles.frame}
          title="B2Brain AI assistant conversation"
          src={DID_FRAME_URL}
          allow="autoplay; camera; microphone"
          loading="eager"
          tabIndex={isOpen ? 0 : -1}
          onLoad={() => {
            if (isOpen) {
              frameRef.current?.contentWindow?.postMessage(
                {type: 'b2brain-did-open'},
                DID_FRAME_ORIGIN,
              )
            }
          }}
        />
        {isOpen && !isReady && (
          <div
            className={styles.startup}
            style={{backgroundImage: `url(${DID_IDLE_POSTER})`}}
            role="status"
          >
            <span className={styles.startupLabel}>Preparing AI assistant…</span>
          </div>
        )}
      </section>

      {!isOpen && (
        <button
          type="button"
          className={styles.launcher}
          aria-label="Open video chat"
          aria-controls="did-agent-panel"
          aria-expanded="false"
          onClick={() => setIsOpen(true)}
        >
          <span className={styles.avatar} aria-hidden="true">
            <video
              className={styles.avatarVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={DID_IDLE_POSTER}
              disablePictureInPicture
            >
              <source src={DID_IDLE_VIDEO} type="video/mp4" />
            </video>
          </span>
          <span className={styles.notification} aria-hidden="true">
            1
          </span>
        </button>
      )}
    </div>
  )
}
