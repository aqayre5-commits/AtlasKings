'use client'

import Image from 'next/image'
import type { GroupStandingRow } from '@/lib/simulator/groups'

interface Props {
  standings: GroupStandingRow[]
  groupLetter: string
}

export function GroupTable({ standings, groupLetter }: Props) {
  return (
    <table
      className="data-table"
      style={{ width: '100%', borderCollapse: 'collapse' }}
      aria-label={`Group ${groupLetter} standings`}
    >
      <thead>
        <tr>
          {['#', 'Team', 'P', 'W', 'D', 'L', 'GD', 'Pts'].map((col) => (
            <th
              key={col}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 600,
                color: 'var(--text-faint)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '6px 4px',
                textAlign: col === 'Team' ? 'left' : 'center',
                borderBottom: '1px solid var(--border)',
                ...(col === '#' ? { width: 20 } : {}),
                ...(col === 'Team' ? { paddingLeft: 8 } : {}),
                ...(['P', 'W', 'D', 'L', 'GD', 'Pts'].includes(col)
                  ? { width: 28 }
                  : {}),
              }}
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {standings.map((row, idx) => {
          const isTop2 = idx < 2
          const isThird = idx === 2
          const borderLeftColor = isTop2
            ? 'var(--green)'
            : isThird
              ? 'var(--gold)'
              : 'transparent'

          const badge = isTop2 ? 'Q' : isThird ? '?' : null

          return (
            <tr
              key={row.team.code}
              style={{
                borderBottom: '1px solid var(--border)',
                borderLeft: `3px solid ${borderLeftColor}`,
                transition: 'all 0.2s ease',
              }}
            >
              {/* Rank */}
              <td
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--text-faint)',
                  textAlign: 'center',
                  padding: '6px 4px',
                  width: 20,
                }}
              >
                {idx + 1}
              </td>

              {/* Team */}
              <td style={{ padding: '6px 8px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Image
                    src={row.team.flagUrl}
                    alt={`${row.team.name} flag`}
                    width={18}
                    height={13}
                    style={{
                      objectFit: 'contain',
                      flexShrink: 0,
                      borderRadius: 2,
                    }}
                    unoptimized
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-head)',
                      fontSize: 12,
                      fontWeight: 700,
                      color: 'var(--text)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row.team.name}
                  </span>
                  {badge && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        fontWeight: 700,
                        color: isTop2 ? 'var(--green)' : 'var(--gold)',
                        background: isTop2
                          ? 'var(--green-light)'
                          : 'var(--gold-light)',
                        padding: '1px 4px',
                        borderRadius: 3,
                        flexShrink: 0,
                      }}
                    >
                      {badge}
                    </span>
                  )}
                </div>
              </td>

              {/* Stats */}
              {[
                row.played,
                row.won,
                row.drawn,
                row.lost,
                row.gd > 0 ? `+${row.gd}` : row.gd,
              ].map((val, i) => (
                <td
                  key={i}
                  style={{
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--text-sec)',
                    padding: '6px 2px',
                  }}
                >
                  {val}
                </td>
              ))}

              {/* Points */}
              <td
                style={{
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--text)',
                  padding: '6px 4px',
                }}
              >
                {row.points}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
