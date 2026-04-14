// ── FIXTURE ──
export interface Fixture {
  id: number
  referee?: string
  date: string
  venue: { name: string; city: string }
  status: {
    long: string
    short: string
    elapsed: number | null
  }
  league: {
    id: number
    name: string
    country: string
    logo: string
    round: string
  }
  teams: {
    home: Team
    away: Team
  }
  goals: {
    home: number | null
    away: number | null
  }
  score: {
    halftime: { home: number | null; away: number | null }
    fulltime: { home: number | null; away: number | null }
  }
}

// ── TEAM ──
export interface Team {
  id: number
  name: string
  logo: string
  winner?: boolean | null
}

// ── STANDING ──
export interface Standing {
  rank: number
  team: Team
  points: number
  goalsDiff: number
  group: string
  form: string
  all: {
    played: number
    win: number
    draw: number
    lose: number
    goals: { for: number; against: number }
  }
  home: {
    played: number
    win: number
    draw: number
    lose: number
  }
  away: {
    played: number
    win: number
    draw: number
    lose: number
  }
}

// ── PLAYER ──
export interface Player {
  id: number
  name: string
  firstname: string
  lastname: string
  age: number
  nationality: string
  height?: string
  weight?: string
  photo: string
  injured: boolean
  position: string
}

export interface PlayerStats {
  player: Player
  statistics: Array<{
    team: Team
    league: {
      id: number
      name: string
      country: string
      logo: string
    }
    games: {
      appearences: number
      lineups: number
      minutes: number
      rating?: string
    }
    goals: {
      total: number
      assists: number
    }
    shots: {
      total: number
      on: number
    }
    passes: {
      total: number
      accuracy: number
    }
    cards: {
      yellow: number
      red: number
    }
  }>
}

// ── MATCH EVENTS ──
export interface MatchEvent {
  time: { elapsed: number; extra?: number }
  team: Team
  player: { id: number; name: string }
  assist: { id?: number; name?: string }
  type: 'Goal' | 'Card' | 'subst' | 'Var'
  detail: string
}

// ── MATCH STATS ──
export interface MatchStat {
  team: Team
  statistics: Array<{
    type: string
    value: number | string | null
  }>
}

// ── LINEUPS ──
export interface Lineup {
  team: Team
  formation: string
  startXI: Array<{ player: { id: number; name: string; number: number; pos: string; grid: string } }>
  substitutes: Array<{ player: { id: number; name: string; number: number; pos: string } }>
  coach: { id: number; name: string; photo: string }
}
