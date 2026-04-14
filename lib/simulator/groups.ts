/**
 * FIFA World Cup 2026 — predictor group-stage dataset.
 *
 * Rebuilt on top of the canonical `lib/data/wc2026.ts` module. The
 * earlier hand-written version had corrupted pairings across 9 of 12
 * groups (duplicates, cross-group teams, and missing fixtures), which
 * surfaced on /wc-2026/predictor as "some games are missing".
 *
 * Everything here is now derived:
 *   • TEAMS — pulled from canonical GROUPS, with a local FIFA-ranking
 *     lookup for the predictor's simulation weighting.
 *   • GROUP_MATCHES — generated programmatically so every group has
 *     all 6 round-robin pairings, exactly once, with stable match
 *     numbers. Morocco's Group C fixtures (match 7 BRA v MAR, 30
 *     SCO v MAR, 50 MAR v HAI) are overridden with PDF-verified
 *     venues and dates. Non-Morocco match venues and dates are
 *     heuristic placeholders and should be refreshed whenever a
 *     cleaner PDF extraction is available.
 */

import {
  GROUPS,
  VENUES,
  MOROCCO_FIXTURES,
  countryFlagUrl,
  getVenue,
  GROUP_LETTERS,
  type WC26GroupTeam,
} from '@/lib/data/wc2026'

export interface SimTeam {
  id: number           // api-football team ID
  name: string
  code: string         // FIFA 3-letter code
  flagUrl: string
  group: string
  fifaRanking: number  // approximate, used only for simulation weighting
}

export interface GroupMatch {
  matchNumber: number
  group: string
  homeCode: string
  awayCode: string
  date: string         // ISO date (local ET)
  venue: string
  city: string
}

export interface SimGroup {
  letter: string
  teams: SimTeam[]
  matches: GroupMatch[]
}

export interface GroupStandingRow {
  team: SimTeam
  played: number
  won: number
  drawn: number
  lost: number
  gf: number
  ga: number
  gd: number
  points: number
}

// ─── FIFA ranking lookup (approximate, for simulation only) ──────

const FIFA_RANKING: Record<string, number> = {
  // Group A
  MEX: 15, RSA: 59, KOR: 22, CZE: 36,
  // Group B
  CAN: 40, BIH: 56, QAT: 43, SUI: 18,
  // Group C
  BRA: 5, MAR: 13, HAI: 90, SCO: 48,
  // Group D
  USA: 11, PAR: 52, AUS: 24, TUR: 41,
  // Group E
  GER: 8, CUW: 85, CIV: 39, ECU: 33,
  // Group F
  NED: 7, JPN: 14, SWE: 27, TUN: 42,
  // Group G
  BEL: 6, EGY: 34, IRN: 21, NZL: 93,
  // Group H
  ESP: 3, CPV: 64, KSA: 60, URU: 10,
  // Group I
  FRA: 2, SEN: 17, IRQ: 62, NOR: 46,
  // Group J
  ARG: 1, ALG: 32, AUT: 23, JOR: 68,
  // Group K
  POR: 4, COD: 55, UZB: 53, COL: 12,
  // Group L
  ENG: 9, CRO: 16, GHA: 58, PAN: 47,
}

// ─── TEAMS — flattened from canonical GROUPS ─────────────────────

// Team list flattened from the canonical GROUPS map. Flags resolve
// from the ISO-3166 country code via flagcdn.com — NOT from the
// api-football team-logo endpoint, which returns club crests for
// many of the numeric IDs and was the source of the "wrong flags"
// bug across v1 panels.
const TEAMS: SimTeam[] = GROUPS.flatMap(group =>
  group.teams.map<SimTeam>(t => ({
    id: t.apiId,
    name: t.name,
    code: t.code,
    flagUrl: countryFlagUrl(t.code, 80),
    group: group.letter,
    fifaRanking: FIFA_RANKING[t.code] ?? 50,
  })),
)

// ─── GROUP_MATCHES — deterministic full round-robin ──────────────
//
// Each group plays a 6-match round-robin across 3 matchdays:
//
//   MD1 : seed 1 v 2  ·  seed 3 v 4
//   MD2 : seed 1 v 3  ·  seed 4 v 2
//   MD3 : seed 1 v 4  ·  seed 2 v 3
//
// Group letters run A–L, MDs run in order, so the 72 match numbers
// are allocated as:
//   MD1 (matches 1–24)  : two per group (A, B, C, ..., L)
//   MD2 (matches 25–48) : two per group
//   MD3 (matches 49–72) : two per group
//
// A fixed offset then shifts Group C's numbers onto the 3 Morocco
// match numbers the PDF specifies (7, 30, 50) by scheduling Group C
// slightly later within each matchday block.

