/**
 * Smart YouTube video discovery for articles.
 *
 * Given article metadata, constructs a targeted search query,
 * calls the YouTube API, and selects the best matching video.
 * Includes a file-based cache to minimize API usage.
 */

import { searchYouTube, type YouTubeSearchResult } from './client'

// ── Known football channels (get scoring bonus) ──
const TRUSTED_CHANNELS = new Set([
  'sky sports football', 'sky sports', 'bein sports',
  'espn fc', 'espn', 'bt sport', 'tnt sports',
  'the athletic', 'premier league', 'la liga',
  'ligue 1 uber eats', 'bundesliga', 'serie a',
  'uefa champions league', 'fifa', 'caf',
  'bbc sport', 'goal', 'onefootball',
  'tifo football', 'football daily',
  'al jazeera arabic', 'bein sports fr',
])

// ── In-memory cache (persists for server lifetime) ──
const cache = new Map<string, { videoId: string; cachedAt: number }>()
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days

interface FindVideoInput {
  title: string
  teams?: string[]
  players?: string[]
  type?: string
  category?: string
}

/**
 * Find the best YouTube video for an article.
 * Returns videoId or null if no good match found.
 */
export async function findVideoForArticle(input: FindVideoInput): Promise<string | null> {
  const query = buildQuery(input)
  if (!query) return null

  // Check cache
  const cacheKey = query.toLowerCase().trim()
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL) {
    return cached.videoId
  }

  // Search YouTube
  const results = await searchYouTube(query)
  if (results.length === 0) return null

  // Score and select best result
  const best = selectBest(results, input)
  if (!best) return null

  // Cache the result
  cache.set(cacheKey, { videoId: best.videoId, cachedAt: Date.now() })

  return best.videoId
}

/**
 * Build a search query from article metadata.
 */
function buildQuery(input: FindVideoInput): string {
  const { title, teams, type } = input

  // Type-specific queries
  if (type === 'recap' && teams && teams.length >= 2) {
    return `${teams[0]} vs ${teams[1]} highlights`
  }
  if (type === 'transfer' && input.players?.length) {
    return `${input.players[0]} ${teams?.[0] ?? ''} transfer`
  }
  if (type === 'preview' && teams && teams.length >= 2) {
    return `${teams[0]} vs ${teams[1]} preview`
  }

  // Default: extract meaningful words from title
  const stopWords = new Set(['the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'is', 'are', 'was', 'were', 'has', 'have', 'had', 'be', 'been', 'with', 'from', 'by', 'as', 'this', 'that', 'it', 'its'])
  const words = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w))
    .slice(0, 6)

  if (words.length === 0) return ''
  return words.join(' ') + ' football'
}

/**
 * Select the best video from search results.
 * Returns null if no result meets the minimum quality threshold.
 */
function selectBest(
  results: YouTubeSearchResult[],
  input: FindVideoInput,
): YouTubeSearchResult | null {
  const titleWords = new Set(
    input.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2),
  )

  let bestScore = 0
  let bestResult: YouTubeSearchResult | null = null

  for (const result of results) {
    let score = 0

    // Title word overlap (0-100)
    const videoWords = result.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/)
    const overlap = videoWords.filter(w => titleWords.has(w)).length
    const overlapRatio = titleWords.size > 0 ? overlap / titleWords.size : 0
    score += Math.round(overlapRatio * 100)

    // Trusted channel bonus
    if (TRUSTED_CHANNELS.has(result.channelTitle.toLowerCase())) {
      score += 50
    }

    // Recency bonus (published in last 7 days)
    const daysOld = (Date.now() - new Date(result.publishedAt).getTime()) / 86_400_000
    if (daysOld < 2) score += 30
    else if (daysOld < 7) score += 15

    // Team name in video title/description
    if (input.teams?.length) {
      const videoText = (result.title + ' ' + result.description).toLowerCase()
      const teamMatch = input.teams.some(t => videoText.includes(t.toLowerCase()))
      if (teamMatch) score += 20
    }

    if (score > bestScore) {
      bestScore = score
      bestResult = result
    }
  }

  // Minimum threshold — reject poor matches
  if (bestScore < 30) return null

  return bestResult
}
