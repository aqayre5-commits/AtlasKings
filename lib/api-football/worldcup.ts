/**
 * World Cup 2026 data layer.
 * Wraps API-Football endpoints with WC-specific logic:
 * - 48 teams, 12 groups (A-L), Round of 32 bracket
 * - Best third-placed team calculations
 * - Stage-aware fixture filtering
 */
import { apiFetch } from './client'
import { LEAGUES, getSeasonForLeague } from './leagues'
import { getTopScorers, getTopAssists, getTopYellowCards, getTopRedCards } from './players'
import { CACHE_TIERS, withTier } from '@/lib/data/cache'
import { countryFlagUrl, GROUPS } from '@/lib/data/wc2026'
import type {
  OverviewPageData, FixtureLite, GroupStanding, GroupStandingRow,
  BestThirdRow, BracketMatch, TeamLite, PlayerStatRow, StageKey, MatchStatus,
} from '@/types/world-cup'

/**
 * Resolve a WC 2026 country flag from an api-football team payload.
 *
 * api-football's team.logo URL is:
 *   • reliable for club crests
 *   • UNRELIABLE for several WC national teams — some IDs return
 *     the club badge of a team that shares a name, and a handful
 *     return generic placeholders.
 *
 * Our canonical GROUPS list carries every WC 2026 team name + ISO
 * 3-letter code, so the cheapest fix is to pattern-match the
 * api-football team name against it and serve the flag from
 * flagcdn.com when we have a confident match. Anything we don't
 * recognise (friendlies, qualifiers, unrelated fixtures) falls
 * back to whatever api-football returned, so existing non-WC
 * surfaces are unaffected.
 */
const FLAG_BY_NORMALISED_NAME = buildFlagLookup()
function buildFlagLookup(): Map<string, string> {
  const map = new Map<string, string>()
  for (const group of GROUPS) {
    for (const team of group.teams) {
      map.set(normalise(team.name), countryFlagUrl(team.code, 80))
      map.set(normalise(team.code), countryFlagUrl(team.code, 80))
    }
  }
  // Common alternate spellings returned by api-football.
  const aliases: Record<string, string> = {
    'south korea': 'KOR',
    'korea republic': 'KOR',
    'usa': 'USA',
    'united states': 'USA',
    'ivory coast': 'CIV',
    "cote d'ivoire": 'CIV',
    'czech republic': 'CZE',
    'czechia': 'CZE',
    'iran': 'IRN',
    'ir iran': 'IRN',
    'bosnia and herzegovina': 'BIH',
    'bosnia herzegovina': 'BIH',
    'congo dr': 'COD',
    'dr congo': 'COD',
    'cape verde': 'CPV',
    'cabo verde': 'CPV',
    'curacao': 'CUW',
    'turkey': 'TUR',
    'turkiye': 'TUR',
    'saudi arabia': 'KSA',
    'new zealand': 'NZL',
    'south africa': 'RSA',
    'algeria': 'ALG',
  }
  for (const [name, code] of Object.entries(aliases)) {
    map.set(normalise(name), countryFlagUrl(code, 80))
  }
  return map
}
function normalise(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
}
function resolveTeamFlag(apiTeam: { name?: string; logo?: string }): string {
  const name = apiTeam.name ?? ''
  const hit = FLAG_BY_NORMALISED_NAME.get(normalise(name))
  return hit ?? apiTeam.logo ?? ''
}

const WC_LEAGUE_ID = LEAGUES.wc.id // 1
const WC_SEASON = getSeasonForLeague('wc') // 2026

// ─── Helpers ───

function mapStage(roundName: string): StageKey {
  const r = roundName.toLowerCase()
  if (r.includes('group')) return 'group'
  if (r.includes('round of 32') || r.includes('32nd')) return 'r32'
  if (r.includes('round of 16') || r.includes('16th')) return 'r16'
  if (r.includes('quarter')) return 'qf'
  if (r.includes('semi')) return 'sf'
  if (r.includes('bronze') || r.includes('3rd place') || r.includes('third')) return 'bronze'
  if (r.includes('final') && !r.includes('semi') && !r.includes('quarter')) return 'final'
  return 'group'
}

function mapStatus(short: string): MatchStatus {
  const map: Record<string, MatchStatus> = {
    NS: 'NS', '1H': 'LIVE', '2H': 'LIVE', HT: 'HT', FT: 'FT',
    AET: 'AET', PEN: 'PEN', PST: 'POSTPONED', CANC: 'POSTPONED',
    ET: 'LIVE', P: 'LIVE', LIVE: 'LIVE',
  }
  return map[short] ?? 'NS'
}

