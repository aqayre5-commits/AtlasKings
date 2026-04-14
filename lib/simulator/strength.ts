/**
 * Team strength model used by the predictor's simulation engine.
 *
 * Derived deterministically from the FIFA ranking lookup that already
 * lives on `SimTeam.fifaRanking`. We project each team's rank onto an
 * Elo-like scalar so match probabilities can be computed with a
 * classic 1 / (1 + 10^((Δ−home) / 400)) formula — the same shape used
 * by FiveThirtyEight, eloratings.net, etc.
 *
 * Goal generation uses a Poisson process with a rating-dependent
 * lambda. Knockout draws fall through to extra-time (30-min half-
 * lambda) then to a rating-biased penalty shootout with a 15% cap so
 * the stronger team never *guarantees* a penalty win.
 *
 * This module is pure — no React, no DOM, no randomness at import
 * time. All random draws go through the `rng` argument so the Monte
 * Carlo worker can swap in a seeded PRNG for reproducibility (not
 * used yet, but the hook is there).
 */

import type { SimTeam } from './groups'
import { teamElo } from './tournamentResults'

/**
 * Strength models supported by the predictor.
 *
 *   'historical' (default, despite the name) — weighted sum of
 *   stage results across every major tournament in the WC 2026
 *   window: WC 2022, WC 2018, Euro 2024, Copa América 2024,
 *   AFCON 2023/25, Asian Cup 2023, Gold Cup 2023/25, OFC 2024.
 *   Implemented in `lib/simulator/tournamentResults.ts` which is
 *   the single place to edit tournament data or reweight signals.
 *
 *   The name is kept as 'historical' for back-compat with saved
 *   states in localStorage — behaviour is strictly better than
 *   the old 2-WC + recent-form blend because the new model
 *   captures continental cup results (e.g. Spain's Euro 2024
 *   title) that the old model ignored.
 *
 *   'elo' / 'fifa-rank' — legacy. Projects the current FIFA
 *   ranking onto the same elo scale. Kept for back-compat and
 *   A/B testing.
 */
export type StrengthModel = 'historical' | 'elo' | 'fifa-rank'

export interface StrengthOptions {
  /** Chaos 0..100. 0 = pure strength, 100 = coin flip. */
  chaos?: number
  /** Applies a home-advantage bonus for the home team. */
  homeAdvantage?: boolean
  /** Host-nation bonus. Only applies when the team is USA/MEX/CAN. */
  hostNationBonus?: boolean
  /** Random source. Defaults to Math.random. */
  rng?: () => number
  /** Strength model. Defaults to 'historical'. */
  model?: StrengthModel
}

const HOST_NATION_CODES = new Set(['USA', 'MEX', 'CAN'])
const HOME_ADV_ELO = 60
const HOST_BONUS_ELO = 80
const ELO_FLOOR = 1100
const ELO_CEILING = 2150

/**
 * Project a FIFA ranking onto an Elo-like scalar. Rank 1 maps to
 * ~2090, rank 50 to ~1700, rank 100 to ~1350. Missing or unreasonable
 * ranks fall back to 1500.
 */
export function eloFromFifaRank(rank: number): number {
  if (!Number.isFinite(rank) || rank <= 0) return 1500
  const raw = 2100 - (rank - 1) * 8
  return Math.max(ELO_FLOOR, Math.min(ELO_CEILING, raw))
}

/**
 * Resolve a team's strength scalar under the selected model.
 *
 * The 'historical' model is now a weighted sum across every major
 * tournament in the sample window — see `tournamentResults.ts`
 * for the data + weights. Both the other paths return values in
 * the same 1100-2200 elo space so switching models never breaks
 * the match-probability math.
 */
export function teamStrength(team: SimTeam, opts?: StrengthOptions): number {
  const model = opts?.model ?? 'historical'
  if (model === 'historical') {
    return teamElo(team.code)
  }
  // Legacy ranking-derived paths. 'fifa-rank' was originally a
  // different normalisation that produced values in 0-99 — which
  // silently broke the elo math when compared with the historical
  // path. We now treat both 'fifa-rank' and 'elo' as aliases for
  // the unified `eloFromFifaRank()` projection so strength models
  // are always comparable.
  return eloFromFifaRank(team.fifaRanking)
}

export interface MatchProbabilities {
  pHome: number
  pDraw: number
  pAway: number
  homeElo: number
  awayElo: number
  /** Expected goals for each side, used as the Poisson lambda. */
  lambdaHome: number
  lambdaAway: number
}

/**
 * Compute win / draw / away-win probabilities for a group-stage
 * match, plus the Poisson lambdas used when sampling a score.
 */
