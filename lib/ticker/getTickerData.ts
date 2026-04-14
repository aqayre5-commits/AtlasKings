/**
 * Atlas Kings — Smart Scores Ticker
 *
 * Priority stack:
 *  1. LIVE       — matches in progress right now
 *  2. TODAY      — matches today (upcoming or finished)
 *  3. TOMORROW   — nothing today, but matches tomorrow
 *  4. UPCOMING   — next matchday within 7 days
 *  5. INTL       — international window (FIFA/AFCON break)
 *  6. EMPTY      — true dead period, bar hides
 */

import { apiFetch } from '@/lib/api-football/client'
import { CURRENT_SEASON } from '@/lib/api-football/leagues'
import { getMoroccanPlayersInFixture } from '@/lib/data/moroccan-players-watchlist'

// ── Competition priority (Moroccan audience first) ──────────────────────────
const TIER_1 = [
  { id: 1,   name: 'Morocco',          short: 'MAR',  flag: '🇲🇦' },
  { id: 200, name: 'Botola Pro',       short: 'BOT',  flag: '🏆' },
  { id: 12,  name: 'CAF CL',           short: 'CAF',  flag: '🌍' },
]
const TIER_2 = [
  { id: 2,   name: 'Champions League', short: 'UCL',  flag: '⭐' },
  { id: 39,  name: 'Premier League',   short: 'PL',   flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 140, name: 'La Liga',          short: 'ESP',  flag: '🇪🇸' },
]
const TIER_3 = [
  { id: 78,  name: 'Bundesliga',       short: 'BUN',  flag: '🇩🇪' },
  { id: 135, name: 'Serie A',          short: 'ITA',  flag: '🇮🇹' },
  { id: 61,  name: 'Ligue 1',          short: 'FRA',  flag: '🇫🇷' },
]
const INTL_LEAGUES = [
  { id: 1,   name: 'World Cup',        short: 'WC',   flag: '🌍' },
  { id: 6,   name: 'AFCON',            short: 'AFCON',flag: '🌍' },
  { id: 29,  name: 'Africa WCQ',       short: 'WCQ',  flag: '🌍' },
  { id: 31,  name: 'Europe WCQ',       short: 'WCQ',  flag: '🌍' },
]

const ALL_LEAGUES = [...TIER_1, ...TIER_2, ...TIER_3]
const MOROCCO_TEAM_ID = 1

// Priority scoring for Moroccan audience relevance
const TIER_1_IDS = new Set(TIER_1.map(l => l.id))
const TIER_2_IDS = new Set(TIER_2.map(l => l.id))

export type TickerState = 'live' | 'today' | 'tomorrow' | 'upcoming' | 'international' | 'empty'

export interface TickerMatch {
  id: string
  homeShort: string
  awayShort: string
  homeScore: number | null
  awayScore: number | null
  status: string        // 'NS' | 'LIVE' | 'HT' | 'FT' etc.
  elapsed: number | null
  time: string          // kickoff time string e.g. "20:00"
  competition: string   // short name
  flag: string
  isMorocco: boolean
  date: string
  /** Priority score for sorting (higher = more relevant). */
  priority: number
  /** Moroccan player(s) in this fixture, if any. */
  moroccanPlayer?: string
}

export interface TickerData {
  state: TickerState
  matches: TickerMatch[]
  label: string         // e.g. "LIVE", "TODAY", "SAT 12 APR"
  nextDate?: string     // for upcoming state
}

// ── Raw API shape ────────────────────────────────────────────────────────────
interface APIFixture {
  fixture: {
    id: number
    date: string
    status: { long: string; short: string; elapsed: number | null }
  }
  league: { id: number; name: string }
  teams: {
    home: { id: number; name: string; logo: string }
    away: { id: number; name: string; logo: string }
  }
  goals: { home: number | null; away: number | null }
}

const LIVE_STATUSES = new Set(['1H', '2H', 'ET', 'P', 'HT', 'LIVE', 'BREAK'])
const DONE_STATUSES = new Set(['FT', 'AET', 'PEN'])

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Casablanca',
  })
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short',
    timeZone: 'Africa/Casablanca',
  }).toUpperCase()
}

function getShortName(name: string): string {
  // 3-4 letter abbreviation
  const OVERRIDES: Record<string, string> = {
    'Manchester City': 'MCI', 'Manchester United': 'MUN',
    'Real Madrid': 'RMA', 'Barcelona': 'BAR', 'Atletico Madrid': 'ATL',
    'Paris Saint Germain': 'PSG', 'Bayern Munich': 'BAY',
    'Liverpool': 'LIV', 'Arsenal': 'ARS', 'Chelsea': 'CHE',
    'Tottenham Hotspur': 'TOT', 'Morocco': 'MAR',
    'Raja CA': 'RAJ', 'Wydad AC': 'WAC',
    'Borussia Dortmund': 'BVB', 'Juventus': 'JUV',
    'Inter': 'INT', 'AC Milan': 'MIL',
  }
  return OVERRIDES[name] ?? name.slice(0, 3).toUpperCase()
}

