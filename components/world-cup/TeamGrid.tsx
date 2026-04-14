import Link from 'next/link'
import Image from 'next/image'
import type { TeamLite } from '@/types/world-cup'

interface Props {
  teams: TeamLite[]
  langPrefix: string
}

export function TeamGrid({ teams, langPrefix }: Props) {
  if (teams.length === 0) return null

  return (
    <section aria-label="Teams">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 'var(--gap)',
      }}>
        {teams.map(team => (
          <Link
            key={team.id}
            href={`${langPrefix}/world-cup/teams/${team.id}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '20px 12px 16px',
              transition: 'transform var(--t-fast), box-shadow var(--t-fast)',
              textAlign: 'center',
              minHeight: 'var(--tap-min)',
            }}
          >
            {/* Flag */}
            {team.flagUrl ? (
              <Image
                src={team.flagUrl}
                alt={`${team.name} flag`}
                width={48}
                height={36}
                style={{ objectFit: 'contain', borderRadius: 3, marginBottom: 12 }}
                unoptimized
              />
            ) : (
              <div style={{
                width: 48,
                height: 36,
                borderRadius: 3,
                background: 'var(--card-alt)',
                marginBottom: 12,
              }} />
            )}

            {/* Name */}
            <span style={{
              fontFamily: 'var(--font-head)',
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text)',
              lineHeight: 1.2,
              marginBottom: 4,
            }}>
              {team.name}
            </span>

            {/* Group */}
            {team.group && (
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 600,
                color: 'var(--green)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 2,
              }}>
                {team.group}
              </span>
            )}

            {/* Confederation */}
            {team.confederation && (
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-faint)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                {team.confederation}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
