import { apiFetch } from './client'
import { LEAGUES, CURRENT_SEASON, getSeasonForLeague, type LeagueKey } from './leagues'
import { CACHE_TIERS, withTier } from '@/lib/data/cache'
import type { MatchData as _MatchData, MatchStatus } from '@/lib/data/placeholderData'
export type MatchData = _MatchData

// ─────────────────────────────────────────────────────────────────────────────
// Cache tiers for this file
// ─────────────────────────────────────────────────────────────────────────────
//
// Aggregate/list fetchers (today's fixtures, next match, upcoming) stay on
// the static `fresh` or `daily` tiers — they are homepage/feed concerns.
//
// Per-match live freshness is deliberately NOT piped through here. It lives
// where it matters: `footballData.match(id)` + `/api/live/[id]`. Do NOT add
// status-based dynamic tiering to these collection fetchers — it would
// inflate API-Football pressure before we have real traffic data.
//
// TODO(Week 2): revisit dynamic tiering when the home/scores surfaces get
// live-aware UI. At that point the right move may be to split
// `getAllTodayFixtures()` into a fast live-only path + a 5-min bulk path.

// Raw API-Football fixture shape
interface APIFixture {
  fixture: {
    id: number
    date: string
    status: { long: string; short: string; elapsed: number | null }
    venue: { name: string; city: string }
  }
  league: { id: number; name: string; round: string }
  teams: {
    home: { id: number; name: string; logo: string; winner: boolean | null }
    away: { id: number; name: string; logo: string; winner: boolean | null }
  }
  goals: { home: number | null; away: number | null }
}

function mapStatus(short: string): MatchStatus {
  const map: Record<string, MatchStatus> = {
    'NS': 'NS', 'TBD': 'NS',
    '1H': 'LIVE', '2H': 'LIVE', 'ET': 'LIVE', 'P': 'LIVE', 'LIVE': 'LIVE',
    'HT': 'HT',
    'FT': 'FT', 'AET': 'FT', 'PEN': 'FT',
    'PST': 'PST', 'CANC': 'CANC', 'ABD': 'CANC',
  }
  return map[short] ?? 'NS'
}

