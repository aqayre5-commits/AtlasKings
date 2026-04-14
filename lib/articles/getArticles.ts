import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { readingTime } from '@/lib/utils'
import type { Article, ArticleMeta, ArticleCategory, ArticleType } from '@/types/article'

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles')

// ── SCORING ──────────────────────────────────────────

const TYPE_MULTIPLIERS: Record<ArticleType, number> = {
  breaking: 3.0,
  feature: 2.0,
  recap: 1.5,
  preview: 1.5,
  transfer: 1.3,
  analysis: 1.2,
  opinion: 1.0,
  standard: 1.0,
}

const GRAVITY = 1.5 // Higher = faster decay. 1.5 is moderate (ESPN-like)

/**
 * Compute article ranking score.
 * Score = (priority × type_multiplier × boost) / (hours + 2) ^ gravity
 *
 * - priority: 1-100 editorial weight (default 50)
 * - type_multiplier: breaking=3x, feature=2x, etc.
 * - Morocco boost: articles tagged with 'morocco' team get 1.5x AND decay slower
 * - Featured articles get 2x boost
 * - Time decay: standard articles halve every ~8-10 hours
 * - Morocco articles use softer gravity (1.2 vs 1.5) — stay visible ~2x longer
 */
function computeScore(meta: ArticleMeta): number {
  const priority = meta.priority ?? 50
  const type = meta.type ?? 'standard'
  const multiplier = TYPE_MULTIPLIERS[type] ?? 1.0

  const hoursSincePublish = Math.max(0,
    (Date.now() - new Date(meta.date).getTime()) / 3600000
  )

  const isMorocco = meta.teams?.includes('morocco') || meta.category === 'morocco'

  let boost = 1.0
  if (meta.featured) boost *= 2.0
  if (isMorocco) boost *= 1.5

  // Morocco content decays slower (gravity 1.2 vs 1.5)
  // This means Morocco articles stay visible ~2x longer than equivalent non-Morocco articles
  const gravity = isMorocco ? 1.2 : GRAVITY

  return (priority * multiplier * boost) / Math.pow(hoursSincePublish + 2, gravity)
}

/**
 * Apply team-specific boost when viewing a team page.
 * Articles tagged with the team get a 3x boost.
 */
function computeScoreForTeam(meta: ArticleMeta, teamSlug: string): number {
  const base = meta.score ?? computeScore(meta)
  if (meta.teams?.includes(teamSlug)) return base * 3
  if (meta.category === teamSlug || meta.tags?.includes(teamSlug)) return base * 2
  return base
}

// ── ARTICLE FETCHING ─────────────────────────────────

function parseArticleMeta(filename: string, dir: string): ArticleMeta {
  const slug = filename.replace(/\.md$/, '')
  const raw = fs.readFileSync(path.join(dir, filename), 'utf8')
  const { data, content } = matter(raw)

  const meta: ArticleMeta = {
    slug,
    title: data.title ?? '',
    excerpt: data.excerpt ?? '',
    category: (data.category ?? 'morocco') as ArticleCategory,
    author: data.author ?? 'Atlas Kings Editorial Team',
    date: data.date ?? new Date().toISOString(),
    modified: data.modified ?? data.date,
    image: data.image,
    readingTime: readingTime(content),
    // Scoring fields
    featured: data.featured ?? false,
    tags: data.tags ?? [],
    priority: data.priority ?? 50,
    type: (data.type as ArticleType) ?? 'standard',
    teams: data.teams ?? [],
    players: data.players ?? [],
    // Trust + provenance (default 'automated' so legacy articles still render)
    trustState: data.trustState ?? 'automated',
    sourceUrl: data.sourceUrl,
    // Video
    videoId: data.videoId,
    videoFrame: data.videoFrame,
  }

  meta.score = computeScore(meta)
  return meta
}

/**
 * Get all articles for a language, sorted by ranking score (highest first).
 */
