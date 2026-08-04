/**
 * Analytics IDs — the SAME ones the rest of b2brain.com already uses, so the
 * event pages (this separate Next.js app, served under b2brain.com/events) feed
 * into the same GA property, PostHog project and Factors account. Because it is
 * all one domain now, sessions/persons stitch together with no cross-domain
 * linking.
 *
 * These are public, client-side keys (a GA measurement id, a PostHog *project*
 * key, a Factors token) — safe to ship to the browser; they are already visible
 * in the main site's page source. Env vars override if ever needed.
 */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || 'G-X31VMXY18V'

export const POSTHOG_KEY =
  process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_TE8y0c1VQtWzXua3HGrlyWANH5IN8yjJdklY0SIizey'

export const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

/** Matches the main site's posthog.init `defaults` — turns on autocapture and
 *  history-change (SPA) pageviews, so client-side navigations are tracked. */
export const POSTHOG_DEFAULTS = '2026-05-30'

export const FACTORS_TOKEN =
  process.env.NEXT_PUBLIC_FACTORS_TOKEN || 'hep4k00t1obqnf68afjefuntho6a2am4'
export const FACTORS_HOST = 'https://api.factors.ai'
