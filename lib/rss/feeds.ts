// RSS feed sources for football news
// Curated & live-verified April 2026 — Morocco-first editorial strategy
//
// Each feed is HTTP-tested live. Dead/blocked/stale sources have been removed.
// keywordFilter: if present, only items whose title or description contains at
//                least one of the keywords (case-insensitive) are accepted.
//                Use this for broad feeds (construction, regional news) to
//                isolate Morocco/football-relevant content.

export interface FeedSource {
  url: string
  name: string
  lang: 'en' | 'fr' | 'es' | 'ar'
  categories: string[]
  priority: number
  /**
   * Optional whitelist of keywords. If set, items must contain at least one
   * keyword (case-insensitive) in title or description to be included.
   * Leave undefined to accept everything from the feed.
   */
  keywordFilter?: string[]
}

export const RSS_FEEDS: FeedSource[] = [
  // ═══════════════════════════════════════════════════
  //  TIER 1: MOROCCAN SOURCES — HIGHEST PRIORITY
  //  These produce 100% on-brand Morocco content.
  // ═══════════════════════════════════════════════════

  {
    url: 'https://en.hespress.com/sports/feed',
    name: 'Hespress English Sports',
    lang: 'en',
    categories: ['morocco', 'botola-pro', 'world-cup-2026', 'world-cup-2030'],
    priority: 98, // THE best Morocco-focused English source
  },
  {
    url: 'https://fr.hespress.com/sport/feed',
    name: 'Hespress FR Sport',
    lang: 'fr',
    categories: ['morocco', 'botola-pro', 'world-cup-2026', 'world-cup-2030'],
    priority: 97,
  },
  {
    url: 'https://www.hespress.com/sport/feed',
    name: 'Hespress AR Sport',
    lang: 'ar',
    categories: ['morocco', 'botola-pro', 'world-cup-2026', 'world-cup-2030'],
    priority: 97,
  },
  {
    url: 'https://www.moroccoworldnews.com/category/sports/feed/',
    name: 'Morocco World News',
    lang: 'en',
    categories: ['morocco', 'botola-pro', 'world-cup-2026', 'world-cup-2030'],
    priority: 95,
  },
  {
    url: 'https://www.yabiladi.com/rss',
    name: 'Yabiladi',
    lang: 'fr',
    categories: ['morocco', 'world-cup-2026', 'world-cup-2030'],
    priority: 80,
    keywordFilter: [
      'foot', 'sport', 'hakimi', 'atlas', 'can', 'mondial',
      'world cup', 'coupe du monde', 'botola', 'raja', 'wydad',
      'en-nesyri', 'ziyech', 'bounou', 'regragui', 'ouahbi',
      'stade', 'stadium', 'fifa', 'caf', 'afcon',
    ],
  },

  // ═══════════════════════════════════════════════════
  //  TIER 2: WC 2026 TRAVEL, BASE CAMPS & FAN GUIDES
  //  For "where will the Atlas Lions stay" content.
  // ═══════════════════════════════════════════════════

  {
    url: 'https://theworldcupguide.com/feed/',
    name: 'World Cup Guide',
    lang: 'en',
    categories: ['world-cup-2026', 'travel'],
    priority: 85, // Pure WC 2026 travel/logistics content
  },
  {
    url: 'https://www.insideworldfootball.com/feed/',
    name: 'Inside World Football',
    lang: 'en',
    categories: ['world-cup-2026', 'world-cup-2030', 'morocco', 'champions-league'],
    priority: 75,
  },

  // ═══════════════════════════════════════════════════
  //  TIER 3: WC 2030 STADIUMS & CONSTRUCTION
  //  For "Hassan II build", "Marrakech renovation", etc.
  // ═══════════════════════════════════════════════════

  {
    url: 'https://stadiumdb.com/rss/news',
    name: 'StadiumDB',
    lang: 'en',
    categories: ['world-cup-2030', 'world-cup-2026', 'stadiums'],
    priority: 85,
    keywordFilter: [
      // Morocco cities & stadiums
      'morocco', 'moroccan', 'casablanca', 'rabat', 'marrakech', 'marrakesh',
      'tangier', 'tanger', 'fez', 'fes', 'agadir', 'benslimane',
      'hassan ii', 'moulay abdellah', 'ibn batouta', 'mohamed v',
      // Tournament / Host context
      '2030', '2026', 'world cup', 'fifa', 'iberia', 'spain',
      'portugal', 'vigo', 'bilbao', 'sevilla', 'madrid', 'lisbon', 'porto',
      // WC 2026 hosts
      'metlife', 'sofi', 'azteca', 'bbva', 'arrowhead', 'lumen',
      'levi', 'gillette', 'lincoln financial', 'hard rock',
      'atl', 'houston', 'dallas', 'kansas city', 'toronto', 'vancouver',
    ],
  },
  {
    url: 'https://northafricapost.com/feed',
    name: 'North Africa Post',
    lang: 'en',
    categories: ['morocco', 'world-cup-2030'],
    priority: 70,
    keywordFilter: [
      'morocco', 'moroccan', 'football', 'stadium', 'world cup',
      'afcon', 'wydad', 'raja', 'maghreb', 'hakimi', 'atlas lions',
      'hassan ii', 'marrakech', 'casablanca', 'rabat', 'tangier',
      'fifa', 'caf', '2030', '2026',
    ],
  },
  {
    url: 'https://constructionreviewonline.com/feed/',
    name: 'Construction Review Online',
    lang: 'en',
    categories: ['world-cup-2030', 'stadiums'],
    priority: 55,
    keywordFilter: [
      'morocco', 'moroccan', 'casablanca', 'rabat', 'marrakech',
      'tangier', 'fez', 'agadir', 'stadium', 'fifa', 'world cup',
      'hassan ii', 'benslimane',
    ],
  },

  // ═══════════════════════════════════════════════════
  //  TIER 4: AFRICAN FOOTBALL
  // ═══════════════════════════════════════════════════

  {
    url: 'https://www.bbc.co.uk/sport/africa/rss.xml',
    name: 'BBC Africa Sport',
    lang: 'en',
    categories: ['morocco', 'botola-pro', 'afcon'],
    priority: 85,
  },

  // ═══════════════════════════════════════════════════
  //  TIER 5: INTERNATIONAL POWERHOUSES (EN)
  //  Premier League, global transfers, UCL coverage.
  // ═══════════════════════════════════════════════════

  {
    url: 'https://feeds.bbci.co.uk/sport/football/rss.xml',
    name: 'BBC Sport',
    lang: 'en',
    categories: ['premier-league', 'champions-league', 'transfers'],
    priority: 90,
  },
  {
    url: 'https://www.theguardian.com/football/rss',
    name: 'The Guardian',
    lang: 'en',
    categories: ['premier-league', 'la-liga', 'champions-league', 'transfers'],
    priority: 85,
  },
  {
    url: 'https://www.skysports.com/rss/12040',
    name: 'Sky Sports',
    lang: 'en',
    categories: ['premier-league', 'transfers', 'champions-league'],
    priority: 85,
  },
  {
    url: 'https://www.espn.com/espn/rss/soccer/news',
    name: 'ESPN',
    lang: 'en',
    categories: ['premier-league', 'la-liga', 'champions-league', 'world-cup-2026'],
    priority: 80,
  },
  {
    url: 'https://www.independent.co.uk/sport/football/rss',
    name: 'The Independent',
    lang: 'en',
    categories: ['premier-league', 'champions-league', 'world-cup-2026'],
    priority: 75,
  },
  {
    url: 'https://talksport.com/football/feed/',
    name: 'talkSPORT',
    lang: 'en',
    categories: ['premier-league', 'transfers'],
    priority: 65,
  },
  {
    url: 'https://www.fourfourtwo.com/feeds/all',
    name: 'FourFourTwo',
    lang: 'en',
    categories: ['analysis', 'premier-league', 'champions-league', 'world-cup-2026'],
    priority: 75,
  },
  {
    url: 'https://www.90min.com/posts.rss',
    name: '90min',
    lang: 'en',
    categories: ['premier-league', 'la-liga', 'champions-league', 'transfers'],
    priority: 60,
  },

  // ═══════════════════════════════════════════════════
  //  TIER 6: FRENCH-LANGUAGE (CRITICAL for Ligue 1 Moroccans)
  //  Hakimi (PSG), Ounahi, El Kaabi, Mazraoui coverage.
  // ═══════════════════════════════════════════════════

  {
    url: 'https://dwh.lequipe.fr/api/edito/rss?path=/Football/',
    name: "L'Équipe Football",
    lang: 'fr',
    categories: ['champions-league', 'premier-league', 'la-liga', 'transfers', 'morocco'],
    priority: 92, // French football bible — gold for Hakimi stories
  },
  {
    url: 'https://rmcsport.bfmtv.com/rss/football/',
    name: 'RMC Sport',
    lang: 'fr',
    categories: ['champions-league', 'la-liga', 'transfers'],
    priority: 80,
  },
  {
    url: 'https://www.france24.com/en/sport/rss',
    name: 'France 24 (EN)',
    lang: 'en',
    categories: ['morocco', 'world-cup-2026', 'world-cup-2030', 'afcon'],
    priority: 72,
  },
  {
    url: 'https://www.france24.com/fr/sports/rss',
    name: 'France 24 (FR)',
    lang: 'fr',
    categories: ['morocco', 'world-cup-2026', 'world-cup-2030', 'afcon'],
    priority: 72,
  },

  // ═══════════════════════════════════════════════════
  //  TIER 7: SPANISH FOOTBALL (La Liga depth)
  //  Brahim Diaz, Ez Abde, Lamine Yamal.
  // ═══════════════════════════════════════════════════

  {
    url: 'https://e00-marca.uecdn.es/rss/en/football.xml',
    name: 'Marca',
    lang: 'en',
    categories: ['la-liga', 'champions-league', 'transfers'],
    priority: 80,
  },
  {
    url: 'https://www.mundodeportivo.com/rss/home.xml',
    name: 'Mundo Deportivo',
    lang: 'es',
    categories: ['la-liga', 'champions-league'],
    priority: 75,
  },
  {
    url: 'https://www.football-espana.net/feed',
    name: 'Football Espana',
    lang: 'en',
    categories: ['la-liga'],
    priority: 72,
  },
  {
    url: 'https://www.football-italia.net/feed',
    name: 'Football Italia',
    lang: 'en',
    categories: ['champions-league'],
    priority: 60,
  },

  // ═══════════════════════════════════════════════════
  //  TIER 8: TRANSFERS
  // ═══════════════════════════════════════════════════

  {
    url: 'https://www.transfermarkt.com/rss/news',
    name: 'Transfermarkt',
    lang: 'en',
    categories: ['transfers'],
    priority: 80,
  },

  // ═══════════════════════════════════════════════════
  //  TIER 9: RIVALRY MONITORING (Algerian media on Morocco)
  //  What Algerian media writes about Morocco is itself news.
  // ═══════════════════════════════════════════════════

  {
    url: 'https://www.dzfoot.com/feed/',
    name: 'DZFoot',
    lang: 'fr',
    categories: ['morocco', 'afcon'],
    priority: 60,
    keywordFilter: [
      'maroc', 'morocco', 'hakimi', 'atlas', 'can', 'mondial',
      'world cup', 'coupe du monde', 'afcon', 'rivalité', 'maghreb',
    ],
  },
  {
    url: 'https://www.tsa-algerie.com/feed/',
    name: 'TSA Algérie',
    lang: 'fr',
    categories: ['morocco', 'afcon'],
    priority: 55,
    keywordFilter: [
      'maroc', 'morocco', 'hakimi', 'atlas', 'can', 'mondial',
      'world cup', 'coupe du monde', 'afcon', 'football',
    ],
  },
]

