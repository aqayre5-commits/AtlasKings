import { pageMetadata } from '@/lib/seo/pageMetadata'
import { getTopScorers, getTopAssists, getTopYellowCards, getTopRedCards } from '@/lib/api-football/players'
import { LEAGUES } from '@/lib/api-football/leagues'
import { categoryColor } from '@/lib/utils'
import { PlayerStatsPage } from '@/components/pages/PlayerStatsPage'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('premier-league/stats', lang, '/premier-league/stats')
}

export const revalidate = 3600

export default async function PLStatsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const p = lang === 'en' ? '' : `/${lang}`
  const leagueId = LEAGUES.pl.id
  const color = categoryColor('premier-league')

  const [scorers, assists, yellowCards, redCards] = await Promise.all([
    getTopScorers(leagueId).catch(() => []),
    getTopAssists(leagueId).catch(() => []),
    getTopYellowCards(leagueId).catch(() => []),
    getTopRedCards(leagueId).catch(() => []),
  ])

  return (
    <PlayerStatsPage
      title="Premier League"
      color={color}
      lang={lang}
      langPrefix={p}
      scorers={scorers}
      assists={assists}
      yellowCards={yellowCards}
      redCards={redCards}
    />
  )
}
