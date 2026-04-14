import { pageMetadata } from '@/lib/seo/pageMetadata'
import { WhatsAppShare } from '@/components/ui/WhatsAppShare'
import { WorldCupPageShell } from '@/components/world-cup/WorldCupPageShell'
import { BestThirdTable } from '@/components/world-cup/BestThirdTable'
import ApiSportsWidget from '@/components/ui/ApiSportsWidget'
import { LEAGUES, getSeasonForLeague } from '@/lib/api-football/leagues'
import { getBestThirdStandings } from '@/lib/api-football/worldcup'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('world-cup-2026/groups', lang, '/wc-2026/standings')
}

export const revalidate = 1800

export default async function WorldCupStandingsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = getTranslations((lang as Lang) || 'en')

  const bestThird = await getBestThirdStandings().catch(() => [])

  return (
    <WorldCupPageShell
      title={t.sections.standings}
      description=""
      lang={lang}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <WhatsAppShare text="FIFA World Cup 2026 Group Standings" variant="icon" />
      </div>
      {/* Standings widget — renders all 12 group tables */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <ApiSportsWidget
          type="standings"
          leagueId={LEAGUES.wc.id}
          season={getSeasonForLeague('wc')}
          lang={lang}
          minHeight={600}
        />
      </div>

      {/* Best third-placed teams — custom (no widget for this) */}
      {bestThird.length > 0 && (
        <div style={{ marginTop: 'var(--section-gap)' }}>
          <BestThirdTable rows={bestThird} />
        </div>
      )}
    </WorldCupPageShell>
  )
}
