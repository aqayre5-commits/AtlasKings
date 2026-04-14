/**
 * Sentry — browser bundle configuration.
 *
 * Loaded automatically by @sentry/nextjs when the client bundle boots.
 * If `NEXT_PUBLIC_SENTRY_DSN` is unset, we no-op the init so the SDK
 * stays silent in dev / prototype environments without a Sentry project.
 */

import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,

    // Keep sampling conservative — we're a Morocco-focused site and
    // don't want to pay for 100% trace ingestion during a tournament.
    tracesSampleRate: 0.1,

    // Session replay is expensive; start at 0 and opt in per-issue later.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,

    // Strip known-noisy browser errors that don't indicate real bugs.
    ignoreErrors: [
      // Benign third-party / browser-extension noise
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Non-Error promise rejection captured',
      // Service worker update churn
      'ServiceWorker script evaluation failed',
    ],

    beforeSend(event) {
      // Drop events originating from browser extensions — they pollute
      // the feed without telling us anything actionable.
      const frames = event.exception?.values?.[0]?.stacktrace?.frames ?? []
      if (frames.some(f => (f.filename ?? '').includes('chrome-extension://'))) {
        return null
      }
      return event
    },
  })
}
