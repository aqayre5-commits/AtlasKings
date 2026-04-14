// Full database-backed article pipeline orchestrator
// Runs: ingest → cluster → score → write → publish
import { ingestFeeds, clusterItems } from './ingestion'
import { scoreAllPendingClusters } from './scoring'
import { processDraftClusters } from './writer'

export interface PipelineResult {
  step: string
  ingest: { fetched: number; stored: number; duplicates: number }
  clustered: number
  scored: number
  articlesCreated: string[]
  errors: string[]
}

/**
 * Run the full pipeline end-to-end.
 *
 * 1. Ingest: Fetch all RSS → store in source_items
 * 2. Cluster: Group similar items into story_clusters
 * 3. Score: Rank clusters by priority, Morocco relevance, confidence
 * 4. Write: Generate AI articles for top-scoring clusters
 * 5. Publish: Articles stored in articles + article_localizations (EN/AR/FR)
 */
export async function runDatabasePipeline(options?: {
  maxArticles?: number
}): Promise<PipelineResult> {
  const maxArticles = options?.maxArticles ?? 10
  const errors: string[] = []

  console.log('[DB Pipeline] Starting full pipeline...')

  // Step 1: Ingest RSS feeds
  console.log('[DB Pipeline] Step 1: Ingesting feeds...')
  let ingestResult = { fetched: 0, stored: 0, duplicates: 0 }
  try {
    ingestResult = await ingestFeeds()
    console.log(`[DB Pipeline] Ingested: ${ingestResult.stored} new / ${ingestResult.duplicates} dupes / ${ingestResult.fetched} total`)
  } catch (err) {
    errors.push(`Ingest failed: ${(err as Error).message}`)
    console.error('[DB Pipeline] Ingest error:', err)
  }

  // Step 2: Cluster items
  console.log('[DB Pipeline] Step 2: Clustering...')
  let clustered = 0
  try {
    clustered = await clusterItems()
    console.log(`[DB Pipeline] Clustered: ${clustered} items`)
  } catch (err) {
    errors.push(`Clustering failed: ${(err as Error).message}`)
  }

  // Step 3: Score clusters
  console.log('[DB Pipeline] Step 3: Scoring...')
  let scored = 0
  try {
    scored = await scoreAllPendingClusters()
    console.log(`[DB Pipeline] Scored: ${scored} clusters`)
  } catch (err) {
    errors.push(`Scoring failed: ${(err as Error).message}`)
  }

  // Step 4: Generate articles
  console.log('[DB Pipeline] Step 4: Generating articles...')
  let articleIds: string[] = []
  try {
    articleIds = await processDraftClusters(maxArticles)
    console.log(`[DB Pipeline] Created: ${articleIds.length} articles`)
  } catch (err) {
    errors.push(`Article generation failed: ${(err as Error).message}`)
  }

  console.log(`[DB Pipeline] Complete. ${articleIds.length} articles created, ${errors.length} errors.`)

  return {
    step: 'complete',
    ingest: ingestResult,
    clustered,
    scored,
    articlesCreated: articleIds,
    errors,
  }
}
