import Link from 'next/link'
import { getStandings } from '@/lib/api-football/standings'
import { categoryColor } from '@/lib/utils'
import type { LeagueKey } from '@/lib/api-football/leagues'
import type { ArticleCategory } from '@/types/article'

interface Props {
  title: string
  category: ArticleCategory
  leagueKey: LeagueKey
}

const STATUS_COLORS: Record<string, string> = {
  champions: '#0d9940',
  ucl:       '#0a1f5c',
  uel:       '#e06000',
  relegation:'#c1121f',
}

const STATUS_LABELS: Record<string, string> = {
  champions:  'Champions',
  ucl:        'Champions League',
  uel:        'Europa League',
  relegation: 'Relegation',
}

export async function TablePage({ title, category, leagueKey }: Props) {
  const color = categoryColor(category)
  const rows = await getStandings(leagueKey).catch(() => [])

  // Group legend items
  const statuses = [...new Set(rows.map(r => r.status).filter(Boolean))]

  return (
    <main>
      <div className="page-wrap">
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div className="card" style={{ marginTop: 0 }}>
            <div className="sec-head">
              <div className="sec-bar" style={{ background: color }} />
              <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)' }}>
                {title} — Standings
              </h1>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-faint)', letterSpacing: '0.06em' }}>
                2025–26
              </span>
            </div>

            {rows.length === 0 ? (
              <div style={{ padding: '48px 20px', textAlign: 'center', fontFamily: 'var(--font-head)', fontSize: 14, color: 'var(--text-faint)' }}>
                Table data loading…
              </div>
            ) : (
              <table className="standings-table" style={{ fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ width: 28 }}>#</th>
                    <th style={{ textAlign: 'left' }}>Club</th>
                    <th>MP</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>GD</th>
                    <th>Pts</th>
                    <th>Form</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => {
                    const prevStatus = i > 0 ? rows[i - 1].status : undefined
                    const showDivider = row.status !== prevStatus && i > 0
                    return (
                      <tr key={row.team} style={{
                        borderTop: showDivider ? `2px solid ${STATUS_COLORS[row.status ?? ''] ?? 'var(--border)'}` : undefined,
                      }}>
                        <td className="st-pos" style={{ paddingLeft: 14 }}>
                          {row.status && (
                            <span style={{ display: 'inline-block', width: 3, height: 14, background: STATUS_COLORS[row.status] ?? 'transparent', borderRadius: 2, marginRight: 6, verticalAlign: 'middle' }} />
                          )}
                          {row.pos}
                        </td>
                        <td className="st-team">{row.team}</td>
                        <td className="st-num">{row.played}</td>
                        <td className="st-num">{row.won}</td>
                        <td className="st-num">{row.drawn}</td>
                        <td className="st-num">{row.lost}</td>
                        <td className="st-num">{row.gf}</td>
                        <td className="st-num">{row.ga}</td>
                        <td className="st-num">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                        <td className="st-pts">{row.pts}</td>
                        <td>
                          <span className="st-form">
                            {row.form.split('').slice(-5).map((r, j) => (
                              <i key={j} className={`fd ${r === 'W' ? 'fw' : r === 'L' ? 'fl' : 'fdraw'}`} />
                            ))}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}

            {/* Legend */}
            {statuses.length > 0 && (
              <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', background: 'var(--card-alt)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {statuses.map(s => s && (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: STATUS_COLORS[s], flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-faint)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      {STATUS_LABELS[s]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
