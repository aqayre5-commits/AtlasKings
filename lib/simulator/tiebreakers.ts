/**
 * FIFA World Cup group-stage tiebreaker ladder.
 *
 * Implements the official FIFA ordering used at the 2022 tournament and
 * reaffirmed for 2026 (see FIFA WC Regulations art. 32.5). The ladder
 * is applied strictly in order — we only consider a criterion when the
 * criteria above have left teams tied.
 *
 *   Overall criteria (applied first across the full group):
 *     1. Greater number of points obtained in all group matches
 *     2. Goal difference in all group matches
 *     3. Greater number of goals scored in all group matches
 *
 *   Head-to-head criteria (applied only to clusters still tied after 1–3):
 *     4. Greater number of points obtained in matches between the tied teams
 *     5. Goal difference in matches between the tied teams
 *     6. Greater number of goals scored in matches between the tied teams
 *
 *   Residual criteria:
 *     7. Fair play points (yellow / red cards) — NOT modelable from a
 *        simulator, skipped with a note so consumers can layer it in
 *        if and when card data exists.
 *     8. Drawing of lots — replaced here by a deterministic stable
 *        hash of the tied team codes so the simulator output is
 *        reproducible across reloads and share links.
 *
 * This file is pure — no React, no DOM, no side effects. It runs on
 * the main thread during reducer dispatches AND inside the Monte
 * Carlo Web Worker.
 */

import type { SimTeam, GroupMatch } from './groups'

export interface TiebreakerRow {
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

export interface MatchResult {
  home: number
  away: number
}

/**
 * Build a zero-valued standings row for every team in a group.
 */
function initRow(team: SimTeam): TiebreakerRow {
  return {
    team,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    points: 0,
  }
}

/**
 * Apply a single match result to the home and away rows.
 */
function applyMatch(
  home: TiebreakerRow,
  away: TiebreakerRow,
  result: MatchResult,
): void {
  home.played++
  away.played++
  home.gf += result.home
  home.ga += result.away
  away.gf += result.away
  away.ga += result.home

  if (result.home > result.away) {
    home.won++
    home.points += 3
    away.lost++
  } else if (result.home < result.away) {
    away.won++
    away.points += 3
    home.lost++
  } else {
    home.drawn++
    home.points += 1
    away.drawn++
    away.points += 1
  }

  home.gd = home.gf - home.ga
  away.gd = away.gf - away.ga
}

/**
 * Compute a plain standings table (no tiebreakers yet) from a set of
 * teams and played matches.
 */
export function buildRawRows(
  teams: SimTeam[],
  matches: GroupMatch[],
  results: Record<number, MatchResult>,
): TiebreakerRow[] {
  const rows = new Map<string, TiebreakerRow>()
  for (const t of teams) rows.set(t.code, initRow(t))

  for (const m of matches) {
    const r = results[m.matchNumber]
    if (!r) continue
    const home = rows.get(m.homeCode)
    const away = rows.get(m.awayCode)
    if (home && away) applyMatch(home, away, r)
  }

  return Array.from(rows.values())
}

/** Overall comparator — criteria 1–3 of the FIFA ladder. */
function overallCompare(a: TiebreakerRow, b: TiebreakerRow): number {
  if (b.points !== a.points) return b.points - a.points
  if (b.gd !== a.gd) return b.gd - a.gd
  if (b.gf !== a.gf) return b.gf - a.gf
  return 0
}

/**
 * Deterministic stable hash for "drawing of lots" fallback. Uses the
 * tied team codes so that the same tied cluster always resolves to
 * the same order across reloads and share links.
 */
function deterministicLotsSort(rows: TiebreakerRow[]): TiebreakerRow[] {
  return [...rows].sort((a, b) => {
    const ha = hashCode(a.team.code)
    const hb = hashCode(b.team.code)
    if (ha !== hb) return ha - hb
    return a.team.code.localeCompare(b.team.code)
  })
}

function hashCode(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return h
}

/**
 * Re-rank a cluster of tied teams by their head-to-head mini-league.
 *
 * Only the matches between the tied teams are considered. Points, GD
 * and goals scored are recalculated using ONLY those matches. If two
 * or more teams remain tied after the H2H mini-league we fall back to
 * the deterministic lots sort.
 */
function resolveTiedCluster(
  cluster: TiebreakerRow[],
  matches: GroupMatch[],
  results: Record<number, MatchResult>,
): TiebreakerRow[] {
  if (cluster.length < 2) return cluster

  const codes = new Set(cluster.map(r => r.team.code))
  const h2hMatches = matches.filter(m => codes.has(m.homeCode) && codes.has(m.awayCode))

  // Rebuild a mini-league from just those matches.
  const miniRows = new Map<string, TiebreakerRow>()
  for (const r of cluster) miniRows.set(r.team.code, initRow(r.team))

  for (const m of h2hMatches) {
    const r = results[m.matchNumber]
    if (!r) continue
    const home = miniRows.get(m.homeCode)
    const away = miniRows.get(m.awayCode)
    if (home && away) applyMatch(home, away, r)
  }

  // Sort the mini-league using the same overall comparator (which now
  // acts as the "head-to-head points → GD → goals" per the FIFA
  // ordering, because the rows contain only inter-cluster games).
  const sortedMini = Array.from(miniRows.values()).sort(overallCompare)

  // Map the mini-league ranking back onto the original rows. If two
  // teams remain tied in the mini-league, fall back to lots.
  const result: TiebreakerRow[] = []
  let i = 0
  while (i < sortedMini.length) {
    let j = i + 1
    while (
      j < sortedMini.length &&
      overallCompare(sortedMini[i], sortedMini[j]) === 0
    ) j++

    const stillTied = sortedMini.slice(i, j)
    if (stillTied.length === 1) {
      const row = cluster.find(r => r.team.code === stillTied[0].team.code)
      if (row) result.push(row)
    } else {
      // Deterministic lots fallback. Fair-play (criterion 7) would
      // slot in above this if card data were available.
      const fallback = deterministicLotsSort(
        stillTied
          .map(st => cluster.find(r => r.team.code === st.team.code))
          .filter((r): r is TiebreakerRow => !!r),
      )
      result.push(...fallback)
    }
    i = j
  }

  return result
}

/**
 * Main entry — return a fully-tiebreakered standings table for a
 * single group.
 *
 * Algorithm:
 *   1. Build raw rows from matches + results.
 *   2. Sort by the overall comparator (criteria 1–3).
 *   3. Walk the sorted list, finding maximal runs of rows that are
 *      still tied on points/GD/goals.
 *   4. For each tied run of size ≥ 2, re-rank its members by the
 *      head-to-head mini-league (criteria 4–6), with a deterministic
 *      lots fallback (criterion 8).
 *   5. Replace the run in place and return.
 *
 * The output is a stable ranking: given the same inputs the result is
 * identical across reloads, platforms, and Monte Carlo workers.
 */
export function applyTiebreakers(
  teams: SimTeam[],
  matches: GroupMatch[],
  results: Record<number, MatchResult>,
): TiebreakerRow[] {
  const raw = buildRawRows(teams, matches, results)
  const sorted = [...raw].sort(overallCompare)

  const out: TiebreakerRow[] = []
  let i = 0
  while (i < sorted.length) {
    let j = i + 1
    while (j < sorted.length && overallCompare(sorted[i], sorted[j]) === 0) j++

    const cluster = sorted.slice(i, j)
    if (cluster.length === 1) {
      out.push(cluster[0])
    } else {
      out.push(...resolveTiedCluster(cluster, matches, results))
    }
    i = j
  }

  return out
}
