import { pageMetadata } from '@/lib/seo/pageMetadata'
import Link from 'next/link'
import { WidgetPageShell } from '@/components/layout/WidgetPageShell'
import { getTeamRecentResults, getTeamUpcomingFixtures } from '@/lib/api-football/fixtures'
import { TeamLogo } from '@/components/ui/TeamLogo'
import { EmptyState } from '@/components/ui/EmptyState'
import { MOROCCO_TEAM_ID } from '@/lib/api-football/leagues'
import type { MatchData } from '@/lib/data/placeholderData'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('morocco/fixtures', lang, '/morocco/fixtures')
}
export const revalidate = 60

function MatchCard({ m, langPrefix = '' }: { m: MatchData; langPrefix?: string }) {
  const isLive = m.status === 'LIVE' || m.status === 'HT'
  const isDone = m.status === 'FT'
  const homeWon = isDone && (m.home.score ?? 0) > (m.away.score ?? 0)
  const awayWon = isDone && (m.away.score ?? 0) > (m.home.score ?? 0)

  return (
    <Link href={`${langPrefix}/matches/${m.id}`} className="match-card">
      <div className="match-card-team">
        <TeamLogo src={m.home.logo} alt={m.home.name} size={18} />
        <span className={`match-card-team-name${homeWon ? ' winner' : ''}`}>{m.home.name}</span>
        {(isDone || isLive) && <span className="match-card-score">{m.home.score}</span>}
      </div>
      <div className="match-card-team">
        <TeamLogo src={m.away.logo} alt={m.away.name} size={18} />
        <span className={`match-card-team-name${awayWon ? ' winner' : ''}`}>{m.away.name}</span>
        {(isDone || isLive) && <span className="match-card-score">{m.away.score}</span>}
      </div>
      <div className="match-card-meta">
        <span className="match-card-date">{m.competition} · {m.date}</span>
        <span className={`match-card-status ${isDone ? 'ft' : isLive ? 'live' : 'time'}`}>
          {isDone ? 'FT' : isLive ? `${m.elapsed}'` : m.time}
        </span>
      </div>
    </Link>
  )
}

export default async function MoroccoFixturesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = getTranslations((lang as Lang) || 'en')
  const s = t.sections

  const [recent, upcoming] = await Promise.all([
    getTeamRecentResults(MOROCCO_TEAM_ID, 10).catch(() => []),
    getTeamUpcomingFixtures(MOROCCO_TEAM_ID, 10).catch(() => []),
  ])

  const p = lang === 'en' ? '' : `/${lang}`
  const hasAny = recent.length > 0 || upcoming.length > 0

  return (
    <WidgetPageShell section="Morocco" sectionHref="/morocco" title="Scores & Fixtures" category="morocco">
      {upcoming.length > 0 && (
        <div className="matchday-section">
          <div className="matchday-header">
            <span className="matchday-bar" />
            {s.upcomingFixtures}
          </div>
          <div className="match-card-grid">
            {upcoming.map(m => <MatchCard key={m.id} m={m} langPrefix={p} />)}
          </div>
        </div>
      )}

      {recent.length > 0 && (
        <div className="matchday-section">
          <div className="matchday-header">
            <span className="matchday-bar" />
            {s.recentResults}
          </div>
          <div className="match-card-grid">
            {recent.map(m => <MatchCard key={m.id} m={m} langPrefix={p} />)}
          </div>
        </div>
      )}

      {!hasAny && (
        <EmptyState icon="🇲🇦" title="No matches found" description="Morocco's fixtures will appear here." />
      )}
    </WidgetPageShell>
  )
}
