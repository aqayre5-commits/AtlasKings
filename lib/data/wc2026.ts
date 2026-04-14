/**
 * FIFA World Cup 2026 — Canonical data module.
 *
 * Single source of truth for the tournament. Every WC 2026 surface on
 * the site (hub, Morocco group card, standings fallback, bracket shell,
 * /fixtures schedule, Morocco hub next-match, simulator) imports from
 * this file. Do NOT hardcode venues, dates, or group orders in pages —
 * add them here and import.
 *
 * Source: FIFA official match schedule PDF
 * `FWC26 Match Schedule_27032026_EN.pdf` (published 27 Mar 2026).
 *
 * What lives here (high confidence from PDF):
 *   • GROUPS — all 12 groups with seeded order (C1..C4 etc.)
 *   • VENUES — 16 host cities grouped by region
 *   • MOROCCO_GROUP + MOROCCO_FIXTURES — full Group C match list for
 *     Morocco with verified PDF venues, dates, kickoff times
 *   • KNOCKOUT_STAGES — structural shell (stage labels, match counts)
 *
 * What does NOT live here:
 *   • Non-Morocco individual match venues/dates for the 66 other group
 *     matches. The PDF text came through disordered and per-match
 *     confidence is too low to claim "single source of truth". The
 *     predictor simulator still carries its own approximate dataset
 *     in `lib/simulator/groups.ts`. Replace when a cleaner extraction
 *     is available.
 */

export type WC26Region = 'west' | 'central' | 'east'

export interface WC26Venue {
  /** Stable key — used in URLs and lookups. */
  key: string
  /** Host city name (canonical display). */
  city: string
  /** Stadium name used during the tournament. */
  stadium: string
  /** Country code — 'USA', 'MEX', 'CAN'. */
  country: 'USA' | 'MEX' | 'CAN'
  /** Geographic region per FIFA regional hub grouping. */
  region: WC26Region
}

export interface WC26GroupTeam {
  /** Seeded position within the group (1–4). PDF order. */
  seed: 1 | 2 | 3 | 4
  /** FIFA 3-letter code. */
  code: string
  /** Display name (English). Use i18n for other locales. */
  name: string
  /** api-football team ID — enables flag rendering via CDN. */
  apiId: number
}

export interface WC26Group {
  /** Group letter A–L. */
  letter: string
  teams: WC26GroupTeam[]
}

export interface WC26Fixture {
  /** Official FIFA match number (1–104). */
  matchNumber: number
  /** Group letter, or null for knockout. */
  group: string | null
  homeCode: string
  awayCode: string
  /** Venue key (see VENUES). */
  venueKey: string
  /** Kickoff in UTC (ET = UTC-4 in June/July DST). */
  kickoffUTC: string
  /** Local date for display (YYYY-MM-DD, ET). */
  dateET: string
  /** Local kickoff time string for display ("18:00 ET"). */
  kickoffDisplay: string
}

// ─── 16 host cities ──────────────────────────────────────────────

export const VENUES: WC26Venue[] = [
  // Western region — Pacific + Mexico
  { key: 'vancouver',      city: 'Vancouver',       stadium: 'BC Place',              country: 'CAN', region: 'west' },
  { key: 'seattle',         city: 'Seattle',          stadium: 'Lumen Field',           country: 'USA', region: 'west' },
  { key: 'sf-bay',          city: 'San Francisco Bay Area', stadium: "Levi's Stadium",  country: 'USA', region: 'west' },
  { key: 'los-angeles',     city: 'Los Angeles',      stadium: 'SoFi Stadium',          country: 'USA', region: 'west' },
  { key: 'guadalajara',     city: 'Guadalajara',      stadium: 'Estadio Akron',         country: 'MEX', region: 'west' },
  { key: 'mexico-city',     city: 'Mexico City',      stadium: 'Estadio Azteca',        country: 'MEX', region: 'west' },
  { key: 'monterrey',       city: 'Monterrey',        stadium: 'Estadio BBVA',          country: 'MEX', region: 'west' },

  // Central region
  { key: 'houston',         city: 'Houston',          stadium: 'NRG Stadium',           country: 'USA', region: 'central' },
  { key: 'dallas',          city: 'Dallas',           stadium: 'AT&T Stadium',          country: 'USA', region: 'central' },
  { key: 'kansas-city',     city: 'Kansas City',      stadium: 'Arrowhead Stadium',     country: 'USA', region: 'central' },

  // Eastern region
  { key: 'atlanta',         city: 'Atlanta',          stadium: 'Mercedes-Benz Stadium', country: 'USA', region: 'east' },
  { key: 'miami',           city: 'Miami',            stadium: 'Hard Rock Stadium',     country: 'USA', region: 'east' },
  { key: 'toronto',         city: 'Toronto',          stadium: 'BMO Field',             country: 'CAN', region: 'east' },
  { key: 'boston',          city: 'Boston',           stadium: 'Gillette Stadium',      country: 'USA', region: 'east' },
  { key: 'philadelphia',    city: 'Philadelphia',     stadium: 'Lincoln Financial Field', country: 'USA', region: 'east' },
  { key: 'new-york-new-jersey', city: 'New York / New Jersey', stadium: 'MetLife Stadium', country: 'USA', region: 'east' },
]

