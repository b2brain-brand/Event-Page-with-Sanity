'use client'

import {useEffect, useRef, useState} from 'react'
import styles from './DidAgent.module.css'

/**
 * D-ID's full conversation UI, isolated inside an iframe.
 *
 * D-ID installs document-level pointer listeners and a fixed overlay. Keeping
 * both inside this document prevents them from intercepting event-page and
 * Studio controls. The parent only owns the launcher and the panel boundary;
 * D-ID owns voice, replies, prompts, chat, fullscreen and speaking states.
 */
const DID_FRAME_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body, #did-agent-container { width: 100%; height: 100%; margin: 0; overflow: hidden; background: transparent; }
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
      data-monitor="true"
      data-position="right"
      data-open-mode="compact"
      data-track="true"
    ></script>
    <script>
      (function () {
        function deepQuery(root, selector) {
          if (!root || !root.querySelector) return null;
          var direct = root.querySelector(selector);
          if (direct) return direct;
          var elements = root.querySelectorAll('*');
          for (var index = 0; index < elements.length; index += 1) {
            var nested = elements[index].shadowRoot && deepQuery(elements[index].shadowRoot, selector);
            if (nested) return nested;
          }
          return null;
        }

        var readyTimer = window.setInterval(function () {
          if (deepQuery(document, '[data-testid="didagent_message_loader_done"]')) {
            window.parent.postMessage({ type: 'b2brain-did-ready' }, '*');
            window.clearInterval(readyTimer);
          }
        }, 100);

        var tries = 0;
        var timer = window.setInterval(function () {
          var host = document.querySelector('[data-testid="didagent_root"]');
          var shadowRoot = host && host.shadowRoot;
          if (shadowRoot) {
            shadowRoot.addEventListener('click', function (event) {
              var path = event.composedPath ? event.composedPath() : [];
              var close = path.some(function (node) {
                return node && node.getAttribute && node.getAttribute('aria-label') === 'Close';
              });
              if (close) {
                window.parent.postMessage({ type: 'b2brain-did-close' }, '*');
              }
            });
            window.clearInterval(timer);
          } else if (++tries > 80) {
            window.clearInterval(timer);
          }
        }, 250);
      })();
    </script>
  </body>
</html>`

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
      if (event.data?.type === 'b2brain-did-close') setIsOpen(false)
      if (event.data?.type === 'b2brain-did-ready') setIsReady(true)
    }

    window.addEventListener('keydown', closeOnEscape)
    window.addEventListener('message', closeFromAgent)
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('message', closeFromAgent)
    }
  }, [])

  return (
    <div className={styles.root}>
      <section
        id="did-agent-panel"
        className={`${styles.panel} ${isOpen ? styles.panelOpen : styles.panelWarming}`}
        aria-label="B2Brain AI assistant"
        aria-hidden={!isOpen}
        aria-busy={isOpen && !isReady}
      >
        <iframe
          ref={frameRef}
          className={styles.frame}
          title="B2Brain AI assistant conversation"
          srcDoc={DID_FRAME_HTML}
          allow="autoplay; camera; microphone"
          loading="eager"
          tabIndex={isOpen ? 0 : -1}
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
