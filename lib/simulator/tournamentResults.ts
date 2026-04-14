/**
 * Tournament-based team strength model.
 *
 * Weighted sum of stage results across every major international
 * tournament with a name-year of 2022 or later. Each tournament
 * contributes a stage-score for participating teams; the score
 * is multiplied by a recency-weighted tournament weight; the sum
 * is clamped into a 1100-2200 elo band. A small FIFA-ranking-
 * points delta (±40, from `fifaPoints.ts`) stabilises teams with
 * thin tournament signal; a small qualifying-pathway delta (±40,
 * from `qualifyingResults.ts`) rewards dominant qualifying runs.
 *
 * Tournaments in the stack:
 *
 *   • FIFA World Cup 2022 (Nov-Dec 2022)           weight 2.5
 *   • UEFA Euro 2024 (Jun-Jul 2024)                weight 2.0
 *   • CONMEBOL Copa América 2024 (Jun-Jul 2024)    weight 2.0
 *   • CAF AFCON 2023 (Jan-Feb 2024, Côte d'Ivoire) weight 0.8
 *   • CAF AFCON 2025 (Dec 2025-Jan 2026, Morocco)  weight 2.0  ⚠ estimated
 *   • AFC Asian Cup 2023 (Jan-Feb 2024, Qatar)     weight 1.5
 *   • CONCACAF Gold Cup 2023 (Jun-Jul 2023)        weight 0.8
 *   • CONCACAF Gold Cup 2025 (Jun-Jul 2025)        weight 1.8  ⚠ estimated
 *   • OFC Nations Cup 2024 (Jun 2024)              weight 1.0
 *
 * Base year is 2022 — nothing older than WC 2022 is included.
 *
 * Stage scores (identical across all tournaments for comparability):
 *   group     10
 *   r16       30
 *   qf        60
 *   sf       100
 *   final    140
 *   champion 180
 *
 * The ⚠ estimated entries cover tournaments whose results sit at
 * the edge of or beyond this codebase's training window. Updating
 * them is a one-line edit in the relevant table below. Every
 * consumer of `teamElo()` picks up the change automatically.
 */

import { qualifyingDelta, qualifyingLabel } from './qualifyingResults'
import { fifaPointsDelta, fifaPointsFor } from './fifaPoints'

export type TournamentStage =
  | 'group'
  | 'r16'
  | 'qf'
  | 'sf'
  | 'final'
  | 'champion'

const STAGE_SCORE: Record<TournamentStage, number> = {
  group: 10,
  r16: 30,
  qf: 60,
  sf: 100,
  final: 140,
  champion: 180,
}

// ──────────────────────────────────────────────────────────────
// TOURNAMENT DATA
// All team codes are FIFA 3-letter codes (as used elsewhere in the
// predictor). Missing entries = team did not participate. Non-WC
// 2026 participants are intentionally omitted since they can't
// play in the predictor anyway.
// ──────────────────────────────────────────────────────────────

// ── FIFA World Cup 2022 (Qatar) — Argentina champions ──
const WC_2022: Record<string, TournamentStage> = {
  ARG: 'champion',
  FRA: 'final',
  CRO: 'sf',
  MAR: 'sf', // historic 4th place for Morocco
  NED: 'qf',
  BRA: 'qf',
  ENG: 'qf',
  POR: 'qf',
  JPN: 'r16',
  KOR: 'r16',
  USA: 'r16',
  AUS: 'r16',
  SUI: 'r16',
  SEN: 'r16',
  ESP: 'r16',
  CAN: 'group',
  ECU: 'group',
  GHA: 'group',
  IRN: 'group',
  KSA: 'group',
  MEX: 'group',
  QAT: 'group',
  TUN: 'group',
  URU: 'group',
  GER: 'group',
  BEL: 'group',
}

// ── UEFA Euro 2024 (Germany) — Spain champions ──
const EURO_2024: Record<string, TournamentStage> = {
  ESP: 'champion', // 2-1 over England in Berlin
  ENG: 'final',
  NED: 'sf',
  FRA: 'sf',
  GER: 'qf', // lost to Spain on the golden goal
  POR: 'qf', // lost to France on pens
  SUI: 'qf', // lost to England on pens
  TUR: 'qf', // lost to Netherlands
  AUT: 'r16', // topped their group, lost to Turkey in R16
  BEL: 'r16', // lost to France
  CRO: 'group', // shock group-stage exit despite being 2022 WC final
  CZE: 'group',
  SCO: 'group',
}

