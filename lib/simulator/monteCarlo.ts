/**
 * Monte Carlo ensemble engine for the WC 2026 predictor.
 *
 * Runs N full tournament simulations and aggregates per-team reach
 * probabilities + championship probabilities. Pure functions, no
 * React, no DOM — so the same code runs on the main thread for
 * quick 1k runs and inside a Web Worker for heavier 10k / 100k runs.
 *
 * Algorithmic structure:
 *
 *   for each iteration i in 1..N
 *     1. clone group results, leave locked matches intact
 *     2. simulate every un-locked group match with Poisson goals
 *     3. apply FIFA tiebreaker ladder → per-group standings
 *     4. rank best-third teams (top 8 advance)
 *     5. populate R32 using the same group-label resolver the v1
 *        knockout module already has
 *     6. walk R32 → R16 → QF → SF → bronze → final, picking winners
 *        with the strength model (ET + weighted penalties for draws)
 *     7. for every team, record the deepest stage reached
 *
 *   after all iterations
 *     - reachProbability[code][stage] = stageReached[code][stage] / N
 *     - winProbability[code]          = championCount[code]        / N
 *     - modalChampionCode             = team with highest championCount
 *     - topRivalries[stage]           = most frequent matchups by stage
 */

import {
  getAllGroups,
  type SimTeam,
  type SimGroup,
  type GroupMatch,
} from './groups'
import {
  getKnockoutBracket,
  populateR32,
  getFeedsSlot,
  type KnockoutSlot,
} from './knockout'
import { rankBestThirds } from './bestThird'
import { applyTiebreakers } from './tiebreakers'
import {
  simulateGroupMatch,
  simulateKnockoutMatch,
  type StrengthOptions,
  type StrengthModel,
} from './strength'
import type { WC26Stage } from '@/lib/data/wc2026'

export interface MonteCarloInput {
  iterations: number
  chaosFactor: number
  strengthModel: StrengthModel
  /** Match numbers whose existing results should NOT be re-rolled. */
  lockedMatches: number[]
  /** Locked group results (copied into every iteration's result map). */
  lockedGroupResults: Record<number, { home: number; away: number }>
}

export interface MonteCarloProgress {
  completed: number
  total: number
}

export interface StageReach {
  r32: number
  r16: number
  qf: number
  sf: number
  final: number
  champion: number
}

export interface MonteCarloOutput {
  iterations: number
  reachProbability: Record<string, StageReach>
  winProbability: Record<string, number>
  modalChampionCode: string | null
  topRivalries: Array<{
    stage: WC26Stage
    pair: string
    frequency: number
  }>
}

const KNOCKOUT_STAGES_ORDER = ['r32', 'r16', 'qf', 'sf', 'bronze', 'final'] as const

type RivalryStage = Exclude<WC26Stage, 'group'>

/**
 * Shared mutable counters used by both sync and async Monte Carlo
 * runners. Holding the aggregation state in a plain object means
 * `runMonteCarloChunked()` can yield to the event loop between
 * batches without losing progress.
 */
interface MCCounters {
  iterations: number
  reach: Record<string, StageReach>
  championCount: Record<string, number>
  rivalries: Record<RivalryStage, Map<string, number>>
  groups: SimGroup[]
  lockedSet: Set<number>
  strengthOpts: StrengthOptions
  lockedGroupResults: Record<number, { home: number; away: number }>
}

/**
 * Seed a fresh counter bundle with zeros for every WC 2026 team.
 * Teams that never advance still appear in the output with 0%
 * probabilities.
 */
function initCounters(input: MonteCarloInput): MCCounters {
  const groups = getAllGroups()
  const reach: Record<string, StageReach> = {}
  const championCount: Record<string, number> = {}
  for (const g of groups) {
    for (const t of g.teams) {
      reach[t.code] = { r32: 0, r16: 0, qf: 0, sf: 0, final: 0, champion: 0 }
      championCount[t.code] = 0
    }
  }
  return {
    iterations: 0,
    reach,
    championCount,
    rivalries: {
      r32: new Map(),
      r16: new Map(),
      qf: new Map(),
      sf: new Map(),
      bronze: new Map(),
      final: new Map(),
    },
    groups,
    lockedSet: new Set(input.lockedMatches),
    strengthOpts: {
      chaos: input.chaosFactor,
      homeAdvantage: true,
      hostNationBonus: true,
      model: input.strengthModel,
    },
    lockedGroupResults: input.lockedGroupResults,
  }
}

