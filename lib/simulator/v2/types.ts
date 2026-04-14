/**
 * Predictor v2 — extended state types.
 *
 * v2 is a superset of v1 and shares action names where behaviour is
 * identical, so legacy components (e.g. <GroupStagePanel>) can dispatch
 * straight into the v2 reducer without translation.
 *
 * New state slices:
 *   - strengthModel         : which rating system drives simulations
 *   - lockedMatches         : match numbers the user wants Monte Carlo
 *                             and "Simulate" to leave alone
 *   - montecarlo            : aggregated MC results (null until a run)
 *   - mcStatus              : idle / running / done / error
 *   - undoStack / redoStack : past snapshots (bounded to 20)
 *   - slug                  : short permalink key (assigned in Phase 5)
 */

import type { SimTeam, SimGroup, GroupStandingRow, GroupMatch } from '../groups'
import type { KnockoutSlot } from '../knockout'
import type { BestThirdEntry } from '../bestThird'
import type { StrengthModel } from '../strength'
import type { WC26Stage } from '@/lib/data/wc2026'

export type SimStepV2 = 'groups' | 'bestThird' | 'knockout'

export type MCStatus = 'idle' | 'running' | 'done' | 'error'

/**
 * Aggregated Monte Carlo results. Probabilities are stored as
 * percentages 0..100 so the UI can render them without re-scaling.
 */
export interface MonteCarloResults {
  iterations: number
  runAt: string // ISO timestamp
  chaosFactor: number
  strengthModel: StrengthModel
  /** Per-team reach probabilities keyed by FIFA 3-letter code. */
  reachProbability: Record<string, ReachProbability>
  /** Per-team championship probability (0..100). */
  winProbability: Record<string, number>
  /** Most frequent champion code across all runs. */
  modalChampionCode: string | null
  /** Top knockout matchup frequencies by stage. */
  topRivalries: Array<{
    stage: WC26Stage
    pair: string // "BRA vs FRA" canonical sort
    frequency: number // 0..100
  }>
}

export interface ReachProbability {
  /** Probability the team makes it out of the group (R32). */
  r32: number
  r16: number
  qf: number
  sf: number
  final: number
  champion: number
}

/**
 * Past snapshot used by undo/redo. Stores only the minimal fields
 * needed to rehydrate a meaningful view.
 */
export interface PastSnapshot {
  groupResults: Record<number, { home: number; away: number }>
  knockoutWinners: Record<number, string> // matchNumber → winner code
  step: SimStepV2
}

export interface SimulatorStateV2 {
  // Display
  mode: 'manual' | 'simulate'
  step: SimStepV2

  // Simulation configuration
  chaosFactor: number // 0..100
  strengthModel: StrengthModel
  lockedMatches: number[] // match numbers excluded from randomisation

  // Tournament state (rebuilt from groupResults on every write)
  groups: SimGroup[]
  groupResults: Record<number, { home: number; away: number }>
  standings: Record<string, GroupStandingRow[]>
  bestThird: BestThirdEntry[]

  // Knockout
  knockout: KnockoutSlot[]
  champion: SimTeam | null

  // Monte Carlo
  montecarlo: MonteCarloResults | null
  mcStatus: MCStatus
  mcProgress: number // 0..100
  /**
   * Per-team "reach R32" probability from the most recent
   * groups-only Monte Carlo run. Populated when a groups sample
   * is applied so the groups panel can show an "ADV%" column
   * alongside the standings table. Cleared on reset / clear-MC.
   */
  groupsAdvanceOdds: Record<string, number> | null

  // History + sharing
  undoStack: PastSnapshot[]
  redoStack: PastSnapshot[]
  slug: string | null
  isSharedView: boolean
}

export type SimActionV2 =
  // v1-compatible actions (same shape as lib/simulator/state.ts)
  | { type: 'SET_MODE'; mode: 'manual' | 'simulate' }
  | { type: 'SET_STEP'; step: SimStepV2 }
  | { type: 'SET_CHAOS'; value: number }
  | { type: 'SET_GROUP_RESULT'; matchNumber: number; home: number; away: number }
  | { type: 'SIMULATE_GROUPS' }
  | { type: 'SET_KNOCKOUT_WINNER'; matchNumber: number; winner: SimTeam }
  | { type: 'SIMULATE_KNOCKOUT' }
  | { type: 'SIMULATE_ALL' }
  | { type: 'ADVANCE_TO_KNOCKOUT' }
  | { type: 'RESET' }
  | { type: 'LOAD_STATE'; state: Partial<SimulatorStateV2> }
  // v2-only actions
  | { type: 'SET_STRENGTH_MODEL'; model: StrengthModel }
  | { type: 'LOCK_MATCH'; matchNumber: number }
  | { type: 'UNLOCK_MATCH'; matchNumber: number }
  | { type: 'CLEAR_LOCKS' }
  | { type: 'MC_START' }
  | { type: 'MC_PROGRESS'; progress: number }
  | { type: 'MC_DONE'; results: MonteCarloResults }
  | { type: 'MC_ERROR' }
  | { type: 'CLEAR_MC' }
  // Direct-apply actions for the groups-only and knockout-only
  // Monte Carlo runs. No preview step — the run commits straight
  // into the reducer, which pushes a history snapshot so Undo
  // rolls back the whole simulated tournament cleanly.
  | {
      type: 'MC_APPLY_GROUPS_SAMPLE'
      sample: import('../monteCarlo').GroupsSample
      iterations: number
      /** Per-team reach-R32 probability from the same ensemble. */
      reachR32: Record<string, number>
    }
  | {
      type: 'MC_APPLY_KNOCKOUT_SAMPLE'
      sample: import('../monteCarlo').KnockoutSample
      iterations: number
    }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_SLUG'; slug: string | null }

/**
 * Helper re-exports so consumers don't need to reach into v1 types.
 */
export type { SimTeam, SimGroup, GroupStandingRow, GroupMatch, KnockoutSlot, BestThirdEntry }
