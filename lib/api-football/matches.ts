import { apiFetch } from './client'
import { CACHE_TIERS, withTier } from '@/lib/data/cache'

// Match events (goals, cards, subs)
interface APIEvent {
  time: { elapsed: number; extra: number | null }
  team: { id: number; name: string; logo: string }
  player: { id: number; name: string }
  assist: { id: number | null; name: string | null }
  type: string
  detail: string
  comments: string | null
}

// Match statistics
interface APIStatistic {
  team: { id: number; name: string; logo: string }
  statistics: Array<{ type: string; value: number | string | null }>
}

// Match lineups
interface APILineup {
  team: { id: number; name: string; logo: string; colors: unknown }
  formation: string
  startXI: Array<{ player: { id: number; name: string; number: number; pos: string; grid: string | null } }>
  substitutes: Array<{ player: { id: number; name: string; number: number; pos: string; grid: string | null } }>
  coach: { id: number; name: string; photo: string }
}

// Per-match live surfaces — events and stats update every 30s during play.
// Lineups change less frequently and sit on the `fresh` (5min) tier.

export async function getMatchEvents(fixtureId: string) {
  const data = await apiFetch<APIEvent[]>('fixtures/events', {
    fixture: fixtureId,
  }, withTier(CACHE_TIERS.live, `match-events-${fixtureId}`))

  return data ?? []
}

export async function getMatchStats(fixtureId: string) {
  const data = await apiFetch<APIStatistic[]>('fixtures/statistics', {
    fixture: fixtureId,
  }, withTier(CACHE_TIERS.live, `match-stats-${fixtureId}`))

  return data ?? []
}

export async function getMatchLineups(fixtureId: string) {
  const data = await apiFetch<APILineup[]>('fixtures/lineups', {
    fixture: fixtureId,
  }, withTier(CACHE_TIERS.fresh, `match-lineups-${fixtureId}`))

  return data ?? []
}

// Get all match data in one parallel call
export async function getFullMatchData(fixtureId: string) {
  const [events, stats, lineups] = await Promise.allSettled([
    getMatchEvents(fixtureId),
    getMatchStats(fixtureId),
    getMatchLineups(fixtureId),
  ])

  return {
    events: events.status === 'fulfilled' ? events.value : [],
    stats: stats.status === 'fulfilled' ? stats.value : [],
    lineups: lineups.status === 'fulfilled' ? lineups.value : [],
  }
}