export function matchProbabilities(
  home: SimTeam,
  away: SimTeam,
  opts: StrengthOptions = {},
): MatchProbabilities {
  const chaos = Math.max(0, Math.min(100, opts.chaos ?? 30)) / 100
  const homeAdv = opts.homeAdvantage ?? true

  let homeElo = teamStrength(home, opts)
  let awayElo = teamStrength(away, opts)

  // Home advantage is gated on the home team actually being a
  // host nation (USA, MEX, CAN). At WC 2026 every non-host match
  // is played at a neutral venue — giving Brazil or Morocco a
  // +60 bonus just because they're listed as "home" in the
  // fixture produced a systematic over-weighting of those teams
  // against their Group C opponents, which was a real bug in
  // the simulation output.
  if (homeAdv && HOST_NATION_CODES.has(home.code)) {
    homeElo += HOME_ADV_ELO
  }
  if (opts.hostNationBonus ?? true) {
    if (HOST_NATION_CODES.has(home.code)) homeElo += HOST_BONUS_ELO
    if (HOST_NATION_CODES.has(away.code)) awayElo += HOST_BONUS_ELO
  }

  const diff = homeElo - awayElo
  const rawHome = 1 / (1 + Math.pow(10, -diff / 400))
  // Draw probability is highest for evenly matched teams and falls to
  // ~0.10 for huge mismatches. Capped [0.10, 0.32].
  let pDraw = 0.32 - Math.min(0.22, Math.abs(diff) / 600)
  pDraw = Math.max(0.10, Math.min(0.32, pDraw))

  // Split the remaining (1 - pDraw) between home and away using
  // rawHome as the weight.
  let pHome = (1 - pDraw) * rawHome
  let pAway = 1 - pDraw - pHome

  // Chaos blend toward uniform 1/3.
  pHome = pHome * (1 - chaos) + (1 / 3) * chaos
  pDraw = pDraw * (1 - chaos) + (1 / 3) * chaos
  pAway = 1 - pHome - pDraw
  if (pAway < 0) pAway = 0

  // Poisson lambdas — a small logistic bend so strong teams score
  // more.
  //
  // Historical World Cup data (2010–2022):
  //   Group stage:   ~1.30 goals/team/match
  //   Knockout 90':  ~1.05 goals/team/match
  //   Extra time:    ~0.35 additional goals/team
  //
  // baseLambda tracks the group-stage average. Knockout functions
  // apply their own dampener (KNOCKOUT_LAMBDA_FACTOR).
  const baseLambda = 1.30
  const elasticity = diff / 400
  const lambdaHome = Math.max(0.25, Math.min(2.8, baseLambda + elasticity * 0.65))
  const lambdaAway = Math.max(0.25, Math.min(2.8, baseLambda - elasticity * 0.65))

  return {
    pHome,
    pDraw,
    pAway,
    homeElo,
    awayElo,
    lambdaHome,
    lambdaAway,
  }
}

/**
 * Ergonomic wrapper around `matchProbabilities()` that accepts
 * FIFA 3-letter codes instead of `SimTeam` objects. Resolves
 * teams lazily from the canonical `GROUPS` list, so UI code
 * like the groups panel can display per-match probability bars
 * without reaching into the simulator data layer.
 *
 * Returns null if either code is not a WC 2026 team.
 */
let teamByCodeCache: Map<string, SimTeam> | null = null
function getTeamByCodeMap(): Map<string, SimTeam> {
  if (teamByCodeCache) return teamByCodeCache
  // Lazy import to avoid a circular dep at module-load time —
  // groups.ts imports from wc2026.ts, which we don't want to
  // eager-load during the strength module's own initialisation.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getAllGroups } = require('./groups') as typeof import('./groups')
  const map = new Map<string, SimTeam>()
  for (const g of getAllGroups()) {
    for (const t of g.teams) map.set(t.code, t)
  }
  teamByCodeCache = map
  return map
}

export function matchProbabilitiesByCode(
  homeCode: string,
  awayCode: string,
  opts: StrengthOptions = {},
): { pHome: number; pDraw: number; pAway: number } | null {
  const teams = getTeamByCodeMap()
  const home = teams.get(homeCode)
  const away = teams.get(awayCode)
  if (!home || !away) return null
  const probs = matchProbabilities(home, away, opts)
  return {
    pHome: probs.pHome,
    pDraw: probs.pDraw,
    pAway: probs.pAway,
  }
}

/**
 * Sample a Poisson-distributed integer (Knuth's algorithm). Cheap and
 * accurate for small lambdas — which is all we need for football.
 */
export function samplePoisson(lambda: number, rng: () => number = Math.random): number {
  if (lambda <= 0) return 0
  const L = Math.exp(-lambda)
  let k = 0
  let p = 1
  do {
    k++
    p *= rng()
  } while (p > L)
  return k - 1
}

export interface SimulatedResult {
  home: number
  away: number
  /** Set to true when the score was decided in extra time. */
  wentToET?: boolean
  /** Set to true when the score was decided on penalties. */
  wentToPens?: boolean
  /** When defined, the match is a knockout draw resolved on pens. */
  penWinner?: 'home' | 'away'
}

/**
 * Simulate a group-stage match (draws allowed).
 */