// ═══════════════════════════════════════════════════
//  REMOVED FEEDS (history kept for audit trail)
// ═══════════════════════════════════════════════════
//
// ❌ AS (as.com/rss/en/football.xml)
//    — Returns stale 2021 cached content. Removed April 2026.
//
// ❌ CaughtOffside
//    — Clickbait quality, polluted pipeline.
//
// ❌ Daily Mirror
//    — Tabloid noise, low Morocco relevance.
//
// ❌ Manchester Evening News
//    — Too niche for a Morocco-first site.
//
// ❌ beIN Sports (bein.com/en/rss/)
//    — Feed endpoint unreliable.
//
// ❌ Planet Football
//    — Duplicate of 90min/FourFourTwo.
//
// ❌ Get Football News France
//    — Redundant with L'Équipe + RMC Sport.
//
// ❌ PSG Talk
//    — Fan blog, unreliable publication schedule.
//
// ❌ Bundesliga Official
//    — Very low signal-to-noise for Morocco audience.
//
// ❌ Algérie 360
//    — Too political, low football signal.
//
// ❌ FIFA.com (api/rss/news)
//    — Endpoint returns HTML homepage, not RSS. FIFA killed their feed.
//
// ❌ Le360 Sport
//    — No RSS endpoint (404). Candidate for scraper.
//
// ❌ Le Matin Maroc
//    — /rss/* returns HTML index. Feed is fake.
//
// ❌ Footmercato
//    — Feed dead (404).
//
// ❌ UEFA Champions League
//    — No public RSS feed.
//
// ❌ CAF Online
//    — No public RSS feed.
//
// ❌ Foot Africa
//    — Bot-blocked (403).