const MD1_DATES = ['2026-06-11', '2026-06-12', '2026-06-13', '2026-06-14', '2026-06-15', '2026-06-16']
const MD2_DATES = ['2026-06-17', '2026-06-18', '2026-06-19', '2026-06-20', '2026-06-21', '2026-06-22']
const MD3_DATES = ['2026-06-23', '2026-06-24', '2026-06-25', '2026-06-26', '2026-06-27', '2026-06-28']

/**
 * Per-group slot within each matchday block. Morocco's Group C gets
 * the slots that map to PDF match numbers 7, 30, 50:
 *   - MD1 block starts at match 1. C slot 6 → 1 + (6-1)*? = need a
 *     linear layout. Simpler: assign MD1 matches per group two at a
 *     time in order A(1,2), B(3,4), C(?,?), D(5,6) ... but that
 *     places C at 5,6.
 *
 * To land Morocco matches at PDF-specified numbers (7, 30, 50) we
 * interleave the per-group ordering manually:
 *
 *   MD1 layout: A A B B D D  C C  E E F F G G H H I I J J K K L L
 *     → C MD1 pair occupies match numbers 7, 8
 *   MD2 layout: A A B B D D C C  E E F F G G H H I I J J K K L L
 *     → C MD2 pair occupies match numbers 31, 32 (home/away tweaked
 *       so Morocco's SCO v MAR lands on 30 — see Morocco override)
 *   MD3 layout: A A B B C C  D D E E F F G G H H I I J J K K L L
 *     → C MD3 pair occupies match numbers 53, 54 (Morocco override
 *       pushes MAR v HAI onto 50 — see below)
 *
 * Because Morocco's three PDF numbers are not perfectly regular, we
 * declare `MOROCCO_MATCH_NUMBERS` explicitly and the main generator
 * fills the rest around them.
 */

const MOROCCO_PDF_NUMBERS = {
  md1: 7,  // BRA v MAR, Sat 13 Jun, New York / New Jersey
  md2: 30, // SCO v MAR, Sat 20 Jun, Boston
  md3: 50, // MAR v HAI, Wed 24 Jun, Atlanta
} as const

/**
 * Build the full 72-match group stage. Deterministic — same output
 * every call, same output across locales.
 */
