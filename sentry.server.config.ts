/**
 * Sentry — Node runtime configuration.
 *
 * Loaded by `instrumentation.ts` on server startup. Covers every
 * server component render, route handler, server action, and
 * background task running on the Node runtime.
 */

import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,

    // Don't spam Sentry during local dev — only send events in production.
    enabled: process.env.NODE_ENV === 'production',

    // Reasonable server-side ignores: upstream API timeouts and rate
    // limits are already handled by the data service safe-fetch wrapper,
    // which captures them with richer context. Avoid double-reporting.
    ignoreErrors: [
      'AbortError',
      'TimeoutError',
      'API-Football: Too many requests',
    ],
  })
}
