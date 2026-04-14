/**
 * Atlas Kings — Unified Football Data Service
 * ─────────────────────────────────────────────
 *
 * Single entry point for every piece of football data rendered on the site.
 * Pages and components MUST go through `footballData.*` — they should never
 * import from `@/lib/api-football/*` directly. This buys us:
 *
 *   1. ONE place to add Sentry/logging, rate-limit breakers, retries
 *   2. ONE place to swap providers (API-Football → SportMonks → etc.)
 *   3. Consistent graceful degradation (every call returns a safe default
 *      instead of throwing — pages never crash when the API hiccups)
 *   4. A migration surface for live polling / SSE / WebSocket channels
 *
 * The existing `lib/api-football/*` fetchers stay exactly as they are and
 * continue to own the `apiFetch()` wrapper, cache tags, and response
 * normalisation. This file is a thin orchestration layer on top of them.
 *
 * Usage (server component):
 *
 *   import { footballData } from '@/lib/data/service'
 *
 *   const [today, standings, next] = await Promise.all([
 *     footballData.todayMatches(),
 *     footballData.allStandings(),
 *     footballData.nextMatch(),
 *   ])
 *
 * Every method returns a safe value (empty array, empty object, or null)
 * on failure — never throws, never undefined.
 */

import * as Sentry from '@sentry/nextjs'
import {
  getAllTodayFixtures,
  getNextMatch,
  getAllFixturesByDate,
  getUpcomingFixtures,
  getTeamRecentResults,
  getTeamUpcomingFixtures,
} from '@/lib/api-football/fixtures'
import { getAllStandings, getStandings } from '@/lib/api-football/standings'
import { getMatchDetail } from '@/lib/api-football/match-detail'
import type { LeagueKey } from '@/lib/api-football/leagues'

import type {
  MatchData,
  StandingsByLeague,
  NextMatchSummary,
} from './types'

// ─── Internal helpers ──────────────────────────────────────────────────────

/**
 * Wrap a fetcher with:
 *  - try/catch (never throws)
 *  - consistent logging tag
 *  - a typed fallback value
 *
 * Tier info is currently advisory — the underlying `apiFetch()` already sets
 * `next.revalidate` and `next.tags`. When we migrate providers or add a
 * Redis layer, this is the hook point.
 */
/**
 * Classify an upstream error so we can route it to the right log
 * level and Sentry sink. These are all *expected* — `safe()` always
 * returns a fallback — so none of them should break the Next.js dev
 * overlay or page rendering.
 */
function classifyError(message: string): 'rate-limit' | 'network' | 'upstream' {
  const lower = message.toLowerCase()
  if (
    lower.includes('too many requests') ||
    lower.includes('rate limit') ||
    lower.includes('429')
  ) {
    return 'rate-limit'
  }
  if (
    lower.includes('fetch failed') ||
    lower.includes('timeout') ||
    lower.includes('econnrefused') ||
    lower.includes('etimedout') ||
    lower.includes('network')
  ) {
    return 'network'
  }
  return 'upstream'
}

