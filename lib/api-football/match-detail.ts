// Single-call match detail fetcher
// Gets EVERYTHING about a match in ONE API call: fixture, events, lineups, stats, player ratings
import { apiFetch } from './client'
import { LEAGUES, type LeagueKey } from './leagues'
import { CACHE_TIERS, withTier } from '@/lib/data/cache'

export interface MatchDetail {
  fixture: {
    id: number
    referee: string | null
    date: string
    status: { long: string; short: string; elapsed: number | null }
    venue: { name: string; city: string }
  }
  league: { id: number; name: string; round: string; logo: string }
  teams: {
    home: { id: number; name: string; logo: string; winner: boolean | null }
    away: { id: number; name: string; logo: string; winner: boolean | null }
  }
  goals: { home: number | null; away: number | null }
  score: {
    halftime: { home: number | null; away: number | null }
    fulltime: { home: number | null; away: number | null }
    extratime: { home: number | null; away: number | null }
    penalty: { home: number | null; away: number | null }
  }
  events: Array<{
    time: { elapsed: number; extra: number | null }
    team: { id: number; name: string; logo: string }
    player: { id: number; name: string }
    assist: { id: number | null; name: string | null }
    type: string
    detail: string
  }>
  lineups: Array<{
    team: { id: number; name: string; logo: string }
    formation: string
    startXI: Array<{ player: { id: number; name: string; number: number; pos: string } }>
    substitutes: Array<{ player: { id: number; name: string; number: number; pos: string } }>
    coach: { id: number; name: string; photo: string }
  }>
  statistics: Array<{
    team: { id: number; name: string; logo: string }
    statistics: Array<{ type: string; value: number | string | null }>
  }>
  players: Array<{
    team: { id: number; name: string; logo: string }
    players: Array<{
      player: { id: number; name: string; photo: string }
      statistics: Array<{
        games: { minutes: number | null; rating: string | null; position: string }
        goals: { total: number | null; assists: number | null }
        shots: { total: number | null; on: number | null }
        passes: { total: number | null; accuracy: string | null }
        cards: { yellow: number; red: number }
      }>
    }>
  }>
}

/**
 * Get complete match detail in ONE API call.
 * Returns fixture + events + lineups + statistics + player ratings.
 *
 * Cost: 1 API call (vs 3-4 separate calls before).
 *
 * This is the per-match live surface — it powers `footballData.match(id)`
 * which in turn backs `/api/live/[id]`. Sits on the `live` (30s) tier so
 * Next's data cache aligns with the edge cache `s-maxage=20` on the live
 * route. For finished matches the route handler uses a 1h Cache-Control so
 * the 30s data cache is effectively bypassed anyway.
 */
export async function getMatchDetail(fixtureId: string): Promise<MatchDetail | null> {
  const data = await apiFetch<MatchDetail[]>('fixtures', {
    id: fixtureId,
  }, withTier(CACHE_TIERS.live, `match-detail-${fixtureId}`))

  if (!data || data.length === 0) return null
  return data[0]
}

/**
 * Detect league key from league ID.
 */
export function detectLeagueKey(leagueId: number): LeagueKey {
  const entry = Object.entries(LEAGUES).find(([, v]) => v.id === leagueId)
  return (entry?.[0] ?? 'pl') as LeagueKey
}

/**
 * Map an internal LeagueKey to the URL slug used by site routes.
 * Returns null when the league has no dedicated site presence — the
 * caller should render the league name as plain text (no link) in that
 * case (bundesliga / seriea / ligue1 / caf / laliga2).
 */
export function leagueKeyToSlug(key: LeagueKey): string | null {
  switch (key) {
    case 'pl':     return 'premier-league'
    case 'laliga': return 'la-liga'
    case 'ucl':    return 'champions-league'
    case 'botola': return 'botola-pro'
    case 'wc':     return 'wc-2026'
    default:       return null
  }
}
