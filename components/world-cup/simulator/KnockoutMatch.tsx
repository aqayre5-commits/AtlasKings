'use client'

import Image from 'next/image'
import type { KnockoutSlot } from '@/lib/simulator/knockout'
import { STAGE_LABELS } from '@/lib/simulator/knockout'
import type { SimTeam } from '@/lib/simulator/groups'

interface Props {
  slot: KnockoutSlot
  onSelectWinner: (matchNumber: number, winner: SimTeam) => void
  disabled?: boolean
  highlight?: boolean
}

/**
 * Single knockout match card — compact design matching 2026worldcupsim reference.
 * Shows: match number + city header, two team rows (flag | code | score), winner highlighted green.
 */
export function KnockoutMatch({ slot, onSelectWinner, disabled = false, highlight = false }: Props) {
  const canPick = !disabled && !!slot.homeTeam && !!slot.awayTeam
  const hasResult = slot.winner !== null

  return (
    <div style={{
      background: 'var(--card)',
      border: highlight ? '2px solid var(--gold)' : '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      width: '100%',
      fontSize: 0, // reset for inline elements
      boxShadow: highlight ? '0 0 12px rgba(184,130,10,0.12)' : '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'all 0.2s ease',
    }}>
      {/* Match info header */}
      <div style={{
        padding: '5px 10px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--card-alt)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
          color: 'var(--text-faint)', letterSpacing: '0.04em',
        }}>
          Match {slot.matchNumber}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'var(--text-faint)',
        }}>
          {slot.city}
        </span>
      </div>

      {/* Home team row */}
      <TeamRow
        team={slot.homeTeam}
        label={slot.homeLabel}
        score={slot.homeScore}
        isWinner={hasResult && slot.winner?.code === slot.homeTeam?.code}
        canPick={canPick && !hasResult}
        onClick={() => slot.homeTeam && canPick && onSelectWinner(slot.matchNumber, slot.homeTeam)}
      />

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* Away team row */}
      <TeamRow
        team={slot.awayTeam}
        label={slot.awayLabel}
        score={slot.awayScore}
        isWinner={hasResult && slot.winner?.code === slot.awayTeam?.code}
        canPick={canPick && !hasResult}
        onClick={() => slot.awayTeam && canPick && onSelectWinner(slot.matchNumber, slot.awayTeam)}
      />
    </div>
  )
}

/** Single team row within a match card */
function TeamRow({ team, label, score, isWinner, canPick, onClick }: {
  team: SimTeam | null
  label: string
  score: number | null
  isWinner: boolean
  canPick: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={!canPick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        padding: '6px 10px',
        border: 'none',
        cursor: canPick ? 'pointer' : 'default',
        background: isWinner ? 'var(--green-light)' : 'transparent',
        transition: 'background 0.15s ease',
        minHeight: 36,
      }}
    >
      {/* Flag */}
      {team ? (
        <Image
          src={team.flagUrl}
          alt={team.name}
          width={24}
          height={16}
          style={{ objectFit: 'contain', borderRadius: 2, flexShrink: 0 }}
          unoptimized
        />
      ) : (
        <div style={{ width: 24, height: 16, borderRadius: 2, background: 'var(--card-alt)', flexShrink: 0 }} />
      )}

      {/* Team code / label */}
      <span style={{
        fontFamily: 'var(--font-head)',
        fontSize: 12,
        fontWeight: isWinner ? 800 : 600,
        color: team ? 'var(--text)' : 'var(--text-faint)',
        flex: 1,
        textAlign: 'left',
      }}>
        {team?.code ?? label}
      </span>

      {/* Score box */}
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        fontWeight: 700,
        color: isWinner ? 'var(--green)' : 'var(--text)',
        minWidth: 28,
        textAlign: 'center',
        padding: '2px 6px',
        borderRadius: 4,
        border: score !== null ? '1px solid var(--border)' : 'none',
        background: isWinner ? 'var(--green-light)' : 'transparent',
      }}>
        {score !== null ? score : ''}
      </span>
    </button>
  )
}