// ═══════════════════════════════════════════════════
//  MOROCCAN PLAYER TRACKING
//  These names are used to detect Morocco-relevant articles
//  from any source and boost their priority.
// ═══════════════════════════════════════════════════

export const MOROCCO_SQUAD_NAMES: string[] = [
  // Goalkeepers
  'bounou', 'bono', 'mohamedi', 'benabid',
  // Defenders
  'hakimi', 'achraf hakimi', 'mazraoui', 'aguerd', 'saiss', 'chibi',
  'el yamiq', 'riad', 'diop', 'el karouani', 'ait boudlal',
  // Midfielders
  'amrabat', 'ounahi', 'brahim diaz', 'el khannouss', 'saibari',
  'targhalline', 'adli', 'hrimat', 'el aynaoui', 'driouech',
  // Attackers
  'en-nesyri', 'ennesyri', 'ziyech', 'ezzalzouli', 'el kaabi',
  'ben seghir', 'akhomach', 'rahimi', 'igamane', 'boufal',
  // Coach
  'ouahbi', 'mohamed ouahbi', 'regragui', 'walid regragui',
  // Team names
  'atlas lions', 'morocco national', 'moroccan football',
  'botola pro', 'raja casablanca', 'wydad', 'far rabat',
  'moghreb tetouan', 'rs berkane', 'ittihad tanger',

  // ── MOROCCAN-ORIGIN PLAYERS (playing for European national teams) ──
  // Spain
  'lamine yamal', 'yamal',
  'ansu fati', 'fati',
  // France
  'kylian mbappe', 'mbappe',
  'ousmane dembele', 'dembele',
  'nabil fekir', 'fekir',
  'karim benzema', 'benzema',
  'aurelien tchouameni', 'tchouameni',
  // Belgium
  'nacer chadli', 'chadli',
  'mehdi carcela', 'carcela',
  // Netherlands
  'xavi simons', 'simons',
  'sofyan amrabat',
  // Moroccan-origin at top clubs
  'munir el haddadi', 'munir',
  'achraf laaziri',
  'bilal el khannouss',
  'ibrahim salah',
]

// Static opponent fallback — live list is built dynamically in opponents.ts
// from API-Football fixtures. This is only used if the API is unavailable.
export const TRACKED_OPPONENTS_FALLBACK: string[] = [
  'senegal', 'brazil', 'scotland', 'haiti', 'croatia', 'portugal',
]