function normaliseFixture(f: any): FixtureLite {
  return {
    id: f.fixture.id,
    stage: mapStage(f.league.round ?? ''),
    roundLabel: f.league.round ?? '',
    group: f.league.round?.match(/Group\s+(\w)/)?.[1] ?? undefined,
    dateUtc: f.fixture.date,
    venue: f.fixture.venue?.name ?? '',
    city: f.fixture.venue?.city ?? '',
    status: mapStatus(f.fixture.status.short),
    homeTeam: {
      id: f.teams.home.id,
      name: f.teams.home.name,
      slug: f.teams.home.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      flagUrl: resolveTeamFlag(f.teams.home),
    },
    awayTeam: {
      id: f.teams.away.id,
      name: f.teams.away.name,
      slug: f.teams.away.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      flagUrl: resolveTeamFlag(f.teams.away),
    },
    homeScore: f.goals.home,
    awayScore: f.goals.away,
  }
}

function normaliseTeam(t: any): TeamLite {
  return {
    id: t.team.id,
    name: t.team.name,
    slug: t.team.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    flagUrl: resolveTeamFlag(t.team),
  }
}

function normalisePlayerStat(p: any, rank: number, statExtractor: (s: any) => number): PlayerStatRow {
  const stats = p.statistics?.[0]
  return {
    rank,
    playerId: p.player.id,
    playerName: p.player.name,
    playerSlug: p.player.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    playerPhoto: p.player.photo,
    team: {
      id: stats?.team?.id ?? 0,
      name: stats?.team?.name ?? '',
      slug: (stats?.team?.name ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      flagUrl: resolveTeamFlag(stats?.team ?? {}),
    },
    matches: stats?.games?.appearences ?? 0,
    minutes: stats?.games?.minutes ?? 0,
    value: statExtractor(stats),
  }
}

// ─── Public API ───

export async function getWorldCupFixtures(params?: {
  stage?: string
  date?: string
  teamId?: number
  group?: string
}): Promise<FixtureLite[]> {
  const apiParams: Record<string, string | number> = {
    league: WC_LEAGUE_ID,
    season: WC_SEASON,
  }
  if (params?.date) apiParams.date = params.date
  if (params?.teamId) apiParams.team = params.teamId

  // WC fixtures: list aggregate — stays on the daily tier. The tournament
  // isn't running yet so 1h is plenty; during the live window Week 2 will
  // decide whether to split live matches off into a separate path.
  const data = await apiFetch<any[]>(
    'fixtures',
    apiParams,
    withTier(CACHE_TIERS.daily, 'wc-fixtures'),
  )

  let fixtures = (data ?? []).map(normaliseFixture)

  if (params?.stage) {
    fixtures = fixtures.filter(f => f.stage === params.stage)
  }
  if (params?.group) {
    fixtures = fixtures.filter(f => f.group === params.group)
  }

  return fixtures.sort((a, b) => new Date(a.dateUtc).getTime() - new Date(b.dateUtc).getTime())
}

export async function getWorldCupStandings(): Promise<GroupStanding[]> {
  const data = await apiFetch<any[]>('standings', {
    league: WC_LEAGUE_ID,
    season: WC_SEASON,
  }, withTier(CACHE_TIERS.daily, 'wc-standings'))

  if (!data || data.length === 0) return []

  // API returns nested: league.standings is an array of group arrays
  const standings = data[0]?.league?.standings ?? []

  return standings.map((groupRows: any[]) => {
    const groupLetter = groupRows[0]?.group?.replace('Group ', '') ?? '?'
    return {
      group: groupLetter,
      rows: groupRows.map((row: any, i: number): GroupStandingRow => ({
        rank: row.rank ?? i + 1,
        team: {
          id: row.team.id,
          name: row.team.name,
          slug: row.team.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          flagUrl: resolveTeamFlag(row.team),
          group: groupLetter,
        },
        played: row.all.played ?? 0,
        won: row.all.win ?? 0,
        drawn: row.all.draw ?? 0,
        lost: row.all.lose ?? 0,
        gf: row.all.goals?.for ?? 0,
        ga: row.all.goals?.against ?? 0,
        gd: (row.all.goals?.for ?? 0) - (row.all.goals?.against ?? 0),
        points: row.points ?? 0,
      })),
    }
  })
}

export async function getBestThirdStandings(): Promise<BestThirdRow[]> {
  const groups = await getWorldCupStandings()
  if (groups.length === 0) return []

  // Collect all 3rd-placed teams
  const thirds: BestThirdRow[] = groups
    .filter(g => g.rows.length >= 3)
    .map((g, i) => {
      const row = g.rows[2] // 3rd place
      return {
        rank: 0,
        team: row.team,
        group: g.group,
        points: row.points,
        gd: row.gd,
        gf: row.gf,
        status: 'currently_out' as const,
      }
    })

  // Sort by points desc, then GD, then GF
  thirds.sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf)

  // Top 8 qualify
  return thirds.map((t, i) => ({
    ...t,
    rank: i + 1,
    status: i < 8 ? 'currently_in' as const : 'currently_out' as const,
  }))
}

