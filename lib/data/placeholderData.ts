// Type definitions for match and standings data
// These types are used across the API layer and components

export type MatchStatus = 'FT' | 'HT' | 'LIVE' | 'NS' | 'PST' | 'CANC'

export interface MatchData {
  id: string
  status: MatchStatus
  elapsed: number | null
  home: { name: string; shortName: string; logo?: string; score: number | null }
  away: { name: string; shortName: string; logo?: string; score: number | null }
  competition: string
  competitionKey: string
  date: string
  time: string
  venue: string
  round?: string
}

export interface StandingRow {
  pos: number
  team: string
  shortName?: string
  logo?: string
  played: number
  won: number
  drawn: number
  lost: number
  gf: number
  ga: number
  gd: number
  pts: number
  form: string
  status?: 'champions' | 'ucl' | 'uel' | 'relegation'
}

// Group matches by competition key
export function groupByCompetition(matches: MatchData[]): Record<string, MatchData[]> {
  return matches.reduce((acc, m) => {
    const key = m.competitionKey
    if (!acc[key]) acc[key] = []
    acc[key].push(m)
    return acc
  }, {} as Record<string, MatchData[]>)
}
