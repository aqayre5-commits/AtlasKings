import { pageMetadata } from '@/lib/seo/pageMetadata'
import { categoryColor } from '@/lib/utils'
import { PlayerStatsPage } from '@/components/pages/PlayerStatsPage'
import { getTopScorers, getTopAssists, getTopYellowCards, getTopRedCards } from '@/lib/api-football/players'
import { LEAGUES } from '@/lib/api-football/leagues'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('world-cup-2026/stats', lang, '/wc-2026/stats')
}

export const revalidate = 1800

export default async function WorldCupStatsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = getTranslations((lang as Lang) || 'en')
  const p = lang === 'en' ? '' : `/${lang}`
  const color = categoryColor('world-cup')

  const leagueId = LEAGUES.wc.id

  const [scorers, assists, yellowCards, redCards] = await Promise.all([
    getTopScorers(leagueId).catch(() => []),
    getTopAssists(leagueId).catch(() => []),
    getTopYellowCards(leagueId).catch(() => []),
    getTopRedCards(leagueId).catch(() => []),
  ])

  return (
    <PlayerStatsPage
      title={t.subnav.playerStats}
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
