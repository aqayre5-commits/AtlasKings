/**
 * Sanity check for the groups-only Monte Carlo sample picker.
 *
 * Runs the picker a few times and reports where Spain finishes
 * in Group H for each sample. Under the elo model, Spain at
 * 1600 vs Uruguay 1440 / Cabo Verde 1280 / Saudi Arabia 1265
 * should finish 1st or 2nd in the vast majority of samples.
 *
 * Run:  npx tsx scripts/verify-mc-sample.ts
 */

import { runMonteCarloGroupsOnly } from '../lib/simulator/monteCarlo'

async function main() {
  const runs = 5
  console.log(`\nRunning groups-only MC ${runs} times, 10k iterations each…\n`)

  for (let i = 1; i <= runs; i++) {
    const out = await runMonteCarloGroupsOnly({
      iterations: 10_000,
      chaosFactor: 30,
      strengthModel: 'historical',
      lockedMatches: [],
      lockedGroupResults: {},
    })

    const groupH = out.sample.standingsByLetter['H'] ?? []
    const espPos = groupH.findIndex(r => r.code === 'ESP')
    const espRow = groupH[espPos]
    const espLabel = espPos === -1 ? 'MISSING' : `${espPos + 1}st/2nd/3rd/4th`[espPos * 4]

    // Pretty table for Group H
    console.log(`Run ${i}:`)
    groupH.forEach((row, idx) => {
      const marker = row.code === 'ESP' ? ' ← Spain' : ''
      console.log(
        `  ${idx + 1}. ${row.code.padEnd(4)} ${row.points} pts · ${row.won}W ${row.drawn}D ${row.lost}L · GD ${row.gd >= 0 ? '+' : ''}${row.gd}${marker}`,
      )
    })
    const placing = espPos === 0 ? '1st ✓' : espPos === 1 ? '2nd ✓' : espPos === 2 ? '3rd ✗' : '4th ✗'
    console.log(`  → Spain: ${placing} (${espRow?.points ?? '?'} pts)\n`)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
