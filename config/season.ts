export type SeasonState = 'regular' | 'pre_wc' | 'tournament' | 'post_tournament'

export const SEASON_CONFIG = {
  // Change this one value to reorient the entire site
  current: 'pre_wc' as SeasonState,

  worldCup2026: {
    start: '2026-06-11',
    end: '2026-07-19',
    hostCountries: ['USA', 'Canada', 'Mexico'],
  },

  // Which sections are primary in each state
  primarySections: {
    regular:        ['morocco', 'botola', 'pl', 'laliga', 'ucl'],
    pre_wc:         ['morocco', 'wc', 'botola', 'pl', 'ucl'],
    tournament:     ['wc', 'morocco'],
    post_tournament:['morocco', 'botola', 'pl', 'laliga', 'ucl'],
  },

  // Hero category preference per state
  heroCategory: {
    regular:        'any',
    pre_wc:         'any',
    tournament:     'world-cup',
    post_tournament:'any',
  },
}
