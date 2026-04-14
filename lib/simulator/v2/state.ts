/**
 * Predictor v2 reducer.
 *
 * Backward-compatible with the v1 reducer at the action level — every
 * v1 SimAction type also exists here with identical semantics — so
 * the existing `<GroupStagePanel>`, `<BestThirdPanel>`, etc. can
 * dispatch into v2 without changes. v2 layers on:
 *
 *   - proper FIFA tiebreaker ladder via applyTiebreakers()
 *   - match locking for Monte Carlo
 *   - undo/redo snapshots
 *   - Monte Carlo status + result slice
 *   - elo-backed simulate actions using lib/simulator/strength.ts
 *
 * This file is pure; the worker and the React shell import the
 * helpers they need.
 */

import {
  getAllGroups,
  getAllGroupMatches,
  GROUP_LETTERS,
  type SimTeam,
  type GroupMatch,
  type GroupStandingRow,
} from '../groups'
import {
  getKnockoutBracket,
  populateR32,
  advanceWinner,
  getFeedsSlot,
  type KnockoutSlot,
} from '../knockout'
import { rankBestThirds, type BestThirdEntry } from '../bestThird'
import { applyTiebreakers } from '../tiebreakers'
import {
  simulateGroupMatch,
  simulateKnockoutMatch,
  type StrengthOptions,
} from '../strength'
import type {
  SimulatorStateV2,
  SimActionV2,
  PastSnapshot,
  MonteCarloResults,
  SimStepV2,
} from './types'

// ─── Initial state ──────────────────────────────────────────────

export function createInitialStateV2(): SimulatorStateV2 {
  const groups = getAllGroups()
  // Knockout bracket starts empty — every R32 slot shows its
  // placeholder label ("1A", "2B", "3CEFHI", etc.) until the user
  // has either entered real group scores or accepted a Monte Carlo
  // groups preview. This enforces the "you can only simulate/manual
  // knockout if you have already done group results" requirement
  // from the product spec.
  return {
    mode: 'manual',
    step: 'groups',
    chaosFactor: 30,
    strengthModel: 'historical',
    lockedMatches: [],
    groups,
    groupResults: {},
    standings: {},
    bestThird: [],
    knockout: getKnockoutBracket(),
    champion: null,
    montecarlo: null,
    mcStatus: 'idle',
    mcProgress: 0,
    groupsAdvanceOdds: null,
    undoStack: [],
    redoStack: [],
    slug: null,
    isSharedView: false,
  }
}

// ─── Helpers ────────────────────────────────────────────────────

const MAX_HISTORY = 20

function snapshot(state: SimulatorStateV2): PastSnapshot {
  const knockoutWinners: Record<number, string> = {}
  for (const slot of state.knockout) {
    if (slot.winner) knockoutWinners[slot.matchNumber] = slot.winner.code
  }
  return {
    groupResults: { ...state.groupResults },
    knockoutWinners,
    step: state.step,
  }
}

function pushHistory(state: SimulatorStateV2): SimulatorStateV2 {
  const next: SimulatorStateV2 = {
    ...state,
    undoStack: [...state.undoStack, snapshot(state)].slice(-MAX_HISTORY),
    redoStack: [],
  }
  return next
}

/**
 * Run the full FIFA tiebreaker ladder for every group and return the
 * standings map keyed on group letter. Also wraps the rows in the
 * GroupStandingRow shape the legacy <GroupTable> consumes.
 */
function recalculateStandings(state: SimulatorStateV2): Record<string, GroupStandingRow[]> {
  const standings: Record<string, GroupStandingRow[]> = {}
  for (const group of state.groups) {
    const ranked = applyTiebreakers(group.teams, group.matches, state.groupResults)
    standings[group.letter] = ranked.map<GroupStandingRow>(r => ({
      team: r.team,
      played: r.played,
      won: r.won,
      drawn: r.drawn,
      lost: r.lost,
      gf: r.gf,
      ga: r.ga,
      gd: r.gd,
      points: r.points,
    }))
  }
  return standings
}

function recalculateBestThird(standings: Record<string, GroupStandingRow[]>): BestThirdEntry[] {
  return rankBestThirds(standings)
}

function populateKnockoutFromStandings(
  standings: Record<string, GroupStandingRow[]>,
  bestThird: BestThirdEntry[],
): KnockoutSlot[] {
  const bracket = getKnockoutBracket()
  const qualifyingThirds = bestThird.filter(t => t.advances)
  return populateR32(bracket, standings, qualifyingThirds)
}