export function getVenue(key: string): WC26Venue | undefined {
  return VENUES.find(v => v.key === key)
}

// ─── All 12 groups in seeded order (C1, C2, C3, C4…) ────────────

export const GROUPS: WC26Group[] = [
  {
    letter: 'A',
    teams: [
      { seed: 1, code: 'MEX', name: 'Mexico',        apiId: 7 },
      { seed: 2, code: 'RSA', name: 'South Africa',  apiId: 1110 },
      { seed: 3, code: 'KOR', name: 'Korea Republic', apiId: 17 },
      { seed: 4, code: 'CZE', name: 'Czechia',       apiId: 3506 }, // A4: winner of UEFA playoff
    ],
  },
  {
    letter: 'B',
    teams: [
      { seed: 1, code: 'CAN', name: 'Canada',          apiId: 5529 },
      { seed: 2, code: 'BIH', name: 'Bosnia & Herzegovina', apiId: 1104 }, // B2: UEFA playoff
      { seed: 3, code: 'QAT', name: 'Qatar',           apiId: 1592 },
      { seed: 4, code: 'SUI', name: 'Switzerland',     apiId: 15 },
    ],
  },
  {
    letter: 'C',
    teams: [
      { seed: 1, code: 'BRA', name: 'Brazil',   apiId: 6 },
      { seed: 2, code: 'MAR', name: 'Morocco',  apiId: 31 },
      { seed: 3, code: 'HAI', name: 'Haiti',    apiId: 1114 },
      { seed: 4, code: 'SCO', name: 'Scotland', apiId: 1108 },
    ],
  },
  {
    letter: 'D',
    teams: [
      { seed: 1, code: 'USA', name: 'United States', apiId: 2384 },
      { seed: 2, code: 'PAR', name: 'Paraguay',      apiId: 1583 },
      { seed: 3, code: 'AUS', name: 'Australia',     apiId: 20 },
      { seed: 4, code: 'TUR', name: 'Türkiye',       apiId: 1579 }, // D4: UEFA playoff
    ],
  },
  {
    letter: 'E',
    teams: [
      { seed: 1, code: 'GER', name: 'Germany',       apiId: 25 },
      { seed: 2, code: 'CUW', name: 'Curaçao',       apiId: 1576 },
      { seed: 3, code: 'CIV', name: "Côte d'Ivoire", apiId: 1577 },
      { seed: 4, code: 'ECU', name: 'Ecuador',       apiId: 1595 },
    ],
  },
  {
    letter: 'F',
    teams: [
      { seed: 1, code: 'NED', name: 'Netherlands', apiId: 1118 },
      { seed: 2, code: 'JPN', name: 'Japan',       apiId: 12 },
      { seed: 3, code: 'SWE', name: 'Sweden',      apiId: 1575 }, // F3: UEFA playoff
      { seed: 4, code: 'TUN', name: 'Tunisia',     apiId: 1569 },
    ],
  },
  {
    letter: 'G',
    teams: [
      { seed: 1, code: 'BEL', name: 'Belgium',     apiId: 1 },
      { seed: 2, code: 'EGY', name: 'Egypt',       apiId: 1574 },
      { seed: 3, code: 'IRN', name: 'IR Iran',     apiId: 1573 },
      { seed: 4, code: 'NZL', name: 'New Zealand', apiId: 1571 },
    ],
  },
  {
    letter: 'H',
    teams: [
      { seed: 1, code: 'ESP', name: 'Spain',        apiId: 9 },
      { seed: 2, code: 'CPV', name: 'Cabo Verde',   apiId: 1578 },
      { seed: 3, code: 'KSA', name: 'Saudi Arabia', apiId: 23 },
      { seed: 4, code: 'URU', name: 'Uruguay',      apiId: 1580 },
    ],
  },
  {
    letter: 'I',
    teams: [
      { seed: 1, code: 'FRA', name: 'France',  apiId: 2 },
      { seed: 2, code: 'SEN', name: 'Senegal', apiId: 1569 },
      { seed: 3, code: 'IRQ', name: 'Iraq',    apiId: 1582 }, // I3: intercontinental playoff
      { seed: 4, code: 'NOR', name: 'Norway',  apiId: 1581 },
    ],
  },
  {
    letter: 'J',
    teams: [
      { seed: 1, code: 'ARG', name: 'Argentina', apiId: 26 },
      { seed: 2, code: 'ALG', name: 'Algeria',   apiId: 1105 },
      { seed: 3, code: 'AUT', name: 'Austria',   apiId: 1584 },
      { seed: 4, code: 'JOR', name: 'Jordan',    apiId: 1585 },
    ],
  },
  {
    letter: 'K',
    teams: [
      { seed: 1, code: 'POR', name: 'Portugal',   apiId: 27 },
      { seed: 2, code: 'COD', name: 'Congo DR',   apiId: 1588 }, // K2: intercontinental playoff
      { seed: 3, code: 'UZB', name: 'Uzbekistan', apiId: 1586 },
      { seed: 4, code: 'COL', name: 'Colombia',   apiId: 1587 },
    ],
  },
  {
    letter: 'L',
    teams: [
      { seed: 1, code: 'ENG', name: 'England', apiId: 10 },
      { seed: 2, code: 'CRO', name: 'Croatia', apiId: 3 },
      { seed: 3, code: 'GHA', name: 'Ghana',   apiId: 1589 },
      { seed: 4, code: 'PAN', name: 'Panama',  apiId: 1590 },
    ],
  },
]

