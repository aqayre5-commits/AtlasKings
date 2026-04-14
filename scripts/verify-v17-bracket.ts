/**
 * Sanity check for the v17 knockout bracket.
 *
 * Prints R32, R16, QF pairings and traces feedsInto routing
 * from both semi-finals back to R32 to confirm the left/right
 * halves are clean and no match is orphaned.
 *
 * Run:  npx tsx scripts/verify-v17-bracket.ts
 */

import { getKnockoutBracket } from '../lib/simulator/knockout'

const bracket = getKnockoutBracket()

console.log('\n━━━ v17 R32 pairings ━━━')
for (const m of bracket.filter(m => m.stage === 'r32')) {
  console.log(
    `  #${String(m.matchNumber).padStart(2)}  ${m.homeLabel.padEnd(8)} v ${m.awayLabel.padEnd(8)}  → feeds R16 #${m.feedsInto}  · ${m.city}`,
  )
}

console.log('\n━━━ v17 R16 pairings ━━━')
for (const m of bracket.filter(m => m.stage === 'r16')) {
  console.log(
    `  #${m.matchNumber}  ${m.homeLabel.padEnd(4)} v ${m.awayLabel.padEnd(4)}  → feeds QF #${m.feedsInto}  · ${m.city}`,
  )
}

console.log('\n━━━ v17 QF pairings ━━━')
for (const m of bracket.filter(m => m.stage === 'qf')) {
  console.log(
    `  #${m.matchNumber}  ${m.homeLabel} v ${m.awayLabel}  → feeds SF #${m.feedsInto}`,
  )
}

console.log('\n━━━ v17 SF pairings ━━━')
for (const m of bracket.filter(m => m.stage === 'sf')) {
  console.log(
    `  #${m.matchNumber}  ${m.homeLabel} v ${m.awayLabel}  → feeds Final #${m.feedsInto}`,
  )
}

function trace(target: number): number[] {
  const out: number[] = []
  function walk(matchNumber: number) {
    out.push(matchNumber)
    for (const upstream of bracket) {
      if (upstream.feedsInto === matchNumber) walk(upstream.matchNumber)
    }
  }
  walk(target)
  return out.sort((a, b) => a - b)
}

const left = trace(101).filter(n => n !== 101)
const right = trace(102).filter(n => n !== 102)

console.log('\n━━━ Bracket halves (reverse feedsInto trace) ━━━')
console.log(`  SF 101 feeders: ${left.join(', ')}`)
console.log(`  SF 102 feeders: ${right.join(', ')}`)

const leftR32 = left.filter(n => n >= 73 && n <= 88).sort((a, b) => a - b)
const rightR32 = right.filter(n => n >= 73 && n <= 88).sort((a, b) => a - b)
console.log(`\n  Left  R32: ${leftR32.join(', ')}  (${leftR32.length} matches)`)
console.log(`  Right R32: ${rightR32.join(', ')}  (${rightR32.length} matches)`)

const leftClean = leftR32.every(n => n <= 80)
const rightClean = rightR32.every(n => n >= 81)
console.log(`\n  <= 80 / >= 81 split valid: ${leftClean && rightClean ? 'YES' : 'NO'}`)

// Visual bracket ordering (top-to-bottom within each half)
// mirrors BracketCanvas.tsx `bracketOrderedHalf`.
import { getFeedsSlot } from '../lib/simulator/knockout'

function feedersOrdered(target: number) {
  return bracket
    .filter(m => m.feedsInto === target)
    .sort((a, b) => {
      const sa = getFeedsSlot(a.matchNumber)
      const sb = getFeedsSlot(b.matchNumber)
      if (sa !== sb) return sa === 'home' ? -1 : 1
      return a.matchNumber - b.matchNumber
    })
}

function bracketOrdered(sfMatch: number) {
  const qf = feedersOrdered(sfMatch).filter(m => m.stage === 'qf')
  const r16: typeof bracket = []
  for (const q of qf) {
    for (const r of feedersOrdered(q.matchNumber).filter(m => m.stage === 'r16')) {
      r16.push(r)
    }
  }
  const r32: typeof bracket = []
  for (const r of r16) {
    for (const s of feedersOrdered(r.matchNumber).filter(m => m.stage === 'r32')) {
      r32.push(s)
    }
  }
  return { r32, r16, qf }
}

console.log('\n━━━ Bracket-ordered top-to-bottom (left half) ━━━')
const leftOrdered = bracketOrdered(101)
console.log(`  R32: ${leftOrdered.r32.map(m => m.matchNumber).join(' · ')}`)
console.log(`  R16: ${leftOrdered.r16.map(m => m.matchNumber).join(' · ')}`)
console.log(`  QF:  ${leftOrdered.qf.map(m => m.matchNumber).join(' · ')}`)

console.log('\n━━━ Bracket-ordered top-to-bottom (right half) ━━━')
const rightOrdered = bracketOrdered(102)
console.log(`  R32: ${rightOrdered.r32.map(m => m.matchNumber).join(' · ')}`)
console.log(`  R16: ${rightOrdered.r16.map(m => m.matchNumber).join(' · ')}`)
console.log(`  QF:  ${rightOrdered.qf.map(m => m.matchNumber).join(' · ')}`)

// Sanity check: for each R16, the two R32 feeders should be at
// consecutive even/odd positions in the bracket-ordered R32 list.
console.log('\n━━━ R32 pair adjacency check ━━━')
for (const half of [leftOrdered, rightOrdered] as const) {
  for (let i = 0; i < half.r32.length; i += 2) {
    const a = half.r32[i]
    const b = half.r32[i + 1]
    if (!a || !b) continue
    const ok = a.feedsInto === b.feedsInto
    console.log(
      `  Pair (${a.matchNumber}, ${b.matchNumber}) → R16 ${a.feedsInto}/${b.feedsInto} ${ok ? 'OK' : 'MISMATCH'}`,
    )
  }
}
