'use client'

import Image from 'next/image'
import type { SimTeam } from '@/lib/simulator/groups'

interface Props {
  homeCode: string
  awayCode: string
  homeTeam: SimTeam
  awayTeam: SimTeam
  homeScore: number | null
  awayScore: number | null
  onChange: (home: number, away: number) => void
  disabled?: boolean
}

export function MatchScoreInput({
  homeCode,
  awayCode,
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  onChange,
  disabled = false,
}: Props) {
  const inc = (side: 'home' | 'away') => {
    const h = homeScore ?? 0
    const a = awayScore ?? 0
    if (side === 'home' && h < 9) onChange(h + 1, a)
    if (side === 'away' && a < 9) onChange(h, a + 1)
  }

  const dec = (side: 'home' | 'away') => {
    const h = homeScore ?? 0
    const a = awayScore ?? 0
    if (side === 'home' && h > 0) onChange(h - 1, a)
    if (side === 'away' && a > 0) onChange(h, a - 1)
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: 48,
        padding: '0 8px',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Home team label */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        minWidth: 56,
        justifyContent: 'flex-end',
      }}>
        <Image
          src={homeTeam.flagUrl}
          alt={homeTeam.name}
          width={18}
          height={13}
          style={{ objectFit: 'contain', borderRadius: 2 }}
          unoptimized
        />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text)',
        }}>
          {homeCode}
        </span>
      </div>

      {/* Home score controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <button
          onClick={() => dec('home')}
          disabled={disabled || homeScore === null || homeScore <= 0}
          aria-label={`Decrease ${homeCode} score`}
          style={{
            width: 24,
            height: 24,
            minWidth: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            fontWeight: 700,
            color: disabled ? 'var(--text-faint)' : 'var(--text-sec)',
            cursor: disabled ? 'default' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: disabled ? 0.4 : 1,
          }}
        >
          -
        </button>
        <span style={{
          width: 24,
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 16,
          fontWeight: 700,
          color: homeScore !== null ? 'var(--text)' : 'var(--text-faint)',
        }}>
          {homeScore ?? '-'}
        </span>
        <button
          onClick={() => inc('home')}
          disabled={disabled || (homeScore !== null && homeScore >= 9)}
          aria-label={`Increase ${homeCode} score`}
          style={{
            width: 24,
            height: 24,
            minWidth: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            fontWeight: 700,
            color: disabled ? 'var(--text-faint)' : 'var(--text-sec)',
            cursor: disabled ? 'default' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: disabled ? 0.4 : 1,
          }}
        >
          +
        </button>
      </div>

      {/* Dash separator */}
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 14,
        fontWeight: 700,
        color: 'var(--text-faint)',
        padding: '0 2px',
      }}>
        -
      </span>

      {/* Away score controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <button
          onClick={() => dec('away')}
          disabled={disabled || awayScore === null || awayScore <= 0}
          aria-label={`Decrease ${awayCode} score`}
          style={{
            width: 24,
            height: 24,
            minWidth: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            fontWeight: 700,
            color: disabled ? 'var(--text-faint)' : 'var(--text-sec)',
            cursor: disabled ? 'default' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: disabled ? 0.4 : 1,
          }}
        >
          -
        </button>
        <span style={{
          width: 24,
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 16,
          fontWeight: 700,
          color: awayScore !== null ? 'var(--text)' : 'var(--text-faint)',
        }}>
          {awayScore ?? '-'}
        </span>
        <button
          onClick={() => inc('away')}
          disabled={disabled || (awayScore !== null && awayScore >= 9)}
          aria-label={`Increase ${awayCode} score`}
          style={{
            width: 24,
            height: 24,
            minWidth: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            fontWeight: 700,
            color: disabled ? 'var(--text-faint)' : 'var(--text-sec)',
            cursor: disabled ? 'default' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: disabled ? 0.4 : 1,
          }}
        >
          +
        </button>
      </div>

      {/* Away team label */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        minWidth: 56,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text)',
        }}>
          {awayCode}
        </span>
        <Image
          src={awayTeam.flagUrl}
          alt={awayTeam.name}
          width={18}
          height={13}
          style={{ objectFit: 'contain', borderRadius: 2 }}
          unoptimized
        />
      </div>
    </div>
  )
}
