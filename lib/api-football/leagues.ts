// API-Football league IDs
// Find more at: https://www.api-football.com/documentation-v3#tag/Leagues

export const LEAGUES = {
  botola:  { id: 200, name: 'Botola Pro',        country: 'Morocco',  color: '#0a5229' },
  pl:      { id: 39,  name: 'Premier League',     country: 'England',  color: '#3d195b' },
  laliga:  { id: 140, name: 'La Liga',            country: 'Spain',    color: '#ee8700' },
  ucl:     { id: 2,   name: 'Champions League',   country: 'World',    color: '#0a1f5c' },
  laliga2: { id: 141, name: 'La Liga 2',          country: 'Spain',    color: '#ee8700' },
  bundesliga:{ id: 78, name: 'Bundesliga',        country: 'Germany',  color: '#d20515' },
  seriea:  { id: 135, name: 'Serie A',            country: 'Italy',    color: '#024494' },
  ligue1:  { id: 61,  name: 'Ligue 1',           country: 'France',   color: '#091c3e' },
  wc:      { id: 1,   name: 'FIFA World Cup',     country: 'World',    color: '#c0000b', season: 2026 },
  afcon:   { id: 6,   name: 'Africa Cup of Nations', country: 'World', color: '#b8820a' },
  caf:     { id: 12,  name: 'CAF Champions League', country: 'World',  color: '#b8820a' },
} as const

export type LeagueKey = keyof typeof LEAGUES

// Current season — Pro plan
export const CURRENT_SEASON = 2025

// Get the correct season for a league (some leagues like WC use a different season)
export function getSeasonForLeague(leagueKey: LeagueKey): number {
  const league = LEAGUES[leagueKey]
  return ('season' in league ? league.season : CURRENT_SEASON) as number
}

// Morocco national team ID (API-Football team ID 31)
export const MOROCCO_TEAM_ID = 31

// Moroccan club team IDs
export const MOROCCAN_TEAMS = {
  raja:     { id: 976,  name: 'Raja Casablanca' },
  wydad:    { id: 968,  name: 'Wydad AC' },
  far:      { id: 969,  name: 'FAR Rabat' },
  berkane:  { id: 962,  name: 'Renaissance Berkane' },
}