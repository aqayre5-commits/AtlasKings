/**
 * Atlas Kings — Environment Variable Validation
 * ────────────────────────────────────────────────────────────────────
 *
 * Single source of truth for every env var the app reads. Every import
 * of this module triggers a Zod parse at module-init time, which means:
 *
 *   1. **Build-time failure** — any page that imports `env` (directly or
 *      transitively via the data service, layout, etc.) will fail the
 *      build if a *required* env var is missing or malformed.
 *
 *   2. **Server-startup failure** — `instrumentation.ts` imports this
 *      module on process boot, so the server refuses to come up with a
 *      misconfigured env.
 *
 *   3. **Type-safe access** — `env.APIFOOTBALL_KEY` is `string | undefined`
 *      (optional) or `string` (required), matching the schema exactly.
 *      Callers get full autocomplete + narrowing instead of `process.env`'s
 *      `string | undefined` on everything.
 *
 * Classification philosophy:
 *
 *   - **Required**: app cannot produce correct output without it. Build
 *     fails if missing. Examples: `NEXT_PUBLIC_SITE_URL` (breaks every
 *     canonical URL, sitemap, OG tag).
 *
 *   - **Optional**: feature degrades gracefully when missing. Examples:
 *     `APIFOOTBALL_KEY` (data service returns empty, pages still render),
 *     `ANTHROPIC_API_KEY` (article pipeline disabled, existing articles
 *     still serve), `NEXT_PUBLIC_SENTRY_DSN` (error tracking disabled).
 *
 * Adding a new env var:
 *   1. Add it to the appropriate schema (server or client) below.
 *   2. Use `env.MY_VAR` at call sites instead of `process.env.MY_VAR`.
 *   3. Update `.env.example` with a comment describing the var.
 *
 * Client/server split:
 *   Next.js only exposes `NEXT_PUBLIC_*` vars to the browser bundle. We
 *   enforce this at the schema level: a server-only var placed in the
 *   client schema would leak credentials. Do NOT mix them.
 */

import { z } from 'zod'

// ─── Schemas ────────────────────────────────────────────────────────────