// ── CONMEBOL Copa América 2024 (USA) — Argentina champions ──
const COPA_2024: Record<string, TournamentStage> = {
  ARG: 'champion', // 1-0 over Colombia in extra time in Miami
  COL: 'final',
  URU: 'sf', // beat Canada in the 3rd-place play-off
  CAN: 'sf', // historic first Canada SF
  BRA: 'qf', // eliminated by Uruguay on penalties
  ECU: 'qf',
  PAN: 'qf',
  MEX: 'group',
  PAR: 'group',
  USA: 'group', // host-nation group-stage exit, cost Berhalter his job
}

// ── CAF AFCON 2023 (Côte d'Ivoire, Jan-Feb 2024) — CIV champions ──
const AFCON_2023: Record<string, TournamentStage> = {
  CIV: 'champion', // remarkable run — nearly crashed out in groups
  RSA: 'sf', // 3rd place
  COD: 'sf', // 4th place
  CPV: 'qf',
  MAR: 'r16', // upset loss to South Africa 0-2
  SEN: 'r16', // defending champions out on pens to CIV
  EGY: 'r16', // lost to DR Congo on pens
  ALG: 'group',
  TUN: 'group',
  GHA: 'group', // controversial group-stage exit
}

// ── AFC Asian Cup 2023 (Qatar, Jan-Feb 2024) — Qatar champions ──
const ASIAN_CUP_2023: Record<string, TournamentStage> = {
  QAT: 'champion', // back-to-back Asian champions as host
  JOR: 'final', // best-ever Jordan result
  IRN: 'sf', // lost to Qatar
  KOR: 'sf', // lost to Jordan
  AUS: 'qf',
  JPN: 'qf',
  UZB: 'qf',
  KSA: 'r16', // lost to Korea on penalties
  IRQ: 'r16',
}

// ── CAF AFCON 2025 (Morocco, Dec 2025-Jan 2026) — estimated ──
//
// ⚠ Estimated values — AFCON 2025 was played at the edge of this
// codebase's training window. Morocco hosted with strong squad
// and home advantage, so a deep run is narratively plausible.
// Update these entries to match actual results; `teamElo()` picks
// up every change automatically.
const AFCON_2025: Record<string, TournamentStage> = {
  MAR: 'champion', // ⚠ estimated (host nation)
  CIV: 'final', // ⚠ estimated (defending champion)
  SEN: 'sf', // ⚠ estimated
  EGY: 'sf', // ⚠ estimated
  RSA: 'qf', // ⚠ estimated
  COD: 'qf', // ⚠ estimated
  ALG: 'qf', // ⚠ estimated
  TUN: 'qf', // ⚠ estimated
  CPV: 'r16', // ⚠ estimated
  GHA: 'r16', // ⚠ estimated
}

// ── CONCACAF Gold Cup 2023 (USA/Canada) — Mexico champions ──
const GOLD_CUP_2023: Record<string, TournamentStage> = {
  MEX: 'champion', // 1-0 over Panama in the final
  PAN: 'final',
  USA: 'sf', // lost to Panama on pens
  CAN: 'qf',
  QAT: 'qf', // Qatar participated as an invited guest
}

// ── CONCACAF Gold Cup 2025 (USA) — estimated ──
//
// ⚠ Estimated values — Gold Cup 2025 was played Jun-Jul 2025.
// Defaults follow the 2023 narrative pattern (MEX champion, USA
// runner-up, PAN deep run). Update when confirmed.
const GOLD_CUP_2025: Record<string, TournamentStage> = {
  MEX: 'champion', // ⚠ estimated
  USA: 'final', // ⚠ estimated
  PAN: 'sf', // ⚠ estimated
  CAN: 'qf', // ⚠ estimated
}

// ── OFC Nations Cup 2024 — New Zealand champions ──
const OFC_2024: Record<string, TournamentStage> = {
  NZL: 'champion', // 3-1 over Vanuatu
}

// ──────────────────────────────────────────────────────────────
// WEIGHTS + SUMMATION
// ──────────────────────────────────────────────────────────────

interface TournamentEntry {
  key: string
  label: string
  weight: number
  data: Record<string, TournamentStage>
  estimated?: boolean
}

const TOURNAMENTS: TournamentEntry[] = [
  { key: 'wc2022', label: 'WC 2022', weight: 2.5, data: WC_2022 },
  { key: 'euro2024', label: 'Euro 2024', weight: 2.0, data: EURO_2024 },
  { key: 'copa2024', label: 'Copa 2024', weight: 2.0, data: COPA_2024 },
  { key: 'afcon2023', label: 'AFCON 2023', weight: 0.8, data: AFCON_2023 },
  { key: 'afcon2025', label: 'AFCON 2025', weight: 2.0, data: AFCON_2025, estimated: true },
  { key: 'asian2023', label: 'Asian Cup 2023', weight: 1.5, data: ASIAN_CUP_2023 },
  { key: 'goldcup2023', label: 'Gold Cup 2023', weight: 0.8, data: GOLD_CUP_2023 },
  { key: 'goldcup2025', label: 'Gold Cup 2025', weight: 1.8, data: GOLD_CUP_2025, estimated: true },
  { key: 'ofc2024', label: 'OFC 2024', weight: 1.0, data: OFC_2024 },
]

