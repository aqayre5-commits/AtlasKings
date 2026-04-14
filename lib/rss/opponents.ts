// Dynamic Opponent Tracking
// Automatically detects who Morocco has played and will play,
// and feeds those team names into the article pipeline for relevance detection.

import { getTeamRecentResults, getTeamUpcomingFixtures } from '@/lib/api-football/fixtures'
import { MOROCCO_TEAM_ID } from '@/lib/api-football/leagues'

interface TrackedOpponent {
  name: string              // Team name as it appears in articles
  searchTerms: string[]     // Lowercase terms to match in RSS items
  reason: 'recent' | 'upcoming' | 'controversial'
  matchDate: string         // When they played/will play
  importance: number        // 1-10 (10 = WC final, 1 = old friendly)
}

// Known controversial matches and rivalries that stay relevant permanently
const CONTROVERSIAL_MATCHES: TrackedOpponent[] = [
  {
    name: 'Senegal',
    searchTerms: ['senegal', 'senegalese', 'afcon final', 'caf final', 'teranga lions'],
    reason: 'controversial',
    matchDate: '2026-03-29',
    importance: 10, // AFCON final controversy — stays tracked indefinitely
  },
]

// Permanent rivalry tracking — these are always monitored regardless of fixtures
const RIVALRY_TRACKING: TrackedOpponent[] = [
  {
    name: 'Algeria',
    searchTerms: [
      'algeria', 'algerian', 'algerie', 'الجزائر',
      'desert foxes', 'fennecs',
      'djamel belmadi', 'faf', // Algerian FA
      'algeria morocco', 'morocco algeria',
      'maghreb rivalry', 'north africa football',
      'algerian media', 'algerian press',
      'usma', 'mc alger', 'js kabylie', 'cr belouizdad', // Algerian clubs
    ],
    reason: 'controversial',
    matchDate: 'permanent',
    importance: 9, // Always high priority — geopolitical + sporting rivalry
  },
]

/**
 * Build the live opponent tracking list from API-Football data.
 * Called by the pipeline before processing RSS items.
 *
 * Returns team names + search terms for:
 * 1. Last 5 opponents (recent matches)
 * 2. Next 5 opponents (upcoming fixtures)
 * 3. Permanently tracked controversial matches
 */
export async function getTrackedOpponents(): Promise<TrackedOpponent[]> {
  const opponents: TrackedOpponent[] = [...CONTROVERSIAL_MATCHES, ...RIVALRY_TRACKING]
  const seenNames = new Set(opponents.map(o => o.name.toLowerCase()))

  try {
    // Recent opponents
    const recent = await getTeamRecentResults(MOROCCO_TEAM_ID, 5).catch(() => [])
    for (const match of recent) {
      const opponentName = match.home.name === 'Morocco' ? match.away.name : match.home.name
      const lower = opponentName.toLowerCase()
      if (!seenNames.has(lower)) {
        seenNames.add(lower)
        opponents.push({
          name: opponentName,
          searchTerms: [lower, ...generateSearchTerms(opponentName)],
          reason: 'recent',
          matchDate: match.date,
          importance: match.competition.includes('World Cup') ? 9
            : match.competition.includes('AFCON') || match.competition.includes('Africa') ? 8
            : match.competition.includes('Qualif') ? 7
            : 4, // friendly
        })
      }
    }

    // Upcoming opponents
    const upcoming = await getTeamUpcomingFixtures(MOROCCO_TEAM_ID, 5).catch(() => [])
    for (const match of upcoming) {
      const opponentName = match.home.name === 'Morocco' ? match.away.name : match.home.name
      const lower = opponentName.toLowerCase()
      if (!seenNames.has(lower)) {
        seenNames.add(lower)
        opponents.push({
          name: opponentName,
          searchTerms: [lower, ...generateSearchTerms(opponentName)],
          reason: 'upcoming',
          matchDate: match.date,
          importance: match.competition.includes('World Cup') ? 10
            : match.competition.includes('AFCON') || match.competition.includes('Africa') ? 8
            : match.competition.includes('Qualif') ? 7
            : 5,
        })
      }
    }
  } catch (err) {
    console.warn('[Opponents] Failed to fetch fixtures:', (err as Error).message)
  }

  // Sort by importance (highest first)
  return opponents.sort((a, b) => b.importance - a.importance)
}

/**
 * Generate search terms from a team name.
 * "Brazil" → ["brazil", "brazilian", "seleção"]
 * "Scotland" → ["scotland", "scottish", "tartan army"]
 */
function generateSearchTerms(name: string): string[] {
  const lower = name.toLowerCase()
  const terms: string[] = []

  // Common demonyms and nicknames
  const DEMONYMS: Record<string, string[]> = {
    'brazil': ['brazilian', 'seleção', 'selecao'],
    'scotland': ['scottish', 'tartan army'],
    'haiti': ['haitian'],
    'senegal': ['senegalese', 'teranga lions'],
    'croatia': ['croatian', 'vatreni'],
    'portugal': ['portuguese'],
    'argentina': ['argentinian', 'albiceleste'],
    'france': ['french', 'les bleus'],
    'spain': ['spanish', 'la roja'],
    'germany': ['german', 'die mannschaft'],
    'england': ['english', 'three lions'],
    'netherlands': ['dutch', 'oranje'],
    'belgium': ['belgian', 'red devils'],
    'nigeria': ['nigerian', 'super eagles'],
    'egypt': ['egyptian', 'pharaohs'],
    'ivory coast': ['ivorian', "côte d'ivoire"],
    'ghana': ['ghanaian', 'black stars'],
    'cameroon': ['cameroonian', 'indomitable lions'],
    'tunisia': ['tunisian', 'eagles of carthage'],
    'algeria': ['algerian', 'desert foxes'],
    'usa': ['american', 'usmnt', 'united states'],
    'mexico': ['mexican', 'el tri'],
    'japan': ['japanese', 'samurai blue'],
    'south korea': ['korean', 'taeguk warriors'],
  }

  if (DEMONYMS[lower]) {
    terms.push(...DEMONYMS[lower])
  }

  return terms
}

/**
 * Check if an RSS item is about a tracked opponent.
 * Returns the opponent and their importance if matched, null otherwise.
 */
export function matchOpponent(
  text: string,
  opponents: TrackedOpponent[]
): { opponent: TrackedOpponent; matched: string } | null {
  const lower = text.toLowerCase()

  for (const opp of opponents) {
    for (const term of opp.searchTerms) {
      if (lower.includes(term)) {
        return { opponent: opp, matched: term }
      }
    }
  }

  return null
}
