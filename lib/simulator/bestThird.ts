/**
 * Best third-placed team logic for 48-team World Cup.
 * Top 2 from each group = 24 teams, plus 8 best 3rd-placed teams = 32 total.
 *
 * FIFA defines which R32 slot each qualifying 3rd-placed team gets,
 * based on which groups the 8 qualifying 3rd-placed teams come from.
 */
import type { GroupStandingRow, SimTeam } from './groups'

export interface BestThirdEntry {
  team: SimTeam
  group: string
  points: number
  gd: number
  gf: number
  advances: boolean
}

/**
 * Rank all 12 third-placed teams across groups.
 * Returns sorted list — top 8 advance.
 */
export function rankBestThirds(
  allStandings: Record<string, GroupStandingRow[]>,
): BestThirdEntry[] {
  const thirds: BestThirdEntry[] = []

  for (const [group, rows] of Object.entries(allStandings)) {
    if (rows.length < 3) continue
    const thirdPlace = rows[2]
    thirds.push({
      team: thirdPlace.team,
      group,
      points: thirdPlace.points,
      gd: thirdPlace.gd,
      gf: thirdPlace.gf,
      advances: false,
    })
  }

  // Sort: points desc → GD desc → GF desc
  thirds.sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf)

  // Top 8 advance
  for (let i = 0; i < Math.min(8, thirds.length); i++) {
    thirds[i].advances = true
  }

  return thirds
}

/**
 * FIFA R32 slot assignments for best third-placed teams.
 * The 8 qualifying groups determine which R32 matches the 3rd-placed teams go to.
 *
 * This is a simplified mapping — FIFA publishes the exact table based on
 * which combination of 8 groups produce the qualifying 3rd-placed teams.
 * For the simulator, we assign them to the available R32 "3rd place" slots
 * in bracket order.
 */
export function assignThirdPlaceSlots(
  qualifyingThirds: BestThirdEntry[],
): Map<string, number> {
  // R32 match numbers that have a "best 3rd" slot (from FIFA bracket)
  // These are the 8 R32 matches where a 3rd-placed team plays against a group winner
  const thirdPlaceR32Slots = [79, 80, 81, 82, 83, 84, 85, 86]

  const slotMap = new Map<string, number>()
  const advancing = qualifyingThirds.filter(t => t.advances)

  advancing.forEach((entry, i) => {
    if (i < thirdPlaceR32Slots.length) {
      slotMap.set(entry.group, thirdPlaceR32Slots[i])
    }
  })

  return slotMap
}
