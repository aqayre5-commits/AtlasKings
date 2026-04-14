'use client'

import { useEffect, useState } from 'react'
import { SkeletonWidget } from '@/components/ui/Skeleton'

interface ApiSportsWidgetProps {
  type: 'games' | 'standings' | 'game' | 'team' | 'player' | 'h2h' | 'leagues' | 'league'
  leagueId?: number
  teamId?: number
  gameId?: string | number
  playerId?: number
  season?: number
  /** Two team IDs for H2H widget */
  h2hTeam1?: number
  h2hTeam2?: number
  lang?: string
  className?: string
  minHeight?: number
}

export default function ApiSportsWidget({
  type,
  leagueId,
  teamId,
  gameId,
  playerId,
  season,
  h2hTeam1,
  h2hTeam2,
  lang,
  className,
  minHeight = 400,
}: ApiSportsWidgetProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={className} style={{ minHeight, width: '100%' }}>
        <SkeletonWidget height={minHeight} />
      </div>
    )
  }

  // Map lang to widget-supported language (en, fr, es, it only)
  const widgetLang = lang === 'fr' ? 'fr' : 'en'

  // Build data attributes
  const attrs: Record<string, string> = {
    'data-type': type,
  }
  if (leagueId) attrs['data-league-id'] = String(leagueId)
  if (teamId) attrs['data-team-id'] = String(teamId)
  if (gameId) attrs['data-game-id'] = String(gameId)
  if (playerId) attrs['data-player-id'] = String(playerId)
  if (season) attrs['data-season'] = String(season)
  if (lang) attrs['data-lang'] = widgetLang

  // H2H needs two team IDs passed as data-team-id in format "team1-team2"
  if (type === 'h2h' && h2hTeam1 && h2hTeam2) {
    attrs['data-team-id'] = `${h2hTeam1}`
    attrs['data-team-id-2'] = `${h2hTeam2}`
  }

  return (
    <div className={className} style={{ minHeight, width: '100%' }}>
      <api-sports-widget {...attrs} />
    </div>
  )
}
