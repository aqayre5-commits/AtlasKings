/**
 * Cache tier configuration for the Atlas Kings data service.
 *
 * Every football data fetch is bucketed into one of these tiers.
 * Next.js `fetch()` honours `revalidate` via its built-in cache, and `tags`
 * allow on-demand invalidation via `revalidateTag()` from server actions or
 * webhook endpoints (e.g. when a match ends we purge `live:*`).
 *
 * Picking the right tier is a tradeoff between API-Football rate limits
 * (Free: 100 req/day, Pro: 7500 req/day) and user-visible freshness.
 *
 *   - static:  ~1 day    — things that never change hourly (team logos, venues)
 *   - daily:   ~1 hour   — league standings, squads, season stats
 *   - fresh:   ~5 min    — today's fixtures schedule, not-yet-live scores
 *   - live:    ~30 sec   — in-progress matches (scores, events, elapsed time)
 *
 * At 30-second revalidation, a single live match consumes ~120 req/hour.
 * Vercel's edge cache deduplicates identical requests across clients, so
 * one origin hit serves thousands of simultaneous viewers.
 */

export interface CacheTier {
  /** Seconds before Next.js revalidates in the background. */
  revalidate: number
  /**
   * Cache tags for `revalidateTag()`. Prefix with the tier name so we can
   * purge entire tiers (`live:*`) or specific resources (`live:match:12345`).
   */
  tags: string[]
}

export const CACHE_TIERS = {
  /** Things that change at most once a day — team metadata, venues, logos. */
  static: {
    revalidate: 86400, // 24h
    tags: ['static'],
  },

  /** Daily-ish data — standings, squads, season-level stats. */
  daily: {
    revalidate: 3600, // 1h
    tags: ['daily'],
  },

  /** Today's matches, upcoming fixtures, next-match banner. */
  fresh: {
    revalidate: 300, // 5min
    tags: ['fresh'],
  },

  /** In-progress live matches — scores, events, elapsed time. */
  live: {
    revalidate: 30, // 30s
    tags: ['live'],
  },
} as const satisfies Record<string, CacheTier>

export type CacheTierName = keyof typeof CACHE_TIERS

/**
 * Helper: pick a tier dynamically based on match state. During live matches
 * we want 30s freshness; between matches the daily tier is plenty.
 */
export function tierForMatch(status: string | undefined): CacheTier {
  if (!status) return CACHE_TIERS.fresh
  const live = ['LIVE', 'HT', '1H', '2H', 'ET', 'P']
  return live.includes(status) ? CACHE_TIERS.live : CACHE_TIERS.fresh
}

/**
 * Helper: build a tagged version of a tier — used to scope cache purges to
 * a specific resource. Example: `tagged(CACHE_TIERS.live, 'match', 12345)`
 * returns `{ revalidate: 30, tags: ['live', 'live:match:12345'] }`.
 */
export function tagged(tier: CacheTier, ...parts: (string | number)[]): CacheTier {
  const suffix = parts.join(':')
  return {
    revalidate: tier.revalidate,
    tags: [...tier.tags, `${tier.tags[0]}:${suffix}`],
  }
}

/**
 * Helper: produce the exact `{ revalidate, tags }` shape that the existing
 * `apiFetch()` wrapper already accepts, preserving the tier's canonical
 * revalidate value while appending resource-specific cache tags so callers
 * can still invalidate precisely (e.g. `revalidateTag('fixtures-pl-today')`).
 *
 * Usage:
 *   apiFetch('fixtures', { league, season, date },
 *     withTier(CACHE_TIERS.fresh, `fixtures-${leagueKey}-today`))
 *
 * This is the one-line migration path for every `lib/api-football/*` fetcher:
 * replace `{ revalidate: 60, tags: [...] }` with
 * `withTier(CACHE_TIERS.fresh, ...)`.
 */
export function withTier(
  tier: CacheTier,
  ...extraTags: string[]
): { revalidate: number; tags: string[] } {
  return {
    revalidate: tier.revalidate,
    tags: extraTags.length > 0 ? [...tier.tags, ...extraTags] : [...tier.tags],
  }
}
