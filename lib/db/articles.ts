// Database article reader — reads published articles from PostgreSQL
// Replaces file-based markdown reading for DB-stored articles
import { query, queryOne } from './client'
import type { ArticleMeta, ArticleCategory, ArticleType } from '@/types/article'

interface DBArticle {
  id: string
  canonical_slug: string
  article_type: string
  confidence_label: string
  priority_score: number
  published_at: string
  source_count: number
}

interface DBLocalization {
  article_id: string
  language: string
  title: string
  slug: string
  summary: string
  body_markdown: string
  seo_title: string
  meta_description: string
  og_image_url: string | null
}

interface DBArticleEntity {
  entity_type: string
  entity_id: string
  role: string
  entity_name?: string
  moroccan?: boolean
}

/**
 * Map a DB article + localization to ArticleMeta.
 */
function mapToArticleMeta(article: DBArticle, loc: DBLocalization, entities: DBArticleEntity[]): ArticleMeta {
  // Detect category from entities
  let category: ArticleCategory = 'morocco'
  const hasMoroccan = entities.some(e => e.moroccan)
  if (hasMoroccan) category = 'morocco'
  else if (article.article_type === 'transfer_watch') category = 'transfers'
  else if (article.article_type === 'match_preview' || article.article_type === 'match_report') category = 'champions-league'

  // Map article_type to ArticleType
  const typeMap: Record<string, ArticleType> = {
    'breaking_news': 'breaking',
    'match_preview': 'preview',
    'match_report': 'recap',
    'transfer_watch': 'transfer',
    'player_watch': 'feature',
    'injury_update': 'standard',
    'controversy_explainer': 'analysis',
    'morocco_nt_update': 'breaking',
  }

  const teams = entities
    .filter(e => e.entity_type === 'player' && e.moroccan)
    .length > 0 ? ['morocco'] : []

  return {
    slug: loc.slug,
    title: loc.title,
    excerpt: loc.summary || '',
    category,
    author: 'Atlas Kings',
    date: article.published_at,
    image: loc.og_image_url || undefined,
    readingTime: Math.ceil((loc.body_markdown?.length ?? 500) / 1000),
    featured: article.priority_score >= 85,
    tags: [],
    priority: article.priority_score,
    type: typeMap[article.article_type] ?? 'standard',
    teams,
    players: entities.filter(e => e.entity_type === 'player').map(e => e.entity_name ?? ''),
  }
}

/**
 * Get all published articles from the database for a language.
 * Returns ArticleMeta[] sorted by priority score (highest first).
 */
export async function getDBArticles(lang: 'en' | 'ar' | 'fr' = 'en'): Promise<ArticleMeta[]> {
  const rows = await query<DBArticle & DBLocalization>(
    `SELECT a.id, a.canonical_slug, a.article_type, a.confidence_label,
            a.priority_score, a.published_at, a.source_count,
            al.language, al.title, al.slug, al.summary, al.body_markdown,
            al.seo_title, al.meta_description, al.og_image_url
     FROM atlas.articles a
     JOIN atlas.article_localizations al ON al.article_id = a.id
     WHERE a.publish_status = $1 AND al.language = $2
     ORDER BY a.priority_score DESC, a.published_at DESC
     LIMIT 100`,
    ['published', lang]
  )

  // Get entities for all articles
  const articleIds = rows.map(r => r.id)
  let entities: (DBArticleEntity & { article_id: string })[] = []

  if (articleIds.length > 0) {
    // Batch fetch entities
    entities = await query<DBArticleEntity & { article_id: string }>(
      `SELECT ae.article_id, ae.entity_type, ae.entity_id, ae.role,
              COALESCE(p.full_name, '') as entity_name,
              COALESCE(p.moroccan_origin_flag, false) as moroccan
       FROM atlas.article_entities ae
       LEFT JOIN atlas.players p ON ae.entity_type = 'player' AND p.id = ae.entity_id
       WHERE ae.article_id = ANY($1)`,
      [articleIds]
    )
  }

  return rows.map(row => {
    const articleEntities = entities.filter(e => e.article_id === row.id)
    return mapToArticleMeta(
      row as DBArticle,
      row as unknown as DBLocalization,
      articleEntities
    )
  })
}

/**
 * Get a single article by slug from the database.
 */
export async function getDBArticleBySlug(
  slug: string,
  lang: 'en' | 'ar' | 'fr' = 'en'
): Promise<{ meta: ArticleMeta; content: string } | null> {
  const row = await queryOne<DBArticle & DBLocalization>(
    `SELECT a.id, a.canonical_slug, a.article_type, a.confidence_label,
            a.priority_score, a.published_at, a.source_count,
            al.language, al.title, al.slug, al.summary, al.body_markdown,
            al.seo_title, al.meta_description, al.og_image_url
     FROM atlas.articles a
     JOIN atlas.article_localizations al ON al.article_id = a.id
     WHERE al.slug = $1 AND al.language = $2 AND a.publish_status = $3`,
    [slug, lang, 'published']
  )

  if (!row) return null

  const entities = await query<DBArticleEntity & { article_id: string }>(
    `SELECT ae.article_id, ae.entity_type, ae.entity_id, ae.role,
            COALESCE(p.full_name, '') as entity_name,
            COALESCE(p.moroccan_origin_flag, false) as moroccan
     FROM atlas.article_entities ae
     LEFT JOIN atlas.players p ON ae.entity_type = 'player' AND p.id = ae.entity_id
     WHERE ae.article_id = $1`,
    [row.id]
  )

  return {
    meta: mapToArticleMeta(row as DBArticle, row as unknown as DBLocalization, entities),
    content: row.body_markdown || '',
  }
}

/**
 * Get all published article slugs from the database (for sitemap/static paths).
 */
export async function getDBArticleSlugs(lang: 'en' | 'ar' | 'fr' = 'en'): Promise<string[]> {
  const rows = await query<{ slug: string }>(
    `SELECT al.slug FROM atlas.article_localizations al
     JOIN atlas.articles a ON a.id = al.article_id
     WHERE a.publish_status = $1 AND al.language = $2`,
    ['published', lang]
  )
  return rows.map(r => r.slug)
}