function buildGroupMatches(): GroupMatch[] {
  const matches: GroupMatch[] = []
  // Track claimed match numbers so we can skip Morocco's PDF numbers
  // when walking the sequential allocator for non-Morocco groups.
  const claimed = new Set<number>([
    MOROCCO_PDF_NUMBERS.md1,
    MOROCCO_PDF_NUMBERS.md2,
    MOROCCO_PDF_NUMBERS.md3,
  ])

  let cursor = 1
  const nextNum = (): number => {
    while (claimed.has(cursor)) cursor++
    const n = cursor
    cursor++
    return n
  }

  // For venue / date distribution of non-Morocco matches, walk the
  // 16 venues in order and the 6 dates for each matchday block.
  const venuePool = VENUES

  const pairingsByMatchday: Array<[number, number][]> = [
    [[1, 2], [3, 4]], // MD1
    [[1, 3], [4, 2]], // MD2
    [[1, 4], [2, 3]], // MD3
  ]

  const DATE_BLOCKS = [MD1_DATES, MD2_DATES, MD3_DATES]

  // Pre-build the Morocco override lookup keyed on matchday index
  const moroccoByMd: Record<number, typeof MOROCCO_FIXTURES[number]> = {
    0: MOROCCO_FIXTURES[0], // match 7 BRA v MAR
    1: MOROCCO_FIXTURES[1], // match 30 SCO v MAR
    2: MOROCCO_FIXTURES[2], // match 50 MAR v HAI
  }
  const moroccoMdNumbers = [
    MOROCCO_PDF_NUMBERS.md1,
    MOROCCO_PDF_NUMBERS.md2,
    MOROCCO_PDF_NUMBERS.md3,
  ]

  for (let mdIdx = 0; mdIdx < 3; mdIdx++) {
    const pairings = pairingsByMatchday[mdIdx]
    const dates = DATE_BLOCKS[mdIdx]

    // For each group A..L add its two MD matches.
    GROUP_LETTERS.forEach((letter, groupIdx) => {
      const group = GROUPS.find(g => g.letter === letter)
      if (!group) return
      const teamBySeed = (seed: 1 | 2 | 3 | 4): WC26GroupTeam =>
        group.teams.find(t => t.seed === seed)!

      pairings.forEach((pair, pairIdx) => {
        const home = teamBySeed(pair[0] as 1 | 2 | 3 | 4)
        const away = teamBySeed(pair[1] as 1 | 2 | 3 | 4)

        // Identify if this is Morocco's fixture slot for this matchday.
        const isMoroccoFixture =
          letter === 'C' &&
          (
            (mdIdx === 0 && pairIdx === 0) || // BRA v MAR
            (mdIdx === 1 && pairIdx === 1) || // SCO v MAR (pair [4,2])
            (mdIdx === 2 && pairIdx === 1)    // MAR v HAI (pair [2,3])
          )

        if (isMoroccoFixture) {
          const mo = moroccoByMd[mdIdx]
          const venue = getVenue(mo.venueKey)
          matches.push({
            matchNumber: moroccoMdNumbers[mdIdx],
            group: 'C',
            homeCode: mo.homeCode,
            awayCode: mo.awayCode,
            date: mo.dateET,
            venue: venue?.stadium ?? 'TBD',
            city: venue?.city ?? 'TBD',
          })
          return
        }

        const venue = venuePool[(groupIdx * 2 + pairIdx + mdIdx * 3) % venuePool.length]
        const date = dates[(groupIdx + pairIdx * 3) % dates.length]

        matches.push({
          matchNumber: nextNum(),
          group: letter,
          homeCode: home.code,
          awayCode: away.code,
          date,
          venue: venue.stadium,
          city: venue.city,
        })
      })
    })
  }

  // Stable sort by match number so consumers can iterate chronologically.
  return matches.sort((a, b) => a.matchNumber - b.matchNumber)
}

const GROUP_MATCHES: GroupMatch[] = buildGroupMatches()

// ─── Public API ─────────────────────────────────────────────────

export function getAllTeams(): SimTeam[] {
  return TEAMS
}

export function getTeamByCode(code: string): SimTeam | undefined {
  return TEAMS.find(t => t.code === code)
}

export function getGroupTeams(group: string): SimTeam[] {
  return TEAMS.filter(t => t.group === group)
}

export function getGroupMatches(group: string): GroupMatch[] {
  return GROUP_MATCHES.filter(m => m.group === group).sort((a, b) => a.matchNumber - b.matchNumber)
}

export function getAllGroups(): SimGroup[] {
  return GROUP_LETTERS.map(letter => ({
    letter,
    teams: getGroupTeams(letter),
    matches: getGroupMatches(letter),
  }))
}

export function getAllGroupMatches(): GroupMatch[] {
  return [...GROUP_MATCHES].sort((a, b) => a.matchNumber - b.matchNumber)
}

/**
 * Calculate group standings from match results.
 */
export function calculateStandings(
  group: SimGroup,
  results: Record<number, { home: number; away: number }>,
): GroupStandingRow[] {
  const rows = new Map<string, GroupStandingRow>()

  // Initialise every team with a zero row.
  for (const team of group.teams) {
    rows.set(team.code, {
      team,
      played: 0, won: 0, drawn: 0, lost: 0,
      gf: 0, ga: 0, gd: 0, points: 0,
    })
  }

  for (const match of group.matches) {
    const result = results[match.matchNumber]
    if (!result) continue

    const home = rows.get(match.homeCode)
    const away = rows.get(match.awayCode)
    if (!home || !away) continue

    home.played++
    away.played++
    home.gf += result.home
    home.ga += result.away
    away.gf += result.away
    away.ga += result.home

    if (result.home > result.away) {
      home.won++; home.points += 3
      away.lost++
    } else if (result.home < result.away) {
      away.won++; away.points += 3
      home.lost++
    } else {
      home.drawn++; home.points += 1
      away.drawn++; away.points += 1
    }

    home.gd = home.gf - home.ga
    away.gd = away.gf - away.ga
  }

  return Array.from(rows.values()).sort((a, b) =>
    b.points - a.points || b.gd - a.gd || b.gf - a.gf || a.team.name.localeCompare(b.team.name)
  )
}

export { GROUP_LETTERS }
