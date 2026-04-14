/**
 * Database queries for the media asset system.
 * Tables: atlas.media_assets, atlas.media_tags, atlas.media_entities, atlas.article_media_candidates
 */
import { query, queryOne, execute } from './client'

// ─── Types ───

export interface MediaAsset {
  id: string
  source_url: string
  source_type: string
  entity_type: string | null
  entity_id: string | null
  api_football_id: number | null
  media_kind: string
  kit_context: string | null
  article_safe: boolean
  r2_key: string | null
  r2_hero_key: string | null
  r2_card_key: string | null
  r2_thumb_key: string | null
  r2_square_key: string | null
  width: number | null
  height: number | null
  file_size_bytes: number | null
  mime_type: string
  aspect_ratio: number | null
  quality_score: number
  sharpness_score: number | null
  resolution_adequate: boolean
  identity_confidence: number | null
  situation_confidence: number | null
  context_confidence: number | null
  fetch_status: string
  vision_status: string
  review_status: string
  active: boolean
  fetched_at: string | null
  analyzed_at: string | null
  created_at: string
  updated_at: string
}

export interface MediaTag {
  id: string
  media_asset_id: string
  tag_category: string
  tag_value: string
  confidence: number
  source: string
  created_at: string
}

export interface MediaEntity {
  id: string
  media_asset_id: string
  entity_type: string
  entity_id: string
  role: string
  confidence: number
  confirmed: boolean
  created_at: string
}

export interface ArticleMediaCandidate {
  id: string
  article_id: string
  media_asset_id: string
  total_score: number
  entity_match_score: number
  type_fit_score: number
  situation_match_score: number
  competition_context_score: number
  kit_context_score: number
  quality_score: number
  freshness_score: number
  selected: boolean
  rank: number | null
  created_at: string
}

// ─── Media Assets ───

export async function insertMediaAsset(data: {
  source_url: string
  source_type?: string
  entity_type?: string
  entity_id?: string
  api_football_id?: number
  media_kind?: string
}): Promise<MediaAsset | null> {
  return queryOne<MediaAsset>(
    `INSERT INTO atlas.media_assets (source_url, source_type, entity_type, entity_id, api_football_id, media_kind)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT DO NOTHING
     RETURNING *`,
    [data.source_url, data.source_type ?? 'api_football', data.entity_type ?? null, data.entity_id ?? null, data.api_football_id ?? null, data.media_kind ?? 'portrait']
  )
}

export async function updateMediaAsset(id: string, fields: Partial<MediaAsset>): Promise<void> {
  const sets: string[] = []
  const params: unknown[] = []
  let i = 1

  const allowed = [
    'r2_key', 'r2_hero_key', 'r2_card_key', 'r2_thumb_key', 'r2_square_key',
    'width', 'height', 'file_size_bytes', 'mime_type', 'aspect_ratio',
    'quality_score', 'sharpness_score', 'resolution_adequate',
    'identity_confidence', 'situation_confidence', 'context_confidence',
    'fetch_status', 'vision_status', 'review_status',
    'article_safe', 'kit_context', 'active',
    'fetched_at', 'analyzed_at',
  ]

  for (const key of allowed) {
    if (key in fields) {
      sets.push(`${key} = $${i}`)
      params.push((fields as Record<string, unknown>)[key])
      i++
    }
  }

  if (sets.length === 0) return
  sets.push(`updated_at = now()`)
  params.push(id)

  await execute(
    `UPDATE atlas.media_assets SET ${sets.join(', ')} WHERE id = $${i}`,
    params
  )
}

export async function getMediaAssetBySource(sourceUrl: string): Promise<MediaAsset | null> {
  return queryOne<MediaAsset>(
    `SELECT * FROM atlas.media_assets WHERE source_url = $1`,
    [sourceUrl]
  )
}

export async function getMediaAssetsByEntity(entityType: string, entityId: string): Promise<MediaAsset[]> {
  return query<MediaAsset>(
    `SELECT * FROM atlas.media_assets WHERE entity_type = $1 AND entity_id = $2 AND active = true ORDER BY quality_score DESC`,
    [entityType, entityId]
  )
}

export async function getMediaAssetsByApiFootballId(apiId: number, entityType: string): Promise<MediaAsset[]> {
  return query<MediaAsset>(
    `SELECT * FROM atlas.media_assets WHERE api_football_id = $1 AND entity_type = $2 AND active = true`,
    [apiId, entityType]
  )
}

export async function getPendingFetchAssets(limit = 50): Promise<MediaAsset[]> {
  return query<MediaAsset>(
    `SELECT * FROM atlas.media_assets WHERE fetch_status = 'pending' ORDER BY created_at ASC LIMIT $1`,
    [limit]
  )
}

export async function getPendingVisionAssets(limit = 50): Promise<MediaAsset[]> {
  return query<MediaAsset>(
    `SELECT * FROM atlas.media_assets WHERE vision_status = 'pending' AND fetch_status = 'fetched' ORDER BY created_at ASC LIMIT $1`,
    [limit]
  )
}