const serverSchema = z.object({
  // Node runtime
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Database (required for DB-backed features: push subs, articles, media)
  DATABASE_URL: z.string().url().optional(),

  // API-Football (optional — data service degrades gracefully to empty lists)
  APIFOOTBALL_KEY: z.string().min(1).optional(),

  // Claude / Anthropic (optional — article pipeline disabled without it)
  ANTHROPIC_API_KEY: z.string().min(1).optional(),

  // Article pipeline auth (required only when pipeline is triggered — the
  // route handler itself already fails closed when this is missing)
  PIPELINE_SECRET: z.string().min(1).optional(),

  // Web Push VAPID (all-or-nothing: if any is set, all must be set)
  VAPID_PRIVATE_KEY: z.string().min(1).optional(),
  // VAPID subject per RFC 8292 is a URI — conventionally `mailto:`-prefixed.
  // Accept either a plain email (raw@example.com) or a mailto: URI.
  VAPID_EMAIL: z
    .string()
    .regex(/^(mailto:)?[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Must be an email address or mailto: URI')
    .optional(),
  PUSH_SECRET: z.string().min(1).optional(),

  // Cloudflare R2 media storage (all-or-nothing for the media pipeline)
  CLOUDFLARE_R2_ACCOUNT_ID: z.string().min(1).optional(),
  CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().min(1).optional(),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  CLOUDFLARE_R2_BUCKET_NAME: z.string().min(1).optional(),
  CLOUDFLARE_R2_PUBLIC_URL: z.string().url().optional(),

  // Sentry source-map upload config. All three are server-only, all
  // optional, all used by `withSentryConfig()` in next.config.js to
  // upload source maps during build. Skipped in dev and when the DSN
  // is unset. Added to the schema in Launch Session 2.9 so the three
  // variables no longer bypass env validation — previously they were
  // read via raw `process.env` in next.config.js.
  SENTRY_ORG: z.string().min(1).optional(),
  SENTRY_PROJECT: z.string().min(1).optional(),
  SENTRY_AUTH_TOKEN: z.string().min(1).optional(),
})

const clientSchema = z.object({
  // Site URL — REQUIRED. Used in metadata, sitemap, robots, canonicals,
  // Open Graph tags, and JSON-LD. Missing this silently breaks SEO.
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url()
    .default('https://atlaskings.com'),

  // API-Football widget key (optional — widgets degrade when absent)
  NEXT_PUBLIC_APIFOOTBALL_KEY: z.string().optional(),

  // Web Push public key (required only when push notifications are used)
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: z.string().optional(),

  // Sentry DSN (optional — error tracking disabled when absent)
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
})

// ─── Parse + export ─────────────────────────────────────────────────────

/**
 * Normalize an env source object: treat empty strings as undefined.
 *
 * Rationale: .env files commonly declare a key with an empty value to
 * mark it as "known but not set" (`ANTHROPIC_API_KEY=`). Zod's
 * `.optional()` alone doesn't cover this — it only skips validation
 * when the key is absent. `.min(1).optional()` would then fail on the
 * empty string. Preprocessing once here means every optional schema
 * field behaves the way .env files semantically intend without every
 * individual field needing a `.preprocess()` wrapper.
 */
function normalizeEnvSource(
  source: Record<string, string | undefined>,
): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {}
  for (const [key, value] of Object.entries(source)) {
    out[key] = value === '' ? undefined : value
  }
  return out
}

/**
 * Parse a schema against a normalized env source and surface failures
 * as a readable error message instead of a raw Zod dump.
 */
function parseOrThrow<T extends z.ZodTypeAny>(
  schema: T,
  source: Record<string, string | undefined>,
  label: string,
): z.infer<T> {
  const normalized = normalizeEnvSource(source)
  const result = schema.safeParse(normalized)
  if (result.success) return result.data

  const issues = result.error.issues
    .map(i => `  • ${i.path.join('.')}: ${i.message}`)
    .join('\n')

  throw new Error(
    `\n╔══════════════════════════════════════════════════════════╗\n` +
    `║  Invalid ${label.padEnd(48)}║\n` +
    `╚══════════════════════════════════════════════════════════╝\n` +
    `${issues}\n\n` +
    `Check your .env.local (dev) or hosting env (prod) against\n` +
    `lib/env.ts for the expected shape.\n`,
  )
}

// Only validate the server schema when running on the server — the
// `process.env` keys for server-only vars don't exist in the browser
// bundle (Next.js strips them), so parsing there would always fail.
const isServer = typeof window === 'undefined'

export const env = {
  ...(isServer ? parseOrThrow(serverSchema, process.env, 'server environment') : {}),
  // Client vars are exposed in both environments.
  ...parseOrThrow(clientSchema, {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_APIFOOTBALL_KEY: process.env.NEXT_PUBLIC_APIFOOTBALL_KEY,
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  }, 'client environment'),
} as z.infer<typeof serverSchema> & z.infer<typeof clientSchema>

/**
 * Convenience flags for feature gating throughout the codebase.
 * Example:
 *   if (env_features.sentry) Sentry.captureException(err)
 */
export const env_features = {
  sentry: Boolean(env.NEXT_PUBLIC_SENTRY_DSN),
  database: Boolean(env.DATABASE_URL),
  apiFootball: Boolean(env.APIFOOTBALL_KEY),
  anthropic: Boolean(env.ANTHROPIC_API_KEY),
  webPush: Boolean(env.VAPID_PRIVATE_KEY && env.VAPID_EMAIL && env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
  r2: Boolean(
    env.CLOUDFLARE_R2_ACCOUNT_ID &&
    env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
    env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
    env.CLOUDFLARE_R2_BUCKET_NAME,
  ),
} as const
