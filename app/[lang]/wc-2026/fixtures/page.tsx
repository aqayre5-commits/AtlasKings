import { pageMetadata } from '@/lib/seo/pageMetadata'
import { WorldCupPageShell } from '@/components/world-cup/WorldCupPageShell'
import ApiSportsWidget from '@/components/ui/ApiSportsWidget'
import { LEAGUES, getSeasonForLeague } from '@/lib/api-football/leagues'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('world-cup-2026/scores', lang, '/wc-2026/fixtures')
}

export const revalidate = 1800

export default async function WorldCupFixturesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = getTranslations((lang as Lang) || 'en')

  return (
    <WorldCupPageShell
      title={t.subnav.fixturesResults}
      description=""
      lang={lang}
    >
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <ApiSportsWidget
          type="league"
          leagueId={LEAGUES.wc.id}
          season={getSeasonForLeague('wc')}
          lang={lang}
          minHeight={700}
        />
      </div>
    </WorldCupPageShell>
  )
}