export async function getWorldCupBracket(): Promise<BracketMatch[]> {
  const fixtures = await getWorldCupFixtures()
  const knockoutFixtures = fixtures.filter(f =>
    f.stage !== 'group'
  )

  const stageOrder: Record<StageKey, number> = {
    group: 0, r32: 1, r16: 2, qf: 3, sf: 4, bronze: 5, final: 6,
  }

  return knockoutFixtures
    .sort((a, b) => (stageOrder[a.stage] - stageOrder[b.stage]) || new Date(a.dateUtc).getTime() - new Date(b.dateUtc).getTime())
    .map((f, i): BracketMatch => ({
      id: f.id,
      stage: f.stage,
      roundOrder: stageOrder[f.stage],
      matchNumber: i + 1,
      slotLabel: f.slotLabel ?? f.roundLabel,
      homeLabel: f.homeTeam.name,
      awayLabel: f.awayTeam.name,
      dateUtc: f.dateUtc,
      venue: f.venue,
      city: f.city,
      homeTeam: f.homeTeam,
      awayTeam: f.awayTeam,
    }))
}

export async function getWorldCupTeams(): Promise<TeamLite[]> {
  const data = await apiFetch<any[]>('teams', {
    league: WC_LEAGUE_ID,
    season: WC_SEASON,
  }, withTier(CACHE_TIERS.static, 'wc-teams'))

  return (data ?? []).map(normaliseTeam).sort((a, b) => a.name.localeCompare(b.name))
}

export async function getWorldCupTopScorers(): Promise<PlayerStatRow[]> {
  const data = await getTopScorers(WC_LEAGUE_ID).catch(() => [])
  return data.map((p, i) => normalisePlayerStat(p, i + 1, s => s?.goals?.total ?? 0))
}

export async function getWorldCupTopAssists(): Promise<PlayerStatRow[]> {
  const data = await getTopAssists(WC_LEAGUE_ID).catch(() => [])
  return data.map((p, i) => normalisePlayerStat(p, i + 1, s => s?.goals?.assists ?? 0))
}

export async function getWorldCupTopYellowCards(): Promise<PlayerStatRow[]> {
  const data = await getTopYellowCards(WC_LEAGUE_ID).catch(() => [])
  return data.map((p, i) => normalisePlayerStat(p, i + 1, s => s?.cards?.yellow ?? 0))
}

export async function getWorldCupTopRedCards(): Promise<PlayerStatRow[]> {
  const data = await getTopRedCards(WC_LEAGUE_ID).catch(() => [])
  return data.map((p, i) => normalisePlayerStat(p, i + 1, s => s?.cards?.red ?? 0))
}

export async function getWorldCupOverview(): Promise<OverviewPageData> {
  const [fixtures, standings, bestThird, bracket, scorers] = await Promise.all([
    getWorldCupFixtures().catch(() => []),
    getWorldCupStandings().catch(() => []),
    getBestThirdStandings().catch(() => []),
    getWorldCupBracket().catch(() => []),
    getWorldCupTopScorers().catch(() => []),
  ])

  const now = new Date()
  const liveMatches = fixtures.filter(f => f.status === 'LIVE' || f.status === 'HT')
  const upcomingOrRecent = fixtures
    .filter(f => new Date(f.dateUtc) >= new Date(now.getTime() - 24 * 60 * 60 * 1000))
    .slice(0, 6)

  return {
    liveMatches,
    featuredMatch: liveMatches[0] ?? upcomingOrRecent[0] ?? null,
    featuredStory: null, // Filled by article system
    latestStories: [], // Filled by article system
    fixturesPreview: upcomingOrRecent,
    miniStandings: standings.slice(0, 4),
    bestThirdPreview: bestThird.slice(0, 8),
    bracketPreview: bracket.slice(0, 8),
    topScorers: scorers.slice(0, 10),
  }
}