export const GROUP_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'] as const

export function getGroup(letter: string): WC26Group | undefined {
  return GROUPS.find(g => g.letter === letter)
}

export function getGroupTeams(letter: string): WC26GroupTeam[] {
  return getGroup(letter)?.teams ?? []
}

/**
 * API-Football CDN flag URL for a given team api ID.
 *
 * ⚠  Prefer `countryFlagUrl(code)` for new code. api-football's
 * `/football/teams/{id}.png` endpoint returns CLUB crests for many
 * IDs and national-team logos only for the curated subset, so any
 * slip in the `apiId` value renders the wrong emblem. Country flags
 * are resolved from ISO-3166 codes via flagcdn.com instead.
 */
export function flagUrl(apiId: number): string {
  return `https://media.api-sports.io/football/teams/${apiId}.png`
}

// ─── Country flags ──────────────────────────────────────────────

/**
 * FIFA 3-letter code → ISO-3166-1 alpha-2 lowercase code (with
 * a handful of subdivisions for the Home Nations).
 *
 * Used by `countryFlagUrl()` below. These are reliable across
 * flagcdn.com and most flag CDNs.
 */
export const COUNTRY_ISO: Record<string, string> = {
  // Group A
  MEX: 'mx', RSA: 'za', KOR: 'kr', CZE: 'cz',
  // Group B
  CAN: 'ca', BIH: 'ba', QAT: 'qa', SUI: 'ch',
  // Group C
  BRA: 'br', MAR: 'ma', HAI: 'ht', SCO: 'gb-sct',
  // Group D
  USA: 'us', PAR: 'py', AUS: 'au', TUR: 'tr',
  // Group E
  GER: 'de', CUW: 'cw', CIV: 'ci', ECU: 'ec',
  // Group F
  NED: 'nl', JPN: 'jp', SWE: 'se', TUN: 'tn',
  // Group G
  BEL: 'be', EGY: 'eg', IRN: 'ir', NZL: 'nz',
  // Group H
  ESP: 'es', CPV: 'cv', KSA: 'sa', URU: 'uy',
  // Group I
  FRA: 'fr', SEN: 'sn', IRQ: 'iq', NOR: 'no',
  // Group J
  ARG: 'ar', ALG: 'dz', AUT: 'at', JOR: 'jo',
  // Group K
  POR: 'pt', COD: 'cd', UZB: 'uz', COL: 'co',
  // Group L
  ENG: 'gb-eng', CRO: 'hr', GHA: 'gh', PAN: 'pa',
}

