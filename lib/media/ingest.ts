/**
 * Media ingestion — populate media_assets from API-Football entities.
 * Reads players, teams, venues, and competitions from the atlas schema
 * and creates media_asset rows for each with API-Football CDN URLs.
 */
import { query } from '@/lib/db/client'
import { insertMediaAsset, insertMediaEntity } from '@/lib/db/media'

const API_SPORTS_CDN = 'https://media.api-sports.io/football'

interface IngestResult {
  players: number
  teams: number
  venues: number
  competitions: number
  total: number
}

/**
 * Ingest player media from atlas.players.
 * Uses the API-Football player photo URL pattern.
 */
async function ingestPlayerMedia(): Promise<number> {
  // Get all players with API-Football IDs
  const players = await query<{
    id: string; full_name: string; api_football_player_id: number; priority_tier: string
  }>(
    `SELECT id, full_name, api_football_player_id, priority_tier
     FROM atlas.players
     WHERE api_football_player_id IS NOT NULL AND active = true`
  )

  let count = 0
  for (const player of players) {
    const sourceUrl = `${API_SPORTS_CDN}/players/${player.api_football_player_id}.png`
    const asset = await insertMediaAsset({
      source_url: sourceUrl,
      source_type: 'api_football',
      entity_type: 'player',
      entity_id: player.id,
      api_football_id: player.api_football_player_id,
      media_kind: 'portrait',
    })
    if (asset) {
      // Link entity with high confidence (source-linked)
      await insertMediaEntity({
        media_asset_id: asset.id,
        entity_type: 'player',
        entity_id: player.id,
        role: 'subject',
        confidence: 0.95,
        confirmed: true, // Source-linked = confirmed identity
      })
      count++
    }
  }
  return count
}

/**
 * Ingest team logo media from atlas.teams.
 */
async function ingestTeamMedia(): Promise<number> {
  const teams = await query<{
    id: string; name: string; api_football_team_id: number
  }>(
    `SELECT id, name, api_football_team_id
     FROM atlas.teams
     WHERE api_football_team_id IS NOT NULL`
  )

  let count = 0
  for (const team of teams) {
    const sourceUrl = `${API_SPORTS_CDN}/teams/${team.api_football_team_id}.png`
    const asset = await insertMediaAsset({
      source_url: sourceUrl,
      source_type: 'api_football',
      entity_type: 'team',
      entity_id: team.id,
      api_football_id: team.api_football_team_id,
      media_kind: 'logo',
    })
    if (asset) {
      await insertMediaEntity({
        media_asset_id: asset.id,
        entity_type: 'team',
        entity_id: team.id,
        role: 'subject',
        confidence: 1.0,
        confirmed: true,
      })
      count++
    }
  }
  return count
}

/**
 * Ingest competition logo media.
 */
async function ingestCompetitionMedia(): Promise<number> {
  const comps = await query<{
    id: string; name: string; api_football_league_id: number
  }>(
    `SELECT id, name, api_football_league_id
     FROM atlas.competitions
     WHERE api_football_league_id IS NOT NULL`
  )

  let count = 0
  for (const comp of comps) {
    const sourceUrl = `${API_SPORTS_CDN}/leagues/${comp.api_football_league_id}.png`
    const asset = await insertMediaAsset({
      source_url: sourceUrl,
      source_type: 'api_football',
      entity_type: 'competition',
      entity_id: comp.id,
      api_football_id: comp.api_football_league_id,
      media_kind: 'logo',
    })
    if (asset) count++
  }
  return count
}

/**
 * Ingest known venue/stadium media using hardcoded API-Football venue IDs.
 * These are the major Moroccan and European venues.
 */
async function ingestVenueMedia(): Promise<number> {
  const venues: { name: string; apiId: number }[] = [
    { name: 'Complexe Sportif Mohammed V', apiId: 1099 },
    { name: 'Stade Moulay Abdellah', apiId: 1103 },
    { name: 'Grand Stade de Marrakech', apiId: 1107 },
    { name: 'Stade Ibn Batouta', apiId: 1106 },
    { name: 'Santiago Bernabéu', apiId: 1456 },
    { name: 'Camp Nou', apiId: 1455 },
    { name: 'Emirates Stadium', apiId: 494 },
    { name: 'Anfield', apiId: 489 },
    { name: 'Old Trafford', apiId: 556 },
    { name: 'Wembley', apiId: 495 },
    { name: 'Stade de France', apiId: 681 },
    { name: 'Allianz Arena', apiId: 700 },
  ]

  let count = 0
  for (const venue of venues) {
    const sourceUrl = `${API_SPORTS_CDN}/venues/${venue.apiId}.png`
    const asset = await insertMediaAsset({
      source_url: sourceUrl,
      source_type: 'api_football',
      entity_type: 'venue',
      entity_id: `venue_${venue.apiId}`,
      api_football_id: venue.apiId,
      media_kind: 'stadium',
    })
    if (asset) count++
  }
  return count
}

/**
 * Run full ingestion across all entity types.
 */
export async function ingestAllMedia(): Promise<IngestResult> {
  const [players, teams, competitions, venues] = await Promise.all([
    ingestPlayerMedia().catch(() => 0),
    ingestTeamMedia().catch(() => 0),
    ingestCompetitionMedia().catch(() => 0),
    ingestVenueMedia().catch(() => 0),
  ])

  return {
    players,
    teams,
    venues,
    competitions,
    total: players + teams + competitions + venues,
  }
}