function leagueMeta(leagueId: number) {
  return (
    ALL_LEAGUES.find(l => l.id === leagueId) ??
    INTL_LEAGUES.find(l => l.id === leagueId) ??
    { short: 'INT', flag: '⚽' }
  )
}

function isMoroccoMatch(fixture: APIFixture): boolean {
  return (
    fixture.teams.home.id === MOROCCO_TEAM_ID ||
    fixture.teams.away.id === MOROCCO_TEAM_ID
  )
}

function toTickerMatch(f: APIFixture): TickerMatch {
  const meta = leagueMeta(f.league.id)
  const morocco = isMoroccoMatch(f)

  // Priority scoring: Botola (100) > Morocco NT (95) > Moroccan player club (80) > Big 5 (40) > rest (10)
  let priority = 10
  if (TIER_1_IDS.has(f.league.id)) priority = 100
  if (morocco) priority = 95

  // Check if a Moroccan international plays for either club
  const watchlistPlayers = getMoroccanPlayersInFixture(f.teams.home.id, f.teams.away.id)
  let moroccanPlayer: string | undefined
  if (watchlistPlayers.length > 0 && !morocco) {
    priority = Math.max(priority, 80)
    moroccanPlayer = watchlistPlayers[0].shortName
  }

  if (TIER_2_IDS.has(f.league.id)) priority = Math.max(priority, 40)

  return {
    id: String(f.fixture.id),
    homeShort: getShortName(f.teams.home.name),
    awayShort: getShortName(f.teams.away.name),
    homeScore: f.goals.home,
    awayScore: f.goals.away,
    status: f.fixture.status.short,
    elapsed: f.fixture.status.elapsed,
    time: formatTime(f.fixture.date),
    competition: meta.short,
    flag: morocco ? '\uD83C\uDDF2\uD83C\uDDE6' : meta.flag,
    isMorocco: morocco,
    date: f.fixture.date,
    priority,
    moroccanPlayer,
  }
}

// Sort by priority (desc), then live status, then kickoff time
function sortMatches(matches: TickerMatch[]): TickerMatch[] {
  return [...matches].sort((a, b) => {
    // Higher priority first
    if (a.priority !== b.priority) return b.priority - a.priority
    // Live matches before finished/upcoming within same tier
    const aLive = LIVE_STATUSES.has(a.status) ? 0 : 1
    const bLive = LIVE_STATUSES.has(b.status) ? 0 : 1
    if (aLive !== bLive) return aLive - bLive
    // Earlier kickoff first
    return a.date.localeCompare(b.date)
  })
}

// Fetch fixtures for a date across all tracked leagues
async function fetchByDate(dateStr: string): Promise<APIFixture[]> {
  const results = await Promise.allSettled(
    [...TIER_1, ...TIER_2, ...TIER_3].map(league =>
      apiFetch<APIFixture[]>('fixtures', {
        league: league.id,
        season: CURRENT_SEASON,
        date: dateStr,
      }, { revalidate: 60 })
    )
  )
  return results
    .filter((r): r is PromiseFulfilledResult<APIFixture[]> => r.status === 'fulfilled' && !!r.value)
    .flatMap(r => r.value)
}

async function fetchLive(): Promise<APIFixture[]> {
  const results = await Promise.allSettled(
    [...TIER_1, ...TIER_2, ...TIER_3].map(league =>
      apiFetch<APIFixture[]>('fixtures', {
        league: league.id,
        season: CURRENT_SEASON,
        live: 'all',
      }, { revalidate: 30 })
    )
  )
  return results
    .filter((r): r is PromiseFulfilledResult<APIFixture[]> => r.status === 'fulfilled' && !!r.value)
    .flatMap(r => r.value)
}

async function fetchInternational(days: number): Promise<APIFixture[]> {
  const fixtures: APIFixture[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]

    const results = await Promise.allSettled(
      INTL_LEAGUES.map(league =>
        apiFetch<APIFixture[]>('fixtures', {
          league: league.id,
          season: CURRENT_SEASON,
          date: dateStr,
        }, { revalidate: 3600 })
      )
    )
    const dayFixtures = results
      .filter((r): r is PromiseFulfilledResult<APIFixture[]> => r.status === 'fulfilled' && !!r.value)
      .flatMap(r => r.value)
    fixtures.push(...dayFixtures)
    if (fixtures.length >= 10) break
  }
  return fixtures
}