function strengthOpts(state: SimulatorStateV2): StrengthOptions {
  return {
    chaos: state.chaosFactor,
    homeAdvantage: true,
    hostNationBonus: true,
    model: state.strengthModel,
  }
}

/**
 * Simulate all group matches respecting locked entries. Any match
 * number present in `lockedMatches` with an existing result is left
 * untouched — everything else is rerolled.
 */
function simulateGroupsRespectingLocks(state: SimulatorStateV2): Record<number, { home: number; away: number }> {
  const locked = new Set(state.lockedMatches)
  const next: Record<number, { home: number; away: number }> = { ...state.groupResults }
  for (const group of state.groups) {
    for (const match of group.matches) {
      if (locked.has(match.matchNumber) && next[match.matchNumber]) continue
      const home = group.teams.find(t => t.code === match.homeCode)
      const away = group.teams.find(t => t.code === match.awayCode)
      if (!home || !away) continue
      const res = simulateGroupMatch(home, away, strengthOpts(state))
      next[match.matchNumber] = { home: res.home, away: res.away }
    }
  }
  return next
}

/**
 * Advance a knockout match's result and its downstream slot. Mirrors
 * the v1 behaviour (odd-numbered source matches fill the downstream
 * home slot, even fill the away slot).
 */
function commitKnockoutResult(
  knockout: KnockoutSlot[],
  match: KnockoutSlot,
  winner: SimTeam,
  homeScore: number,
  awayScore: number,
): void {
  match.homeScore = homeScore
  match.awayScore = awayScore
  match.winner = winner

  if (match.feedsInto) {
    const next = knockout.find(m => m.matchNumber === match.feedsInto)
    if (next) {
      // FEEDS_SLOT replaces the old matchNumber-parity routing
      // which collided under v17 (e.g. R32 73/75 both odd → both
      // tried to fill home of R16 90). See knockout.ts.
      if (getFeedsSlot(match.matchNumber) === 'home') next.homeTeam = winner
      else next.awayTeam = winner
    }
  }

  if (match.stage === 'sf') {
    const loser = match.homeTeam?.code === winner.code ? match.awayTeam : match.homeTeam
    const bronze = knockout.find(m => m.stage === 'bronze')
    if (bronze && loser) {
      if (match.matchNumber === 101) bronze.homeTeam = loser
      else if (match.matchNumber === 102) bronze.awayTeam = loser
    }
  }
}

/**
 * Simulate every unresolved knockout match in stage order.
 */
function simulateKnockoutCascade(state: SimulatorStateV2): KnockoutSlot[] {
  const knockout = state.knockout.map(s => ({ ...s }))
  const stages = ['r32', 'r16', 'qf', 'sf', 'bronze', 'final'] as const
  for (const stage of stages) {
    for (const match of knockout.filter(m => m.stage === stage)) {
      if (!match.homeTeam || !match.awayTeam || match.winner) continue
      const result = simulateKnockoutMatch(match.homeTeam, match.awayTeam, strengthOpts(state))
      const winner =
        result.penWinner === 'home'
          ? match.homeTeam
          : result.penWinner === 'away'
            ? match.awayTeam
            : result.home > result.away
              ? match.homeTeam
              : match.awayTeam
      commitKnockoutResult(knockout, match, winner, result.home, result.away)
    }
  }
  return knockout
}

// ─── Reducer ────────────────────────────────────────────────────

