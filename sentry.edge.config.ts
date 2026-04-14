/**
 * Sentry — Edge runtime configuration.
 *
 * Loaded by `instrumentation.ts` on edge runtime startup. Covers our
 * `middleware.ts` (language detection + routing). The app/api/live/[id]
 * route currently runs on the Node runtime, so most server handlers are
 * covered by `sentry.server.config.ts` instead.
 */

import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    enabled: process.env.NODE_ENV === 'production',
  })
}
