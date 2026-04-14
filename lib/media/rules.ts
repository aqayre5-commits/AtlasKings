/**
 * Context fusion rules engine.
 * Combines vision tags with football data (fixtures, player info) to produce
 * richer situation tags and review decisions.
 */
import { query, queryOne } from '@/lib/db/client'
import { updateMediaAsset, insertMediaTag, getTagsForAsset, type MediaAsset } from '@/lib/db/media'

/**
 * Apply context rules to a batch of analyzed media assets.
 */
export async function applyContextRules(limit = 50): Promise<{ processed: number; flagged: number }> {
  // Get assets that have been vision-analyzed but not yet context-processed
  const assets = await query<MediaAsset>(
    `SELECT * FROM atlas.media_assets
     WHERE vision_status = 'analyzed' AND review_status = 'pending' AND active = true
     ORDER BY created_at ASC LIMIT $1`,
    [limit]
  )

  let processed = 0
  let flagged = 0

  for (const asset of assets) {
    try {
      const tags = await getTagsForAsset(asset.id)
      const tagMap = new Map(tags.map(t => [`${t.tag_category}:${t.tag_value}`, t.confidence]))

      // ── 1. Kit enrichment ──
      if (asset.entity_type === 'player' && asset.entity_id) {
        const player = await queryOne<{ moroccan_origin_flag: boolean; priority_tier: string }>(
          `SELECT moroccan_origin_flag, priority_tier FROM atlas.players WHERE id = $1`,
          [asset.entity_id]
        )
        if (player?.moroccan_origin_flag) {
          const kitTag = tags.find(t => t.tag_category === 'kit')
          if (kitTag?.tag_value.startsWith('morocco')) {
            // Vision confirmed Morocco kit on a Moroccan player — boost confidence
            await insertMediaTag({
              media_asset_id: asset.id,
              tag_category: 'context',
              tag_value: 'morocco_national_team',
              confidence: 0.9,
              source: 'rules_engine',
            })
            await updateMediaAsset(asset.id, { kit_context: kitTag.tag_value })
          }
        }
      }

      // ── 2. Situation inference from fixtures ──
      if (asset.entity_type === 'player' && asset.entity_id) {
        // Find recent fixtures for this player's team (within 48 hours)
        const fixture = await queryOne<{ home_team_id: string; away_team_id: string; home_score: number; away_score: number; status: string }>(
          `SELECT f.home_team_id, f.away_team_id, f.home_score, f.away_score, f.status
           FROM atlas.fixtures f
           JOIN atlas.players p ON (p.current_team_id = f.home_team_id OR p.current_team_id = f.away_team_id)
           WHERE p.id = $1 AND f.status = 'FT'
             AND f.match_date > now() - interval '48 hours'
           ORDER BY f.match_date DESC LIMIT 1`,
          [asset.entity_id]
        )

        if (fixture) {
          const player2 = await queryOne<{ current_team_id: string }>(
            `SELECT current_team_id FROM atlas.players WHERE id = $1`,
            [asset.entity_id]
          )
          if (player2?.current_team_id) {
            const isHome = player2.current_team_id === fixture.home_team_id
            const teamScore = isHome ? fixture.home_score : fixture.away_score
            const oppScore = isHome ? fixture.away_score : fixture.home_score

            if (teamScore > oppScore) {
              await insertMediaTag({
                media_asset_id: asset.id,
                tag_category: 'situation',
                tag_value: 'post_win',
                confidence: 0.7,
                source: 'rules_engine',
              })
            } else if (teamScore < oppScore) {
              await insertMediaTag({
                media_asset_id: asset.id,
                tag_category: 'situation',
                tag_value: 'post_loss',
                confidence: 0.7,
                source: 'rules_engine',
              })
            }
          }
        }
      }

      // ── 3. Compute composite confidence scores ──
      const emotionTag = tags.find(t => t.tag_category === 'emotion')
      const sceneTag = tags.find(t => t.tag_category === 'scene')
      const identityConf = asset.identity_confidence ?? 0

      const situationConf = emotionTag ? emotionTag.confidence * 0.6 + (sceneTag?.confidence ?? 0) * 0.4 : 0
      const contextConf = (tagMap.get('context:morocco_national_team') ?? 0) * 0.5
        + (asset.kit_context ? 0.3 : 0)
        + (identityConf > 0.8 ? 0.2 : 0)

      await updateMediaAsset(asset.id, {
        situation_confidence: Math.min(situationConf, 1) as any,
        context_confidence: Math.min(contextConf, 1) as any,
      })

      // ── 4. Review flagging ──
      const emotion = emotionTag?.tag_value ?? 'neutral'
      const isStarPlayer = await queryOne<{ id: string }>(
        `SELECT id FROM atlas.players WHERE id = $1 AND priority_tier IN ('S', 'A')`,
        [asset.entity_id ?? '']
      )

      const needsReview =
        // Emotional images of star players
        (['crying', 'angry', 'disappointed'].includes(emotion) && isStarPlayer) ||
        // Low vision confidence
        (identityConf < 0.5 && identityConf > 0) ||
        // Multiple people with low confidence
        (tagMap.has('people:multiple') && identityConf < 0.7)

      if (needsReview) {
        await updateMediaAsset(asset.id, { review_status: 'needs_review' })
        flagged++
      } else {
        // Auto-approve if quality is decent and identity is clear
        const autoApprove = (asset.quality_score ?? 0) >= 30 && identityConf >= 0.6
        await updateMediaAsset(asset.id, {
          review_status: autoApprove ? 'auto_approved' : 'pending',
          article_safe: autoApprove,
        })
      }

      processed++
    } catch (err) {
      console.error(`[media/rules] Failed to process asset ${asset.id}:`, err)
    }
  }

  return { processed, flagged }
}