async function safe<T>(
  label: string,
  fn: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    const result = await fn()
    return (result ?? fallback) as T
  } catch (err) {
    const error = err as Error
    const kind = classifyError(error.message)

    // All upstream failures are logged as WARN, never as ERROR. The
    // whole point of `safe()` is that a failed fetch is a normal
    // outcome — the page still renders with a fallback. Logging at
    // error level surfaces these as blocking red overlays in Next's
    // dev error UI, which is wrong for expected degradation.
    //
    // We keep the structured label so a grep of dev logs still lets
    // you see which fetcher tripped.
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[data:${label}] ${kind} — ${error.message}`)
    }

    // Forward to Sentry so production on-call can pivot on "what
    // fetcher failed" without reading stack traces. Rate-limits are
    // self-healing and noisy, so we drop them to `info` and skip
    // forwarding entirely unless the DSN is explicitly configured.
    // Sentry is a no-op when the DSN isn't set (dev / prototype).
    if (kind !== 'rate-limit') {
      Sentry.captureException(error, {
        tags: {
          source: 'data-service',
          fetcher: label,
          kind,
        },
        level: 'warning',
      })
    }

    return fallback
  }
}

// ─── Public API ────────────────────────────────────────────────────────────

export const footballData = {
  // ── MATCHES ──

  /**
   * All of today's fixtures across every tracked league (Morocco, Botola,
   * PL, La Liga, UCL, AFCON). 5-minute cache during the day, dropping to
   * 30s for any match that flips to LIVE (handled inside the fetcher).
   */
  todayMatches(): Promise<MatchData[]> {
    return safe('todayMatches', () => getAllTodayFixtures(), [])
  },

  /**
   * Matches on a specific ISO date (YYYY-MM-DD) across every tracked league.
   * Used by /scores and /fixtures with a date picker.
   */
  matchesByDate(date: string): Promise<MatchData[]> {
    return safe(`matchesByDate:${date}`, () => getAllFixturesByDate(date), [])
  },

  /**
   * Upcoming fixtures for a single league (default: next 5).
   * Cached for 5 min.
   */
  upcomingMatches(league: LeagueKey, limit = 5): Promise<MatchData[]> {
    return safe(
      `upcoming:${league}:${limit}`,
      () => getUpcomingFixtures(league, limit),
      [],
    )
  },

  /**
   * Full detail for a single match — status, teams, events, lineups,
   * statistics, venue. The flagship payload for the match detail page.
   * Cached 30s during live play.
   */
  match(fixtureId: string) {
    return safe(`match:${fixtureId}`, () => getMatchDetail(fixtureId), null)
  },

  /**
   * The next-up match summary for the home page hero countdown.
   * Walks league priority (UCL → AFCON → WC → PL → Botola → La Liga) to
   * find the earliest upcoming match. 1h cache.
   */
  nextMatch(): Promise<NextMatchSummary | null> {
    return safe('nextMatch', () => getNextMatch(), null)
  },

  // ── STANDINGS ──

  /**
   * League standings for every tracked league, keyed by league slug.
   * Used by the home page sidebar tabs and `/standings`. 1h cache.
   */
  allStandings(): Promise<StandingsByLeague> {
    return safe(
      'allStandings',
      () => getAllStandings() as unknown as Promise<StandingsByLeague>,
      {} as StandingsByLeague,
    )
  },

  /**
   * Standings for a single league. Used by `/[league]/table`.
   */
  standings(league: LeagueKey) {
    return safe(`standings:${league}`, () => getStandings(league), [])
  },

  // ── TEAM DATA ──

  /**
   * Last N results for a team (default: 5). Used on team pages and head-to-head.
   */
  teamRecentResults(teamId: number, last = 5): Promise<MatchData[]> {
    return safe(
      `teamRecent:${teamId}:${last}`,
      () => getTeamRecentResults(teamId, last),
      [],
    )
  },

  /**
   * Next N fixtures for a team (default: 5).
   */
  teamUpcoming(teamId: number, next = 5): Promise<MatchData[]> {
    return safe(
      `teamUpcoming:${teamId}:${next}`,
      () => getTeamUpcomingFixtures(teamId, next),
      [],
    )
  },

  // ── DERIVED VIEWS (computed, not fetched) ──

  /**
   * Split a list of matches into live vs the rest. Used by the home hero
   * to decide whether to show a live card or the upcoming countdown.
   * Zero network calls — pure client helper, exposed here for consistency.
   */
  splitLive(matches: MatchData[]): { live: MatchData[]; other: MatchData[] } {
    const live: MatchData[] = []
    const other: MatchData[] = []
    for (const m of matches) {
      if (m.status === 'LIVE' || m.status === 'HT') live.push(m)
      else other.push(m)
    }
    return { live, other }
  },
} as const

export type FootballData = typeof footballData
