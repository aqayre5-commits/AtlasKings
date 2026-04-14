import Link from 'next/link'
import Image from 'next/image'
import { WidgetPageShell } from '@/components/layout/WidgetPageShell'
import { getTeamsByLeague } from '@/lib/api-football/teams'
import { getStandings } from '@/lib/api-football/standings'
import { EmptyState } from '@/components/ui/EmptyState'
import type { ArticleCategory } from '@/types/article'
import type { LeagueKey } from '@/lib/api-football/leagues'

interface Props {
  title: string
  section: string
  sectionHref: string
  category: ArticleCategory
  leagueKey: LeagueKey
  lang?: string
}

export default async function TeamsPage({ title, section, sectionHref, category, leagueKey, lang }: Props) {
  const [teams, standings] = await Promise.all([
    getTeamsByLeague(leagueKey).catch(() => []),
    getStandings(leagueKey).catch(() => []),
  ])

  // Create a position map from standings
  const posMap: Record<number, number> = {}
  for (const row of standings) {
    // Match by team name (API may use slightly different IDs)
    const team = teams.find(t => t.team.name === row.team)
    if (team) posMap[team.team.id] = row.pos
  }

  return (
    <WidgetPageShell section={section} sectionHref={sectionHref} title="Teams" category={category} lang={lang}>
      {teams.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 0,
        }}>
          {teams.map(t => {
            const pos = posMap[t.team.id]
            return (
              <Link
                key={t.team.id}
                href={`/teams/${t.team.id}`}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '24px 16px 20px', textDecoration: 'none',
                  borderBottom: '1px solid var(--border)',
                  borderRight: '1px solid var(--border)',
                  transition: 'background var(--t-fast)',
                }}
              >
                {/* Team logo */}
                <div style={{
                  width: 64, height: 64, marginBottom: 12, position: 'relative',
                }}>
                  <Image
                    src={t.team.logo}
                    alt={t.team.name}
                    width={64}
                    height={64}
                    style={{ objectFit: 'contain' }}
                  />
                </div>

                {/* Team name */}
                <div style={{
                  fontFamily: 'var(--font-head)', fontSize: 14, fontWeight: 700,
                  color: 'var(--text)', textAlign: 'center', lineHeight: 1.2,
                  marginBottom: 6,
                }}>
                  {t.team.name}
                </div>

                {/* Position badge */}
                {pos && (
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
                    color: pos <= 4 ? 'var(--live)' : pos >= 18 ? 'var(--red)' : 'var(--text-faint)',
                    background: pos <= 4 ? 'var(--green-light)' : pos >= 18 ? 'var(--red-light)' : 'var(--card-alt)',
                    padding: '2px 8px', borderRadius: 'var(--radius-sm)',
                    letterSpacing: '0.04em',
                  }}>
                    {pos}{pos === 1 ? 'st' : pos === 2 ? 'nd' : pos === 3 ? 'rd' : 'th'}
                  </span>
                )}

                {/* Venue */}
                {t.venue?.name && (
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-faint)',
                    marginTop: 6, textAlign: 'center', lineHeight: 1.3,
                  }}>
                    {t.venue.name}
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      ) : (
        <EmptyState icon="⚽" title="Teams loading" description="Team data will appear here." />
      )}
    </WidgetPageShell>
  )
}