/**
 * Country-flag URL for a FIFA 3-letter code. Uses flagcdn.com which
 * serves PNG (raster sizes: 20/40/80/160/320/640/1280/2560) and is
 * free / unlimited for open-source projects.
 *
 * Unknown codes fall back to a 1×1 transparent pixel so the UI
 * never renders a broken image icon.
 */
export function countryFlagUrl(code: string, size: 20 | 40 | 80 | 160 | 320 = 40): string {
  const iso = COUNTRY_ISO[code]
  if (!iso) {
    return 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
  }
  return `https://flagcdn.com/w${size}/${iso}.png`
}

/**
 * Full team name from a 3-letter code. Useful for cards that want
 * the long form without reaching into GROUPS.
 */
export function teamNameFromCode(code: string): string {
  for (const g of GROUPS) {
    const t = g.teams.find(tm => tm.code === code)
    if (t) return t.name
  }
  return code
}

// ─── Morocco Group C metadata ────────────────────────────────────

export const MOROCCO_GROUP_LETTER = 'C'
/** Current FIFA ranking as of the draw. Updated when FIFA publishes. */
export const MOROCCO_FIFA_RANK = 13

/**
 * Morocco's three Group C fixtures.
 *
 * All kickoffs are 18:00 ET (22:00 UTC during June DST).
 * Venues and dates extracted from the FIFA match schedule grid.
 *
 *   Match 7  · Sat 13 Jun · BRA v MAR · New York / New Jersey
 *   Match 30 · Sat 20 Jun · SCO v MAR · Boston
 *   Match 50 · Wed 24 Jun · MAR v HAI · Atlanta
 */
export const MOROCCO_FIXTURES: WC26Fixture[] = [
  {
    matchNumber: 7,
    group: 'C',
    homeCode: 'BRA',
    awayCode: 'MAR',
    venueKey: 'new-york-new-jersey',
    dateET: '2026-06-13',
    kickoffUTC: '2026-06-13T22:00:00Z',
    kickoffDisplay: '18:00 ET',
  },
  {
    matchNumber: 30,
    group: 'C',
    homeCode: 'SCO',
    awayCode: 'MAR',
    venueKey: 'boston',
    dateET: '2026-06-20',
    kickoffUTC: '2026-06-20T22:00:00Z',
    kickoffDisplay: '18:00 ET',
  },
  {
    matchNumber: 50,
    group: 'C',
    homeCode: 'MAR',
    awayCode: 'HAI',
    venueKey: 'atlanta',
    dateET: '2026-06-24',
    kickoffUTC: '2026-06-24T22:00:00Z',
    kickoffDisplay: '18:00 ET',
  },
]

/**
 * First scheduled Morocco match by date. Safe to use in banners as the
 * "next match" fallback while the live API pipeline is inactive.
 */
export function getMoroccoOpener(): WC26Fixture {
  return MOROCCO_FIXTURES[0]
}

// ─── Legacy-shaped Morocco helpers (for existing consumers) ─────

/**
 * Shape consumed by the `<MoroccoGroupCard>` props.
 * Returns the 4 Group C teams in PDF seed order with zero-valued
 * standings rows so the mini table renders correctly before any
 * tournament match is played.
 */
export function getMoroccoGroupTableRows() {
  return getGroupTeams(MOROCCO_GROUP_LETTER).map(t => ({
    rank: t.seed,
    name: t.name,
    code: t.code,
    // Country flag via flagcdn.com (resolved from ISO code), not
    // the api-football team-logo endpoint which returns club crests
    // for many of the numeric IDs.
    flagUrl: countryFlagUrl(t.code, 80),
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    points: 0,
    isMorocco: t.code === 'MAR',
  }))
}

/**
 * Shape consumed by the `<MoroccoHeroBanner>` and `<MoroccoGroupCard>`
 * fixture lists. Pre-resolves the opponent flag + venue display so
 * consumers do not need to cross-reference GROUPS or VENUES.
 */