// ── PLACEHOLDER DATA — used when no API key ─────────────────────────────────
function getPlaceholderTicker(): TickerData {
  const now = new Date()
  const hour = now.getHours()

  // Simulate different states based on time of day
  if (hour >= 19 && hour <= 22) {
    return {
      state: 'live',
      label: 'LIVE',
      matches: [
        { id: '1', homeShort: 'MAG', awayShort: 'WAC', homeScore: 0, awayScore: 0, status: 'LIVE', elapsed: 74, time: '20:00', competition: 'BOT', flag: '\uD83C\uDDF2\uD83C\uDDE6', isMorocco: false, date: new Date().toISOString(), priority: 100 },
        { id: '5', homeShort: 'RAJ', awayShort: 'OLM', homeScore: 1, awayScore: 0, status: 'LIVE', elapsed: 61, time: '18:00', competition: 'BOT', flag: '\uD83C\uDDF2\uD83C\uDDE6', isMorocco: false, date: new Date().toISOString(), priority: 100 },
        { id: '2', homeShort: 'PSG', awayShort: 'LIV', homeScore: 2, awayScore: 1, status: 'LIVE', elapsed: 83, time: '21:00', competition: 'UCL', flag: '\u2B50', isMorocco: false, date: new Date().toISOString(), priority: 80, moroccanPlayer: 'Hakimi' },
        { id: '3', homeShort: 'RMA', awayShort: 'BAR', homeScore: 1, awayScore: 0, status: 'HT', elapsed: 45, time: '21:00', competition: 'ESP', flag: '\uD83C\uDDEA\uD83C\uDDF8', isMorocco: false, date: new Date().toISOString(), priority: 80, moroccanPlayer: 'Diaz' },
        { id: '4', homeShort: 'ARS', awayShort: 'MUN', homeScore: 2, awayScore: 0, status: 'FT', elapsed: null, time: '17:30', competition: 'PL', flag: '\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67\uDB40\uDC7F', isMorocco: false, date: new Date().toISOString(), priority: 40 },
      ],
    }
  }

  return {
    state: 'today',
    label: 'TODAY',
    matches: [
      { id: '1', homeShort: 'MAR', awayShort: 'GHA', homeScore: null, awayScore: null, status: 'NS', elapsed: null, time: '20:00', competition: 'WCQ', flag: '\uD83C\uDDF2\uD83C\uDDE6', isMorocco: true, date: new Date().toISOString(), priority: 95 },
      { id: '2', homeShort: 'RMA', awayShort: 'BAR', homeScore: null, awayScore: null, status: 'NS', elapsed: null, time: '21:00', competition: 'ESP', flag: '\uD83C\uDDEA\uD83C\uDDF8', isMorocco: false, date: new Date().toISOString(), priority: 80, moroccanPlayer: 'Diaz' },
      { id: '3', homeShort: 'MCI', awayShort: 'CHE', homeScore: null, awayScore: null, status: 'NS', elapsed: null, time: '17:30', competition: 'PL', flag: '\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67\uDB40\uDC7F', isMorocco: false, date: new Date().toISOString(), priority: 40 },
    ],
  }
}

// ── MAIN EXPORT ──────────────────────────────────────────────────────────────
export async function getTickerData(): Promise<TickerData> {
  // No API key — return realistic placeholder
  if (!process.env.APIFOOTBALL_KEY) {
    return getPlaceholderTicker()
  }

  try {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    const tomorrowStr = new Date(today.getTime() + 86400000).toISOString().split('T')[0]

    // ── Priority 1: LIVE ──
    const live = await fetchLive()
    if (live.length > 0) {
      const matches = sortMatches(live.map(toTickerMatch))
      return { state: 'live', label: 'LIVE', matches }
    }

    // ── Priority 2: TODAY ──
    const todayFixtures = await fetchByDate(todayStr)
    if (todayFixtures.length > 0) {
      const matches = sortMatches(todayFixtures.map(toTickerMatch))
      const hasLive = matches.some(m => LIVE_STATUSES.has(m.status))
      return {
        state: 'today',
        label: hasLive ? 'LIVE' : 'TODAY',
        matches,
      }
    }

    // ── Priority 3: TOMORROW ──
    const tomorrowFixtures = await fetchByDate(tomorrowStr)
    if (tomorrowFixtures.length > 0) {
      const matches = sortMatches(tomorrowFixtures.map(toTickerMatch))
      return { state: 'tomorrow', label: 'TOMORROW', matches }
    }

    // ── Priority 4: NEXT MATCHDAY (7 days) ──
    for (let i = 2; i <= 7; i++) {
      const d = new Date(today.getTime() + i * 86400000)
      const dateStr = d.toISOString().split('T')[0]
      const fixtures = await fetchByDate(dateStr)
      if (fixtures.length > 0) {
        const matches = sortMatches(fixtures.map(toTickerMatch))
        return {
          state: 'upcoming',
          label: formatDate(d.toISOString()),
          matches,
          nextDate: formatDate(d.toISOString()),
        }
      }
    }

    // ── Priority 5: INTERNATIONAL WINDOW ──
    const intlFixtures = await fetchInternational(14)
    if (intlFixtures.length > 0) {
      const matches = sortMatches(intlFixtures.map(toTickerMatch))
      return { state: 'international', label: '🌍 INTERNATIONAL', matches }
    }

    // ── Priority 6: EMPTY ──
    return { state: 'empty', label: '', matches: [] }

  } catch (err) {
    console.error('[Ticker] Error fetching data:', err)
    return { state: 'empty', label: '', matches: [] }
  }
}
