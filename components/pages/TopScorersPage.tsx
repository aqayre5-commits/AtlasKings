import { getTopScorers } from '@/lib/api-football/players'
import { categoryColor } from '@/lib/utils'
import { LEAGUES } from '@/lib/api-football/leagues'
import type { LeagueKey } from '@/lib/api-football/leagues'
import type { ArticleCategory } from '@/types/article'

interface Props {
  title: string
  category: ArticleCategory
  leagueKey: LeagueKey
  lang?: string
}

export async function TopScorersPage({ title, category, leagueKey, lang }: Props) {
  const color = categoryColor(category)
  const leagueId = LEAGUES[leagueKey].id
  const scorers = await getTopScorers(leagueId).catch(() => [])

  return (
    <main>
      <div className="page-wrap">
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div className="card" style={{ marginTop: 0 }}>
            <div className="sec-head">
              <div className="sec-bar" style={{ background: color }} />
              <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)' }}>
                {title} — Top Scorers
              </h1>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-faint)', letterSpacing: '0.06em' }}>2025–26</span>
            </div>

            {scorers.length === 0 ? (
              <div style={{ padding: '48px 20px', textAlign: 'center', fontFamily: 'var(--font-head)', fontSize: 14, color: 'var(--text-faint)' }}>
                Top scorer data loading…
              </div>
            ) : (
              <>
                {/* Header row */}
                <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 140px 48px 48px 48px', alignItems: 'center', padding: '8px 16px', background: 'var(--card-alt)', borderBottom: '1px solid var(--border)', gap: 12 }}>
                  {['#', 'Player', 'Club', 'G', 'A', 'Apps'].map(h => (
                    <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-faint)', textTransform: 'uppercase', textAlign: h === 'Player' || h === 'Club' ? 'left' : 'center' }}>{h}</span>
                  ))}
                </div>
                {scorers.slice(0, 20).map((s, i) => {
                  const stats = s.statistics[0]
                  return (
                    <div key={s.player.id} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 140px 48px 48px 48px', alignItems: 'center', padding: '11px 16px', borderBottom: i < Math.min(scorers.length, 20) - 1 ? '1px solid var(--border)' : 'none', gap: 12, background: i === 0 ? `${color}08` : undefined }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: i < 3 ? color : 'var(--text-faint)', fontWeight: i < 3 ? 700 : 400, textAlign: 'center' }}>
                        {i + 1}
                      </span>
                      <div>
                        <div style={{ fontFamily: 'var(--font-head)', fontSize: 14, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{s.player.name}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-faint)', marginTop: 3 }}>{s.player.nationality}</div>
                      </div>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-sec)' }}>{stats?.team.name}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 800, color: color, textAlign: 'center' }}>{stats?.goals.total ?? 0}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-sec)', textAlign: 'center' }}>{stats?.goals.assists ?? 0}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)', textAlign: 'center' }}>{stats?.games.appearences ?? 0}</span>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
