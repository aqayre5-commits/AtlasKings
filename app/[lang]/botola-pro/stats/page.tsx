import { pageMetadata } from '@/lib/seo/pageMetadata'
import { getTopScorers, getTopAssists, getTopYellowCards, getTopRedCards } from '@/lib/api-football/players'
import { LEAGUES } from '@/lib/api-football/leagues'
import { categoryColor } from '@/lib/utils'
import { PlayerStatsPage } from '@/components/pages/PlayerStatsPage'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('botola-pro/stats', lang, '/botola-pro/stats')
}

export const revalidate = 3600

export default async function BotolaStatsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const p = lang === 'en' ? '' : `/${lang}`
  const leagueId = LEAGUES.botola.id
  const color = categoryColor('botola-pro')

  const [scorers, assists, yellowCards, redCards] = await Promise.all([
    getTopScorers(leagueId).catch(() => []),
    getTopAssists(leagueId).catch(() => []),
    getTopYellowCards(leagueId).catch(() => []),
    getTopRedCards(leagueId).catch(() => []),
  ])

  return (
    <PlayerStatsPage
      title="Botola Pro"
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