export function simulateGroupMatch(
  home: SimTeam,
  away: SimTeam,
  opts: StrengthOptions = {},
): SimulatedResult {
  const rng = opts.rng ?? Math.random
  const { pHome, pDraw, lambdaHome, lambdaAway } = matchProbabilities(home, away, opts)

  const roll = rng()
  if (roll < pHome) {
    return scoreForOutcome('home', lambdaHome, lambdaAway, rng)
  }
  if (roll < pHome + pDraw) {
    return scoreForOutcome('draw', lambdaHome, lambdaAway, rng)
  }
  return scoreForOutcome('away', lambdaHome, lambdaAway, rng)
}

/**
 * Simulate a knockout match — draws after 90 go to extra time, then
 * penalties. Returns the final on-pitch scoreline plus penWinner for
 * shootout resolution.
 *
 * Penalties are *weighted* by elo with a hard ±15% cap around 50/50
 * so a superpower can't guarantee a shootout against a minnow.
 */
// Knockout matches are more cautious than group stage. Historical
// data (WC 2010–2022) shows ~1.05 goals/team in knockout 90' vs
// ~1.30 in groups. This factor dampens the group-calibrated lambdas.
const KNOCKOUT_LAMBDA_FACTOR = 0.82

export function simulateKnockoutMatch(
  home: SimTeam,
  away: SimTeam,
  opts: StrengthOptions = {},
): SimulatedResult {
  const rng = opts.rng ?? Math.random
  const probs = matchProbabilities(home, away, opts)

  // Dampen lambdas for knockout football.
  const koLambdaHome = probs.lambdaHome * KNOCKOUT_LAMBDA_FACTOR
  const koLambdaAway = probs.lambdaAway * KNOCKOUT_LAMBDA_FACTOR

  // Simulate 90 minutes with dampened lambdas.
  const { pHome, pDraw, pAway } = probs
  const roll = rng()
  let base: SimulatedResult
  if (roll < pHome) {
    base = scoreForOutcome('home', koLambdaHome, koLambdaAway, rng)
  } else if (roll < pHome + pDraw) {
    base = scoreForOutcome('draw', koLambdaHome, koLambdaAway, rng)
  } else {
    base = scoreForOutcome('away', koLambdaHome, koLambdaAway, rng)
  }

  if (base.home !== base.away) return base

  // 90 minutes tied → extra time. Historical ET averages ~0.35
  // goals/team across 30 minutes.
  const etLambda = 0.35
  const etHome = samplePoisson(etLambda, rng)
  const etAway = samplePoisson(etLambda, rng)
  const afterET: SimulatedResult = {
    home: base.home + etHome,
    away: base.away + etAway,
    wentToET: true,
  }
  if (afterET.home !== afterET.away) return afterET

  // Still tied → weighted penalty shootout.
  const eloDiff = probs.homeElo - probs.awayElo
  const lean = Math.max(-0.15, Math.min(0.15, eloDiff / 2000))
  const pHomeWinsPens = 0.5 + lean
  const penWinner = rng() < pHomeWinsPens ? 'home' : 'away'

  return {
    ...afterET,
    wentToPens: true,
    penWinner,
  }
}

/**
 * Turn an abstract match outcome into a realistic scoreline.
 *
 * Samples Poisson goals for each side using the supplied lambdas,
 * then nudges the result to match the outcome (draws are left alone,
 * losers are clamped below the winner).
 */
/**
 * Turn an abstract match outcome into a realistic scoreline.
 *
 * Calibrated against historical World Cup data (2010–2022):
 *   Most common knockout scorelines: 1-0 (28%), 2-1 (22%),
 *   2-0 (14%), 1-1 (12%). 4+ goals by one team < 3%.
 *
 * Winner's goals capped at 4 (covers 99%+ of real WC matches).
 * Loser always scores fewer than the winner.
 */
function scoreForOutcome(
  outcome: 'home' | 'away' | 'draw',
  lambdaHome: number,
  lambdaAway: number,
  rng: () => number,
): SimulatedResult {
  const rawHome = samplePoisson(lambdaHome, rng)
  const rawAway = samplePoisson(lambdaAway, rng)

  if (outcome === 'draw') {
    // Draw score: average of both samples, capped at 3
    // (4-4 draws are virtually nonexistent in WC history).
    const draw = Math.min(Math.round((rawHome + rawAway) / 2), 3)
    return { home: draw, away: draw }
  }

  if (outcome === 'home') {
    // Use the home team's own Poisson sample (min 1 for a win).
    // Historical cap: only 3 WC knockout matches ever saw 5+ goals
    // by one team since 2002, so cap at 4.
    const winner = Math.min(Math.max(rawHome, 1), 4)
    const loser = Math.min(rawAway, winner - 1)
    return { home: winner, away: Math.max(0, loser) }
  }

  // outcome === 'away'
  const winner = Math.min(Math.max(rawAway, 1), 4)
  const loser = Math.min(rawHome, winner - 1)
  return { home: Math.max(0, loser), away: winner }
}
