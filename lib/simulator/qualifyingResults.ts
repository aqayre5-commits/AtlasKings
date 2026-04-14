/**
 * WC 2026 qualifying pathway adjustments.
 *
 * Small static elo deltas applied on top of the continental-cup
 * baseline from `tournamentResults.ts`. Captures the "how did they
 * qualify" signal that the continental-cup stack misses for teams
 * who didn't have a strong run at their most recent confederation
 * cup.
 *
 * Base deltas are then scaled by a CONFEDERATION DIFFICULTY
 * multiplier that reflects how hard it is to top each
 * confederation's qualifying round. Topping CONMEBOL's 10-team
 * round-robin is a completely different test from topping OFC's
 * 6-team group — the model rewards the former more heavily.
 *
 * Key example: Norway missed the Euro 2024 final rounds but topped
 * their UEFA qualifying group behind a dominant Haaland-led
 * campaign. Under the continental-cup-only model they sat at the
 * 1200 floor. After applying the UEFA × 0.92 multiplier to their
 * +40 base, Norway gets a +37 delta — still not top-tier, but
 * clearly above teams with no signal at all.
 *
 * Host nations don't play qualifying and are NOT subject to the
 * confederation multiplier (they have no confederation qualifying
 * path to be measured on). Instead they get flat static boosts
 * reflecting their real-world strength:
 *
 *   USA  +35   (MLS growth, a decade of player-development
 *               investment, 2022 WC R16 run)
 *   MEX  +25   (standard host acknowledgment)
 *   CAN  +25   (standard host acknowledgment)
 *
 * The existing match-time host bonus (+80 elo per match, in
 * `strength.ts → matchProbabilities()`) handles the "playing at
 * home" advantage separately; this is purely a base-elo
 * acknowledgment and does NOT double-count it.
 *
 * Tier → base delta (before multiplier):
 *   40  direct qualifier, topped confederation group
 *   20  direct qualifier via 2nd place / playoff / Nations League
 *   host static (bypasses multiplier)
 *    0  fallback for unknown teams
 *
 * Pathway assignments are my best reading of how each team
 * reached WC 2026 as of April 2026. Any cell is a one-line edit.
 */

export type Confederation =
  | 'UEFA'
  | 'CONMEBOL'
  | 'CAF'
  | 'AFC'
  | 'CONCACAF'
  | 'OFC'

/**
 * Relative qualifying difficulty per confederation. 1.00 =
 * hardest (CONMEBOL's 10-team home-and-away round-robin).
 * Applied as a multiplier on the base qualifying delta.
 */
export const CONFEDERATION_DIFFICULTY: Record<Confederation, number> = {
  CONMEBOL: 1.0,
  UEFA: 0.92,
  CONCACAF: 0.75,
  CAF: 0.7,
  AFC: 0.65,
  OFC: 0.45,
}

export interface QualifyingEntry {
  /** Base elo delta (before confederation multiplier). */
  delta: number
  /** Short label for tooltips: "topped UEFA group", "host", etc. */
  label: string
  /**
   * Confederation used to look up the difficulty multiplier.
   * `null` = host nation (multiplier not applied, delta stands
   * as-is since hosts have no confederation qualifying path).
   */
  confederation: Confederation | null
}

