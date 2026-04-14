import { pageMetadata } from '@/lib/seo/pageMetadata'
import { getStandings } from '@/lib/api-football/standings'
import { TeamLogo } from '@/components/ui/TeamLogo'
import { EmptyState } from '@/components/ui/EmptyState'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('champions-league/table', lang, '/champions-league/table')
}

export const revalidate = 3600

export default async function UCLTablePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = getTranslations((lang as Lang) || 'en')
  const st = t.ui.standings

  const standings = await getStandings('ucl').catch(() => [])

  return (
    <main>
      <div className="page-wrap">
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {standings.length > 0 ? (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                padding: '12px 16px', background: 'var(--card-alt)',
                borderBottom: '1px solid var(--border)',
                fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 800,
                letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ width: 3, height: 14, borderRadius: 2, background: 'var(--navy)' }} />
                {t.nav.ucl} — {st.title}
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="data-table" style={{ minWidth: 600 }}>
                  <thead>
                    <tr>
                      <th>{st.pos}</th>
                      <th className="left">{st.club}</th>
                      <th>{st.played}</th>
                      <th>{st.won}</th>
                      <th>{st.drawn}</th>
                      <th>{st.lost}</th>
                      <th>{st.gd}</th>
                      <th>{st.points}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((row, i) => (
                      <tr key={`${i}-${row.team}`} style={{
                        background: row.pos <= 8 ? 'rgba(10, 31, 92, 0.05)' : undefined,
                      }}>
                        <td>{row.pos}</td>
                        <td className="team-name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <TeamLogo src={row.logo} alt={row.team} size={18} />
                          {row.team}
                        </td>
                        <td>{row.played}</td>
                        <td>{row.won}</td>
                        <td>{row.drawn}</td>
                        <td>{row.lost}</td>
                        <td>{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                        <td className="pts">{row.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="card">
              <EmptyState icon="🏆" title={st.title} description="" />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
