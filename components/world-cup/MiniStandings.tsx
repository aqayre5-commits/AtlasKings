import Image from 'next/image'
import type { GroupStanding } from '@/types/world-cup'

interface Props {
  groups: GroupStanding[]
  showFullTables?: boolean
}

export function MiniStandings({ groups, showFullTables = false }: Props) {
  if (groups.length === 0) return null

  return (
    <section aria-label="Group standings">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 'var(--gap)',
      }}>
        {groups.map(group => (
          <div
            key={group.group}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
            }}
          >
            {/* Group header */}
            <div style={{
              padding: '10px 14px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--card-alt)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <div style={{
                width: 4,
                height: 16,
                borderRadius: 2,
                background: 'var(--green)',
                flexShrink: 0,
              }} />
              <h3 style={{
                fontFamily: 'var(--font-head)',
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--text)',
                margin: 0,
              }}>
                {group.group}
              </h3>
            </div>

            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '6px 14px', textAlign: 'left' }}>
                    Team
                  </th>
                  {showFullTables && (
                    <>
                      <th style={{ width: 28, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', fontWeight: 600, padding: '6px 0' }}>P</th>
                      <th style={{ width: 28, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', fontWeight: 600, padding: '6px 0' }}>W</th>
                      <th style={{ width: 28, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', fontWeight: 600, padding: '6px 0' }}>D</th>
                      <th style={{ width: 28, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', fontWeight: 600, padding: '6px 0' }}>L</th>
                      <th style={{ width: 28, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', fontWeight: 600, padding: '6px 0' }}>GD</th>
                    </>
                  )}
                  <th style={{ width: 32, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', fontWeight: 600, padding: '6px 4px' }}>
                    Pts
                  </th>
                </tr>
              </thead>
              <tbody>
                {group.rows.map(row => {
                  const isQualified = row.qualificationStatus === 'qualified'
                  const isEliminated = row.qualificationStatus === 'eliminated'

                  return (
                    <tr
                      key={row.team.id}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        borderLeft: isQualified
                          ? '3px solid var(--green)'
                          : isEliminated
                            ? '3px solid var(--red)'
                            : '3px solid transparent',
                      }}
                    >
                      <td style={{ padding: '8px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {/* Rank */}
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 11,
                            fontWeight: 600,
                            color: 'var(--text-faint)',
                            width: 18,
                            flexShrink: 0,
                          }}>
                            {row.rank}
                          </span>
                          {row.team.flagUrl && (
                            <Image
                              src={row.team.flagUrl}
                              alt={`${row.team.name} flag`}
                              width={18}
                              height={13}
                              style={{ objectFit: 'contain', flexShrink: 0, borderRadius: 2 }}
                              unoptimized
                            />
                          )}
                          <span style={{
                            fontFamily: 'var(--font-head)',
                            fontSize: 13,
                            fontWeight: 700,
                            color: 'var(--text)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {row.team.shortName || row.team.name}
                          </span>
                        </div>
                      </td>

                      {showFullTables && (
                        <>
                          <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-sec)', padding: '8px 0' }}>{row.played}</td>
                          <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-sec)', padding: '8px 0' }}>{row.won}</td>
                          <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-sec)', padding: '8px 0' }}>{row.drawn}</td>
                          <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-sec)', padding: '8px 0' }}>{row.lost}</td>
                          <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-sec)', padding: '8px 0' }}>{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                        </>
                      )}

                      <td style={{
                        textAlign: 'center',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 13,
                        fontWeight: 700,
                        color: 'var(--text)',
                        padding: '8px 4px',
                      }}>
                        {row.points}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </section>
  )
}
