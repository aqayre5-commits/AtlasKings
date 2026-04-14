/**
 * Expanded media ingestion — pulls full squads from all tracked leagues
 * via API-Football, seeds teams + players into the DB, then creates media_assets.
 *
 * This gives ~1500+ player photos + team logos from:
 * Botola Pro, Premier League, La Liga, Champions League, Bundesliga, Serie A, Ligue 1
 */
import { getTeamsByLeague, getTeamSquad } from '@/lib/api-football/teams'
import { LEAGUES, type LeagueKey } from '@/lib/api-football/leagues'
import { query, queryOne, execute } from '@/lib/db/client'
import { insertMediaAsset, insertMediaEntity } from '@/lib/db/media'

const API_SPORTS_CDN = 'https://media.api-sports.io/football'

// Leagues to pull full squads from
const INGEST_LEAGUES: LeagueKey[] = [
  'botola', 'pl', 'laliga', 'ucl', 'bundesliga', 'seriea', 'ligue1',
]

interface ExpandedIngestResult {
  teamsCreated: number
  teamsSkipped: number
  playersCreated: number
  playersSkipped: number
  mediaCreated: number
  errors: string[]
}

/**
 * Upsert a team into atlas.teams and create a media_asset for its logo.
 */
async function upsertTeam(team: {
  id: number; name: string; country: string; logo: string
}, competitionId?: string): Promise<string> {
  // Check if team exists
  const existing = await queryOne<{ id: string }>(
    `SELECT id FROM atlas.teams WHERE api_football_team_id = $1`,
    [team.id]
  )
  if (existing) return existing.id

  // Insert team
  const row = await queryOne<{ id: string }>(
    `INSERT INTO atlas.teams (id, api_football_team_id, name, slug, country, logo_url, moroccan_club_flag, competition_id)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (api_football_team_id) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [
      team.id,
      team.name,
      team.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      team.country,
      team.logo,
      team.country === 'Morocco',
      competitionId ?? null,
    ]
  )

  const teamId = row?.id ?? ''

  // Create media asset for logo
  if (teamId) {
    const asset = await insertMediaAsset({
      source_url: `${API_SPORTS_CDN}/teams/${team.id}.png`,
      source_type: 'api_football',
      entity_type: 'team',
      entity_id: teamId,
      api_football_id: team.id,
      media_kind: 'logo',
    })
    if (asset) {
      await insertMediaEntity({
        media_asset_id: asset.id,
        entity_type: 'team',
        entity_id: teamId,
        role: 'subject',
        confidence: 1.0,
        confirmed: true,
      })
    }
  }

  return teamId
}

/**
 * Upsert a player into atlas.players and create a media_asset for their photo.
 */
async function upsertPlayer(player: {
  id: number; name: string; age: number; number: number | null; position: string; photo: string
}, teamId: string, isMoroccanClub: boolean): Promise<boolean> {
  // Check if player exists
  const existing = await queryOne<{ id: string }>(
    `SELECT id FROM atlas.players WHERE api_football_player_id = $1`,
    [player.id]
  )

  let playerId: string

  if (existing) {
    playerId = existing.id
    // Update team assignment
    await execute(
      `UPDATE atlas.players SET current_team_id = $1, updated_at = now() WHERE id = $2`,
      [teamId, playerId]
    )
  } else {
    // Determine position category
    const posMap: Record<string, string> = {
      Goalkeeper: 'GK', Defender: 'DEF', Midfielder: 'MID', Attacker: 'FWD',
    }
    const posCode = posMap[player.position] ?? 'MID'

    const row = await queryOne<{ id: string }>(
      `INSERT INTO atlas.players
       (id, api_football_player_id, full_name, position, current_team_id, active, priority_tier, moroccan_origin_flag)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, true, $5, $6)
       ON CONFLICT (api_football_player_id) DO UPDATE SET
         full_name = EXCLUDED.full_name, current_team_id = EXCLUDED.current_team_id, updated_at = now()
       RETURNING id`,
      [
        player.id,
        player.name,
        posCode,
        teamId,
        isMoroccanClub ? 'B' : 'C', // Moroccan club players get B tier, others C
        isMoroccanClub, // Assume Moroccan club players are Moroccan-origin
      ]
    )
    playerId = row?.id ?? ''
  }

  if (!playerId) return false

  // Create media asset for player photo
  const asset = await insertMediaAsset({
    source_url: `${API_SPORTS_CDN}/players/${player.id}.png`,
    source_type: 'api_football',
    entity_type: 'player',
    entity_id: playerId,
    api_football_id: player.id,
    media_kind: 'portrait',
  })

  if (asset) {
    await insertMediaEntity({
      media_asset_id: asset.id,
      entity_type: 'player',
      entity_id: playerId,
      role: 'subject',
      confidence: 0.95,
      confirmed: true,
    })
    return true
  }
  return false
}

/**
 * Run expanded ingestion for all tracked leagues.
 * Pulls teams + full squads from API-Football.
 */
export async function ingestExpandedMedia(
  leagues?: LeagueKey[]
): Promise<ExpandedIngestResult> {
  const result: ExpandedIngestResult = {
    teamsCreated: 0,
    teamsSkipped: 0,
    playersCreated: 0,
    playersSkipped: 0,
    mediaCreated: 0,
    errors: [],
  }

  const targetLeagues = leagues ?? INGEST_LEAGUES

  for (const leagueKey of targetLeagues) {
    const league = LEAGUES[leagueKey]
    console.log(`[ingest-expanded] Processing ${league.name}...`)

    try {
      // 1. Get all teams in this league
      const teams = await getTeamsByLeague(leagueKey)
      if (!teams || teams.length === 0) {
        result.errors.push(`No teams found for ${league.name}`)
        continue
      }

      console.log(`[ingest-expanded] Found ${teams.length} teams in ${league.name}`)

      // Get competition ID from atlas.competitions
      const comp = await queryOne<{ id: string }>(
        `SELECT id FROM atlas.competitions WHERE api_football_league_id = $1`,
        [league.id]
      )

      for (const teamData of teams) {
        try {
          // 2. Upsert team
          const existingTeam = await queryOne<{ id: string }>(
            `SELECT id FROM atlas.teams WHERE api_football_team_id = $1`,
            [teamData.team.id]
          )

          let teamId: string
          if (existingTeam) {
            teamId = existingTeam.id
            result.teamsSkipped++
          } else {
            teamId = await upsertTeam(teamData.team, comp?.id)
            result.teamsCreated++
          }

          // 3. Get squad for this team
          const squad = await getTeamSquad(teamData.team.id)
          if (!squad || squad.length === 0) {
            // Some teams have no squad data
            continue
          }

          const isMoroccanClub = teamData.team.country === 'Morocco'

          for (const player of squad) {
            try {
              const created = await upsertPlayer(player, teamId, isMoroccanClub)
              if (created) {
                result.playersCreated++
                result.mediaCreated++
              } else {
                result.playersSkipped++
              }
            } catch (err) {
              result.errors.push(`Player ${player.name}: ${String(err).slice(0, 100)}`)
            }
          }

          // Rate limit between squad calls (API-Football: 10 req/min on some plans)
          await new Promise(r => setTimeout(r, 1500))

        } catch (err) {
          result.errors.push(`Team ${teamData.team.name}: ${String(err).slice(0, 100)}`)
        }
      }

      // Rate limit between leagues
      await new Promise(r => setTimeout(r, 2000))

    } catch (err) {
      result.errors.push(`League ${league.name}: ${String(err).slice(0, 100)}`)
    }
  }

  return result
}
