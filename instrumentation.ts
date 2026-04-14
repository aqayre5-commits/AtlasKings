/**
 * Next.js instrumentation hook — runs once when the server process starts.
 *
 * Purpose:
 *   1. **Env validation at startup** — importing `@/lib/env` triggers the
 *      Zod parse. If the server env is invalid, the process fails to boot
 *      with a readable error message.
 *   2. **Sentry init** — wired here so error tracking is live before any
 *      request handler runs. Uses Next.js runtime-aware conditional loading
 *      so edge and node share the same file without duplicate imports.
 *
 * Next.js 15 calls this file's `register()` once per server lifecycle
 * (Node and Edge have separate lifecycles, hence the NEXT_RUNTIME check).
 *
 * Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Always run env validation — fails fast on missing required vars.
  // This import side-effect is what triggers the Zod parse.
  await import('@/lib/env')

  // Sentry has separate SDK bundles for each runtime. We import the
  // matching config file only on the runtime it targets.
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}

/**
 * Called by Next.js whenever a request handler throws an uncaught error.
 * Forwards the error to Sentry when available — fully optional and safe
 * to call even when Sentry isn't configured.
 */
export async function onRequestError(
  err: unknown,
  request: {
    path: string
    method: string
    headers: Record<string, string | string[] | undefined>
  },
  context: {
    routerKind: 'Pages Router' | 'App Router'
    routePath: string
    routeType: 'render' | 'route' | 'action' | 'middleware'
    renderSource?: string
    revalidateReason?: string
    renderType?: 'dynamic' | 'dynamic-resume'
  },
) {
  try {
    const Sentry = await import('@sentry/nextjs')
    Sentry.captureRequestError(err, request, context)
  } catch {
    // Sentry not configured or failed to load — fail silently so the
    // original error is still surfaced by Next.js's own handler.
  }
}
