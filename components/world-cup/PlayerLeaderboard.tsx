import Link from 'next/link'
import Image from 'next/image'
import { TeamLogo } from '@/components/ui/TeamLogo'
import type { PlayerStatRow } from '@/types/world-cup'

interface Props {
  title: string
  rows: PlayerStatRow[]
  statLabel: string
  langPrefix: string
}

export function PlayerLeaderboard({ title, rows, statLabel, langPrefix }: Props) {
  if (rows.length === 0) return null

  return (
    <section aria-label={title}>
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
              <th style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '6px 4px', textAlign: 'left' }}>Player</th>
              <th style={{ width: 48, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', fontWeight: 600, padding: '6px 4px' }}>Team</th>
              <th style={{ width: 40, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', fontWeight: 600, textTransform: 'uppercase', padding: '6px 4px' }}>{statLabel}</th>
              <th style={{ width: 28, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', fontWeight: 600, padding: '6px 4px' }}>MP</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.playerId} style={{ borderBottom: '1px solid var(--border)' }}>
                <td colSpan={5} style={{ padding: 0 }}>
                  <Link
                    href={`${langPrefix}/players/${row.playerId}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 14px',
                      gap: 8,
                      textDecoration: 'none',
                      transition: 'background var(--t-fast)',
                      minHeight: 'var(--tap-min)',
                    }}
                  >
                    {/* Rank */}
                    <span style={{
                      width: 24,
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      fontWeight: row.rank <= 3 ? 700 : 600,
                      color: row.rank <= 3 ? 'var(--green)' : 'var(--text-faint)',
                    }}>
                      {row.rank}
                    </span>

                    {/* Photo + Name */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      {row.playerPhoto ? (
                        <Image
                          src={row.playerPhoto}
                          alt={row.playerName}
                          width={28}
                          height={28}
                          style={{ objectFit: 'cover', borderRadius: '50%', flexShrink: 0 }}
                        />
                      ) : (
                        <div style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: 'var(--card-alt)',
                          flexShrink: 0,
                        }} />
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
                        {row.playerName}
                      </span>
                    </div>

                    {/* Team logo */}
                    <div style={{ width: 48, display: 'flex', justifyContent: 'center' }}>
                      <TeamLogo src={row.team.flagUrl} alt={row.team.name} size={18} />
                    </div>

                    {/* Stat value */}
                    <span style={{
                      width: 40,
                      textAlign: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 16,
                      fontWeight: 700,
                      color: 'var(--text)',
                    }}>
                      {row.value}
                    </span>

                    {/* Matches played */}
                    <span style={{
                      width: 28,
                      textAlign: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      color: 'var(--text-sec)',
                    }}>
                      {row.matches}
                    </span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
