/**
 * Simulator state management — useReducer pattern for the full tournament prediction.
 */
import type { SimTeam, SimGroup, GroupStandingRow } from './groups'
import { getAllGroups, calculateStandings, GROUP_LETTERS } from './groups'
import { getKnockoutBracket, populateR32, advanceWinner, type KnockoutSlot } from './knockout'
import { rankBestThirds, type BestThirdEntry } from './bestThird'
import { simulateAllGroupMatches, simulateKnockoutMatch } from './engine'

export type SimStep = 'groups' | 'bestThird' | 'knockout'

export interface SimulatorState {
  mode: 'manual' | 'simulate'
  step: SimStep
  chaosFactor: number
  groups: SimGroup[]
  groupResults: Record<number, { home: number; away: number }>
  standings: Record<string, GroupStandingRow[]>
  bestThird: BestThirdEntry[]
  knockout: KnockoutSlot[]
  champion: SimTeam | null
  isSharedView: boolean
}

export type SimAction =
  | { type: 'SET_MODE'; mode: 'manual' | 'simulate' }
  | { type: 'SET_STEP'; step: SimStep }
  | { type: 'SET_CHAOS'; value: number }
  | { type: 'SET_GROUP_RESULT'; matchNumber: number; home: number; away: number }
  | { type: 'SIMULATE_GROUPS' }
  | { type: 'SET_KNOCKOUT_WINNER'; matchNumber: number; winner: SimTeam }
  | { type: 'SIMULATE_KNOCKOUT' }
  | { type: 'SIMULATE_ALL' }
  | { type: 'ADVANCE_TO_KNOCKOUT' }
  | { type: 'RESET' }
  | { type: 'LOAD_STATE'; state: Partial<SimulatorState> }

export function createInitialState(): SimulatorState {
  return {
    mode: 'manual',
    step: 'groups',
    chaosFactor: 30,
    groups: getAllGroups(),
    groupResults: {},
    standings: {},
    bestThird: [],
    knockout: getKnockoutBracket(),
    champion: null,
    isSharedView: false,
  }
}

function recalculateStandings(state: SimulatorState): Record<string, GroupStandingRow[]> {
  const standings: Record<string, GroupStandingRow[]> = {}
  for (const group of state.groups) {
    standings[group.letter] = calculateStandings(group, state.groupResults)
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

export function simulatorReducer(state: SimulatorState, action: SimAction): SimulatorState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.mode }

    case 'SET_STEP':
      return { ...state, step: action.step }

    case 'SET_CHAOS':
      return { ...state, chaosFactor: action.value }

    case 'SET_GROUP_RESULT': {
      const groupResults = {
        ...state.groupResults,
        [action.matchNumber]: { home: action.home, away: action.away },
      }
      const newState = { ...state, groupResults }
      newState.standings = recalculateStandings(newState)
      newState.bestThird = recalculateBestThird(newState.standings)
      return newState
    }

    case 'SIMULATE_GROUPS': {
      const groupResults = simulateAllGroupMatches(state.groups, state.chaosFactor)
      const newState = { ...state, groupResults }
      newState.standings = recalculateStandings(newState)
      newState.bestThird = recalculateBestThird(newState.standings)
      return newState
    }

    case 'ADVANCE_TO_KNOCKOUT': {
      const knockout = populateKnockoutFromStandings(state.standings, state.bestThird)
      return { ...state, knockout, step: 'knockout' }
    }

    case 'SET_KNOCKOUT_WINNER': {
      const knockout = advanceWinner(state.knockout, action.matchNumber, action.winner)
      // Check if final has a winner → set champion
      const final = knockout.find(m => m.stage === 'final')
      const champion = final?.winner ?? null
      return { ...state, knockout, champion }
    }

    case 'SIMULATE_KNOCKOUT': {
      let knockout = [...state.knockout.map(s => ({ ...s }))]

      // Simulate each stage in order
      const stages = ['r32', 'r16', 'qf', 'sf', 'bronze', 'final'] as const
      for (const stage of stages) {
        const stageMatches = knockout.filter(m => m.stage === stage)
        for (const match of stageMatches) {
          if (match.homeTeam && match.awayTeam && !match.winner) {
            const result = simulateKnockoutMatch(match.homeTeam, match.awayTeam, state.chaosFactor)
            match.homeScore = result.home
            match.awayScore = result.away
            const winner = result.home > result.away ? match.homeTeam : match.awayTeam
            match.winner = winner

            // Advance winner to next match
            if (match.feedsInto) {
              const nextMatch = knockout.find(m => m.matchNumber === match.feedsInto)
              if (nextMatch) {
                if (match.matchNumber % 2 === 1) nextMatch.homeTeam = winner
                else nextMatch.awayTeam = winner
              }
            }

            // Handle bronze (losers of SFs)
            if (match.stage === 'sf') {
              const loser = match.homeTeam.code === winner.code ? match.awayTeam : match.homeTeam
              const bronze = knockout.find(m => m.stage === 'bronze')
              if (bronze && loser) {
                if (match.matchNumber === 101) bronze.homeTeam = loser
                else bronze.awayTeam = loser
              }
            }
          }
        }
      }

      const final = knockout.find(m => m.stage === 'final')
      return { ...state, knockout, champion: final?.winner ?? null }
    }

    case 'SIMULATE_ALL': {
      // Step 1: Simulate groups
      const groupResults = simulateAllGroupMatches(state.groups, state.chaosFactor)
      let newState: SimulatorState = { ...state, groupResults }
      newState.standings = recalculateStandings(newState)
      newState.bestThird = recalculateBestThird(newState.standings)

      // Step 2: Populate knockout
      newState.knockout = populateKnockoutFromStandings(newState.standings, newState.bestThird)

      // Step 3: Simulate knockout
      const result = simulatorReducer(newState, { type: 'SIMULATE_KNOCKOUT' })
      return { ...result, step: 'knockout' }
    }

    case 'RESET':
      return createInitialState()

    case 'LOAD_STATE':
      return { ...state, ...action.state }

    default:
      return state
  }
}

// ─── URL state encoding/decoding for sharing ───

export function encodeState(state: SimulatorState): string {
  const compact = {
    g: state.groupResults,
    k: Object.fromEntries(
      state.knockout
        .filter(m => m.winner)
        .map(m => [m.matchNumber, m.winner!.code])
    ),
    c: state.chaosFactor,
  }
  return btoa(JSON.stringify(compact))
}

export function decodeState(encoded: string): Partial<SimulatorState> | null {
  try {
    const compact = JSON.parse(atob(encoded))
    return {
      groupResults: compact.g ?? {},
      chaosFactor: compact.c ?? 30,
      isSharedView: true,
    }
  } catch {
    return null
  }
}