export const QUALIFYING: Record<string, QualifyingEntry> = {
  // ─── Hosts (no qualifying played, multiplier skipped) ───
  USA: { delta: 35, label: 'host (no qualifying)', confederation: null }, // refined upward — MLS era, 2022 R16
  MEX: { delta: 25, label: 'host (no qualifying)', confederation: null },
  CAN: { delta: 25, label: 'host (no qualifying)', confederation: null },

  // ─── UEFA (16 slots: 12 group winners + 4 playoff) ───
  // Elite group winners — dominant qualifying campaigns
  ESP: { delta: 40, label: 'topped UEFA group', confederation: 'UEFA' },
  FRA: { delta: 40, label: 'topped UEFA group', confederation: 'UEFA' },
  ENG: { delta: 40, label: 'topped UEFA group', confederation: 'UEFA' },
  GER: { delta: 40, label: 'topped UEFA group', confederation: 'UEFA' },
  NED: { delta: 40, label: 'topped UEFA group', confederation: 'UEFA' },
  POR: { delta: 40, label: 'topped UEFA group', confederation: 'UEFA' },
  BEL: { delta: 40, label: 'topped UEFA group', confederation: 'UEFA' },
  CRO: { delta: 40, label: 'topped UEFA group', confederation: 'UEFA' },
  TUR: { delta: 40, label: 'topped UEFA group', confederation: 'UEFA' },
  SUI: { delta: 40, label: 'topped UEFA group', confederation: 'UEFA' },
  NOR: { delta: 40, label: 'topped UEFA group (Haaland)', confederation: 'UEFA' },
  // Playoff / 2nd-place route
  SCO: { delta: 20, label: 'UEFA playoff route', confederation: 'UEFA' },
  AUT: { delta: 20, label: 'UEFA playoff route', confederation: 'UEFA' },
  CZE: { delta: 20, label: 'UEFA playoff route', confederation: 'UEFA' },
  SWE: { delta: 20, label: 'UEFA playoff route', confederation: 'UEFA' },
  BIH: { delta: 20, label: 'UEFA playoff route', confederation: 'UEFA' },

  // ─── CONMEBOL (6 direct qualifiers from 10-team league) ───
  // Top of the league table
  ARG: { delta: 40, label: 'topped CONMEBOL table', confederation: 'CONMEBOL' },
  BRA: { delta: 40, label: 'top-3 CONMEBOL', confederation: 'CONMEBOL' },
  URU: { delta: 40, label: 'top-3 CONMEBOL', confederation: 'CONMEBOL' },
  // Mid-table automatic qualifiers
  COL: { delta: 20, label: 'CONMEBOL auto-qualifier', confederation: 'CONMEBOL' },
  PAR: { delta: 20, label: 'CONMEBOL auto-qualifier', confederation: 'CONMEBOL' },
  ECU: { delta: 20, label: 'CONMEBOL auto-qualifier', confederation: 'CONMEBOL' },

  // ─── CAF (9 direct + 1 intercontinental playoff, from 9 groups) ───
  // Group winners
  MAR: { delta: 40, label: 'topped CAF group', confederation: 'CAF' },
  SEN: { delta: 40, label: 'topped CAF group', confederation: 'CAF' },
  EGY: { delta: 40, label: 'topped CAF group', confederation: 'CAF' },
  CIV: { delta: 40, label: 'topped CAF group', confederation: 'CAF' },
  ALG: { delta: 40, label: 'topped CAF group', confederation: 'CAF' },
  TUN: { delta: 40, label: 'topped CAF group', confederation: 'CAF' },
  RSA: { delta: 40, label: 'topped CAF group', confederation: 'CAF' },
  GHA: { delta: 40, label: 'topped CAF group', confederation: 'CAF' },
  COD: { delta: 40, label: 'topped CAF group', confederation: 'CAF' },
  // Intercontinental playoff winner
  CPV: { delta: 20, label: 'CAF playoff route', confederation: 'CAF' },

  // ─── AFC (8 direct + 1 intercontinental playoff) ───
  // Group winners in the 4th round
  JPN: { delta: 40, label: 'topped AFC group', confederation: 'AFC' },
  KOR: { delta: 40, label: 'topped AFC group', confederation: 'AFC' },
  IRN: { delta: 40, label: 'topped AFC group', confederation: 'AFC' },
  AUS: { delta: 40, label: 'topped AFC group', confederation: 'AFC' },
  // 2nd place / 4th round auto-qualifiers
  QAT: { delta: 20, label: 'AFC auto-qualifier', confederation: 'AFC' },
  UZB: { delta: 20, label: 'AFC auto-qualifier', confederation: 'AFC' },
  KSA: { delta: 20, label: 'AFC auto-qualifier', confederation: 'AFC' },
  JOR: { delta: 20, label: 'AFC auto-qualifier', confederation: 'AFC' },
  // Intercontinental playoff route
  IRQ: { delta: 20, label: 'AFC playoff route', confederation: 'AFC' },

  // ─── CONCACAF (3 direct, hosts handled above) ───
  PAN: { delta: 20, label: 'CONCACAF auto-qualifier', confederation: 'CONCACAF' },
  HAI: { delta: 20, label: 'CONCACAF playoff route', confederation: 'CONCACAF' },
  CUW: { delta: 20, label: 'CONCACAF playoff route', confederation: 'CONCACAF' },

  // ─── OFC (1 direct) ───
  NZL: { delta: 20, label: 'OFC auto-qualifier', confederation: 'OFC' },
}

/**
 * Return the qualifying elo delta for a team code, with the
 * confederation difficulty multiplier already applied. Unknown
 * codes return 0 so the function is safe to call on anything.
 * Hosts bypass the multiplier since they have no confederation
 * qualifying path.
 */
export function qualifyingDelta(code: string): number {
  const entry = QUALIFYING[code]
  if (!entry) return 0
  if (entry.confederation === null) return entry.delta // host — no multiplier
  const multiplier = CONFEDERATION_DIFFICULTY[entry.confederation]
  return Math.round(entry.delta * multiplier)
}

/**
 * Return the qualifying pathway label for a team code, or null
 * if the team isn't in the qualifying map. Consumed by the MC
 * panel tooltip to explain the delta.
 */
export function qualifyingLabel(code: string): string | null {
  return QUALIFYING[code]?.label ?? null
}
