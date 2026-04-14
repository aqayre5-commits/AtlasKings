/**
 * Moroccan players whose club matches should always surface
 * in the ticker. When a fixture involves one of these clubs,
 * the match is promoted to Tier 3 priority and the player's
 * name is shown as context.
 *
 * clubApiId = API-Football team ID for the player's current club.
 * Update when players transfer.
 */

export interface WatchlistPlayer {
  name: string
  shortName: string   // abbreviated for ticker display
  clubApiId: number
}

export const MOROCCAN_PLAYERS_WATCHLIST: WatchlistPlayer[] = [
  { name: 'Achraf Hakimi',       shortName: 'Hakimi',       clubApiId: 85   }, // PSG
  { name: 'Brahim Diaz',         shortName: 'Diaz',         clubApiId: 541  }, // Real Madrid
  { name: 'Noussair Mazraoui',   shortName: 'Mazraoui',     clubApiId: 33   }, // Man United
  { name: 'Bilal El Khannouss',  shortName: 'El Khannouss', clubApiId: 157  }, // Stuttgart
  { name: 'Nayef Aguerd',        shortName: 'Aguerd',       clubApiId: 81   }, // Marseille
  { name: 'Sofyan Amrabat',      shortName: 'Amrabat',      clubApiId: 543  }, // Real Betis
  { name: 'Yassine Bounou',      shortName: 'Bounou',       clubApiId: 1137 }, // Al Hilal
  { name: 'Youssef En-Nesyri',   shortName: 'En-Nesyri',    clubApiId: 611  }, // Fenerbahce
  { name: 'Hamza Igamane',       shortName: 'Igamane',      clubApiId: 79   }, // Lille
  { name: 'Eliesse Ben Seghir',  shortName: 'Ben Seghir',   clubApiId: 168  }, // Bayer Leverkusen
  { name: 'Neil El Aynaoui',     shortName: 'El Aynaoui',   clubApiId: 497  }, // Roma
  { name: 'Abdessamad Ezzalzouli', shortName: 'Ezzalzouli', clubApiId: 543  }, // Real Betis
  { name: 'Ayoub El Kaabi',      shortName: 'El Kaabi',     clubApiId: 567  }, // Olympiacos
]

/** Quick lookup: club API ID → watchlist player(s) at that club. */
const _clubMap = new Map<number, WatchlistPlayer[]>()
for (const p of MOROCCAN_PLAYERS_WATCHLIST) {
  const arr = _clubMap.get(p.clubApiId) ?? []
  arr.push(p)
  _clubMap.set(p.clubApiId, arr)
}

/** Check if a fixture involves a club with a Moroccan player. */
export function getMoroccanPlayersInFixture(
  homeTeamId: number,
  awayTeamId: number,
): WatchlistPlayer[] {
  const players: WatchlistPlayer[] = []
  const home = _clubMap.get(homeTeamId)
  if (home) players.push(...home)
  const away = _clubMap.get(awayTeamId)
  if (away) players.push(...away)
  return players
}
