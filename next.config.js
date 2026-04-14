// Sentry wraps the Next.js config so sourcemaps and instrumentation
// hook up automatically. It's a no-op at runtime when the DSN is unset,
// but `withSentryConfig()` is always safe to call.
const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint circular structure error with next/react plugin on Vercel.
    // Linting runs separately via CI — safe to skip during build.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'media.api-sports.io' },
      { protocol: 'https', hostname: 'media-2.api-sports.io' },
      { protocol: 'https', hostname: 'media-3.api-sports.io' },
      { protocol: 'https', hostname: '*.r2.dev' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          // CSP — allow self, Google Fonts (fallback), API-Football widgets, R2 images
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://widgets.api-sports.io",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              // flagcdn.com added for the WC 2026 predictor — national
              // flags resolve from ISO-3166 codes via countryFlagUrl()
              // in lib/data/wc2026.ts. Without this entry every flag
              // renders as a broken-image placeholder under the
              // default img-src policy.
              "img-src 'self' https://media.api-sports.io https://media-2.api-sports.io https://media-3.api-sports.io https://*.r2.dev https://flagcdn.com https://img.youtube.com data: blob:",
              "connect-src 'self' https://v3.football.api-sports.io https://widgets.api-sports.io",
              "frame-src https://www.youtube-nocookie.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      // API routes: no cache by default…
      // …EXCEPT /api/live/* which is deliberately edge-cached for live score
      // deduping (see app/api/live/[id]/route.ts for the per-response
      // Cache-Control logic). The negative lookahead excludes anything
      // whose first path segment starts with "live".
      {
        source: '/api/:path((?!live).*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
        ],
      },
    ]
  },

  async redirects() {
    return [
      // ── Consolidate legacy /world-cup-2026 tree → canonical /wc-2026 ──
      //
      // The legacy tree had different sub-page names than the canonical
      // one, so the catch-all at the bottom is NOT correct for every
      // sub-path. These specific overrides must come first — rule order
      // matters (first match wins). Launch Session 1.3/1.8.
      //
      // Legacy name → canonical mapping:
      //   /scores       → /fixtures
      //   /groups       → /standings
      //   /statistics   → /stats
      //   /morocco      → /morocco/qualification (Morocco WC 2026 context)
      //   /squad        → /morocco/squad           (federation player pool)

      { source: '/:lang/world-cup-2026/scores',     destination: '/:lang/wc-2026/fixtures',   permanent: true },
      { source: '/:lang/world-cup-2026/groups',     destination: '/:lang/wc-2026/standings',  permanent: true },
      { source: '/:lang/world-cup-2026/statistics', destination: '/:lang/wc-2026/stats',      permanent: true },
      { source: '/:lang/world-cup-2026/morocco',    destination: '/:lang/morocco/qualification', permanent: true },
      { source: '/:lang/world-cup-2026/squad',      destination: '/:lang/morocco/squad',      permanent: true },

      // Hub + any other legacy sub-path that shares its name with the
      // canonical tree (/fixtures, /bracket, /teams, /stats, /predictor).
      { source: '/:lang/world-cup-2026',           destination: '/:lang/wc-2026',           permanent: true },
      { source: '/:lang/world-cup-2026/:path*',    destination: '/:lang/wc-2026/:path*',    permanent: true },
    ]
  },
}

module.exports = withSentryConfig(nextConfig, {
  // Suppress the "org/project not set" warning when running without a
  // configured Sentry project (dev / prototype). Source map upload is
  // automatically skipped in that case.
  silent: true,

  // Only upload source maps when SENTRY_AUTH_TOKEN is present (typically
  // set in Vercel production builds, never in dev).
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Hide source maps from the served bundle once uploaded to Sentry.
  hideSourceMaps: true,

  // Forward browser error reports through /monitoring to dodge ad-blockers
  // that nuke requests going directly to sentry.io.
  tunnelRoute: '/monitoring',

  // Disable Sentry's automatic instrumentation of Vercel cron endpoints —
  // we don't use them for anything Sentry would care about.
  automaticVercelMonitors: false,
})