function normaliseFixture(f: APIFixture, competitionKey: LeagueKey): MatchData {
  const league = LEAGUES[competitionKey]
  return {
    id: String(f.fixture.id),
    status: mapStatus(f.fixture.status.short),
    elapsed: f.fixture.status.elapsed,
    home: {
      name: f.teams.home.name,
      shortName: f.teams.home.name.slice(0, 3).toUpperCase(),
      logo: f.teams.home.logo,
      score: f.goals.home,
    },
    away: {
      name: f.teams.away.name,
      shortName: f.teams.away.name.slice(0, 3).toUpperCase(),
      logo: f.teams.away.logo,
      score: f.goals.away,
    },
    competition: league.name,
    competitionKey,
    date: new Date(f.fixture.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
    time: new Date(f.fixture.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    venue: `${f.fixture.venue.name}, ${f.fixture.venue.city}`,
    round: f.league.round,
  }
}

// Get today's fixtures for a league
export async function getTodayFixtures(leagueKey: LeagueKey): Promise<MatchData[]> {
  const league = LEAGUES[leagueKey]
  const season = getSeasonForLeague(leagueKey)
  const today = new Date().toISOString().split('T')[0]

  const data = await apiFetch<APIFixture[]>('fixtures', {
    league: league.id, season, date: today,
  }, withTier(CACHE_TIERS.fresh, `fixtures-${leagueKey}-today`))

  if (data && data.length > 0) return data.map(f => normaliseFixture(f, leagueKey))

  const fallback = await apiFetch<APIFixture[]>('fixtures', {
    league: league.id, season, last: 3,
  }, withTier(CACHE_TIERS.daily, `fixtures-${leagueKey}-recent`))

  return (fallback ?? []).map(f => normaliseFixture(f, leagueKey))
}

// Get all today's fixtures across tracked leagues
export async function getAllTodayFixtures(): Promise<MatchData[]> {
  const today = new Date().toISOString().split('T')[0]
  const results = await Promise.allSettled(
    (['botola', 'pl', 'laliga', 'ucl'] as LeagueKey[]).map(async key => {
      const league = LEAGUES[key]
      const season = getSeasonForLeague(key)
      const data = await apiFetch<APIFixture[]>('fixtures', {
        league: league.id, season, date: today,
      }, withTier(CACHE_TIERS.fresh, `fixtures-today`, `fixtures-${key}-today`))

      if (data && data.length > 0) return data.map(f => normaliseFixture(f, key))

      const fallback = await apiFetch<APIFixture[]>('fixtures', {
        league: league.id, season, last: 3,
      }, withTier(CACHE_TIERS.daily, `fixtures-${key}-recent`))
      return (fallback ?? []).map(f => normaliseFixture(f, key))
    })
  )
  return results
    .filter((r): r is PromiseFulfilledResult<MatchData[]> => r.status === 'fulfilled')
    .flatMap(r => r.value)
}

// Get upcoming fixtures for a league
export async function getUpcomingFixtures(leagueKey: LeagueKey, next = 5): Promise<MatchData[]> {
  const league = LEAGUES[leagueKey]
  const season = getSeasonForLeague(leagueKey)

  const data = await apiFetch<APIFixture[]>('fixtures', {
    league: league.id, season, next,
  }, withTier(CACHE_TIERS.daily, `fixtures-${leagueKey}-upcoming`))

  if (data && data.length > 0) return data.map(f => normaliseFixture(f, leagueKey))

  const last = Math.min(next, 10)
  const fallback = await apiFetch<APIFixture[]>('fixtures', {
    league: league.id, season, last,
  }, withTier(CACHE_TIERS.daily, `fixtures-${leagueKey}-recent`))

  return (fallback ?? []).map(f => normaliseFixture(f, leagueKey))
}

// Get a single fixture by ID — per-match live concern, lives on the `live` tier.
export async function getFixtureById(fixtureId: string): Promise<MatchData | null> {
  const data = await apiFetch<APIFixture[]>('fixtures', {
    id: fixtureId,
  }, withTier(CACHE_TIERS.live, `fixture-${fixtureId}`))

  if (!data || data.length === 0) return null
  const leagueId = data[0].league.id
  const leagueKey = (Object.entries(LEAGUES).find(([, v]) => v.id === leagueId)?.[0] ?? 'pl') as LeagueKey
  return normaliseFixture(data[0], leagueKey)
}

// Get fixtures for a specific league on a specific date
export async function getFixturesByDate(leagueKey: LeagueKey, date: string): Promise<MatchData[]> {
  const league = LEAGUES[leagueKey]
  const season = getSeasonForLeague(leagueKey)

  const data = await apiFetch<APIFixture[]>('fixtures', {
    league: league.id, season, date,
  }, withTier(CACHE_TIERS.fresh, `fixtures-${leagueKey}-${date}`))

  return (data ?? []).map(f => normaliseFixture(f, leagueKey))
}

// Get fixtures across all tracked leagues for a specific date
export async function getAllFixturesByDate(date: string): Promise<MatchData[]> {
  const results = await Promise.allSettled(
    (['botola', 'pl', 'laliga', 'ucl'] as LeagueKey[]).map(async key => {
      const league = LEAGUES[key]
      const season = getSeasonForLeague(key)
      const data = await apiFetch<APIFixture[]>('fixtures', {
        league: league.id, season, date,
      }, withTier(CACHE_TIERS.fresh, `fixtures-all-${date}`, `fixtures-${key}-${date}`))
      return (data ?? []).map(f => normaliseFixture(f, key))
    })
  )
  return results
    .filter((r): r is PromiseFulfilledResult<MatchData[]> => r.status === 'fulfilled')
    .flatMap(r => r.value)
}

// Get next upcoming match across priority leagues (for countdown banner).
// Kept on the static `fresh` (5min) tier per Week 1 plan — no dynamic
// per-match live tiering here; that lives in footballData.match(id).
export async function getNextMatch(): Promise<{
  homeTeam: string; awayTeam: string; date: string; competition: string; round?: string; venue?: string
} | null> {
  const priorities: LeagueKey[] = ['ucl', 'afcon', 'wc', 'pl', 'botola', 'laliga']

  for (const key of priorities) {
    const league = LEAGUES[key]
    const season = getSeasonForLeague(key)
    const data = await apiFetch<APIFixture[]>('fixtures', {
      league: league.id, season, next: 1,
    }, withTier(CACHE_TIERS.fresh, `next-match-${key}`))

    if (data && data.length > 0) {
      const f = data[0]
      return {
        homeTeam: f.teams.home.name,
        awayTeam: f.teams.away.name,
        date: f.fixture.date,
        competition: league.name,
        round: f.league.round,
        venue: f.fixture.venue?.name ? `${f.fixture.venue.name}, ${f.fixture.venue.city}` : undefined,
      }
    }
  }
  return null
}

// Get fixtures for a specific round/matchday
export async function getFixturesByRound(leagueKey: LeagueKey, round: string): Promise<MatchData[]> {
  const league = LEAGUES[leagueKey]
  const season = getSeasonForLeague(leagueKey)
  const data = await apiFetch<APIFixture[]>('fixtures', {
    league: league.id, season, round,
  }, withTier(CACHE_TIERS.daily, `fixtures-${leagueKey}-round-${round}`))

  return (data ?? []).map(f => normaliseFixture(f, leagueKey))
}

// Get current round info and surrounding matchdays
export async function getMatchdayFixtures(leagueKey: LeagueKey): Promise<{
  rounds: { round: string; matches: MatchData[] }[]
}> {
  const league = LEAGUES[leagueKey]
  const season = getSeasonForLeague(leagueKey)

  const nextData = await apiFetch<APIFixture[]>('fixtures', {
    league: league.id, season, next: 1,
  }, withTier(CACHE_TIERS.daily, `current-round-${leagueKey}`))

  const lastData = await apiFetch<APIFixture[]>('fixtures', {
    league: league.id, season, last: 1,
  }, withTier(CACHE_TIERS.daily, `last-round-${leagueKey}`))

  const rounds: string[] = []
  if (lastData && lastData.length > 0) {
    const lastRound = lastData[0].league.round
    if (!rounds.includes(lastRound)) rounds.push(lastRound)
  }
  if (nextData && nextData.length > 0) {
    const nextRound = nextData[0].league.round
    if (!rounds.includes(nextRound)) rounds.push(nextRound)
  }

  const results = await Promise.allSettled(
    rounds.map(async round => ({
      round,
      matches: await getFixturesByRound(leagueKey, round),
    }))
  )

  return {
    rounds: results
      .filter((r): r is PromiseFulfilledResult<{ round: string; matches: MatchData[] }> => r.status === 'fulfilled')
      .map(r => r.value)
      .filter(r => r.matches.length > 0),
  }
}

// Get all knockout round fixtures for a competition (UCL, WC, etc.)
export async function getKnockoutFixtures(leagueKey: LeagueKey): Promise<{
  rounds: { round: string; matches: MatchData[] }[]
}> {
  const league = LEAGUES[leagueKey]
  const season = getSeasonForLeague(leagueKey)

  // Fetch rounds list
  const roundNames = await apiFetch<string[]>('fixtures/rounds', {
    league: league.id, season,
  }, withTier(CACHE_TIERS.daily, `rounds-${leagueKey}`))

  if (!roundNames) return { rounds: [] }

  // Filter to knockout rounds only
  const knockoutRounds = roundNames.filter(r =>
    /round of 16|8th|quarter|semi|final/i.test(r) && !/group/i.test(r)
  )

  const results = await Promise.allSettled(
    knockoutRounds.map(async round => ({
      round,
      matches: await getFixturesByRound(leagueKey, round),
    }))
  )

  return {
    rounds: results
      .filter((r): r is PromiseFulfilledResult<{ round: string; matches: MatchData[] }> => r.status === 'fulfilled')
      .map(r => r.value)
      .filter(r => r.matches.length > 0),
  }
}

// Get recent results for a team (all competitions)
export async function getTeamRecentResults(teamId: number, last = 5): Promise<MatchData[]> {
  const data = await apiFetch<APIFixture[]>('fixtures', {
    team: teamId, last,
  }, withTier(CACHE_TIERS.daily, `team-results-${teamId}`))

  if (!data) return []
  return data.map(f => {
    const leagueId = f.league.id
    const leagueKey = (Object.entries(LEAGUES).find(([, v]) => v.id === leagueId)?.[0] ?? 'afcon') as LeagueKey
    return normaliseFixture(f, leagueKey)
  })
}

// Get upcoming fixtures for a team (all competitions)
export async function getTeamUpcomingFixtures(teamId: number, next = 5): Promise<MatchData[]> {
  const data = await apiFetch<APIFixture[]>('fixtures', {
    team: teamId, next,
  }, withTier(CACHE_TIERS.daily, `team-upcoming-${teamId}`))

  if (!data) return []
  return data.map(f => {
    const leagueId = f.league.id
    const leagueKey = (Object.entries(LEAGUES).find(([, v]) => v.id === leagueId)?.[0] ?? 'afcon') as LeagueKey
    return normaliseFixture(f, leagueKey)
  })
}
