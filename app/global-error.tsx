'use client'

/**
 * Root-level error boundary for uncaught React render errors in the App
 * Router. Next.js calls this only when an error escapes every nested
 * `error.tsx` — i.e., the entire layout tree failed to render.
 *
 * Two responsibilities:
 *   1. Report the error to Sentry (so we actually see root-level crashes)
 *   2. Render a minimal fallback page so the user gets SOMETHING back
 *      instead of a browser-default white screen
 *
 * This file MUST contain its own `<html>` and `<body>` tags — Next.js
 * mounts it in place of the root layout when the root layout itself
 * throws. Don't wrap it in anything.
 */

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // No-op when Sentry DSN isn't configured — safe to call anyway.
    Sentry.captureException(error, {
      tags: { source: 'global-error' },
      level: 'fatal',
    })
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#f2f1ef',
          color: '#0f0f0f',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <div
          style={{
            maxWidth: 480,
            textAlign: 'center',
            background: '#ffffff',
            border: '1px solid #e6e4e0',
            borderRadius: 8,
            padding: '48px 32px',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16, lineHeight: 1 }}>⚠</div>
          <h1 style={{ fontSize: 22, margin: '0 0 12px', fontWeight: 700 }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 14, color: '#4a4a4a', margin: '0 0 28px', lineHeight: 1.5 }}>
            An unexpected error occurred loading Atlas Kings. The team has been notified.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              background: '#0a5229',
              color: '#ffffff',
              border: 'none',
              padding: '10px 24px',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  )
}
