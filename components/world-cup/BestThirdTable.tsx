import Image from 'next/image'
import type { BestThirdRow } from '@/types/world-cup'

interface Props {
  rows: BestThirdRow[]
  title?: string
}

export function BestThirdTable({ rows, title = 'Best Third-Placed Teams' }: Props) {
  if (rows.length === 0) return null

  return (
    <section aria-label="Best third-placed teams">
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '10px 14px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--card-alt)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <div style={{ width: 4, height: 16, borderRadius: 2, background: 'var(--green)', flexShrink: 0 }} />
          <h3 style={{
            fontFamily: 'var(--font-head)',
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text)',
            margin: 0,
          }}>
            {title}
          </h3>
        </div>

        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ width: 24, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', fontWeight: 600, padding: '6px 14px', textAlign: 'left' }}>#</th>
              <th style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '6px 4px', textAlign: 'left' }}>Team</th>
              <th style={{ width: 40, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', fontWeight: 600, padding: '6px 4px' }}>Group</th>
              <th style={{ width: 32, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', fontWeight: 600, padding: '6px 4px' }}>Pts</th>
              <th style={{ width: 32, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', fontWeight: 600, padding: '6px 4px' }}>GD</th>
              <th style={{ width: 32, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', fontWeight: 600, padding: '6px 4px' }}>GF</th>
              <th style={{ width: 80, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', fontWeight: 600, padding: '6px 4px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              const isIn = row.status === 'currently_in'

              return (
                <tr
                  key={`${row.team.id}-${row.group}`}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    borderLeft: isIn ? '3px solid var(--green)' : '3px solid var(--red)',
                  }}
                >
                  <td style={{ padding: '8px 14px', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--text-faint)' }}>
                    {row.rank}
                  </td>

                  <td style={{ padding: '8px 4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
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

                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-sec)', padding: '8px 4px' }}>
                    {row.group}
                  </td>

                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--text)', padding: '8px 4px' }}>
                    {row.points}
                  </td>

                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-sec)', padding: '8px 4px' }}>
                    {row.gd > 0 ? `+${row.gd}` : row.gd}
                  </td>

                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-sec)', padding: '8px 4px' }}>
                    {row.gf}
                  </td>

                  <td style={{
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: isIn ? 'var(--live)' : 'var(--red)',
                    padding: '8px 4px',
                  }}>
                    {isIn ? 'Currently in' : 'Currently out'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
