export interface NavSection {
  key: string
  label: string
  href: string
  icon?: string
  color?: string
  subLinks: SubLink[]
}

export interface SubLink {
  label: string
  href: string
}

export const NAV_SECTIONS: NavSection[] = [
  {
    key: 'home',
    label: 'Home',
    href: '/',
    subLinks: [],
  },
  {
    key: 'morocco',
    label: 'Morocco',
    href: '/morocco',
    icon: '🇲🇦',
    color: '#0a5229',
    subLinks: [
      { label: 'Home', href: '/morocco' },
      { label: 'Scores & Fixtures', href: '/morocco/fixtures' },
      { label: 'Table', href: '/morocco/table' },
      { label: 'Top Scorers', href: '/morocco/top-scorers' },
      { label: 'Squad', href: '/morocco/squad' },
    ],
  },
  {
    key: 'botola',
    label: 'Botola Pro',
    href: '/botola-pro',
    icon: '🏆',
    subLinks: [
      { label: 'Home', href: '/botola-pro' },
      { label: 'Scores & Fixtures', href: '/botola-pro/scores' },
      { label: 'Table', href: '/botola-pro/table' },
      { label: 'Top Scorers', href: '/botola-pro/top-scorers' },
      { label: 'Teams', href: '/botola-pro/teams' },
    ],
  },
  {
    key: 'pl',
    label: 'Premier League',
    href: '/premier-league',
    subLinks: [
      { label: 'Home', href: '/premier-league' },
      { label: 'Scores & Fixtures', href: '/premier-league/scores' },
      { label: 'Table', href: '/premier-league/table' },
      { label: 'Top Scorers', href: '/premier-league/top-scorers' },
      { label: 'Teams', href: '/premier-league/teams' },
      { label: 'Transfers', href: '/premier-league/transfers' },
    ],
  },
  {
    key: 'laliga',
    label: 'La Liga',
    href: '/la-liga',
    subLinks: [
      { label: 'Home', href: '/la-liga' },
      { label: 'Scores & Fixtures', href: '/la-liga/scores' },
      { label: 'Table', href: '/la-liga/table' },
      { label: 'Top Scorers', href: '/la-liga/top-scorers' },
      { label: 'Teams', href: '/la-liga/teams' },
      { label: 'Transfers', href: '/la-liga/transfers' },
    ],
  },
  {
    key: 'ucl',
    label: 'UCL',
    href: '/champions-league',
    subLinks: [
      { label: 'Home', href: '/champions-league' },
      { label: 'Scores & Fixtures', href: '/champions-league/scores' },
      { label: 'Groups', href: '/champions-league/groups' },
      { label: 'Teams', href: '/champions-league/teams' },
    ],
  },
  {
    key: 'transfers',
    label: 'Transfers',
    href: '/transfers',
    subLinks: [
      { label: 'Latest', href: '/transfers' },
      { label: 'Done Deals', href: '/transfers/done-deals' },
    ],
  },
  {
    key: 'wc26',
    label: 'WC 2026',
    href: '/world-cup-2026',
    icon: '🏆',
    subLinks: [
      { label: 'Home', href: '/world-cup-2026' },
      { label: 'Scores & Fixtures', href: '/world-cup-2026/scores' },
      { label: 'Groups', href: '/world-cup-2026/groups' },
      { label: 'Morocco', href: '/world-cup-2026/morocco' },
      { label: 'Top Scorers', href: '/world-cup-2026/statistics' },
    ],
  },
  {
    key: 'wc30',
    label: 'WC 2030',
    href: '/world-cup-2030',
    icon: '🇲🇦',
    subLinks: [
      { label: 'Home', href: '/world-cup-2030' },
      { label: 'Stadiums', href: '/world-cup-2030/stadiums' },
      { label: 'Cities', href: '/world-cup-2030/cities' },
      { label: 'Construction', href: '/world-cup-2030/construction' },
      { label: 'Travel Guide', href: '/world-cup-2030/travel' },
      { label: 'Tickets & FAQ', href: '/world-cup-2030/tickets' },
    ],
  },
]

// Mobile strip sections (subset of above)
export const MOBILE_STRIP_SECTIONS = ['home', 'morocco', 'botola', 'pl', 'ucl', 'transfers', 'wc26', 'wc30']