export function simulatorReducerV2(
  state: SimulatorStateV2,
  action: SimActionV2,
): SimulatorStateV2 {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.mode }

    case 'SET_STEP':
      return { ...state, step: action.step }

    case 'SET_CHAOS':
      return { ...state, chaosFactor: action.value }

    case 'SET_STRENGTH_MODEL':
      return { ...state, strengthModel: action.model }

    case 'SET_GROUP_RESULT': {
      const history = pushHistory(state)
      const groupResults = {
        ...history.groupResults,
        [action.matchNumber]: { home: action.home, away: action.away },
      }
      const next: SimulatorStateV2 = { ...history, groupResults }
      next.standings = recalculateStandings(next)
      next.bestThird = recalculateBestThird(next.standings)
      return next
    }

    case 'SIMULATE_GROUPS': {
      const history = pushHistory(state)
      const groupResults = simulateGroupsRespectingLocks(history)
      const next: SimulatorStateV2 = { ...history, groupResults }
      next.standings = recalculateStandings(next)
      next.bestThird = recalculateBestThird(next.standings)
      return next
    }

    case 'ADVANCE_TO_KNOCKOUT': {
      const history = pushHistory(state)
      const knockout = populateKnockoutFromStandings(history.standings, history.bestThird)
      return { ...history, knockout, step: 'knockout' }
    }

    case 'SET_KNOCKOUT_WINNER': {
      const history = pushHistory(state)
      const knockout = advanceWinner(history.knockout, action.matchNumber, action.winner)
      const final = knockout.find(m => m.stage === 'final')
      return { ...history, knockout, champion: final?.winner ?? null }
    }

    case 'SIMULATE_KNOCKOUT': {
      const history = pushHistory(state)
      const knockout = simulateKnockoutCascade(history)
      const final = knockout.find(m => m.stage === 'final')
      return { ...history, knockout, champion: final?.winner ?? null }
    }

    case 'SIMULATE_ALL': {
      const history = pushHistory(state)
      const groupResults = simulateGroupsRespectingLocks(history)
      let next: SimulatorStateV2 = { ...history, groupResults }
      next.standings = recalculateStandings(next)
      next.bestThird = recalculateBestThird(next.standings)
      next.knockout = populateKnockoutFromStandings(next.standings, next.bestThird)
      next.knockout = simulateKnockoutCascade(next)
      const final = next.knockout.find(m => m.stage === 'final')
      return { ...next, champion: final?.winner ?? null, step: 'knockout' }
    }

    case 'LOCK_MATCH': {
      if (state.lockedMatches.includes(action.matchNumber)) return state
      return { ...state, lockedMatches: [...state.lockedMatches, action.matchNumber] }
    }

    case 'UNLOCK_MATCH':
      return {
        ...state,
        lockedMatches: state.lockedMatches.filter(n => n !== action.matchNumber),
      }

    case 'CLEAR_LOCKS':
      return { ...state, lockedMatches: [] }

    case 'MC_START':
      return { ...state, mcStatus: 'running', mcProgress: 0 }

    case 'MC_PROGRESS':
      return { ...state, mcProgress: Math.max(0, Math.min(100, action.progress)) }

    case 'MC_DONE':
      return {
        ...state,
        mcStatus: 'done',
        mcProgress: 100,
        montecarlo: action.results,
      }

    case 'MC_ERROR':
      return { ...state, mcStatus: 'error' }

    case 'CLEAR_MC':
      return {
        ...state,
        montecarlo: null,
        mcStatus: 'idle',
        mcProgress: 0,
        groupsAdvanceOdds: null,
      }

    // One-shot groups Monte Carlo: commits the sampled groupResults
    // directly into state, rebuilds standings / best-3rd / R32.
    // No preview/apply two-step — the run IS the commit.
    case 'MC_APPLY_GROUPS_SAMPLE': {
      const history = pushHistory(state)
      const next: SimulatorStateV2 = {
        ...history,
        groupResults: { ...action.sample.groupResults },
        mcStatus: 'idle',
        mcProgress: 0,
        // Ensemble reach-R32 probabilities get persisted so the
        // groups panel can show an "ADV%" column alongside the
        // standings after a run.
        groupsAdvanceOdds: action.reachR32,
      }
      next.standings = recalculateStandings(next)
      next.bestThird = recalculateBestThird(next.standings)
      next.knockout = populateKnockoutFromStandings(next.standings, next.bestThird)
      next.champion = null
      return next
    }

    // One-shot knockout Monte Carlo: replays the sample's winner
    // map through advanceWinner() so the R16 → Final cascade
    // populates correctly from the committed R32 slots.
    case 'MC_APPLY_KNOCKOUT_SAMPLE': {
      const history = pushHistory(state)
      let knockout = history.knockout.map(s => ({ ...s }))
      const sortedNumbers = Object.keys(action.sample.winners)
        .map(Number)
        .sort((a, b) => a - b)
      for (const matchNumber of sortedNumbers) {
        const match = knockout.find(m => m.matchNumber === matchNumber)
        if (!match) continue
        const winnerCode = action.sample.winners[matchNumber]
        const winner =
          match.homeTeam?.code === winnerCode
            ? match.homeTeam
            : match.awayTeam?.code === winnerCode
              ? match.awayTeam
              : null
        if (!winner) continue
        const scores = action.sample.matchScores[matchNumber]
        if (scores) {
          match.homeScore = scores.home
          match.awayScore = scores.away
        }
        knockout = advanceWinner(knockout, matchNumber, winner)
      }
      const final = knockout.find(m => m.stage === 'final')
      return {
        ...history,
        knockout,
        champion: final?.winner ?? null,
        mcStatus: 'idle',
        mcProgress: 0,
      }
    }

    case 'UNDO': {
      const last = state.undoStack[state.undoStack.length - 1]
      if (!last) return state
      const rehydrated = rehydrateFromSnapshot(state, last)
      return {
        ...rehydrated,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [...state.redoStack, snapshot(state)].slice(-MAX_HISTORY),
      }
    }

    case 'REDO': {
      const next = state.redoStack[state.redoStack.length - 1]
      if (!next) return state
      const rehydrated = rehydrateFromSnapshot(state, next)
      return {
        ...rehydrated,
        undoStack: [...state.undoStack, snapshot(state)].slice(-MAX_HISTORY),
        redoStack: state.redoStack.slice(0, -1),
      }
    }

    case 'RESET':
      return createInitialStateV2()

    case 'LOAD_STATE':
      return { ...state, ...action.state }

    case 'SET_SLUG':
      return { ...state, slug: action.slug }

    default:
      return state
  }
}