const BASE_ELO = 1200
const ELO_FLOOR = 1100
const ELO_CEILING = 2200

/**
 * Compute a team's weighted tournament elo. Layered on top of the
 * continental-cup baseline are two small deltas:
 *
 *   1. Qualifying-pathway delta (±40) from `qualifyingResults.ts`
 *      with a confederation-difficulty multiplier applied.
 *   2. FIFA ranking points delta (±40) from `fifaPoints.ts` —
 *      stabilises teams with thin tournament signal.
 *
 * Both deltas are small enough that the tournament stack still
 * dominates the elo for teams with strong continental results.
 */
export function teamElo(code: string): number {
  let weighted = 0
  for (const t of TOURNAMENTS) {
    const stage = t.data[code]
    if (stage) weighted += STAGE_SCORE[stage] * t.weight
  }
  const raw = BASE_ELO + weighted + qualifyingDelta(code) + fifaPointsDelta(code)
  return Math.max(ELO_FLOOR, Math.min(ELO_CEILING, raw))
}

// ──────────────────────────────────────────────────────────────
// BREAKDOWN HELPERS
// Used by the Monte Carlo panel tooltip so users can see WHY a
// team sits where it does.
// ──────────────────────────────────────────────────────────────

export interface EloContribution {
  tournamentKey: string
  tournamentLabel: string
  stage: TournamentStage
  points: number
  estimated: boolean
}

export interface TeamEloBreakdown {
  total: number
  contributions: EloContribution[]
  /** Qualifying-pathway delta (after confederation multiplier). */
  qualifyingDelta: number
  /** Qualifying pathway label (e.g. "topped UEFA group"). */
  qualifyingLabel: string | null
  /** FIFA ranking points delta (±40). */
  fifaPointsDelta: number
  /** Raw FIFA ranking points (~1100-1900 range). */
  fifaPoints: number
}

/**
 * Return the total elo plus the per-tournament breakdown for a
 * team. Contributions are sorted highest-first so consumers can
 * slice the top N for compact displays. The qualifying delta is
 * returned as a separate field rather than a contribution entry
 * because it doesn't fit the TournamentStage type.
 */
export function teamEloBreakdown(code: string): TeamEloBreakdown {
  const contributions: EloContribution[] = []
  let weighted = 0
  for (const t of TOURNAMENTS) {
    const stage = t.data[code]
    if (!stage) continue
    const pts = STAGE_SCORE[stage] * t.weight
    weighted += pts
    contributions.push({
      tournamentKey: t.key,
      tournamentLabel: t.label,
      stage,
      points: pts,
      estimated: !!t.estimated,
    })
  }
  contributions.sort((a, b) => b.points - a.points)
  const qDelta = qualifyingDelta(code)
  const qLabel = qualifyingLabel(code)
  const fDelta = fifaPointsDelta(code)
  const fPts = fifaPointsFor(code)
  const total = Math.max(
    ELO_FLOOR,
    Math.min(ELO_CEILING, BASE_ELO + weighted + qDelta + fDelta),
  )
  return {
    total,
    contributions,
    qualifyingDelta: qDelta,
    qualifyingLabel: qLabel,
    fifaPointsDelta: fDelta,
    fifaPoints: fPts,
  }
}

/**
 * Human-readable one-line summary for tooltips. Example:
 *
 *   "elo 1650 · Euro 2024 champion · WC 2022 R16 · WC 2018 R16"
 *
 * Unknown teams return a placeholder so the UI never renders an
 * empty tooltip.
 */
export function teamEloSummary(code: string): string {
  const b = teamEloBreakdown(code)
  const parts: string[] = []
  const top = b.contributions.slice(0, 3)
  for (const c of top) {
    const stageStr = c.stage === 'champion' ? 'champion' : c.stage.toUpperCase()
    parts.push(`${c.tournamentLabel} ${stageStr}${c.estimated ? '*' : ''}`)
  }
  if (b.qualifyingLabel && b.qualifyingDelta !== 0) {
    const sign = b.qualifyingDelta > 0 ? '+' : ''
    parts.push(`${b.qualifyingLabel} (${sign}${b.qualifyingDelta})`)
  }
  if (b.fifaPointsDelta !== 0) {
    const sign = b.fifaPointsDelta > 0 ? '+' : ''
    parts.push(`FIFA ${b.fifaPoints} (${sign}${b.fifaPointsDelta})`)
  }
  if (parts.length === 0) {
    return `elo ${b.total} · no recent tournament data`
  }
  return `elo ${b.total} · ${parts.join(' · ')}`
}
