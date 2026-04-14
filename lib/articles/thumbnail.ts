// Smart Article Thumbnail Resolver
// Assigns representative photos to articles based on mentioned players, teams, or venues
// Uses both a static fast-lookup dictionary AND the database entity graph

import type { ArticleMeta } from '@/types/article'

// ═══════════════════════════════════════════════════
// STATIC PLAYER PHOTO IDS (fast, no DB call needed)
// Covers 80+ players — the most mentioned in football
// ═══════════════════════════════════════════════════

const PLAYER_PHOTO_IDS: Record<string, number> = {
  // ── MOROCCO NATIONAL TEAM (S-tier) ──
  'hakimi': 9, 'achraf hakimi': 9,
  'bounou': 2701, 'bono': 2701, 'yassine bounou': 2701,
  'en-nesyri': 47422, 'ennesyri': 47422, 'youssef en-nesyri': 47422,
  'ziyech': 37103, 'hakim ziyech': 37103,
  'brahim diaz': 744, 'brahim díaz': 744,
  'amrabat': 74, 'sofyan amrabat': 74,
  'mazraoui': 545, 'noussair mazraoui': 545,
  'ounahi': 129678, 'azzedine ounahi': 129678,
  'aguerd': 21694, 'nayef aguerd': 21694,
  'el khannouss': 340573, 'bilal el khannouss': 340573,
  'ezzalzouli': 181421, 'abde ezzalzouli': 181421,
  'saibari': 161897, 'ibrahim saibari': 161897,
  'ben seghir': 343320, 'eliesse ben seghir': 343320,
  'akhomach': 290740, 'ilias akhomach': 290740,
  'el kaabi': 2722, 'ayoub el kaabi': 2722,
  'boufal': 18793, 'sofiane boufal': 18793,
  'rahimi': 36579, 'soufiane rahimi': 36579,
  'igamane': 306979, 'hamza igamane': 306979,
  'adli': 129682, 'amine adli': 129682,
  'riad': 278898, 'chadi riad': 278898,
  'chibi': 194572,
  'diop': 18814,

  // ── MOROCCAN-ORIGIN PLAYERS (playing for other NTs) ──
  'lamine yamal': 552498, 'yamal': 552498,
  'mbappe': 278, 'kylian mbappe': 278, 'mbappé': 278,
  'benzema': 2295, 'karim benzema': 2295,
  'dembele': 1465, 'ousmane dembele': 1465, 'dembélé': 1465,
  'tchouameni': 46792, 'aurélien tchouaméni': 46792,
  'fekir': 903, 'nabil fekir': 903,
  'munir': 47380, 'munir el haddadi': 47380,

  // ── PREMIER LEAGUE STARS ──
  // For PL articles without specific player mentions, use TEAM logos instead
  // (team logos are more recognizable than wrong player photos)

  // ── LA LIGA STARS ──
  'bellingham': 132598, 'jude bellingham': 132598,

  // ── UCL / KEY STARS (verified IDs only) ──
  'mane': 304, 'sadio mane': 304, 'mané': 304,
  'osimhen': 47164, 'victor osimhen': 47164,
}

// ═══════════════════════════════════════════════════
// TEAM LOGO IDS
// ═══════════════════════════════════════════════════

const TEAM_PHOTO_IDS: Record<string, number> = {
  // Morocco
  'morocco': 31, 'atlas lions': 31, 'moroccan': 31,
  'raja': 976, 'raja casablanca': 976,
  'wydad': 968, 'wydad ac': 968,
  'far rabat': 969,
  'berkane': 962, 'rs berkane': 962,
  // Premier League
  'arsenal': 42, 'liverpool': 40, 'man city': 50, 'manchester city': 50,
  'chelsea': 49, 'tottenham': 47, 'man united': 33, 'manchester united': 33,
  'newcastle': 34, 'aston villa': 66, 'west ham': 48, 'brighton': 51,
  'wolves': 39, 'everton': 45, 'crystal palace': 52, 'fulham': 36,
  'brentford': 55, 'bournemouth': 35, 'nottingham forest': 65,
  'leicester': 46, 'ipswich': 57, 'southampton': 41,
  // La Liga
  'real madrid': 541, 'barcelona': 529, 'atletico madrid': 530, 'atletico': 530,
  'sevilla': 536, 'villarreal': 533, 'real sociedad': 548, 'betis': 543,
  'athletic bilbao': 531, 'athletic': 531, 'girona': 547, 'valencia': 532,
  // UCL / Europe
  'psg': 85, 'paris saint-germain': 85, 'bayern': 157, 'bayern munich': 157,
  'juventus': 496, 'inter': 505, 'ac milan': 489, 'napoli': 492,
  'borussia dortmund': 165, 'dortmund': 165, 'rb leipzig': 173,
  // National teams
  'england': 10, 'france': 2, 'spain': 9, 'germany': 25, 'brazil': 6,
  'argentina': 26, 'portugal': 27, 'belgium': 1, 'netherlands': 1118,
  'senegal': 1569, 'algeria': 1105, 'nigeria': 1108,
  'scotland': 5529, 'croatia': 3, 'haiti': 1114,
}

// ═══════════════════════════════════════════════════
// VENUE/STADIUM IMAGE IDS
// ═══════════════════════════════════════════════════