/**
 * Rebuild standings, best-third and knockout from a snapshot's
 * group results + knockout winners. Used by UNDO / REDO.
 */
function rehydrateFromSnapshot(state: SimulatorStateV2, snap: PastSnapshot): SimulatorStateV2 {
  const groupResults = { ...snap.groupResults }
  const next: SimulatorStateV2 = { ...state, groupResults, step: snap.step }
  next.standings = recalculateStandings(next)
  next.bestThird = recalculateBestThird(next.standings)

  // Rebuild knockout from standings, then replay winners.
  let knockout = populateKnockoutFromStandings(next.standings, next.bestThird)
  const winnerCodes = snap.knockoutWinners
  // Winners must be applied in match-number order so downstream slots
  // are populated before their dependants resolve.
  const sortedMatchNumbers = Object.keys(winnerCodes)
    .map(Number)
    .sort((a, b) => a - b)
  for (const matchNumber of sortedMatchNumbers) {
    const winnerCode = winnerCodes[matchNumber]
    const match = knockout.find(m => m.matchNumber === matchNumber)
    if (!match) continue
    const winner =
      match.homeTeam?.code === winnerCode
        ? match.homeTeam
        : match.awayTeam?.code === winnerCode
          ? match.awayTeam
          : null
    if (winner) knockout = advanceWinner(knockout, matchNumber, winner)
  }
  next.knockout = knockout
  const final = knockout.find(m => m.stage === 'final')
  next.champion = final?.winner ?? null
  return next
}

// ─── URL encoding ──────────────────────────────────────────────

/**
 * Compact base64url encoding of the minimum state needed to rehydrate
 * a shared prediction. Used by the share modal and the /p/[slug]
 * read-only view.
 */
export function encodeStateV2(state: SimulatorStateV2): string {
  const payload = {
    v: 2,
    g: state.groupResults,
    k: Object.fromEntries(
      state.knockout.filter(m => m.winner).map(m => [m.matchNumber, m.winner!.code]),
    ),
    c: state.chaosFactor,
    s: state.strengthModel,
    l: state.lockedMatches,
  }
  return base64UrlEncode(JSON.stringify(payload))
}

export function decodeStateV2(encoded: string): Partial<SimulatorStateV2> | null {
  try {
    const json = base64UrlDecode(encoded)
    const parsed = JSON.parse(json)
    if (parsed.v !== 2) return null
    return {
      groupResults: parsed.g ?? {},
      chaosFactor: parsed.c ?? 30,
      strengthModel: parsed.s ?? 'elo',
      lockedMatches: parsed.l ?? [],
      isSharedView: true,
    }
  } catch {
    return null
  }
}

function base64UrlEncode(input: string): string {
  if (typeof btoa !== 'undefined') {
    return btoa(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  }
  // SSR fallback
  return Buffer.from(input).toString('base64url')
}

function base64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (input.length % 4)) % 4)
  if (typeof atob !== 'undefined') return atob(padded)
  return Buffer.from(padded, 'base64').toString('utf-8')
}

/**
 * Stage match-number helper — exposed so v2 consumers can identify
 * knockout slots by stage without re-reading knockout.ts internals.
 */
export { GROUP_LETTERS, getAllGroupMatches }
export type { SimStepV2, SimTeam, GroupMatch }