/**
 * Run exactly `batchSize` iterations into the shared counters.
 * Used as the inner loop of both the sync and chunked runners.
 */
function runBatch(counters: MCCounters, batchSize: number): void {
  for (let i = 0; i < batchSize; i++) {
    const iterReach = runSingleTournament(
      counters.groups,
      counters.lockedGroupResults,
      counters.lockedSet,
      counters.strengthOpts,
      counters.rivalries,
    )
    for (const [code, stages] of Object.entries(iterReach.teamStages)) {
      const slot = counters.reach[code]
      if (!slot) continue
      if (stages.r32) slot.r32++
      if (stages.r16) slot.r16++
      if (stages.qf) slot.qf++
      if (stages.sf) slot.sf++
      if (stages.final) slot.final++
      if (stages.champion) slot.champion++
    }
    if (iterReach.championCode) {
      counters.championCount[iterReach.championCode] =
        (counters.championCount[iterReach.championCode] ?? 0) + 1
    }
    counters.iterations++
  }
}

/**
 * Freeze the accumulated counters into the immutable output shape.
 * Called once at the end of every run.
 */
function finalize(counters: MCCounters): MonteCarloOutput {
  const iterations = Math.max(1, counters.iterations)
  const reachProbability: Record<string, StageReach> = {}
  for (const [code, c] of Object.entries(counters.reach)) {
    reachProbability[code] = {
      r32: (c.r32 / iterations) * 100,
      r16: (c.r16 / iterations) * 100,
      qf: (c.qf / iterations) * 100,
      sf: (c.sf / iterations) * 100,
      final: (c.final / iterations) * 100,
      champion: (c.champion / iterations) * 100,
    }
  }
  const winProbability: Record<string, number> = {}
  for (const [code, count] of Object.entries(counters.championCount)) {
    winProbability[code] = (count / iterations) * 100
  }
  const modalChampionCode =
    Object.entries(counters.championCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null

  const topRivalries: MonteCarloOutput['topRivalries'] = []
  for (const stage of ['r16', 'qf', 'sf', 'final'] as const) {
    const entries = Array.from(counters.rivalries[stage].entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
    for (const [pair, count] of entries) {
      topRivalries.push({
        stage,
        pair,
        frequency: (count / iterations) * 100,
      })
    }
  }

  return {
    iterations,
    reachProbability,
    winProbability,
    modalChampionCode,
    topRivalries,
  }
}

// ─── Entry points ──────────────────────────────────────────────

/**
 * Synchronous Monte Carlo runner. Blocks the calling thread for
 * the full duration — fine for small batches (≤ 1k) and for the
 * unit-test path. Anything heavier should use
 * `runMonteCarloChunked()` to keep the UI responsive.
 */
export function runMonteCarlo(
  input: MonteCarloInput,
  onProgress?: (p: MonteCarloProgress) => void,
): MonteCarloOutput {
  const total = Math.max(1, Math.min(200_000, input.iterations))
  const counters = initCounters(input)
  const progressEvery = Math.max(1, Math.floor(total / 50))

  for (let i = 0; i < total; i += progressEvery) {
    const batch = Math.min(progressEvery, total - i)
    runBatch(counters, batch)
    onProgress?.({ completed: counters.iterations, total })
  }

  return finalize(counters)
}

/**
 * Main-thread asynchronous chunked runner.
 *
 * Runs iterations in batches of `chunkSize`, yielding to the event
 * loop between each batch so the browser can repaint progress UI
 * and the main thread stays responsive to user clicks. 10k full
 * tournament simulations complete in ~2-4 s on a modern laptop
 * without a perceivable UI freeze.
 *
 * We no longer use a Web Worker. Turbopack's module worker support
 * was producing a silently-failing chunk in dev (no worker file
 * extracted, `new Worker()` rejected at runtime), which is why the
 * MC panel appeared broken. Main-thread chunking is simpler,
 * reliable, and fast enough for the iteration counts we actually
 * offer (1k / 10k / 100k).
 */
export async function runMonteCarloChunked(
  input: MonteCarloInput,
  onProgress?: (p: MonteCarloProgress) => void,
  chunkSize = 500,
): Promise<MonteCarloOutput> {
  const total = Math.max(1, Math.min(200_000, input.iterations))
  const counters = initCounters(input)

  let completed = 0
  while (completed < total) {
    const batch = Math.min(chunkSize, total - completed)
    runBatch(counters, batch)
    completed += batch
    onProgress?.({ completed, total })
    // Yield to the event loop so the progress bar can paint and
    // the user can cancel or scroll during a long run.
    await new Promise<void>(resolve => setTimeout(resolve, 0))
  }

  return finalize(counters)
}

// ─── Single tournament ─────────────────────────────────────────

interface SingleRunResult {
  teamStages: Record<string, { r32: boolean; r16: boolean; qf: boolean; sf: boolean; final: boolean; champion: boolean }>
  championCode: string | null
}

function runSingleTournament(
  groups: SimGroup[],
  lockedGroupResults: Record<number, { home: number; away: number }>,
  lockedSet: Set<number>,
  strengthOpts: StrengthOptions,
  rivalries: Record<Exclude<WC26Stage, 'group'>, Map<string, number>>,
): SingleRunResult {
  // 1–2. Simulate unlocked group matches.
  const results: Record<number, { home: number; away: number }> = { ...lockedGroupResults }
  for (const group of groups) {
    for (const match of group.matches) {
      if (lockedSet.has(match.matchNumber) && results[match.matchNumber]) continue
      const home = group.teams.find(t => t.code === match.homeCode)
      const away = group.teams.find(t => t.code === match.awayCode)
      if (!home || !away) continue
      const r = simulateGroupMatch(home, away, strengthOpts)
      results[match.matchNumber] = { home: r.home, away: r.away }
    }
  }

  // 3. Apply FIFA tiebreaker ladder per group.
  const standings: Record<string, ReturnType<typeof applyTiebreakers>> = {}
  for (const group of groups) {
    standings[group.letter] = applyTiebreakers(group.teams, group.matches, results)
  }

  // Map the ranked rows into the row shape rankBestThirds expects.
  const legacyStandings: Record<string, Array<{ team: SimTeam; points: number; gd: number; gf: number }>> = {}
  for (const [letter, rows] of Object.entries(standings)) {
    legacyStandings[letter] = rows.map(r => ({
      team: r.team,
      points: r.points,
      gd: r.gd,
      gf: r.gf,
    })) as never
  }

  // 4. Rank best-third and pick top 8.
  const bestThird = rankBestThirds(legacyStandings as never)
  const qualifyingThirds = bestThird.filter(t => t.advances)

  // 5. Populate R32.
  const bracket: KnockoutSlot[] = populateR32(getKnockoutBracket(), legacyStandings as never, qualifyingThirds)

  const teamStages: SingleRunResult['teamStages'] = {}
  const mark = (code: string, stage: keyof SingleRunResult['teamStages'][string]) => {
    if (!teamStages[code]) {
      teamStages[code] = { r32: false, r16: false, qf: false, sf: false, final: false, champion: false }
    }
    teamStages[code][stage] = true
  }

  // Every team in R32 gets credit for reaching R32.
  for (const slot of bracket) {
    if (slot.stage !== 'r32') continue
    if (slot.homeTeam) mark(slot.homeTeam.code, 'r32')
    if (slot.awayTeam) mark(slot.awayTeam.code, 'r32')
  }

  // 6. Walk the knockout bracket stage by stage.
  let championCode: string | null = null
  for (const stage of KNOCKOUT_STAGES_ORDER) {
    const stageMatches = bracket.filter(m => m.stage === stage)
    for (const match of stageMatches) {
      if (!match.homeTeam || !match.awayTeam || match.winner) continue

      // Record the matchup frequency for rivalry aggregation. We
      // track all knockout rounds except the bronze final (which is
      // a consolation game and not a "rivalry" in the usual sense).
      if (stage !== 'bronze') {
        const pair = [match.homeTeam.code, match.awayTeam.code].sort().join(' vs ')
        const bucket = rivalries[stage]
        bucket.set(pair, (bucket.get(pair) ?? 0) + 1)
      }

      const sim = simulateKnockoutMatch(match.homeTeam, match.awayTeam, strengthOpts)
      const winner =
        sim.penWinner === 'home'
          ? match.homeTeam
          : sim.penWinner === 'away'
            ? match.awayTeam
            : sim.home > sim.away
              ? match.homeTeam
              : match.awayTeam

      match.homeScore = sim.home
      match.awayScore = sim.away
      match.winner = winner

      // Advance winner to the slot it feeds. Slot is resolved
      // via the precomputed FEEDS_SLOT map in knockout.ts, not
      // via matchNumber parity (which collides under v17).
      if (match.feedsInto) {
        const next = bracket.find(m => m.matchNumber === match.feedsInto)
        if (next) {
          if (getFeedsSlot(match.matchNumber) === 'home') next.homeTeam = winner
          else next.awayTeam = winner
        }
      }

      // Bronze-final slot is fed by SF losers.
      if (stage === 'sf') {
        const loser = match.homeTeam.code === winner.code ? match.awayTeam : match.homeTeam
        const bronze = bracket.find(m => m.stage === 'bronze')
        if (bronze && loser) {
          if (match.matchNumber === 101) bronze.homeTeam = loser
          else if (match.matchNumber === 102) bronze.awayTeam = loser
        }
      }

      // Stage-reach bookkeeping: the winner reached the NEXT stage.
      const nextStage = nextStageOf(stage)
      if (nextStage) mark(winner.code, nextStage)
      if (stage === 'final') {
        mark(winner.code, 'champion')
        championCode = winner.code
      }
    }
  }

  return { teamStages, championCode }
}

function nextStageOf(
  stage: (typeof KNOCKOUT_STAGES_ORDER)[number],
): keyof SingleRunResult['teamStages'][string] | null {
  switch (stage) {
    case 'r32':
      return 'r16'
    case 'r16':
      return 'qf'
    case 'qf':
      return 'sf'
    case 'sf':
      return 'final'
    default:
      return null
  }
}

// ───────────────────────────────────────────────────────────────
// Split runners — groups-only and knockout-only with sample
// picking for the preview → apply flow.
//
// The original `runMonteCarlo*` functions simulate the full
// tournament every iteration and only return aggregated odds. The
// split runners below additionally capture a COHERENT sample
// iteration so the UI can offer a "preview → apply" action that
// writes concrete match results into state, not just stats.
// ───────────────────────────────────────────────────────────────

/**
 * A groups-only sample produced by `runMonteCarloGroupsOnly()`.
 *
 * Contains everything the reducer needs to commit a simulated
 * groups outcome to state:
 *
 *   • `groupResults` — 72 entries keyed by match number
 *   • `standingsByLetter` — tiebreakered standings per group letter
 *   • `bestThirdCodes` — 8 qualifying best-third team codes in
 *     ranking order, so the reducer can rebuild the same R32
 *     population via populateR32()
 */
export interface GroupsSample {
  groupResults: Record<number, { home: number; away: number }>
  standingsByLetter: Record<string, Array<{
    code: string
    points: number
    gd: number
    gf: number
    played: number
    won: number
    drawn: number
    lost: number
  }>>
  bestThirdCodes: string[]
}

export interface GroupsRunOutput {
  iterations: number
  /** Per-team probability of finishing top-2 or qualifying as a best-3rd. */
  reachR32: Record<string, number>
  /** The single coherent sample to offer as a preview. */
  sample: GroupsSample
}

/**
 * A knockout-only sample produced by `runMonteCarloKnockoutOnly()`.
 *
 * Shape is { matchNumber → winner code } so the reducer can replay
 * advanceWinner() for each entry in match-number order and
 * reconstruct the same final bracket.
 */
export interface KnockoutSample {
  winners: Record<number, string>
  matchScores: Record<number, { home: number; away: number }>
  championCode: string | null
  bronzeWinnerCode: string | null
}

export interface KnockoutRunOutput {
  iterations: number
  /** Per-team probability of reaching each knockout stage. */
  reach: Record<string, StageReach>
  /** Per-team championship probability. */
  winProbability: Record<string, number>
  modalChampionCode: string | null
  sample: KnockoutSample
}

/**
 * Shared option payload for the split runners. Same fields as
 * `MonteCarloInput` minus the full-tournament context — groups
 * runs don't touch the knockout slice, knockout runs don't touch
 * the groups slice.
 */
export interface SplitRunnerInput {
  iterations: number
  chaosFactor: number
  strengthModel: MonteCarloInput['strengthModel']
  lockedMatches: number[]
  lockedGroupResults: Record<number, { home: number; away: number }>
}

// ─── Groups-only runner ────────────────────────────────────────

/**
 * Run groups-only Monte Carlo. For each iteration:
 *   1. Simulate every unlocked group match
 *   2. Compute per-group standings via the FIFA tiebreaker ladder
 *   3. Rank best-3rds and mark the top 8 as advancing
 *   4. Count each team's "reaches R32" bit
 *   5. Count how often each team finishes in each of the 4
 *      positions per group (for sample picking, below)
 *
 * After the ensemble is complete, we re-run a best-of-K inner
 * loop (default 120) and pick the iteration whose FULL GROUP
 * STANDINGS most closely match the ensemble's per-position
 * frequencies. The scoring is:
 *
 *   score(sample) = Σ  positionFreq[group][pos][team] / total
 *                   g, pos ∈ 0..3
 *
 * Teams that reliably finish 1st in a group push any sample
 * where they're top up the ranking; samples where a top team
 * ends up 3rd or 4th score much lower regardless of what the
 * other groups look like. This fixes the old winner-only scorer
 * which could return samples where Spain went out at 1 point
 * just because some other group's winner happened to match.
 */
export async function runMonteCarloGroupsOnly(
  input: SplitRunnerInput,
  onProgress?: (p: MonteCarloProgress) => void,
  chunkSize = 500,
): Promise<GroupsRunOutput> {
  const total = Math.max(1, Math.min(200_000, input.iterations))
  const groups = getAllGroups()
  const lockedSet = new Set(input.lockedMatches)
  const strengthOpts: StrengthOptions = {
    chaos: input.chaosFactor,
    homeAdvantage: true,
    hostNationBonus: true,
    model: input.strengthModel,
  }

  // Aggregated R32-reach counter per team.
  const reachR32Count: Record<string, number> = {}
  for (const g of groups) {
    for (const t of g.teams) reachR32Count[t.code] = 0
  }

  // Per-position frequency tracker. For every group and every
  // finish position (0 = 1st, 1 = 2nd, 2 = 3rd, 3 = 4th), count
  // how many times each team code lands there. This is the raw
  // signal consumed by the sample picker.
  const posFreq: Record<string, Array<Record<string, number>>> = {}
  for (const g of groups) {
    posFreq[g.letter] = [{}, {}, {}, {}]
  }

  let completed = 0
  while (completed < total) {
    const batch = Math.min(chunkSize, total - completed)
    for (let i = 0; i < batch; i++) {
      const iter = runSingleGroups(groups, input.lockedGroupResults, lockedSet, strengthOpts)
      // Count R32 reach
      for (const code of iter.r32Teams) {
        reachR32Count[code] = (reachR32Count[code] ?? 0) + 1
      }
      // Count per-position frequency for every group
      for (const [letter, rows] of Object.entries(iter.standings)) {
        const bucket = posFreq[letter]
        if (!bucket) continue
        for (let pos = 0; pos < 4 && pos < rows.length; pos++) {
          const code = rows[pos].team.code
          bucket[pos][code] = (bucket[pos][code] ?? 0) + 1
        }
      }
    }
    completed += batch
    onProgress?.({ completed, total })
    await new Promise<void>(resolve => setTimeout(resolve, 0))
  }

  // Convert R32 counts to percentages.
  const reachR32: Record<string, number> = {}
  for (const [code, c] of Object.entries(reachR32Count)) {
    reachR32[code] = (c / total) * 100
  }

  // Best-of-K sample pick. Score each candidate by summing the
  // ensemble probability that THIS team lands in THIS position,
  // across every (group, position) pair in the sample. Higher =
  // the sample looks more like the typical ensemble outcome.
  //
  // 120 tries is roughly 3× the old 40 because the scoring space
  // is finer-grained and the runs are still cheap (~2 ms each).
  // The max theoretical score is `12 groups × 4 positions = 48`
  // if every position is 100% concentrated on one team; in
  // practice top samples score 25–35.
  let bestSample: GroupsSample | null = null
  let bestScore = -Infinity
  const sampleTries = 120
  for (let i = 0; i < sampleTries; i++) {
    const iter = runSingleGroups(groups, input.lockedGroupResults, lockedSet, strengthOpts)
    let score = 0
    for (const [letter, rows] of Object.entries(iter.standings)) {
      const bucket = posFreq[letter]
      if (!bucket) continue
      for (let pos = 0; pos < 4 && pos < rows.length; pos++) {
        const code = rows[pos].team.code
        const count = bucket[pos][code] ?? 0
        score += count / total
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestSample = iterToGroupsSample(iter)
    }
  }

  if (!bestSample) {
    // Safety fallback — one fresh run in the pathological case
    // where every sample attempt threw.
    const iter = runSingleGroups(groups, input.lockedGroupResults, lockedSet, strengthOpts)
    bestSample = iterToGroupsSample(iter)
  }

  return {
    iterations: total,
    reachR32,
    sample: bestSample,
  }
}

/** Per-iteration output from runSingleGroups. */
interface SingleGroupsResult {
  groupResults: Record<number, { home: number; away: number }>
  standings: Record<string, ReturnType<typeof applyTiebreakers>>
  bestThird: ReturnType<typeof rankBestThirds>
  r32Teams: string[]
}

function runSingleGroups(
  groups: SimGroup[],
  lockedGroupResults: Record<number, { home: number; away: number }>,
  lockedSet: Set<number>,
  strengthOpts: StrengthOptions,
): SingleGroupsResult {
  const results: Record<number, { home: number; away: number }> = { ...lockedGroupResults }
  for (const group of groups) {
    for (const match of group.matches) {
      if (lockedSet.has(match.matchNumber) && results[match.matchNumber]) continue
      const home = group.teams.find(t => t.code === match.homeCode)
      const away = group.teams.find(t => t.code === match.awayCode)
      if (!home || !away) continue
      const r = simulateGroupMatch(home, away, strengthOpts)
      results[match.matchNumber] = { home: r.home, away: r.away }
    }
  }

  const standings: Record<string, ReturnType<typeof applyTiebreakers>> = {}
  for (const group of groups) {
    standings[group.letter] = applyTiebreakers(group.teams, group.matches, results)
  }

  // rankBestThirds expects `GroupStandingRow[]` — we pass the ranked
  // row shape here; it only reads .team/.points/.gd/.gf so the
  // extra fields on our tiebreaker rows are harmless.
  const bestThird = rankBestThirds(standings as never)

  // R32 teams: top 2 per group + the 8 advancing best-thirds.
  const r32Teams: string[] = []
  for (const rows of Object.values(standings)) {
    if (rows[0]) r32Teams.push(rows[0].team.code)
    if (rows[1]) r32Teams.push(rows[1].team.code)
  }
  for (const entry of bestThird) {
    if (entry.advances) r32Teams.push(entry.team.code)
  }

  return { groupResults: results, standings, bestThird, r32Teams }
}

function iterToGroupsSample(iter: SingleGroupsResult): GroupsSample {
  const standingsByLetter: GroupsSample['standingsByLetter'] = {}
  for (const [letter, rows] of Object.entries(iter.standings)) {
    standingsByLetter[letter] = rows.map(r => ({
      code: r.team.code,
      points: r.points,
      gd: r.gd,
      gf: r.gf,
      played: r.played,
      won: r.won,
      drawn: r.drawn,
      lost: r.lost,
    }))
  }
  const bestThirdCodes = iter.bestThird
    .filter(e => e.advances)
    .map(e => e.team.code)
  return {
    groupResults: iter.groupResults,
    standingsByLetter,
    bestThirdCodes,
  }
}

// ─── Knockout-only runner ──────────────────────────────────────

/**
 * Run knockout-only Monte Carlo from a FIXED R32 bracket. Groups
 * must already be done — the caller supplies the populated R32
 * slots (typically via populateR32() from lib/simulator/knockout).
 *
 * Unlike the groups runner, the inputs here are already concrete:
 * the top-2 + best-3rd teams are known. Each iteration re-simulates
 * the R32 → Final cascade and records per-team stage reach + the
 * final champion.
 *
 * The sample pick uses best-of-K: we run extra iterations until
 * one produces the modal champion, and return that bracket's
 * match-by-match winners + scorelines.
 */
export async function runMonteCarloKnockoutOnly(
  input: SplitRunnerInput,
  populatedBracket: KnockoutSlot[],
  onProgress?: (p: MonteCarloProgress) => void,
  chunkSize = 500,
): Promise<KnockoutRunOutput> {
  const total = Math.max(1, Math.min(200_000, input.iterations))
  const strengthOpts: StrengthOptions = {
    chaos: input.chaosFactor,
    homeAdvantage: false, // neutral venues from R32 onward
    hostNationBonus: true,
    model: input.strengthModel,
  }

  // Initialise reach counters only for teams present in R32.
  const r32Codes = new Set<string>()
  for (const slot of populatedBracket) {
    if (slot.stage !== 'r32') continue
    if (slot.homeTeam) r32Codes.add(slot.homeTeam.code)
    if (slot.awayTeam) r32Codes.add(slot.awayTeam.code)
  }
  const reach: Record<string, StageReach> = {}
  const championCount: Record<string, number> = {}
  for (const code of r32Codes) {
    reach[code] = { r32: 0, r16: 0, qf: 0, sf: 0, final: 0, champion: 0 }
    championCount[code] = 0
  }

  // Run the ensemble.
  let completed = 0
  while (completed < total) {
    const batch = Math.min(chunkSize, total - completed)
    for (let i = 0; i < batch; i++) {
      const iter = runSingleKnockoutCascade(populatedBracket, strengthOpts)
      // Credit every R32 team for reaching R32.
      for (const code of r32Codes) {
        reach[code].r32++
      }
      // Stage reach for winners.
      for (const code of iter.reachedR16) if (reach[code]) reach[code].r16++
      for (const code of iter.reachedQF) if (reach[code]) reach[code].qf++
      for (const code of iter.reachedSF) if (reach[code]) reach[code].sf++
      for (const code of iter.reachedFinal) if (reach[code]) reach[code].final++
      if (iter.championCode) {
        reach[iter.championCode]!.champion++
        championCount[iter.championCode] =
          (championCount[iter.championCode] ?? 0) + 1
      }
    }
    completed += batch
    onProgress?.({ completed, total })
    await new Promise<void>(resolve => setTimeout(resolve, 0))
  }

  // Convert counters to percentages.
  const reachPct: Record<string, StageReach> = {}
  for (const [code, c] of Object.entries(reach)) {
    reachPct[code] = {
      r32: (c.r32 / total) * 100,
      r16: (c.r16 / total) * 100,
      qf: (c.qf / total) * 100,
      sf: (c.sf / total) * 100,
      final: (c.final / total) * 100,
      champion: (c.champion / total) * 100,
    }
  }
  const winProbability: Record<string, number> = {}
  for (const [code, count] of Object.entries(championCount)) {
    winProbability[code] = (count / total) * 100
  }
  const modalChampionCode =
    Object.entries(championCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null

  // Best-of-K sample: find a coherent cascade whose champion ==
  // the modal champion. 60 tries is plenty for even the most
  // unlikely modal pick.
  let bestSample: KnockoutSample | null = null
  for (let i = 0; i < 60; i++) {
    const iter = runSingleKnockoutCascade(populatedBracket, strengthOpts)
    if (iter.championCode === modalChampionCode) {
      bestSample = iter.sample
      break
    }
    // Keep the latest as a fallback in case no run matches.
    bestSample = iter.sample
  }

  return {
    iterations: total,
    reach: reachPct,
    winProbability,
    modalChampionCode,
    sample: bestSample!,
  }
}

interface KnockoutCascadeIter {
  reachedR16: string[]
  reachedQF: string[]
  reachedSF: string[]
  reachedFinal: string[]
  championCode: string | null
  sample: KnockoutSample
}

function runSingleKnockoutCascade(
  populatedBracket: KnockoutSlot[],
  strengthOpts: StrengthOptions,
): KnockoutCascadeIter {
  // Deep clone so each iteration is isolated from the shared input.
  const bracket: KnockoutSlot[] = populatedBracket.map(slot => ({
    ...slot,
    homeTeam: slot.homeTeam ?? null,
    awayTeam: slot.awayTeam ?? null,
    winner: null,
    homeScore: null,
    awayScore: null,
  }))

  const reachedR16: string[] = []
  const reachedQF: string[] = []
  const reachedSF: string[] = []
  const reachedFinal: string[] = []
  const winners: Record<number, string> = {}
  const matchScores: Record<number, { home: number; away: number }> = {}
  let championCode: string | null = null
  let bronzeWinnerCode: string | null = null

  for (const stage of KNOCKOUT_STAGES_ORDER) {
    const stageMatches = bracket.filter(m => m.stage === stage)
    for (const match of stageMatches) {
      if (!match.homeTeam || !match.awayTeam || match.winner) continue

      const sim = simulateKnockoutMatch(match.homeTeam, match.awayTeam, strengthOpts)
      const winner =
        sim.penWinner === 'home'
          ? match.homeTeam
          : sim.penWinner === 'away'
            ? match.awayTeam
            : sim.home > sim.away
              ? match.homeTeam
              : match.awayTeam
      match.homeScore = sim.home
      match.awayScore = sim.away
      match.winner = winner
      winners[match.matchNumber] = winner.code
      matchScores[match.matchNumber] = { home: sim.home, away: sim.away }

      // Downstream feed via the precomputed FEEDS_SLOT map.
      if (match.feedsInto) {
        const next = bracket.find(m => m.matchNumber === match.feedsInto)
        if (next) {
          if (getFeedsSlot(match.matchNumber) === 'home') next.homeTeam = winner
          else next.awayTeam = winner
        }
      }

      // Bronze-final slot is fed by SF losers.
      if (stage === 'sf') {
        const loser = match.homeTeam.code === winner.code ? match.awayTeam : match.homeTeam
        const bronze = bracket.find(m => m.stage === 'bronze')
        if (bronze && loser) {
          if (match.matchNumber === 101) bronze.homeTeam = loser
          else if (match.matchNumber === 102) bronze.awayTeam = loser
        }
      }

      // Stage-reach bookkeeping.
      const nextStage = nextStageOf(stage)
      if (nextStage === 'r16') reachedR16.push(winner.code)
      else if (nextStage === 'qf') reachedQF.push(winner.code)
      else if (nextStage === 'sf') reachedSF.push(winner.code)
      else if (nextStage === 'final') reachedFinal.push(winner.code)
      if (stage === 'final') championCode = winner.code
      if (stage === 'bronze') bronzeWinnerCode = winner.code
    }
  }

  return {
    reachedR16,
    reachedQF,
    reachedSF,
    reachedFinal,
    championCode,
    sample: { winners, matchScores, championCode, bronzeWinnerCode },
  }
}
