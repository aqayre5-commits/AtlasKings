export type StageKey =
  | 'group'
  | 'r32'
  | 'r16'
  | 'qf'
  | 'sf'
  | 'bronze'
  | 'final'

export type MatchStatus = 'NS' | 'LIVE' | 'HT' | 'FT' | 'AET' | 'PEN' | 'POSTPONED'

export interface TeamLite {
  id: number
  name: string
  slug: string
  shortName?: string
  code?: string
  flagUrl?: string
  group?: string
  confederation?: string
  status?: 'qualified' | 'alive' | 'eliminated'
}

export interface FixtureLite {
  id: number
  stage: StageKey
  roundLabel: string
  group?: string
  dateUtc: string
  venue: string
  city: string
  status: MatchStatus
  homeTeam: TeamLite
  awayTeam: TeamLite
  homeScore?: number | null
  awayScore?: number | null
  slotLabel?: string
  isFeatured?: boolean
}

export interface GroupStandingRow {
  rank: number
  team: TeamLite
  played: number
  won: number
  drawn: number
  lost: number
  gf: number
  ga: number
  gd: number
  points: number
  qualificationStatus?: 'qualified' | 'playoff' | 'in_race' | 'eliminated'
  qualifierHint?: string
}

export interface GroupStanding {
  group: string
  rows: GroupStandingRow[]
}

export interface BestThirdRow {
  rank: number
  team: TeamLite
  group: string
  points: number
  gd: number
  gf: number
  status: 'currently_in' | 'currently_out'
  possibleSlotHint?: string
}

export interface BracketMatch {
  id: number
  stage: StageKey
  roundOrder: number
  matchNumber?: number
  slotLabel: string
  homeLabel: string
  awayLabel: string
  dateUtc: string
  venue: string
  city: string
  homeTeam?: TeamLite | null
  awayTeam?: TeamLite | null
  winnerTeamId?: number | null
  nextMatchId?: number | null
}

export interface PlayerStatRow {
  rank: number
  playerId: number
  playerName: string
  playerSlug: string
  playerPhoto?: string
  team: TeamLite
  matches: number
  minutes: number
  value: number
}

export interface NewsCardData {
  id: string
  title: string
  slug: string
  excerpt: string
  imageUrl?: string
  publishedAt: string
  category?: string
}

export interface OverviewPageData {
  liveMatches: FixtureLite[]
  featuredMatch?: FixtureLite | null
  featuredStory?: NewsCardData | null
  latestStories: NewsCardData[]
  fixturesPreview: FixtureLite[]
  miniStandings: GroupStanding[]
  bestThirdPreview: BestThirdRow[]
  bracketPreview: BracketMatch[]
  topScorers: PlayerStatRow[]
}