export function getArticlesByLang(lang: 'en' | 'ar' | 'fr' = 'en'): ArticleMeta[] {
  const dir = path.join(ARTICLES_DIR, lang)
  if (!fs.existsSync(dir)) return []

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'))
  const articles = files.map(f => parseArticleMeta(f, dir))

  // Sort by score (highest first), then by date as tiebreaker
  return articles.sort((a, b) => {
    const scoreDiff = (b.score ?? 0) - (a.score ?? 0)
    if (Math.abs(scoreDiff) > 0.001) return scoreDiff
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

/**
 * Get articles for a specific category, sorted by score.
 * When teamSlug is provided, articles tagged with that team get boosted.
 */
export function getArticlesByCategory(
  category: ArticleCategory,
  lang: 'en' | 'ar' | 'fr' = 'en',
  limit?: number,
  teamSlug?: string,
): ArticleMeta[] {
  let all = getArticlesByLang(lang).filter(a => a.category === category)

  // Apply team boost if specified
  if (teamSlug) {
    all = all.map(a => ({ ...a, score: computeScoreForTeam(a, teamSlug) }))
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
  }

  return limit ? all.slice(0, limit) : all
}

/**
 * Get articles relevant to a team (by team tag, category, or player tag).
 * Used on team-specific pages like Morocco.
 */
export function getArticlesForTeam(
  teamSlug: string,
  lang: 'en' | 'ar' | 'fr' = 'en',
  limit?: number,
): ArticleMeta[] {
  const all = getArticlesByLang(lang)

  // Score each article with team boost
  const scored = all.map(a => ({
    ...a,
    score: computeScoreForTeam(a, teamSlug),
  })).sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

  return limit ? scored.slice(0, limit) : scored
}

/**
 * Cross-category article flow for section pages.
 *
 * Returns articles relevant to a section using this priority:
 * 1. Direct category match (e.g. category === 'premier-league') — highest relevance
 * 2. Team tag match (e.g. teams includes 'morocco') from ANY category — cross-category flow
 * 3. Tag match (e.g. tags includes 'premier-league') from ANY category
 * 4. General fallback articles to fill remaining slots
 *
 * This is how ESPN works — an article about Hakimi (PSG/Ligue 1)
 * also appears on the Morocco section because teams: ['morocco'].
 */
export function getArticlesForSection(
  category: ArticleCategory,
  lang: 'en' | 'ar' | 'fr' = 'en',
  limit: number = 10,
): ArticleMeta[] {
  const all = getArticlesByLang(lang)

  // Map category to team slug for cross-matching
  const CATEGORY_TO_TEAM: Record<string, string> = {
    'morocco': 'morocco',
    'botola-pro': 'botola',
    'premier-league': 'premier-league',
    'la-liga': 'la-liga',
    'champions-league': 'champions-league',
    'transfers': 'transfers',
    'world-cup': 'world-cup',
  }
  const teamSlug = CATEGORY_TO_TEAM[category] ?? category

  // Score articles with relevance boost
  const scored = all.map(a => {
    let relevanceBoost = 1.0

    // Direct category match — strongest signal
    if (a.category === category) relevanceBoost = 5.0
    // Team tag match — cross-category flow
    else if (a.teams?.includes(teamSlug)) relevanceBoost = 3.0
    // Tag match — lighter cross-category
    else if (a.tags?.includes(category) || a.tags?.includes(teamSlug)) relevanceBoost = 2.0
    // No match — filler only
    else relevanceBoost = 0.3

    return {
      ...a,
      score: (a.score ?? 0) * relevanceBoost,
    }
  }).sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

  return scored.slice(0, limit)
}

/**
 * Get full article by slug (for article detail page).
 */
export function getArticleBySlug(slug: string, lang: 'en' | 'ar' | 'fr' = 'en'): Article | null {
  const filePath = path.join(ARTICLES_DIR, lang, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title ?? '',
    excerpt: data.excerpt ?? '',
    content,
    category: (data.category ?? 'morocco') as ArticleCategory,
    author: data.author ?? 'Atlas Kings Editorial Team',
    date: data.date ?? new Date().toISOString(),
    modified: data.modified ?? data.date,
    image: data.image,
    imageAlt: data.imageAlt,
    language: lang,
    tags: data.tags ?? [],
    featured: data.featured ?? false,
    readingTime: readingTime(content),
    priority: data.priority ?? 50,
    type: data.type ?? 'standard',
    teams: data.teams ?? [],
    players: data.players ?? [],
    // Trust + provenance (default 'automated' for backward compat)
    trustState: data.trustState ?? 'automated',
    sourceUrl: data.sourceUrl,
    // Video
    videoId: data.videoId,
    videoFrame: data.videoFrame,
  }
}

export function getRelatedArticles(
  slug: string,
  category: ArticleCategory,
  lang: 'en' | 'ar' | 'fr' = 'en',
  limit = 6
): ArticleMeta[] {
  return getArticlesByLang(lang)
    .filter(a => a.slug !== slug && a.category === category)
    .slice(0, limit)
}

export function getAllSlugs(lang: 'en' | 'ar' | 'fr' = 'en'): string[] {
  const dir = path.join(ARTICLES_DIR, lang)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''))
}

// ── ASYNC VARIANTS (DB + FILE MERGE) ─────────────────

/**
 * Get all articles from both database and markdown files, merged and scored.
 * Database articles take priority (newer, entity-resolved).
 * File articles are fallback (RSS pipeline legacy).
 */
export async function getAllArticles(lang: 'en' | 'ar' | 'fr' = 'en'): Promise<ArticleMeta[]> {
  // File-based articles (sync)
  const fileArticles = getArticlesByLang(lang)

  // Database articles (async, with fallback)
  let dbArticles: ArticleMeta[] = []
  try {
    const { getDBArticles } = await import('@/lib/db/articles')
    dbArticles = await getDBArticles(lang)
    // Score DB articles through our system
    dbArticles = dbArticles.map(a => ({ ...a, score: computeScore(a) }))
  } catch (err) {
    // DB unavailable — continue with file articles only
    console.warn('[Articles] DB fetch failed, using files only:', (err as Error).message)
  }

  // Merge — deduplicate by slug (DB articles take priority)
  const seenSlugs = new Set<string>()
  const merged: ArticleMeta[] = []

  // DB articles first (higher priority)
  for (const a of dbArticles) {
    if (!seenSlugs.has(a.slug)) {
      seenSlugs.add(a.slug)
      merged.push(a)
    }
  }

  // Then file articles (fallback)
  for (const a of fileArticles) {
    if (!seenSlugs.has(a.slug)) {
      seenSlugs.add(a.slug)
      merged.push(a)
    }
  }

  // Sort by score
  return merged.sort((a, b) => {
    const scoreDiff = (b.score ?? 0) - (a.score ?? 0)
    if (Math.abs(scoreDiff) > 0.001) return scoreDiff
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

/**
 * Async cross-category article flow with GNews merge.
 * Drop-in async replacement for getArticlesForSection.
 */
export async function getArticlesForSectionAsync(
  category: ArticleCategory,
  lang: 'en' | 'ar' | 'fr' = 'en',
  limit: number = 10,
): Promise<ArticleMeta[]> {
  const all = await getAllArticles(lang)

  const CATEGORY_TO_TEAM: Record<string, string> = {
    'morocco': 'morocco', 'botola-pro': 'botola', 'premier-league': 'premier-league',
    'la-liga': 'la-liga', 'champions-league': 'champions-league',
    'transfers': 'transfers', 'world-cup': 'world-cup',
  }
  const teamSlug = CATEGORY_TO_TEAM[category] ?? category

  const scored = all.map(a => {
    let relevanceBoost = 1.0
    if (a.category === category) relevanceBoost = 5.0
    else if (a.teams?.includes(teamSlug)) relevanceBoost = 3.0
    else if (a.tags?.includes(category) || a.tags?.includes(teamSlug)) relevanceBoost = 2.0
    else relevanceBoost = 0.3
    return { ...a, score: (a.score ?? 0) * relevanceBoost }
  }).sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

  return scored.slice(0, limit)
}
