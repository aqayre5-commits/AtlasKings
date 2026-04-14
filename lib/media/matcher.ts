/**
 * Article-image matching — scored ranking of candidate images for each article.
 *
 * Formula: entity×0.30 + type_fit×0.20 + situation×0.15 +
 *          competition×0.10 + kit×0.10 + quality×0.10 + freshness×0.05
 */
import { query, queryOne } from '@/lib/db/client'
import {
  insertArticleMediaCandidate,
  markMediaSelected,
  getTagsForAsset,
  type MediaAsset,
} from '@/lib/db/media'
import { getPublicUrl } from './r2'

// ─── Type fit mapping: article_type → ideal scene tags ───
const TYPE_FIT: Record<string, string[]> = {
  breaking: ['match_action', 'press_conference', 'portrait'],
  recap: ['match_action', 'team_photo', 'celebration'],
  preview: ['portrait', 'training', 'stadium'],
  transfer: ['portrait', 'press_conference', 'ceremony'],
  analysis: ['match_action', 'portrait'],
  feature: ['portrait', 'training', 'match_action'],
  opinion: ['portrait', 'press_conference'],
  standard: ['portrait', 'match_action', 'team_photo'],
}

// ─── Emotion fit for article sentiment keywords ───
const POSITIVE_EMOTIONS = ['smiling', 'celebrating']
const NEGATIVE_EMOTIONS = ['disappointed', 'crying', 'angry']
const NEUTRAL_EMOTIONS = ['neutral', 'serious', 'focused']

/**
 * Score and rank candidate images for a single article.
 * Returns the URL of the winning image, or null.
 */
