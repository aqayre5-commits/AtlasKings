import { apiFetch } from './client'
import { LEAGUES, CURRENT_SEASON, getSeasonForLeague, type LeagueKey } from './leagues'
import { CACHE_TIERS, withTier } from '@/lib/data/cache'
import type { StandingRow } from '@/lib/data/placeholderData'

// Raw API-Football standing shape
interface APIStanding {
  rank: number
  team: { id: number; name: string; logo: string }
  points: number
  goalsDiff: number
  group: string
  form: string
  status: string
  description: string | null
  all: {
    played: number
    win: number
    draw: number
    lose: number
    goals: { for: number; against: number }
  }
  home: { played: number; win: number; draw: number; lose: number }
  away: { played: number; win: number; draw: number; lose: number }
}

// Map API description to our status type
function mapDescription(desc: string | null): StandingRow['status'] | undefined {
  if (!desc) return undefined
  const d = desc.toLowerCase()
  if (d.includes('champion')) return 'champions'
  if (d.includes('champions league') || d.includes('promotion')) return 'ucl'
  if (d.includes('europa') || d.includes('conference')) return 'uel'
  if (d.includes('relegation') || d.includes('play-off')) return 'relegation'
  return undefined
}

function mapForm(form: string): string {
  // API returns 'W', 'D', 'L' — take last 5
  return (form ?? '').slice(-5).split('').map(r => {
    if (r === 'W') return 'W'
    if (r === 'L') return 'L'
    return 'D'
  }).join('')
}

// Normalise API standing to our StandingRow shape
function normaliseStanding(s: APIStanding): StandingRow {
  return {
    pos: s.rank,
    team: s.team.name,
    shortName: s.team.name.slice(0, 3).toUpperCase(),
    logo: s.team.logo,
    played: s.all.played,
    won: s.all.win,
    drawn: s.all.draw,
    lost: s.all.lose,
    gf: s.all.goals.for,
    ga: s.all.goals.against,
    gd: s.goalsDiff,
    pts: s.points,
    form: mapForm(s.form),
    status: mapDescription(s.description),
  }
}

// Get standings for a league
export async function getStandings(leagueKey: LeagueKey): Promise<StandingRow[]> {
  const league = LEAGUES[leagueKey]

  // API returns nested array: response[0] is array of groups, each group has standings
  const data = await apiFetch<{ league: { standings: APIStanding[][] } }[]>(
    'standings',
    { league: league.id, season: getSeasonForLeague(leagueKey) },
    withTier(CACHE_TIERS.daily, `standings-${leagueKey}`),
  )

  if (!data || data.length === 0) return []

  // Flatten all groups (handles UCL group stage with multiple groups)
  const allStandings = data[0].league.standings.flat()
  return allStandings.map(normaliseStanding)
}

// Get standings for all tracked leagues
export async function getAllStandings(): Promise<Record<string, { name: string; season: string; rows: StandingRow[] }>> {
  const leagueKeys: LeagueKey[] = ['pl', 'botola', 'laliga', 'ucl']

  const results = await Promise.allSettled(
    leagueKeys.map(async key => ({
      key,
      rows: await getStandings(key),
    }))
  )

  const standings: Record<string, { name: string; season: string; rows: StandingRow[] }> = {}

  results.forEach(result => {
    if (result.status === 'fulfilled') {
      const { key, rows } = result.value
      standings[key] = {
        name: LEAGUES[key].name,
        season: `${CURRENT_SEASON}/${String(CURRENT_SEASON + 1).slice(2)}`,
        rows,
      }
    }
  })

  return standings
}
