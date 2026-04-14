export interface Competition {
  id: number          // API-Football league ID
  key: string
  name: string
  shortName: string
  country: string
  color: string
  season: number
}

export const COMPETITIONS: Record<string, Competition> = {
  botola: {
    id: 200,
    key: 'botola',
    name: 'Botola Pro',
    shortName: 'BOT',
    country: 'Morocco',
    color: '#0a5229',
    season: 2025,
  },
  pl: {
    id: 39,
    key: 'pl',
    name: 'Premier League',
    shortName: 'PL',
    country: 'England',
    color: '#3d195b',
    season: 2025,
  },
  laliga: {
    id: 140,
    key: 'laliga',
    name: 'La Liga',
    shortName: 'LL',
    country: 'Spain',
    color: '#ee8700',
    season: 2025,
  },
  ucl: {
    id: 2,
    key: 'ucl',
    name: 'Champions League',
    shortName: 'UCL',
    country: 'Europe',
    color: '#0a1f5c',
    season: 2025,
  },
  wc: {
    id: 1,
    key: 'wc',
    name: 'FIFA World Cup',
    shortName: 'WC',
    country: 'World',
    color: '#c0000b',
    season: 2026,
  },
  afcon: {
    id: 6,
    key: 'afcon',
    name: 'Africa Cup of Nations',
    shortName: 'AFCON',
    country: 'Africa',
    color: '#b8820a',
    season: 2025,
  },
}
