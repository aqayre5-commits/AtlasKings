// AI Writing service — generates articles from scored clusters and stores in DB
import { query, queryOne, execute } from './client'
import { rewriteArticle, translateArticle, detectCategory, detectTeams, detectType } from '@/lib/rss/rewriter'
import { resolveEntities } from './entities'
import { slugify } from '@/lib/utils'

/**
 * Generate an article from a scored cluster.
 * 1. Get cluster sources
 * 2. AI rewrite (EN)
 * 3. AI translate (AR, FR)
 * 4. Store in articles + article_localizations
 * 5. Link entities via article_entities
 */
export async function generateArticleFromCluster(clusterId: string): Promise<string | null> {
  // Get cluster + source items
  const cluster = await queryOne<{
    id: string
    headline_seed: string
    priority_score: number
    morocco_relevance_score: number
    primary_topic: string
  }>(
    `SELECT id, headline_seed, priority_score, morocco_relevance_score, primary_topic
     FROM atlas.story_clusters WHERE id = $1`,
    [clusterId]
  )

  if (!cluster) return null

  const sources = await query<{
    title: string
    summary: string
    source_published_at: string
    source_name: string
  }>(
    `SELECT si.title, si.summary, si.source_published_at, s.name as source_name
     FROM atlas.cluster_items ci
     JOIN atlas.source_items si ON si.id = ci.source_item_id
     JOIN atlas.sources s ON s.id = si.source_id
     WHERE ci.cluster_id = $1
     ORDER BY ci.is_primary DESC, s.trust_score DESC
     LIMIT 5`,
    [clusterId]
  )

  if (sources.length === 0) return null

  const primary = sources[0]

  // 1. AI rewrite in English
  const result = await rewriteArticle({
    title: primary.title,
    description: primary.summary || '',
    source: primary.source_name,
  })

  if (!result) return null

  // 2. Detect metadata
  const combinedText = `${result.title} ${result.excerpt} ${result.content}`
  const category = detectCategory(primary.title, primary.summary || '', [])
  const teams = detectTeams(combinedText)
  const type = detectType(result.title)
  const slug = slugify(result.title).slice(0, 80)

  // 3. Resolve entities
  const entities = await resolveEntities(combinedText)

  // 4. Determine article type from cluster topic
  const articleType = cluster.primary_topic === 'transfer' ? 'transfer_watch'
    : cluster.primary_topic === 'controversy' ? 'controversy_explainer'
    : cluster.primary_topic === 'injury' ? 'injury_update'
    : cluster.primary_topic === 'preview' ? 'match_preview'
    : cluster.primary_topic === 'report' ? 'match_report'
    : 'breaking_news'

  // 5. Determine confidence
  const confidence = sources.length >= 3 ? 'confirmed'
    : sources.length >= 2 ? 'strongly_reported'
    : 'rumor'

  // 6. Insert article record
  const article = await queryOne<{ id: string }>(
    `INSERT INTO atlas.articles
     (cluster_id, article_type, canonical_slug, confidence_label, priority_score, publish_status, source_count, published_at)
     VALUES ($1, $2, $3, $4, $5, 'published', $6, now())
     ON CONFLICT (canonical_slug) DO NOTHING
     RETURNING id`,
    [clusterId, articleType, slug, confidence, cluster.priority_score, sources.length]
  )

  if (!article) return null

  // 7. Insert EN localization
  await execute(
    `INSERT INTO atlas.article_localizations
     (article_id, language, title, slug, summary, body_markdown, seo_title, meta_description)
     VALUES ($1, 'en', $2, $3, $4, $5, $6, $7)
     ON CONFLICT (article_id, language) DO NOTHING`,
    [article.id, result.title, slug, result.excerpt, result.content,
     result.title, result.excerpt.slice(0, 160)]
  )

  // 8. Translate to AR and FR in parallel
  const [arResult, frResult] = await Promise.allSettled([
    translateArticle({ title: result.title, excerpt: result.excerpt, content: result.content, targetLang: 'ar' }),
    translateArticle({ title: result.title, excerpt: result.excerpt, content: result.content, targetLang: 'fr' }),
  ])

  if (arResult.status === 'fulfilled' && arResult.value) {
    const ar = arResult.value
    await execute(
      `INSERT INTO atlas.article_localizations
       (article_id, language, title, slug, summary, body_markdown, seo_title, meta_description)
       VALUES ($1, 'ar', $2, $3, $4, $5, $6, $7)
       ON CONFLICT (article_id, language) DO NOTHING`,
      [article.id, ar.title, slug, ar.excerpt, ar.content, ar.title, ar.excerpt.slice(0, 160)]
    )
  }

  if (frResult.status === 'fulfilled' && frResult.value) {
    const fr = frResult.value
    await execute(
      `INSERT INTO atlas.article_localizations
       (article_id, language, title, slug, summary, body_markdown, seo_title, meta_description)
       VALUES ($1, 'fr', $2, $3, $4, $5, $6, $7)
       ON CONFLICT (article_id, language) DO NOTHING`,
      [article.id, fr.title, slug, fr.excerpt, fr.content, fr.title, fr.excerpt.slice(0, 160)]
    )
  }

  // 9. Link entities
  for (const entity of entities) {
    await execute(
      `INSERT INTO atlas.article_entities (article_id, entity_type, entity_id, relevance_weight, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT DO NOTHING`,
      [article.id, entity.type, entity.id, entity.moroccan ? 100 : 50, entity.relevance]
    )
  }

  // 10. Media matching — assign best image to article
  try {
    const { matchArticleToMedia } = await import('@/lib/media/matcher')
    const imageUrl = await matchArticleToMedia(article.id)
    if (imageUrl) {
      await execute(
        `UPDATE atlas.article_localizations SET og_image_url = $1 WHERE article_id = $2`,
        [imageUrl, article.id]
      )
    }
  } catch {
    // Media matching failure should not block article publishing
  }

  // 11. Update cluster to published
  await execute(
    `UPDATE atlas.story_clusters SET publish_state = 'publish' WHERE id = $1`,
    [clusterId]
  )

  return article.id
}

/**
 * Process all draft clusters — generate articles for high-scoring stories.
 */
export async function processDraftClusters(maxArticles: number = 10): Promise<string[]> {
  const drafts = await query<{ id: string; priority_score: number }>(
    `SELECT id, priority_score FROM atlas.story_clusters
     WHERE publish_state = 'draft'
     ORDER BY priority_score DESC
     LIMIT $1`,
    [maxArticles]
  )

  const articleIds: string[] = []

  for (const draft of drafts) {
    const id = await generateArticleFromCluster(draft.id)
    if (id) articleIds.push(id)
  }

  return articleIds
}
