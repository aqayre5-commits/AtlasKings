/**
 * Sanity check for the tournament-based strength model.
 *
 * Prints the computed elo for every WC 2026 team sorted highest
 * first, plus the top-3 contributing tournaments per team. Quick
 * way to eyeball the model after updating tournament data.
 *
 * Run:  npx tsx scripts/verify-elos.ts
 */

import { teamElo, teamEloBreakdown } from '../lib/simulator/tournamentResults'
import { GROUPS } from '../lib/data/wc2026'

interface Row {
  code: string
  name: string
  elo: number
  top3: string
}

const rows: Row[] = []
for (const g of GROUPS) {
  for (const t of g.teams) {
    const breakdown = teamEloBreakdown(t.code)
    const top3 = breakdown.contributions
      .slice(0, 3)
      .map(c => `${c.tournamentLabel}:${c.stage}${c.estimated ? '*' : ''}`)
      .join(' · ')
    rows.push({
      code: t.code,
      name: t.name,
      elo: teamElo(t.code),
      top3: top3 || '(no tournament data)',
    })
  }
}

rows.sort((a, b) => b.elo - a.elo)

console.log('\n━━━ Team elos under the tournament-based model ━━━\n')
console.log('Rank  Elo   Code  Name                 Contributions')
console.log('──── ────── ───── ──────────────────── ─────────────')

rows.forEach((r, i) => {
  const rank = String(i + 1).padStart(3, ' ')
  const elo = String(r.elo).padStart(5, ' ')
  const code = r.code.padEnd(4, ' ')
  const name = r.name.padEnd(20, ' ').slice(0, 20)
  console.log(`${rank}. ${elo}  ${code}  ${name} ${r.top3}`)
})

// Group H spot check
console.log('\n━━━ Group H spot check ━━━\n')
const groupH = GROUPS.find(g => g.letter === 'H')
if (groupH) {
  for (const t of groupH.teams) {
    console.log(`  ${t.code}  ${teamElo(t.code)}  ${t.name}`)
  }
}
console.log('')
