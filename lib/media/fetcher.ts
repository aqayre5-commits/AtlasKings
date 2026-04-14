/**
 * Media fetch processor — downloads images, processes them, uploads to R2.
 * Processes the fetch queue (media_assets WHERE fetch_status = 'pending').
 */
import { getPendingFetchAssets, updateMediaAsset } from '@/lib/db/media'
import { downloadImage, getImageMetadata, generateDerivedSizes, assessQuality } from './processor'
import { uploadToR2, generateMediaKey, isR2Configured } from './r2'

interface FetchResult {
  processed: number
  failed: number
  skipped: number
}

/**
 * Process pending media assets: download → inspect → resize → upload to R2.
 */
export async function processFetchQueue(limit = 50): Promise<FetchResult> {
  if (!isR2Configured()) {
    console.warn('[media/fetcher] R2 not configured, skipping fetch queue')
    return { processed: 0, failed: 0, skipped: 0 }
  }

  const pending = await getPendingFetchAssets(limit)
  let processed = 0
  let failed = 0

  for (const asset of pending) {
    try {
      // 1. Download original image
      const buffer = await downloadImage(asset.source_url)

      // 2. Extract metadata
      const meta = await getImageMetadata(buffer)

      // 3. Assess quality
      const quality = await assessQuality(buffer, meta)

      // 4. Determine storage key prefix
      const entityType = asset.entity_type ?? 'misc'
      const entityKey = asset.api_football_id ?? asset.id

      // 5. Upload original
      const originalExt = meta.format === 'png' ? 'png' : meta.format === 'jpeg' ? 'jpg' : meta.format
      const originalKey = generateMediaKey(entityType, entityKey, 'original', originalExt)
      await uploadToR2(originalKey, buffer, `image/${meta.format}`)

      // 6. Generate and upload derived sizes
      const derived = await generateDerivedSizes(buffer)
      const heroKey = generateMediaKey(entityType, entityKey, 'hero_1600')
      const cardKey = generateMediaKey(entityType, entityKey, 'card_800')
      const thumbKey = generateMediaKey(entityType, entityKey, 'thumb_400')
      const squareKey = generateMediaKey(entityType, entityKey, 'square_600')

      await Promise.all([
        uploadToR2(heroKey, derived.hero_1600),
        uploadToR2(cardKey, derived.card_800),
        uploadToR2(thumbKey, derived.thumb_400),
        uploadToR2(squareKey, derived.square_600),
      ])

      // 7. Update database
      await updateMediaAsset(asset.id, {
        r2_key: originalKey,
        r2_hero_key: heroKey,
        r2_card_key: cardKey,
        r2_thumb_key: thumbKey,
        r2_square_key: squareKey,
        width: meta.width,
        height: meta.height,
        file_size_bytes: meta.fileSize as any,
        mime_type: `image/${meta.format}`,
        aspect_ratio: meta.aspectRatio as any,
        quality_score: quality.qualityScore as any,
        sharpness_score: quality.sharpnessScore as any,
        resolution_adequate: quality.resolutionAdequate,
        fetch_status: 'fetched',
        fetched_at: new Date().toISOString(),
      })

      processed++

      // Rate limit: 100ms between downloads to avoid hammering CDN
      await new Promise(r => setTimeout(r, 100))
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`[media/fetcher] FAIL asset=${asset.id} url=${asset.source_url} error=${msg}`)
      await updateMediaAsset(asset.id, { fetch_status: 'failed' }).catch(() => {})
      failed++
    }
  }

  return { processed, failed, skipped: 0 }
}
