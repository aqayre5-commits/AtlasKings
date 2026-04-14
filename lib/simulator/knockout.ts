/**
 * FIFA World Cup 2026 — Knockout bracket structure.
 * R32 (16 matches) → R16 (8) → QF (4) → SF (2) → Bronze + Final
 *
 * Based on the official FIFA bracket from the match schedule PDF.
 */
import type { SimTeam } from './groups'
import type { StageKey } from '@/types/world-cup'

export interface KnockoutSlot {
  matchNumber: number
  stage: StageKey
  homeLabel: string    // e.g. "1A" (winner of group A) or "W73" (winner of match 73)
  awayLabel: string    // e.g. "2B" or "3CEFHI"
  homeTeam: SimTeam | null
  awayTeam: SimTeam | null
  homeScore: number | null
  awayScore: number | null
  winner: SimTeam | null
  feedsInto: number | null  // the match number this winner goes to
  date: string
  venue: string
  city: string
}

// ─── Official R32 bracket (from FIFA PDF) ───
// Format: 1X = group X winner, 2X = group X runner-up, 3XXXX = best 3rd from those groups

// ═══════════════════════════════════════════════════════════════
// V17 bracket data (FIFA Match Schedule v17, published 10 Apr 2026).
//
// Pairings, feedsInto routing and dates are taken from the
// official PDF. R16 feeders and SF/QF routing differ from the
// earlier v13 bracket I was initially using, and several R32
// pairings changed entirely — e.g. match 74 went from "1C v 3ACDL"
// to "1E v 3ABCDF", match 83 from "1B v 3EFGIJ" to "2K v 2L",
// and so on.
//
// Venue / city strings are left as my earlier approximations
// rather than re-read from the disordered PDF text dump — they
// drive visuals only, not routing. A future pass can pull
// venue-per-match from a cleaner data source.
// ═══════════════════════════════════════════════════════════════
const KNOCKOUT_BRACKET: Omit<KnockoutSlot, 'homeTeam' | 'awayTeam' | 'homeScore' | 'awayScore' | 'winner'>[] = [
  // ═══ ROUND OF 32 (matches 73-88) ═══ v17 pairings
  { matchNumber: 73, stage: 'r32', homeLabel: '2A', awayLabel: '2B', feedsInto: 90, date: '2026-06-28', venue: 'SoFi Stadium', city: 'Los Angeles' },
  { matchNumber: 74, stage: 'r32', homeLabel: '1E', awayLabel: '3ABCDF', feedsInto: 89, date: '2026-06-28', venue: 'Estadio BBVA', city: 'Monterrey' },
  { matchNumber: 75, stage: 'r32', homeLabel: '1F', awayLabel: '2C', feedsInto: 90, date: '2026-06-28', venue: 'Estadio BBVA', city: 'Monterrey' },
  { matchNumber: 76, stage: 'r32', homeLabel: '1C', awayLabel: '2F', feedsInto: 91, date: '2026-06-28', venue: 'SoFi Stadium', city: 'Los Angeles' },
  { matchNumber: 77, stage: 'r32', homeLabel: '1I', awayLabel: '3CDFGH', feedsInto: 89, date: '2026-06-29', venue: 'NRG Stadium', city: 'Houston' },
  { matchNumber: 78, stage: 'r32', homeLabel: '2E', awayLabel: '2I', feedsInto: 91, date: '2026-06-29', venue: 'AT&T Stadium', city: 'Dallas' },
  { matchNumber: 79, stage: 'r32', homeLabel: '1A', awayLabel: '3CEFHI', feedsInto: 92, date: '2026-06-29', venue: 'Estadio Azteca', city: 'Mexico City' },
  { matchNumber: 80, stage: 'r32', homeLabel: '1L', awayLabel: '3EHIJK', feedsInto: 92, date: '2026-06-29', venue: 'Estadio Azteca', city: 'Mexico City' },
  { matchNumber: 81, stage: 'r32', homeLabel: '1D', awayLabel: '3BEFIJ', feedsInto: 94, date: '2026-06-30', venue: 'AT&T Stadium', city: 'Dallas' },
  { matchNumber: 82, stage: 'r32', homeLabel: '1G', awayLabel: '3AEHIJ', feedsInto: 94, date: '2026-06-30', venue: 'GEHA Field', city: 'Kansas City' },
  { matchNumber: 83, stage: 'r32', homeLabel: '2K', awayLabel: '2L', feedsInto: 93, date: '2026-06-30', venue: 'Lumen Field', city: 'Seattle' },
  { matchNumber: 84, stage: 'r32', homeLabel: '1H', awayLabel: '2J', feedsInto: 93, date: '2026-06-30', venue: 'AT&T Stadium', city: 'Dallas' },
  { matchNumber: 85, stage: 'r32', homeLabel: '1B', awayLabel: '3EFGIJ', feedsInto: 96, date: '2026-07-01', venue: 'AT&T Stadium', city: 'Dallas' },
  { matchNumber: 86, stage: 'r32', homeLabel: '1J', awayLabel: '2H', feedsInto: 95, date: '2026-07-01', venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { matchNumber: 87, stage: 'r32', homeLabel: '1K', awayLabel: '3DEIJL', feedsInto: 96, date: '2026-07-01', venue: 'GEHA Field', city: 'Kansas City' },
  { matchNumber: 88, stage: 'r32', homeLabel: '2D', awayLabel: '2G', feedsInto: 95, date: '2026-07-01', venue: 'Hard Rock Stadium', city: 'Miami' },

  // ═══ ROUND OF 16 (matches 89-96) ═══ v17 routing
  // Per FIFA bracket image:
  //   Left half:  89 (W74+W77) → QF 97
  //               90 (W73+W75) → QF 97
  //               93 (W83+W84) → QF 98   ← feeds 98 NOT 99
  //               94 (W81+W82) → QF 98   ← feeds 98 NOT 99
  //   Right half: 91 (W76+W78) → QF 99   ← feeds 99 NOT 98
  //               92 (W79+W80) → QF 99   ← feeds 99 NOT 98
  //               95 (W86+W88) → QF 100
  //               96 (W85+W87) → QF 100
  { matchNumber: 89, stage: 'r16', homeLabel: 'W74', awayLabel: 'W77', feedsInto: 97, date: '2026-07-04', venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { matchNumber: 90, stage: 'r16', homeLabel: 'W73', awayLabel: 'W75', feedsInto: 97, date: '2026-07-04', venue: 'Hard Rock Stadium', city: 'Miami' },
  { matchNumber: 91, stage: 'r16', homeLabel: 'W76', awayLabel: 'W78', feedsInto: 99, date: '2026-07-05', venue: 'Hard Rock Stadium', city: 'Miami' },
  { matchNumber: 92, stage: 'r16', homeLabel: 'W79', awayLabel: 'W80', feedsInto: 99, date: '2026-07-05', venue: 'Estadio Azteca', city: 'Mexico City' },
  { matchNumber: 93, stage: 'r16', homeLabel: 'W83', awayLabel: 'W84', feedsInto: 98, date: '2026-07-06', venue: 'AT&T Stadium', city: 'Dallas' },
  { matchNumber: 94, stage: 'r16', homeLabel: 'W81', awayLabel: 'W82', feedsInto: 98, date: '2026-07-06', venue: 'Arrowhead Stadium', city: 'Kansas City' },
  { matchNumber: 95, stage: 'r16', homeLabel: 'W86', awayLabel: 'W88', feedsInto: 100, date: '2026-07-07', venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { matchNumber: 96, stage: 'r16', homeLabel: 'W85', awayLabel: 'W87', feedsInto: 100, date: '2026-07-07', venue: 'AT&T Stadium', city: 'Dallas' },

  // ═══ QUARTER-FINALS (matches 97-100) ═══ v17 routing
  // Per FIFA bracket image: QF 97 = W89+W90, QF 98 = W93+W94
  // (NOT W91+W92). The left half's bottom QF (98) takes the
  // winners of R16 93 and 94, not 91 and 92. QF 99 on the right
  // half takes W91+W92.
  { matchNumber: 97, stage: 'qf', homeLabel: 'W89', awayLabel: 'W90', feedsInto: 101, date: '2026-07-09', venue: 'BC Place', city: 'Vancouver' },
  { matchNumber: 98, stage: 'qf', homeLabel: 'W93', awayLabel: 'W94', feedsInto: 101, date: '2026-07-10', venue: 'SoFi Stadium', city: 'Los Angeles' },
  { matchNumber: 99, stage: 'qf', homeLabel: 'W91', awayLabel: 'W92', feedsInto: 102, date: '2026-07-11', venue: 'AT&T Stadium', city: 'Dallas' },
  { matchNumber: 100, stage: 'qf', homeLabel: 'W95', awayLabel: 'W96', feedsInto: 102, date: '2026-07-11', venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },

  // ═══ SEMI-FINALS (matches 101-102) ═══
  { matchNumber: 101, stage: 'sf', homeLabel: 'W97', awayLabel: 'W98', feedsInto: 104, date: '2026-07-14', venue: 'AT&T Stadium', city: 'Dallas' },
  { matchNumber: 102, stage: 'sf', homeLabel: 'W99', awayLabel: 'W100', feedsInto: 104, date: '2026-07-15', venue: 'MetLife Stadium', city: 'New York/New Jersey' },

  // ═══ BRONZE FINAL (match 103) ═══
  { matchNumber: 103, stage: 'bronze', homeLabel: 'L101', awayLabel: 'L102', feedsInto: null, date: '2026-07-18', venue: 'Hard Rock Stadium', city: 'Miami' },

  // ═══ FINAL (match 104) ═══
  { matchNumber: 104, stage: 'final', homeLabel: 'W101', awayLabel: 'W102', feedsInto: null, date: '2026-07-19', venue: 'MetLife Stadium', city: 'New York/New Jersey' },
]

// ─── Feed-slot map ──────────────────────────────────────────────
//
// For each non-final match, which slot ('home' or 'away') does
// its winner fill in the `feedsInto` target? Computed once from
// the static KNOCKOUT_BRACKET structure using the rule "sort
// feeders by matchNumber ascending; first → home, second → away".
//
// This replaces the old matchNumber-parity assignment which
// collided under v17 routing (e.g. R32 73 and 75 both feed R16
// 90, both are odd, so parity logic wrote both to the home slot
// and overwrote the first). The sort-based rule produces a
// clean 1:1 assignment for every (parent, feeder) pair.
const FEEDS_SLOT: Record<number, 'home' | 'away'> = (() => {
  const map: Record<number, 'home' | 'away'> = {}
  for (const match of KNOCKOUT_BRACKET) {
    if (!match.feedsInto) continue
    const siblings = KNOCKOUT_BRACKET
      .filter(m => m.feedsInto === match.feedsInto)
      .sort((a, b) => a.matchNumber - b.matchNumber)
    const idx = siblings.findIndex(s => s.matchNumber === match.matchNumber)
    map[match.matchNumber] = idx === 0 ? 'home' : 'away'
  }
  return map
})()

/**
 * Which slot of the next-round match does this feeder fill?
 * Defaults to 'home' for unknown match numbers so the bracket
 * never silently drops a winner.
 */
export function getFeedsSlot(matchNumber: number): 'home' | 'away' {
  return FEEDS_SLOT[matchNumber] ?? 'home'
}

// ─── Public API ───

/**
 * Get the full knockout bracket with empty team slots.
 */
export function getKnockoutBracket(): KnockoutSlot[] {
  return KNOCKOUT_BRACKET.map(slot => ({
    ...slot,
    homeTeam: null,
    awayTeam: null,
    homeScore: null,
    awayScore: null,
    winner: null,
  }))
}

/**
 * Get matches for a specific stage.
 */
export function getMatchesByStage(stage: StageKey): KnockoutSlot[] {
  return getKnockoutBracket().filter(m => m.stage === stage)
}

/**
 * Populate R32 bracket with qualified teams from group standings.
 * Returns updated bracket with teams filled in.
 */
export function populateR32(
  bracket: KnockoutSlot[],
  standings: Record<string, { team: SimTeam }[]>,
  qualifyingThirds: { team: SimTeam; group: string }[],
): KnockoutSlot[] {
  const updated = bracket.map(slot => ({ ...slot }))

  // Pre-compute a valid 3rd-place assignment. The R32 labels have
  // heavily overlapping eligible-group sets (e.g. 3CEFHI and
  // 3EHIJK) so greedy first-fit fails — we need a proper matching.
  const thirdAssignment = solveThirdPlaceAssignment(updated, qualifyingThirds)

  for (const slot of updated) {
    if (slot.stage !== 'r32') continue

    slot.homeTeam = resolveLabel(slot.homeLabel, standings, qualifyingThirds, thirdAssignment, slot.matchNumber, 'home')
    slot.awayTeam = resolveLabel(slot.awayLabel, standings, qualifyingThirds, thirdAssignment, slot.matchNumber, 'away')
  }

  return updated
}

/**
 * Solve the best-third-place assignment as a bipartite matching
 * problem via backtracking. Each R32 slot with a "3XXXX" label
 * must be assigned exactly one qualifying 3rd-place group, and
 * each qualifying group can only be used once.
 *
 * Returns a Map<matchNumber, group> where `group` is the letter
 * of the 3rd-place team assigned to that match slot.
 */
function solveThirdPlaceAssignment(
  bracket: KnockoutSlot[],
  qualifyingThirds: { team: SimTeam; group: string }[],
): Map<string, string> {
  // Collect all R32 slots that need a 3rd-place team.
  // Key = "matchNumber:home" or "matchNumber:away", value = eligible groups
  const slots: { key: string; eligible: string[] }[] = []
  for (const slot of bracket) {
    if (slot.stage !== 'r32') continue
    for (const side of ['home', 'away'] as const) {
      const label = side === 'home' ? slot.homeLabel : slot.awayLabel
      const m = label.match(/^3([A-L]+)$/)
      if (m) {
        const eligible = m[1].split('').filter(g =>
          qualifyingThirds.some(t => t.group === g),
        )
        slots.push({ key: `${slot.matchNumber}:${side}`, eligible })
      }
    }
  }

  if (slots.length === 0) return new Map()

  // Sort by most constrained first (fewest eligible) for faster solving
  slots.sort((a, b) => a.eligible.length - b.eligible.length)

  const availableGroups = new Set(qualifyingThirds.map(t => t.group))
  const assignment = new Map<string, string>()

  function backtrack(idx: number): boolean {
    if (idx === slots.length) return true
    const { key, eligible } = slots[idx]
    for (const group of eligible) {
      if (!availableGroups.has(group)) continue
      availableGroups.delete(group)
      assignment.set(key, group)
      if (backtrack(idx + 1)) return true
      availableGroups.add(group)
      assignment.delete(key)
    }
    return false
  }

  backtrack(0)
  return assignment
}

/**
 * Advance a winner to the next round.
 */
export function advanceWinner(
  bracket: KnockoutSlot[],
  matchNumber: number,
  winner: SimTeam,
): KnockoutSlot[] {
  const updated = bracket.map(slot => ({ ...slot }))

  // Find the current match and set winner
  const match = updated.find(m => m.matchNumber === matchNumber)
  if (!match) return updated
  match.winner = winner

  // Find the next match this winner feeds into and route into the
  // correct slot via the precomputed FEEDS_SLOT map (see above).
  if (match.feedsInto) {
    const nextMatch = updated.find(m => m.matchNumber === match.feedsInto)
    if (nextMatch) {
      if (getFeedsSlot(matchNumber) === 'home') nextMatch.homeTeam = winner
      else nextMatch.awayTeam = winner
    }
  }

  // Handle bronze final (losers of SFs)
  if (match.stage === 'sf') {
    const loser = match.homeTeam?.code === winner.code ? match.awayTeam : match.homeTeam
    if (loser) {
      const bronze = updated.find(m => m.stage === 'bronze')
      if (bronze) {
        if (matchNumber === 101) bronze.homeTeam = loser
        else if (matchNumber === 102) bronze.awayTeam = loser
      }
    }
  }

  return updated
}

// ─── Helpers ───

function resolveLabel(
  label: string,
  standings: Record<string, { team: SimTeam }[]>,
  qualifyingThirds: { team: SimTeam; group: string }[],
  thirdAssignment: Map<string, string>,
  matchNumber?: number,
  side?: 'home' | 'away',
): SimTeam | null {
  // "1A" = winner of group A
  const winnerMatch = label.match(/^1([A-L])$/)
  if (winnerMatch) {
    const group = winnerMatch[1]
    return standings[group]?.[0]?.team ?? null
  }

  // "2A" = runner-up of group A
  const runnerUpMatch = label.match(/^2([A-L])$/)
  if (runnerUpMatch) {
    const group = runnerUpMatch[1]
    return standings[group]?.[1]?.team ?? null
  }

  // "3CEFHI" = best 3rd from one of those groups.
  // Use the pre-computed assignment from backtracking solver.
  const thirdMatch = label.match(/^3([A-L]+)$/)
  if (thirdMatch && matchNumber != null && side) {
    const assignedGroup = thirdAssignment.get(`${matchNumber}:${side}`)
    if (assignedGroup) {
      const entry = qualifyingThirds.find(t => t.group === assignedGroup)
      return entry?.team ?? null
    }
    return null
  }

  // "W73" = winner of match 73 (handled by advanceWinner, not here)
  // "L101" = loser of match 101 (handled by advanceWinner)
  return null
}

export const STAGE_ORDER: StageKey[] = ['r32', 'r16', 'qf', 'sf', 'bronze', 'final']

export const STAGE_LABELS: Record<StageKey, string> = {
  group: 'Group Stage',
  r32: 'Round of 32',
  r16: 'Round of 16',
  qf: 'Quarter-Finals',
  sf: 'Semi-Finals',
  bronze: 'Bronze Final',
  final: 'Final',
}
