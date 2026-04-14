// Scoring service — ranks story clusters by priority
import { query, execute } from './client'
import { resolveEntities, calculateMoroccoRelevance } from './entities'

/**
 * Score all unscored story clusters.
 * Uses the blueprint formula: entity_importance + match_importance +
 * morocco_relevance + freshness + source_confidence - penalties
 */
export async function scoreCluster(clusterId: string): Promise<number> {
  // Get cluster with source items
  const cluster = await query<{
    id: string
    headline_seed: string
    first_seen_at: string
    source_count: number
  }>(
    `SELECT sc.id, sc.headline_seed, sc.first_seen_at, sc.source_count
     FROM atlas.story_clusters sc WHERE sc.id = $1`,
    [clusterId]
  )

  if (!cluster[0]) return 0

  const c = cluster[0]

  // Get source items for entity resolution
  const items = await query<{ title: string; summary: string; trust_score: number }>(
    `SELECT si.title, si.summary, s.trust_score
     FROM atlas.cluster_items ci
     JOIN atlas.source_items si ON si.id = ci.source_item_id
     JOIN atlas.sources s ON s.id = si.source_id
     WHERE ci.cluster_id = $1
     ORDER BY ci.is_primary DESC
     LIMIT 5`,
    [clusterId]
  )

  // Combine text for entity resolution
  const combinedText = items.map(i => `${i.title} ${i.summary || ''}`).join(' ')
  const entities = await resolveEntities(combinedText)
  const moroccoRelevance = calculateMoroccoRelevance(entities)

  // --- Scoring components ---

  // Entity importance (0-30)
  let entityScore = 0
  for (const e of entities) {
    if (e.type === 'player' && e.priorityTier === 'S') entityScore += 25
    else if (e.type === 'player' && e.priorityTier === 'A') entityScore += 18
    else if (e.type === 'player') entityScore += 8
    else if (e.type === 'competition') entityScore += 12
    else if (e.type === 'rivalry') entityScore += 20
  }
  entityScore = Math.min(30, entityScore)

  // Freshness (0-15)
  const hoursOld = (Date.now() - new Date(c.first_seen_at).getTime()) / 3600000
  const freshness = hoursOld <= 2 ? 15 : hoursOld <= 6 ? 10 : hoursOld <= 24 ? 6 : hoursOld <= 48 ? 2 : 0

  // Source confidence (0-20)
  const avgTrust = items.reduce((sum, i) => sum + (i.trust_score || 50), 0) / (items.length || 1)
  const sourceConfidence = c.source_count >= 3 ? 20 : c.source_count >= 2 ? 14 : avgTrust >= 80 ? 12 : 8

  // Morocco relevance (0-25)
  const moroccoScore = Math.min(25, moroccoRelevance)

  // Total (0-100)
  const total = Math.min(100, entityScore + freshness + sourceConfidence + moroccoScore)

  // Update cluster
  const publishState = total >= 40 ? 'draft' : total >= 25 ? 'monitor' : 'ignore'

  await execute(
    `UPDATE atlas.story_clusters
     SET priority_score = $1,
         morocco_relevance_score = $2,
         confidence_score = $3,
         publish_state = $4
     WHERE id = $5`,
    [total, moroccoRelevance, sourceConfidence * 5, publishState, clusterId]
  )

  return total
}

/**
 * Score all pending clusters.
 */
export async function scoreAllPendingClusters(): Promise<number> {
  const pending = await query<{ id: string }>(
    `SELECT id FROM atlas.story_clusters
     WHERE publish_state = 'monitor' OR priority_score = 0
     ORDER BY first_seen_at DESC
     LIMIT 50`
  )

  let scored = 0
  for (const cluster of pending) {
    await scoreCluster(cluster.id)
    scored++
  }

  return scored
}