const VENUE_PHOTO_IDS: Record<string, number> = {
  'hassan ii': 1099, 'moulay abdellah': 1103, 'marrakech stadium': 1107,
  'tangier stadium': 1106, 'ibn batouta': 1106, 'fes stadium': 2260,
  'agadir stadium': 1105, 'adrar': 1105,
  'bernabeu': 1456, 'santiago bernabeu': 1456,
  'camp nou': 1455, 'spotify camp nou': 1455,
  'emirates': 494, 'emirates stadium': 494,
  'anfield': 489, 'etihad': 555, 'stamford bridge': 519,
  'old trafford': 556, 'wembley': 495, 'tottenham hotspur stadium': 593,
  'parc des princes': 488,
  'allianz arena': 498,
}

// ═══════════════════════════════════════════════════
// COMPETITION LOGO FALLBACKS
// ═══════════════════════════════════════════════════

const COMPETITION_IMAGES: Record<string, string> = {
  'premier league': 'https://media.api-sports.io/football/leagues/39.png',
  'la liga': 'https://media.api-sports.io/football/leagues/140.png',
  'champions league': 'https://media.api-sports.io/football/leagues/2.png',
  'ucl': 'https://media.api-sports.io/football/leagues/2.png',
  'botola': 'https://media.api-sports.io/football/leagues/200.png',
  'botola pro': 'https://media.api-sports.io/football/leagues/200.png',
  'world cup': 'https://media.api-sports.io/football/leagues/1.png',
  'afcon': 'https://media.api-sports.io/football/leagues/6.png',
  'africa cup': 'https://media.api-sports.io/football/leagues/6.png',
  'bundesliga': 'https://media.api-sports.io/football/leagues/78.png',
  'serie a': 'https://media.api-sports.io/football/leagues/135.png',
  'ligue 1': 'https://media.api-sports.io/football/leagues/61.png',
  'fa cup': 'https://media.api-sports.io/football/leagues/45.png',
  'europa league': 'https://media.api-sports.io/football/leagues/3.png',
}

/**
 * Resolve the best thumbnail image for an article.
 * Priority:
 * 1. Article's own image (if set — e.g. from GNews or manual)
 * 2. First mentioned player's photo
 * 3. First mentioned team's logo
 * 4. Venue image (for stadium/WC articles)
 * 5. Competition logo (league badge as fallback)
 * 6. null (fallback to gradient placeholder)
 */
export function resolveArticleThumbnail(article: ArticleMeta): string | null {
  // 1. Article already has an image
  if (article.image) return article.image

  // 1.5. YouTube video frame — better than generic player/team photos
  if (article.videoId) {
    // Prefer the viral frame (auto-captured from video) over the default thumbnail
    if (article.videoFrame) return article.videoFrame
    return `https://img.youtube.com/vi/${article.videoId}/maxresdefault.jpg`
  }

  const text = `${article.title} ${article.excerpt ?? ''}`.toLowerCase()

  // 2. Check for player mentions — most specific, best thumbnail
  for (const [name, id] of Object.entries(PLAYER_PHOTO_IDS)) {
    if (text.includes(name)) {
      return `https://media.api-sports.io/football/players/${id}.png`
    }
  }

  // 3. Check teams array first (from frontmatter), then text
  if (article.teams && article.teams.length > 0) {
    const teamSlug = article.teams[0]
    const teamId = TEAM_PHOTO_IDS[teamSlug]
    if (teamId) return `https://media.api-sports.io/football/teams/${teamId}.png`
  }

  for (const [name, id] of Object.entries(TEAM_PHOTO_IDS)) {
    if (text.includes(name)) {
      return `https://media.api-sports.io/football/teams/${id}.png`
    }
  }

  // 4. Check for venue/stadium mentions
  for (const [name, id] of Object.entries(VENUE_PHOTO_IDS)) {
    if (text.includes(name)) {
      return `https://media.api-sports.io/football/venues/${id}.png`
    }
  }

  // 5. Check for competition mentions (league badge as thumbnail)
  for (const [name, url] of Object.entries(COMPETITION_IMAGES)) {
    if (text.includes(name)) {
      return url
    }
  }

  // 6. Category-based fallback (competition logo from article category)
  const CATEGORY_IMAGES: Record<string, string> = {
    'premier-league': 'https://media.api-sports.io/football/leagues/39.png',
    'la-liga': 'https://media.api-sports.io/football/leagues/140.png',
    'champions-league': 'https://media.api-sports.io/football/leagues/2.png',
    'botola-pro': 'https://media.api-sports.io/football/leagues/200.png',
    'morocco': 'https://media.api-sports.io/football/teams/31.png',
    'world-cup': 'https://media.api-sports.io/football/leagues/1.png',
    'transfers': 'https://media.api-sports.io/football/leagues/39.png',
  }

  if (article.category && CATEGORY_IMAGES[article.category]) {
    return CATEGORY_IMAGES[article.category]
  }

  return null
}

/**
 * Get a player photo URL by player ID.
 */
export function getPlayerPhotoUrl(playerId: number): string {
  return `https://media.api-sports.io/football/players/${playerId}.png`
}

/**
 * Get a team logo URL by team ID.
 */
export function getTeamLogoUrl(teamId: number): string {
  return `https://media.api-sports.io/football/teams/${teamId}.png`
}

/**
 * Get a venue image URL by venue ID.
 */
export function getVenueImageUrl(venueId: number): string {
  return `https://media.api-sports.io/football/venues/${venueId}.png`
}
