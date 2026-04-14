/**
 * FIFA ranking points stabiliser.
 *
 * Layered on top of the tournament stack as a small ±40 elo
 * delta, centred on a global mean of 1500 FIFA points. The goal
 * is to differentiate teams with thin tournament signal (Norway,
 * Bosnia, Haiti, Curaçao) without duplicating the continental-
 * cup recency signal.
 *
 * Mapping:
 *   delta = ((fifaPoints − 1500) / 250) × 40
 *   clamped to ±40
 *
 *   A 250-point gap in FIFA points ≈ the full ±40 delta.
 *   Argentina (~1886) → +40 (cap)
 *   Spain (~1854)    → +40 (cap)
 *   Brazil (~1776)   → +44 → +40 (cap)
 *   Morocco (~1706)  → +33
 *   France (~1859)   → +40 (cap)
 *   Croatia (~1714)  → +34
 *   Haiti (~1205)    → −40 (floor)
 *   Curaçao (~1178)  → −40 (floor)
 *
 * The tight clamp keeps FIFA points from overwhelming the
 * tournament signal: a "Spain at 1854 points + Euro 2024
 * champion" gets +40 from FIFA points on top of +360 from the
 * continental title, not a runaway 200+.
 *
 * Snapshot is approximate April 2026. Refresh from the FIFA
 * rankings page (https://www.fifa.com/fifa-world-ranking) when
 * a new window passes. The numbers are stored in order of
 * current-ish FIFA ranking for human readability.
 */

export const FIFA_POINTS: Record<string, number> = {
  // Top tier
  ARG: 1886,
  FRA: 1859,
  ESP: 1854,
  ENG: 1819,
  BRA: 1776,
  POR: 1765,
  NED: 1759,
  BEL: 1756,
  CRO: 1714,
  MAR: 1706,
  COL: 1701,
  MEX: 1696,
  URU: 1686,
  USA: 1685,
  SUI: 1678,
  GER: 1676,
  SEN: 1651,
  JPN: 1645,
  IRN: 1623,
  KOR: 1595,
  AUS: 1553,
  AUT: 1546,
  CAN: 1527,
  TUR: 1504,
  PAR: 1495,
  QAT: 1491,
  EGY: 1489,
  ECU: 1468,
  NOR: 1468,
  ALG: 1459,
  RSA: 1447,
  TUN: 1446,
  CIV: 1438,
  JOR: 1423,
  SWE: 1411,
  CZE: 1404,
  UZB: 1378,
  SCO: 1376,
  KSA: 1373,
  PAN: 1345,
  GHA: 1337,
  COD: 1333,
  IRQ: 1317,
  NZL: 1281,
  BIH: 1279,
  CPV: 1275,
  HAI: 1205,
  CUW: 1178,
}

const GLOBAL_MEAN = 1500
const SCALE_DIVISOR = 250
const MAX_DELTA = 40

/**
 * Return the raw FIFA ranking points for a team. Falls back to
 * the global mean (1500) for unknown codes so the delta is zero.
 */
export function fifaPointsFor(code: string): number {
  return FIFA_POINTS[code] ?? GLOBAL_MEAN
}

/**
 * Return the elo delta derived from FIFA ranking points. The
 * result is clamped to ±40 so FIFA points can never overwhelm
 * the tournament-stack signal that drives the model.
 */
export function fifaPointsDelta(code: string): number {
  const pts = fifaPointsFor(code)
  const raw = ((pts - GLOBAL_MEAN) / SCALE_DIVISOR) * MAX_DELTA
  return Math.round(Math.max(-MAX_DELTA, Math.min(MAX_DELTA, raw)))
}