export async function getApprovedMediaForEntity(entityType: string, entityId: string): Promise<MediaAsset[]> {
  return query<MediaAsset>(
    `SELECT * FROM atlas.media_assets
     WHERE entity_type = $1 AND entity_id = $2 AND active = true
       AND fetch_status = 'fetched' AND (review_status = 'approved' OR review_status = 'auto_approved' OR review_status = 'pending')
     ORDER BY quality_score DESC, created_at DESC`,
    [entityType, entityId]
  )
}

// ─── Media Tags ───

export async function insertMediaTag(data: {
  media_asset_id: string
  tag_category: string
  tag_value: string
  confidence?: number
  source?: string
}): Promise<void> {
  await execute(
    `INSERT INTO atlas.media_tags (media_asset_id, tag_category, tag_value, confidence, source)
     VALUES ($1, $2, $3, $4, $5)`,
    [data.media_asset_id, data.tag_category, data.tag_value, data.confidence ?? 0.5, data.source ?? 'vision']
  )
}

export async function getTagsForAsset(assetId: string): Promise<MediaTag[]> {
  return query<MediaTag>(
    `SELECT * FROM atlas.media_tags WHERE media_asset_id = $1 ORDER BY confidence DESC`,
    [assetId]
  )
}

export async function deleteTagsForAsset(assetId: string): Promise<void> {
  await execute(`DELETE FROM atlas.media_tags WHERE media_asset_id = $1`, [assetId])
}

// ─── Media Entities ───

export async function insertMediaEntity(data: {
  media_asset_id: string
  entity_type: string
  entity_id: string
  role?: string
  confidence?: number
  confirmed?: boolean
}): Promise<void> {
  await execute(
    `INSERT INTO atlas.media_entities (media_asset_id, entity_type, entity_id, role, confidence, confirmed)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [data.media_asset_id, data.entity_type, data.entity_id, data.role ?? 'subject', data.confidence ?? 0.5, data.confirmed ?? false]
  )
}

// ─── Article Media Candidates ───

export async function insertArticleMediaCandidate(data: {
  article_id: string
  media_asset_id: string
  total_score: number
  entity_match_score?: number
  type_fit_score?: number
  situation_match_score?: number
  competition_context_score?: number
  kit_context_score?: number
  quality_score?: number
  freshness_score?: number
  rank?: number
}): Promise<void> {
  await execute(
    `INSERT INTO atlas.article_media_candidates
     (article_id, media_asset_id, total_score, entity_match_score, type_fit_score, situation_match_score, competition_context_score, kit_context_score, quality_score, freshness_score, rank)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     ON CONFLICT (article_id, media_asset_id) DO UPDATE SET
       total_score = EXCLUDED.total_score,
       entity_match_score = EXCLUDED.entity_match_score,
       type_fit_score = EXCLUDED.type_fit_score,
       situation_match_score = EXCLUDED.situation_match_score,
       competition_context_score = EXCLUDED.competition_context_score,
       kit_context_score = EXCLUDED.kit_context_score,
       quality_score = EXCLUDED.quality_score,
       freshness_score = EXCLUDED.freshness_score,
       rank = EXCLUDED.rank`,
    [data.article_id, data.media_asset_id, data.total_score,
     data.entity_match_score ?? 0, data.type_fit_score ?? 0, data.situation_match_score ?? 0,
     data.competition_context_score ?? 0, data.kit_context_score ?? 0, data.quality_score ?? 0,
     data.freshness_score ?? 0, data.rank ?? null]
  )
}

export async function markMediaSelected(articleId: string, assetId: string): Promise<void> {
  // Clear previous selections
  await execute(
    `UPDATE atlas.article_media_candidates SET selected = false WHERE article_id = $1`,
    [articleId]
  )
  // Mark winner
  await execute(
    `UPDATE atlas.article_media_candidates SET selected = true WHERE article_id = $1 AND media_asset_id = $2`,
    [articleId, assetId]
  )
}

export async function getSelectedMediaForArticle(articleId: string): Promise<(ArticleMediaCandidate & { r2_hero_key: string | null; r2_card_key: string | null; source_url: string }) | null> {
  return queryOne(
    `SELECT c.*, a.r2_hero_key, a.r2_card_key, a.source_url
     FROM atlas.article_media_candidates c
     JOIN atlas.media_assets a ON a.id = c.media_asset_id
     WHERE c.article_id = $1 AND c.selected = true`,
    [articleId]
  )
}

export async function getMediaStats(): Promise<{ total: number; fetched: number; analyzed: number; approved: number }> {
  const row = await queryOne<{ total: string; fetched: string; analyzed: string; approved: string }>(
    `SELECT
       COUNT(*) as total,
       COUNT(*) FILTER (WHERE fetch_status = 'fetched') as fetched,
       COUNT(*) FILTER (WHERE vision_status = 'analyzed') as analyzed,
       COUNT(*) FILTER (WHERE review_status IN ('approved', 'auto_approved')) as approved
     FROM atlas.media_assets`
  )
  return {
    total: parseInt(row?.total ?? '0'),
    fetched: parseInt(row?.fetched ?? '0'),
    analyzed: parseInt(row?.analyzed ?? '0'),
    approved: parseInt(row?.approved ?? '0'),
  }
}
