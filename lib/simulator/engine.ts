/**
 * Simulation engine — generates match results based on FIFA rankings.
 *
 * Chaos factor: 0 = pure ranking-based, 100 = total randomness (coin flip).
 * Group stage allows draws. Knockout always produces a winner.
 */
import type { SimTeam } from './groups'

interface SimResult {
  home: number
  away: number
}

/**
 * Simulate a group stage match (draws allowed).
 */
export function simulateGroupMatch(
  home: SimTeam,
  away: SimTeam,
  chaosFactor: number = 30,
): SimResult {
  const chaos = Math.max(0, Math.min(100, chaosFactor)) / 100

  // Base probabilities from ranking difference
  const rankDiff = away.fifaRanking - home.fifaRanking // positive = home is better
  const homeAdv = 0.05 // slight home advantage in world cup context

  let homeWinProb = 0.35 + rankDiff * 0.003 + homeAdv
  let drawProb = 0.28 - Math.abs(rankDiff) * 0.001
  drawProb = Math.max(0.10, Math.min(0.35, drawProb))

  // Apply chaos factor — pulls all probabilities toward 33/33/33
  homeWinProb = homeWinProb * (1 - chaos) + 0.33 * chaos
  drawProb = drawProb * (1 - chaos) + 0.33 * chaos

  homeWinProb = Math.max(0.05, Math.min(0.85, homeWinProb))

  const awayWinProb = Math.max(0.05, 1 - homeWinProb - drawProb)

  // Roll
  const roll = Math.random()
  if (roll < homeWinProb) {
    return generateScore('home')
  } else if (roll < homeWinProb + drawProb) {
    return generateScore('draw')
  } else {
    return generateScore('away')
  }
}

/**
 * Simulate a knockout match (no draws — produces a winner).
 */
export function simulateKnockoutMatch(
  home: SimTeam,
  away: SimTeam,
  chaosFactor: number = 30,
): SimResult {
  const chaos = Math.max(0, Math.min(100, chaosFactor)) / 100
  const rankDiff = away.fifaRanking - home.fifaRanking

  let homeWinProb = 0.45 + rankDiff * 0.004
  homeWinProb = homeWinProb * (1 - chaos) + 0.5 * chaos
  homeWinProb = Math.max(0.10, Math.min(0.90, homeWinProb))

  const roll = Math.random()
  if (roll < homeWinProb) {
    return generateScore('home')
  } else {
    return generateScore('away')
  }
}

/**
 * Generate a realistic score based on the outcome.
 */
function generateScore(outcome: 'home' | 'away' | 'draw'): SimResult {
  if (outcome === 'draw') {
    const goals = weightedRandom([0, 1, 1, 1, 2, 2, 3])
    return { home: goals, away: goals }
  }

  const winnerGoals = weightedRandom([1, 1, 1, 2, 2, 2, 3, 3, 4])
  const maxLoser = Math.max(0, winnerGoals - 1)
  const loserGoals = Math.floor(Math.random() * (maxLoser + 1))

  if (outcome === 'home') {
    return { home: winnerGoals, away: loserGoals }
  } else {
    return { home: loserGoals, away: winnerGoals }
  }
}

function weightedRandom(options: number[]): number {
  return options[Math.floor(Math.random() * options.length)]
}

/**
 * Simulate all group matches at once.
 */
export function simulateAllGroupMatches(
  groups: { matches: { matchNumber: number; homeCode: string; awayCode: string }[]; teams: SimTeam[] }[],
  chaosFactor: number,
): Record<number, SimResult> {
  const results: Record<number, SimResult> = {}

  for (const group of groups) {
    for (const match of group.matches) {
      const home = group.teams.find(t => t.code === match.homeCode)
      const away = group.teams.find(t => t.code === match.awayCode)
      if (home && away) {
        results[match.matchNumber] = simulateGroupMatch(home, away, chaosFactor)
      }
    }
  }

  return results
}
