// Entity resolution — match players, teams, competitions from article text
import { query } from './client'

interface ResolvedEntity {
  type: 'player' | 'team' | 'competition' | 'rivalry'
  id: string
  name: string
  relevance: 'primary' | 'secondary' | 'mention'
  moroccan: boolean
  priorityTier?: string
}

/**
 * Resolve entities mentioned in article text.
 * Checks player aliases, team names, competition names, and rivalries.
 */
export async function resolveEntities(text: string): Promise<ResolvedEntity[]> {
  const lower = text.toLowerCase()
  const entities: ResolvedEntity[] = []
  const seenIds = new Set<string>()

  // 1. Match player aliases (most specific — highest value)
  const playerMatches = await query<{
    player_id: string
    full_name: string
    alias: string
    moroccan_origin_flag: boolean
    priority_tier: string
    morocco_representation_status: string
  }>(
    `SELECT DISTINCT p.id as player_id, p.full_name, pa.alias,
            p.moroccan_origin_flag, p.priority_tier, p.morocco_representation_status
     FROM atlas.player_aliases pa
     JOIN atlas.players p ON p.id = pa.player_id
     WHERE p.active = true`
  )

  for (const match of playerMatches) {
    if (lower.includes(match.alias.toLowerCase()) && !seenIds.has(match.player_id)) {
      seenIds.add(match.player_id)
      entities.push({
        type: 'player',
        id: match.player_id,
        name: match.full_name,
        relevance: match.priority_tier === 'S' ? 'primary' : 'secondary',
        moroccan: match.moroccan_origin_flag,
        priorityTier: match.priority_tier,
      })
    }
  }

  // 2. Also check player full names directly (for players without aliases)
  const directPlayers = await query<{
    id: string
    full_name: string
    moroccan_origin_flag: boolean
    priority_tier: string
  }>(
    `SELECT id, full_name, moroccan_origin_flag, priority_tier
     FROM atlas.players WHERE active = true`
  )

  for (const p of directPlayers) {
    if (lower.includes(p.full_name.toLowerCase()) && !seenIds.has(p.id)) {
      seenIds.add(p.id)
      entities.push({
        type: 'player',
        id: p.id,
        name: p.full_name,
        relevance: 'mention',
        moroccan: p.moroccan_origin_flag,
        priorityTier: p.priority_tier,
      })
    }
  }

  // 3. Match competitions
  const competitions = await query<{ id: string; name: string; slug: string }>(
    `SELECT id, name, slug FROM atlas.competitions WHERE tracked_flag = true`
  )

  for (const comp of competitions) {
    if (lower.includes(comp.name.toLowerCase()) || lower.includes(comp.slug.replace(/-/g, ' '))) {
      if (!seenIds.has(comp.id)) {
        seenIds.add(comp.id)
        entities.push({
          type: 'competition',
          id: comp.id,
          name: comp.name,
          relevance: 'secondary',
          moroccan: ['botola-pro', 'afcon', 'caf-cl'].includes(comp.slug),
        })
      }
    }
  }

  // 4. Match rivalries
  const rivalries = await query<{ id: string; name: string; slug: string }>(
    `SELECT id, name, slug FROM atlas.rivalries WHERE active = true`
  )

  for (const rivalry of rivalries) {
    const terms = rivalry.slug.split('-vs-')
    if (terms.some(t => lower.includes(t))) {
      entities.push({
        type: 'rivalry',
        id: rivalry.id,
        name: rivalry.name,
        relevance: 'secondary',
        moroccan: true,
      })
    }
  }

  return entities
}

/**
 * Calculate Morocco relevance score (0-100) from resolved entities.
 */
export function calculateMoroccoRelevance(entities: ResolvedEntity[]): number {
  let score = 0

  for (const entity of entities) {
    if (entity.moroccan) {
      if (entity.type === 'player' && entity.priorityTier === 'S') score += 30
      else if (entity.type === 'player' && entity.priorityTier === 'A') score += 20
      else if (entity.type === 'player') score += 10
      else if (entity.type === 'rivalry') score += 25
      else if (entity.type === 'competition') score += 15
    }
  }

  return Math.min(100, score)
}
