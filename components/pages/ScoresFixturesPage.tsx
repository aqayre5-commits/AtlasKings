import { WidgetPageShell } from '@/components/layout/WidgetPageShell'
import { getMatchdayFixtures, getTodayFixtures, getUpcomingFixtures } from '@/lib/api-football/fixtures'
import { getAllTodayFixtures } from '@/lib/api-football/fixtures'
import { EmptyState } from '@/components/ui/EmptyState'
import { MatchCard } from '@/components/primitives/MatchCard'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'
import type { ArticleCategory } from '@/types/article'
import type { LeagueKey } from '@/lib/api-football/leagues'
import type { MatchData } from '@/lib/data/placeholderData'

interface Props {
  title: string
  section: string
  sectionHref: string
  category: ArticleCategory
  leagueKey?: LeagueKey
  lang?: string
}

function formatRound(round: string): string {
  return round
    .replace('Regular Season - ', 'Matchday ')
    .replace('Preliminary Round', 'Preliminary')
}

export default async function ScoresFixturesPage({ title, section, sectionHref, category, leagueKey, lang }: Props) {
  const t = getTranslations((lang as Lang) || 'en')
  const s = t.sections
  const p = lang === 'en' ? '' : `/${lang}`

  if (leagueKey) {
    // LEAGUE-SPECIFIC: Show matchday rounds
    const { rounds } = await getMatchdayFixtures(leagueKey).catch(() => ({ rounds: [] }))

    // Find featured live match
    const allMatches = rounds.flatMap(r => r.matches)
    const liveMatch = allMatches.find(m => m.status === 'LIVE' || m.status === 'HT')

    return (
      <WidgetPageShell section={section} sectionHref={sectionHref} title={s.scoresAndFixtures} category={category} lang={lang}>
        {/* Featured live match */}
        {liveMatch && (
          <div style={{ padding: 16 }}>
            <MatchCard match={liveMatch} variant="hero" langPrefix={p} />
          </div>
        )}

        {rounds.length > 0 ? (
          rounds.map(({ round, matches }) => (
            <div key={round}>
              {/* Round header */}
              <div style={{
                padding: '12px 16px', background: 'var(--card-alt)',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <div style={{ width: 3, height: 14, borderRadius: 2, background: 'var(--green)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-head)', fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>
                  {formatRound(round)}
                </span>
              </div>
              {/* Fixture list — league label is redundant here (round header above),
                  so we hide it; status chip falls back under the score column. */}
              {matches.map(m => (
                <MatchCard
                  key={m.id}
                  match={m}
                  variant="list-row"
                  langPrefix={p}
                  showLeague={false}
                />
              ))}
            </div>
          ))
        ) : (
          <EmptyState icon="⚽" title={s.scoresAndFixtures} description="" />
        )}
      </WidgetPageShell>
    )
  }

  // GLOBAL: Show all leagues
  const keys: LeagueKey[] = ['pl', 'laliga', 'ucl', 'botola']
  const results = await Promise.allSettled(
    keys.map(async k => {
      const { rounds } = await getMatchdayFixtures(k)
      return { key: k, rounds }
    })
  )

  const leagueData = results
    .filter((r): r is PromiseFulfilledResult<{ key: LeagueKey; rounds: { round: string; matches: MatchData[] }[] }> => r.status === 'fulfilled')
    .map(r => r.value)
    .filter(d => d.rounds.length > 0)

  const LEAGUE_NAMES: Record<string, string> = {
    pl: 'Premier League', laliga: 'La Liga', ucl: 'Champions League', botola: 'Botola Pro',
  }

  return (
    <WidgetPageShell section={section} sectionHref={sectionHref} title={s.scoresAndFixtures} category={category} lang={lang}>
      {leagueData.length > 0 ? (
        leagueData.map(({ key, rounds }) => (
          <div key={key}>
            {/* Competition header */}
            <div style={{
              padding: '12px 16px', background: 'var(--score-bg)',
              borderBottom: '1px solid var(--border)',
              fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 800,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: '#fff',
            }}>
              {LEAGUE_NAMES[key] ?? key}
            </div>
            {rounds.map(({ round, matches }) => (
              <div key={round}>
                <div style={{
                  padding: '8px 16px', background: 'var(--card-alt)',
                  borderBottom: '1px solid var(--border)',
                  fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--text-sec)',
                }}>
                  {formatRound(round)}
                </div>
                {matches.map(m => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    variant="list-row"
                    langPrefix={p}
                    showLeague={false}
                  />
                ))}
              </div>
            ))}
          </div>
        ))
      ) : (
        <EmptyState icon="⚽" title={s.scoresAndFixtures} description="" />
      )}
    </WidgetPageShell>
  )
}
