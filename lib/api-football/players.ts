import { apiFetch } from './client'
import { CURRENT_SEASON } from './leagues'
import { CACHE_TIERS, withTier } from '@/lib/data/cache'

interface APIPlayer {
  player: {
    id: number
    name: string
    firstname: string
    lastname: string
    age: number
    nationality: string
    height: string
    weight: string
    photo: string
    injured: boolean
  }
  statistics: Array<{
    team: { id: number; name: string; logo: string }
    league: { id: number; name: string; country: string }
    games: { appearences: number; lineups: number; minutes: number; rating: string | null }
    goals: { total: number; assists: number | null }
    shots: { total: number | null; on: number | null }
    passes: { total: number | null; accuracy: number | null }
    tackles: { total: number | null; interceptions: number | null }
    dribbles: { attempts: number | null; success: number | null }
    cards: { yellow: number; red: number }
  }>
}

export async function getPlayerById(playerId: number) {
  const data = await apiFetch<APIPlayer[]>('players', {
    id: playerId,
    season: CURRENT_SEASON,
  }, withTier(CACHE_TIERS.daily, `player-${playerId}`))

  return data?.[0] ?? null
}

export async function searchPlayers(name: string) {
  const data = await apiFetch<APIPlayer[]>('players', {
    search: name,
    season: CURRENT_SEASON,
  }, withTier(CACHE_TIERS.daily, `player-search-${name}`))

  return data ?? []
}

export async function getTopScorers(leagueId: number) {
  const data = await apiFetch<APIPlayer[]>('players/topscorers', {
    league: leagueId,
    season: CURRENT_SEASON,
  }, withTier(CACHE_TIERS.daily, `topscorers-${leagueId}`))

  return data ?? []
}

export async function getTopAssists(leagueId: number) {
  const data = await apiFetch<APIPlayer[]>('players/topassists', {
    league: leagueId,
    season: CURRENT_SEASON,
  }, withTier(CACHE_TIERS.daily, `topassists-${leagueId}`))

  return data ?? []
}

export async function getTopYellowCards(leagueId: number) {
  const data = await apiFetch<APIPlayer[]>('players/topyellowcards', {
    league: leagueId,
    season: CURRENT_SEASON,
  }, withTier(CACHE_TIERS.daily, `topyellowcards-${leagueId}`))

  return data ?? []
}

export async function getTopRedCards(leagueId: number) {
  const data = await apiFetch<APIPlayer[]>('players/topredcards', {
    league: leagueId,
    season: CURRENT_SEASON,
  }, withTier(CACHE_TIERS.daily, `topredcards-${leagueId}`))

  return data ?? []
}
