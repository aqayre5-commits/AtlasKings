/**
 * Shared football data types for the Atlas Kings data service layer.
 *
 * This file is a single import surface for every component and page that
 * consumes football data. We do NOT redefine types that already live in
 * `lib/data/placeholderData.ts` — we re-export them so there's exactly one
 * source of truth.
 *
 * Add new shared types here. Never import from `@/lib/api-football/*` or
 * `@/lib/data/placeholderData` directly in pages or components — go through
 * `@/lib/data/service` instead.
 */

// ── Canonical match & standing types (owned by placeholderData) ──
export type { MatchData, MatchStatus, StandingRow } from '@/lib/data/placeholderData'
export type { LeagueKey } from '@/lib/api-football/leagues'

// ── Full match detail (owned by api-football/match-detail) ──
export type { MatchDetail } from '@/lib/api-football/match-detail'

// ── Derived / view-model types ──

/** Shape returned by `footballData.nextMatch()` — used by the hero banner. */
export interface NextMatchSummary {
  homeTeam: string
  awayTeam: string
  date: string
  competition: string
  round?: string
  venue?: string
}

/** Shape returned by `footballData.allStandings()` — keyed by league slug. */
export interface LeagueStandings {
  name: string
  season: string
  rows: import('@/lib/data/placeholderData').StandingRow[]
}
export type StandingsByLeague = Record<string, LeagueStandings>

/**
 * Discriminated result for any fetch through the data service.
 *
 * Every call returns `{ ok: true, data }` on success, or `{ ok: false, error }`
 * on failure. This forces callers to handle the degraded path explicitly
 * instead of silently rendering `undefined`.
 *
 * Pages can destructure with a default:
 *   const { data: matches = [] } = await footballData.todayMatches()
 */
export type DataResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; data: null }

/** Convenience constructors. */
export function ok<T>(data: T): DataResult<T> {
  return { ok: true, data }
}
export function fail<T = never>(error: string): DataResult<T> {
  return { ok: false, error, data: null }
}
