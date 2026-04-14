import { apiFetch } from './client'
import { CURRENT_SEASON, getSeasonForLeague, LEAGUES, type LeagueKey } from './leagues'
import { CACHE_TIERS, withTier } from '@/lib/data/cache'

interface APITeam {
  team: { id: number; name: string; country: string; founded: number; logo: string }
  venue: { id: number; name: string; city: string; capacity: number }
}

interface APISquadPlayer {
  id: number
  name: string
  age: number
  number: number | null
  position: string
  photo: string
}

export async function getTeamById(teamId: number) {
  const data = await apiFetch<APITeam[]>('teams', {
    id: teamId,
  }, withTier(CACHE_TIERS.static, `team-${teamId}`))

  return data?.[0] ?? null
}

export async function getTeamSquad(teamId: number) {
  const data = await apiFetch<{ team: { id: number; name: string }; players: APISquadPlayer[] }[]>(
    'players/squads',
    { team: teamId },
    withTier(CACHE_TIERS.static, `squad-${teamId}`),
  )

  return data?.[0]?.players ?? []
}

export async function getTeamStatistics(teamId: number, leagueId: number) {
  const data = await apiFetch<{
    form: string
    fixtures: { played: { total: number }; wins: { total: number }; draws: { total: number }; loses: { total: number } }
    goals: { for: { total: { total: number } }; against: { total: { total: number } } }
    biggest: { wins: { home: string; away: string }; loses: { home: string; away: string } }
    lineups: Array<{ formation: string; played: number }>
  }>(
    'teams/statistics',
    { team: teamId, league: leagueId, season: CURRENT_SEASON },
    withTier(CACHE_TIERS.daily, `team-stats-${teamId}`),
  )

  return data
}

/**
 * Get all teams in a league for the current season.
 * Returns team ID, name, logo, and venue info.
 */
export async function getTeamsByLeague(leagueKey: LeagueKey): Promise<APITeam[]> {
  const league = LEAGUES[leagueKey]
  const season = getSeasonForLeague(leagueKey)

  const data = await apiFetch<APITeam[]>('teams', {
    league: league.id,
    season,
  }, withTier(CACHE_TIERS.static, `teams-${leagueKey}`))

  if (!data) return []

  // Sort alphabetically by team name
  return data.sort((a, b) => a.team.name.localeCompare(b.team.name))
}

export async function searchTeams(name: string) {
  const data = await apiFetch<APITeam[]>('teams', {
    search: name,
  }, withTier(CACHE_TIERS.daily, `team-search-${name}`))

  return data ?? []
}
