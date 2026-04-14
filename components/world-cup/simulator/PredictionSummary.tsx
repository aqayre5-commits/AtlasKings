'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { SimulatorState } from '@/lib/simulator/state'
import { ShareModal } from './ShareModal'

interface Props {
  state: SimulatorState
}

export function PredictionSummary({ state }: Props) {
  const [showShare, setShowShare] = useState(false)

  const champion = state.champion
  if (!champion) return null

  const finalMatch = state.knockout.find((m) => m.stage === 'final')
  const sfMatches = state.knockout.filter((m) => m.stage === 'sf')
  const bronzeMatch = state.knockout.find((m) => m.stage === 'bronze')

  const keyMatches = [
    ...(finalMatch ? [{ label: 'Final', match: finalMatch }] : []),
    ...sfMatches.map((m, i) => ({ label: `Semi-Final ${i + 1}`, match: m })),
    ...(bronzeMatch ? [{ label: 'Bronze Final', match: bronzeMatch }] : []),
  ]

  return (
    <>
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          maxWidth: 560,
          margin: '0 auto',
        }}
      >
        {/* Champion display */}
        <div
          style={{
            padding: '32px 24px',
            textAlign: 'center',
            borderBottom: '1px solid var(--border)',
            background:
              'linear-gradient(180deg, var(--gold-light) 0%, var(--card) 100%)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--gold)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: 12,
            }}
          >
            Your Prediction
          </div>

          <div
            style={{
              display: 'inline-block',
              border: '3px solid var(--gold)',
              borderRadius: 'var(--radius-lg)',
              padding: 4,
              marginBottom: 12,
            }}
          >
            <Image
              src={champion.flagUrl}
              alt={champion.name}
              width={72}
              height={54}
              style={{
                objectFit: 'contain',
                borderRadius: 'var(--radius)',
                display: 'block',
              }}
              unoptimized
            />
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 32,
              fontWeight: 800,
              color: 'var(--text)',
              textTransform: 'uppercase',
              margin: '0 0 4px',
            }}
          >
            {champion.name}
          </h2>
          <div
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--gold)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            World Cup 2026 Champion
          </div>
        </div>

        {/* Key match results */}
        <div style={{ padding: 16 }}>
          <h3
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-faint)',
              marginBottom: 10,
            }}
          >
            Key Results
          </h3>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {keyMatches.map(({ label, match }) => (
              <div
                key={match.matchNumber}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: 'var(--card-alt)',
                  borderRadius: 'var(--radius-sm)',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    fontWeight: 700,
                    color: 'var(--text-faint)',
                    textTransform: 'uppercase',
                    minWidth: 70,
                    flexShrink: 0,
                  }}
                >
                  {label}
                </span>

                {/* Home */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    flex: 1,
                    justifyContent: 'flex-end',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-head)',
                      fontSize: 11,
                      fontWeight: 700,
                      color:
                        match.winner?.code === match.homeTeam?.code
                          ? 'var(--text)'
                          : 'var(--text-faint)',
                    }}
                  >
                    {match.homeTeam?.code ?? '???'}
                  </span>
                  {match.homeTeam && (
                    <Image
                      src={match.homeTeam.flagUrl}
                      alt={match.homeTeam.name}
                      width={16}
                      height={12}
                      style={{ objectFit: 'contain', borderRadius: 1 }}
                      unoptimized
                    />
                  )}
                </div>

                {/* Score */}
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    fontWeight: 700,
                    minWidth: 36,
                    textAlign: 'center',
                    background: 'var(--score-bg)',
                    color: 'var(--text-on-dark)',
                    borderRadius: 3,
                    padding: '2px 6px',
                  }}
                >
                  {match.homeScore ?? '-'} - {match.awayScore ?? '-'}
                </span>

                {/* Away */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    flex: 1,
                  }}
                >
                  {match.awayTeam && (
                    <Image
                      src={match.awayTeam.flagUrl}
                      alt={match.awayTeam.name}
                      width={16}
                      height={12}
                      style={{ objectFit: 'contain', borderRadius: 1 }}
                      unoptimized
                    />
                  )}
                  <span
                    style={{
                      fontFamily: 'var(--font-head)',
                      fontSize: 11,
                      fontWeight: 700,
                      color:
                        match.winner?.code === match.awayTeam?.code
                          ? 'var(--text)'
                          : 'var(--text-faint)',
                    }}
                  >
                    {match.awayTeam?.code ?? '???'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            padding: '12px 16px 16px',
            display: 'flex',
            gap: 8,
          }}
        >
          <button
            onClick={() => setShowShare(true)}
            style={{
              flex: 1,
              minHeight: 'var(--tap-min)',
              padding: '0 16px',
              background: 'var(--green)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-head)',
              fontSize: 13,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Share My Prediction
          </button>

          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent('sim-reset'))
            }
            style={{
              minHeight: 'var(--tap-min)',
              padding: '0 16px',
              background: 'transparent',
              color: 'var(--red)',
              border: '1px solid var(--red)',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-head)',
              fontSize: 13,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            Reset & Try Again
          </button>
        </div>
      </div>

      {showShare && (
        <ShareModal state={state} onClose={() => setShowShare(false)} />
      )}
    </>
  )
}
