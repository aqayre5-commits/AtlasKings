// Ingestion service — stores RSS items in database and clusters them
import { query, queryOne, execute } from './client'
import { fetchAllFeeds, type RSSItem } from '@/lib/rss/fetcher'
import crypto from 'crypto'

/**
 * Normalize a title for deduplication.
 * Strips punctuation, lowercases, takes first 60 chars.
 */
function normalizeHash(title: string): string {
  const normalized = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().slice(0, 80)
  return crypto.createHash('md5').update(normalized).digest('hex')
}

/**
 * Ingest all RSS feeds into the database.
 * Returns count of new items stored.
 */
export async function ingestFeeds(): Promise<{ fetched: number; stored: number; duplicates: number }> {
  const items = await fetchAllFeeds()
  let stored = 0
  let duplicates = 0

  for (const item of items) {
    const hash = normalizeHash(item.title)

    // Look up source by name
    const source = await queryOne<{ id: string }>(
      'SELECT id FROM atlas.sources WHERE name = $1',
      [item.source]
    )

    if (!source) continue

    // Try to insert (skip duplicates via normalized_hash)
    try {
      const result = await query(
        `INSERT INTO atlas.source_items
         (source_id, url, title, summary, source_published_at, language_detected, normalized_hash)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (source_id, normalized_hash) DO NOTHING
         RETURNING id`,
        [
          source.id,
          item.link,
          item.title,
          item.description,
          item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          item.sourceLang || 'en',
          hash,
        ]
      )

      if (result.length > 0) {
        stored++
      } else {
        duplicates++
      }
    } catch (err) {
      // Skip problematic items silently
      duplicates++
    }
  }

  // Update last_fetched_at for all active sources
  await execute(
    `UPDATE atlas.sources SET last_fetched_at = now() WHERE active = true`
  )

  return { fetched: items.length, stored, duplicates }
}

/**
 * Cluster source items into story groups.
 * Uses title similarity and time proximity.
 */
export async function clusterItems(): Promise<number> {
  // Get unclustered items
  const pending = await query<{
    id: string
    title: string
    summary: string
    source_published_at: string
    normalized_hash: string
  }>(
    `SELECT id, title, summary, source_published_at, normalized_hash
     FROM atlas.source_items
     WHERE cluster_status = 'pending'
     ORDER BY source_published_at DESC
     LIMIT 200`
  )

  let clustered = 0

  for (const item of pending) {
    // Check if any existing cluster matches (same topic within 24 hours)
    const existingCluster = await queryOne<{ id: string }>(
      `SELECT sc.id FROM atlas.story_clusters sc
       JOIN atlas.cluster_items ci ON ci.cluster_id = sc.id
       JOIN atlas.source_items si ON si.id = ci.source_item_id
       WHERE si.normalized_hash = $1
       AND sc.first_seen_at > now() - interval '48 hours'
       LIMIT 1`,
      [item.normalized_hash]
    )

    if (existingCluster) {
      // Add to existing cluster
      await execute(
        `INSERT INTO atlas.cluster_items (cluster_id, source_item_id, is_primary)
         VALUES ($1, $2, false)
         ON CONFLICT DO NOTHING`,
        [existingCluster.id, item.id]
      )
      await execute(
        `UPDATE atlas.story_clusters
         SET source_count = source_count + 1, last_updated_at = now()
         WHERE id = $1`,
        [existingCluster.id]
      )
    } else {
      // Create new cluster
      const clusterKey = `${item.normalized_hash}-${Date.now()}`
      const cluster = await queryOne<{ id: string }>(
        `INSERT INTO atlas.story_clusters (cluster_key, headline_seed, first_seen_at)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [clusterKey, item.title, item.source_published_at]
      )

      if (cluster) {
        await execute(
          `INSERT INTO atlas.cluster_items (cluster_id, source_item_id, is_primary)
           VALUES ($1, $2, true)`,
          [cluster.id, item.id]
        )
      }
    }

    // Mark as clustered
    await execute(
      `UPDATE atlas.source_items SET cluster_status = 'assigned' WHERE id = $1`,
      [item.id]
    )
    clustered++
  }

  return clustered
}