export async function matchArticleToMedia(articleId: string): Promise<string | null> {
  // 1. Get article info + linked entities
  const article = await queryOne<{
    id: string; article_type: string; canonical_slug: string;
    priority_score: number; published_at: string
  }>(
    `SELECT id, article_type, canonical_slug, priority_score, published_at FROM atlas.articles WHERE id = $1`,
    [articleId]
  )
  if (!article) return null

  // Get article entities (players, teams, competitions)
  const entities = await query<{
    entity_type: string; entity_id: string; relevance_weight: number; role: string
  }>(
    `SELECT entity_type, entity_id, relevance_weight, role FROM atlas.article_entities WHERE article_id = $1`,
    [articleId]
  )

  // Get article localization for keyword analysis
  const loc = await queryOne<{ title: string; summary: string }>(
    `SELECT title, summary FROM atlas.article_localizations WHERE article_id = $1 AND language = 'en' LIMIT 1`,
    [articleId]
  )
  const articleText = `${loc?.title ?? ''} ${loc?.summary ?? ''}`.toLowerCase()

  // Detect article sentiment from text
  const isPositive = ['win', 'goal', 'celebrate', 'triumph', 'record', 'hero'].some(w => articleText.includes(w))
  const isNegative = ['loss', 'defeat', 'disappoint', 'injury', 'miss', 'fail', 'ban'].some(w => articleText.includes(w))
  const isMorocco = ['morocco', 'atlas lions', 'morocc'].some(w => articleText.includes(w))

  // 2. Find candidate images
  // Get images linked to article entities
  const entityIds = entities.map(e => e.entity_id)
  if (entityIds.length === 0) return null

  const placeholders = entityIds.map((_, i) => `$${i + 1}`).join(', ')
  const candidates = await query<MediaAsset>(
    `SELECT DISTINCT ma.* FROM atlas.media_assets ma
     JOIN atlas.media_entities me ON me.media_asset_id = ma.id
     WHERE me.entity_id IN (${placeholders})
       AND ma.active = true
       AND ma.fetch_status = 'fetched'
       AND (ma.review_status IN ('auto_approved', 'approved', 'pending'))
     ORDER BY ma.quality_score DESC
     LIMIT 20`,
    entityIds
  )

  if (candidates.length === 0) return null

  // 3. Score each candidate
  type ScoredCandidate = MediaAsset & { totalScore: number; scores: Record<string, number> }
  const scored: ScoredCandidate[] = []

  for (const candidate of candidates) {
    const tags = await getTagsForAsset(candidate.id)
    const tagMap = new Map(tags.map(t => [t.tag_category, t.tag_value]))

    // Entity match (0.30)
    const linkedEntity = entities.find(e => e.entity_id === candidate.entity_id)
    const entityMatchScore = linkedEntity
      ? (linkedEntity.role === 'primary' ? 100 : linkedEntity.role === 'secondary' ? 60 : 40)
      : 20

    // Type fit (0.20)
    const scene = tagMap.get('scene') ?? 'portrait'
    const idealScenes = TYPE_FIT[article.article_type] ?? TYPE_FIT.standard
    const sceneIdx = idealScenes.indexOf(scene)
    const typeFitScore = sceneIdx === 0 ? 100 : sceneIdx === 1 ? 70 : sceneIdx >= 2 ? 40 : 20

    // Situation match (0.15)
    const emotion = tagMap.get('emotion') ?? 'neutral'
    let situationScore = 50 // neutral default
    if (isPositive && POSITIVE_EMOTIONS.includes(emotion)) situationScore = 100
    else if (isNegative && NEGATIVE_EMOTIONS.includes(emotion)) situationScore = 90
    else if (NEUTRAL_EMOTIONS.includes(emotion)) situationScore = 60
    else if (isPositive && NEGATIVE_EMOTIONS.includes(emotion)) situationScore = 10 // mismatch
    else if (isNegative && POSITIVE_EMOTIONS.includes(emotion)) situationScore = 10

    // Competition context (0.10)
    const kitCtx = tagMap.get('kit') ?? 'unknown'
    const contextTag = tags.find(t => t.tag_category === 'context')
    let competitionScore = 30
    if (isMorocco && contextTag?.tag_value === 'morocco_national_team') competitionScore = 100
    else if (contextTag) competitionScore = 60

    // Kit context (0.10)
    let kitScore = 30
    if (isMorocco && kitCtx.startsWith('morocco')) kitScore = 100
    else if (!isMorocco && kitCtx === 'club') kitScore = 80
    else if (kitCtx === 'unknown' || kitCtx === 'none') kitScore = 30

    // Quality (0.10)
    const qualityScore = Math.min(100, (candidate.quality_score ?? 0))

    // Freshness (0.05) — newer = better
    const ageMs = Date.now() - new Date(candidate.created_at).getTime()
    const ageDays = ageMs / (1000 * 60 * 60 * 24)
    const freshnessScore = ageDays <= 7 ? 100 : ageDays <= 30 ? 70 : ageDays <= 90 ? 40 : 20

    // Weighted total
    const totalScore =
      entityMatchScore * 0.30 +
      typeFitScore * 0.20 +
      situationScore * 0.15 +
      competitionScore * 0.10 +
      kitScore * 0.10 +
      qualityScore * 0.10 +
      freshnessScore * 0.05

    scored.push({
      ...candidate,
      totalScore,
      scores: {
        entity: entityMatchScore,
        type_fit: typeFitScore,
        situation: situationScore,
        competition: competitionScore,
        kit: kitScore,
        quality: qualityScore,
        freshness: freshnessScore,
      },
    })
  }

  // 4. Sort by total score
  scored.sort((a, b) => b.totalScore - a.totalScore)

  // 5. Insert candidates into article_media_candidates
  for (let i = 0; i < scored.length; i++) {
    const c = scored[i]
    await insertArticleMediaCandidate({
      article_id: articleId,
      media_asset_id: c.id,
      total_score: +c.totalScore.toFixed(2),
      entity_match_score: c.scores.entity,
      type_fit_score: c.scores.type_fit,
      situation_match_score: c.scores.situation,
      competition_context_score: c.scores.competition,
      kit_context_score: c.scores.kit,
      quality_score: c.scores.quality,
      freshness_score: c.scores.freshness,
      rank: i + 1,
    })
  }

  // 6. Select the winner
  const winner = scored[0]
  if (!winner) return null

  await markMediaSelected(articleId, winner.id)

  // Return the best available R2 URL (hero > card > original source)
  if (winner.r2_hero_key) return getPublicUrl(winner.r2_hero_key)
  if (winner.r2_card_key) return getPublicUrl(winner.r2_card_key)
  return winner.source_url
}

/**
 * Match images for all unmatched articles.
 */
export async function matchAllUnmatchedArticles(limit = 20): Promise<{ matched: number; failed: number }> {
  const articles = await query<{ id: string }>(
    `SELECT a.id FROM atlas.articles a
     WHERE a.publish_status = 'published'
       AND NOT EXISTS (SELECT 1 FROM atlas.article_media_candidates c WHERE c.article_id = a.id)
     ORDER BY a.published_at DESC
     LIMIT $1`,
    [limit]
  )

  let matched = 0
  let failed = 0

  for (const article of articles) {
    try {
      const url = await matchArticleToMedia(article.id)
      if (url) {
        // Update og_image_url on all localizations
        await query(
          `UPDATE atlas.article_localizations SET og_image_url = $1 WHERE article_id = $2`,
          [url, article.id]
        )
        matched++
      }
    } catch (err) {
      console.error(`[media/matcher] Failed to match article ${article.id}:`, err)
      failed++
    }
  }

  return { matched, failed }
}