export function getMoroccoFixtureCards() {
  return MOROCCO_FIXTURES.map(f => {
    const isHome = f.homeCode === 'MAR'
    const opponentCode = isHome ? f.awayCode : f.homeCode
    const opponent = GROUPS
      .find(g => g.letter === 'C')
      ?.teams.find(t => t.code === opponentCode)
    const venue = getVenue(f.venueKey)
    return {
      opponent: opponent?.name ?? opponentCode,
      opponentCode,
      opponentFlag: countryFlagUrl(opponentCode, 80),
      date: f.dateET,
      kickoffUTC: f.kickoffUTC,
      venue: venue?.stadium ?? '',
      city: venue?.city ?? '',
      isHome,
      matchNumber: f.matchNumber,
      status: 'upcoming' as const,
    }
  })
}

// ─── Knockout stage structural shell ─────────────────────────────

export type WC26Stage = 'r32' | 'r16' | 'qf' | 'sf' | 'bronze' | 'final'

export interface WC26StageMeta {
  stage: WC26Stage
  matchCount: number
  firstMatchNumber: number
  lastMatchNumber: number
}

/**
 * Structural metadata for the knockout bracket. Exact match-by-match
 * venues and dates live in `lib/simulator/knockout.ts` which is the
 * only consumer right now. Centralising only the shape so the
 * bracket fallback page can render skeleton cards without importing
 * simulator internals.
 */
export const KNOCKOUT_STAGES: WC26StageMeta[] = [
  { stage: 'r32',    matchCount: 16, firstMatchNumber: 73,  lastMatchNumber: 88  },
  { stage: 'r16',    matchCount: 8,  firstMatchNumber: 89,  lastMatchNumber: 96  },
  { stage: 'qf',     matchCount: 4,  firstMatchNumber: 97,  lastMatchNumber: 100 },
  { stage: 'sf',     matchCount: 2,  firstMatchNumber: 101, lastMatchNumber: 102 },
  { stage: 'bronze', matchCount: 1,  firstMatchNumber: 103, lastMatchNumber: 103 },
  { stage: 'final',  matchCount: 1,  firstMatchNumber: 104, lastMatchNumber: 104 },
]

/**
 * The Final. Fixed venue + date by FIFA.
 */
export const WC26_FINAL = {
  matchNumber: 104,
  dateET: '2026-07-19',
  venueKey: 'new-york-new-jersey',
} as const

// ─── GroupStanding shape for MiniStandings component ─────────────
//
// Pre-tournament, the live API returns standings with arbitrary row
// order (and sometimes only partial groups). That caused the "All
// Groups" grid on /wc-2026 to render only four groups in reversed
// alphabetical order. `getStaticGroupStandings()` returns the full
// 12-group set in canonical PDF seed order with zero-value rows, so
// the hub can render a correct skeleton until the first kickoff.
// Once real match data exists, the hub can switch back to the live
// API payload without any component change.
//
// Shape matches `types/world-cup.ts → GroupStanding[]` so we can
// drop this straight into <MiniStandings groups={...} />.

export interface WC26StaticStanding {
  group: string
  rows: {
    rank: number
    team: {
      id: number
      name: string
      slug: string
      shortName?: string
      code?: string
      flagUrl?: string
      group?: string
    }
    played: number
    won: number
    drawn: number
    lost: number
    gf: number
    ga: number
    gd: number
    points: number
  }[]
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Returns all 12 groups as GroupStanding[] with zero-value rows in
 * seeded PDF order. Pass `excludeGroup` to filter out Morocco's
 * group when a dedicated Morocco group card is rendered elsewhere.
 */
export function getStaticGroupStandings(options?: {
  excludeGroup?: string
}): WC26StaticStanding[] {
  const excluded = options?.excludeGroup
  return GROUPS
    .filter(g => g.letter !== excluded)
    .map(g => ({
      group: `Group ${g.letter}`,
      rows: g.teams.map(t => ({
        rank: t.seed,
        team: {
          id: t.apiId,
          name: t.name,
          slug: slugify(t.name),
          shortName: t.name,
          code: t.code,
          flagUrl: countryFlagUrl(t.code, 80),
          group: g.letter,
        },
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        gf: 0,
        ga: 0,
        gd: 0,
        points: 0,
      })),
    }))
}
