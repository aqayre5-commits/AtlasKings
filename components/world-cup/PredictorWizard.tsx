'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { TeamLite, BracketMatch } from '@/types/world-cup'

interface Props {
  teams: TeamLite[]
  bracket: BracketMatch[]
}

type Mode = 'quick' | 'full'

export function PredictorWizard({ teams, bracket }: Props) {
  const [mode, setMode] = useState<Mode>('quick')

  // Group teams by group letter
  const groupMap = new Map<string, TeamLite[]>()
  for (const t of teams) {
    if (!t.group) continue
    const existing = groupMap.get(t.group) || []
    existing.push(t)
    groupMap.set(t.group, existing)
  }
  const sortedGroups = Array.from(groupMap.entries()).sort(([a], [b]) => a.localeCompare(b))

  return (
    <section>
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #041a04 0%, #0a0a0a 100%)',
          borderBottom: '1px solid var(--green)',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--green-bright)',
            display: 'block',
            marginBottom: 6,
          }}>
            World Cup 2026
          </span>
          <h2 style={{
            fontFamily: 'var(--font-head)',
            fontSize: 24,
            fontWeight: 800,
            fontStyle: 'italic',
            color: '#ffffff',
            margin: 0,
          }}>
            Predictor
          </h2>
        </div>

        {/* Mode toggle */}
        <div style={{
          display: 'flex',
          gap: 0,
          padding: '12px 20px',
          borderBottom: '1px solid var(--border)',
        }}>
          <button
            onClick={() => setMode('quick')}
            style={{
              flex: 1,
              padding: '10px 16px',
              fontFamily: 'var(--font-head)',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.02em',
              border: 'none',
              cursor: 'pointer',
              borderRadius: mode === 'quick' ? 'var(--radius-sm) 0 0 var(--radius-sm)' : '0',
              background: mode === 'quick' ? 'var(--green)' : 'var(--card-alt)',
              color: mode === 'quick' ? '#ffffff' : 'var(--text-sec)',
              transition: 'background var(--t-fast), color var(--t-fast)',
            }}
          >
            Quick Pick
          </button>
          <button
            onClick={() => setMode('full')}
            style={{
              flex: 1,
              padding: '10px 16px',
              fontFamily: 'var(--font-head)',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.02em',
              border: 'none',
              cursor: 'pointer',
              borderRadius: mode === 'full' ? '0 var(--radius-sm) var(--radius-sm) 0' : '0',
              background: mode === 'full' ? 'var(--green)' : 'var(--card-alt)',
              color: mode === 'full' ? '#ffffff' : 'var(--text-sec)',
              transition: 'background var(--t-fast), color var(--t-fast)',
            }}
          >
            Full Predictor
          </button>
        </div>

        {/* Content area */}
        <div style={{ padding: '20px' }}>
          {mode === 'quick' ? (
            <>
              {/* Quick Pick — pick winner from each group */}
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'var(--text-sec)',
                lineHeight: 1.5,
                margin: '0 0 20px',
              }}>
                Pick the top 2 from each group, then select your champion.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 12,
              }}>
                {sortedGroups.map(([group, groupTeams]) => (
                  <div
                    key={group}
                    style={{
                      background: 'var(--card-alt)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: 12,
                    }}
                  >
                    <div style={{
                      fontFamily: 'var(--font-head)',
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--green)',
                      marginBottom: 8,
                    }}>
                      {group}
                    </div>
                    {groupTeams.map(team => (
                      <div
                        key={team.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '6px 8px',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          transition: 'background var(--t-fast)',
                          marginBottom: 2,
                        }}
                      >
                        {team.flagUrl && (
                          <Image
                            src={team.flagUrl}
                            alt={`${team.name} flag`}
                            width={18}
                            height={13}
                            style={{ objectFit: 'contain', borderRadius: 2, flexShrink: 0 }}
                            unoptimized
                          />
                        )}
                        <span style={{
                          fontFamily: 'var(--font-head)',
                          fontSize: 13,
                          fontWeight: 600,
                          color: 'var(--text)',
                        }}>
                          {team.name}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Full Predictor — knockout bracket preview */}
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'var(--text-sec)',
                lineHeight: 1.5,
                margin: '0 0 20px',
              }}>
                Predict every match from the group stage through the final.
              </p>

              {bracket.length > 0 ? (
                <div style={{
                  display: 'flex',
                  gap: 8,
                  overflowX: 'auto',
                  paddingBottom: 8,
                  scrollbarWidth: 'none',
                }}>
                  {bracket.slice(0, 8).map(match => (
                    <div
                      key={match.id}
                      style={{
                        flexShrink: 0,
                        width: 180,
                        background: 'var(--card-alt)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        padding: 10,
                      }}
                    >
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 9,
                        color: 'var(--text-faint)',
                        marginBottom: 6,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}>
                        {match.slotLabel}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-head)',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--text-sec)',
                        marginBottom: 4,
                      }}>
                        {match.homeLabel}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-head)',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--text-sec)',
                      }}>
                        {match.awayLabel}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  padding: '20px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--text-faint)',
                }}>
                  Bracket data will appear once the draw is finalized.
                </div>
              )}
            </>
          )}

          {/* Coming soon overlay / CTA */}
          <div style={{
            marginTop: 24,
            padding: '20px',
            background: 'var(--card-alt)',
            border: '1px dashed var(--border-mid)',
            borderRadius: 'var(--radius)',
            textAlign: 'center',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--green)',
              display: 'block',
              marginBottom: 6,
            }}>
              Coming Soon
            </span>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              color: 'var(--text-sec)',
              lineHeight: 1.5,
              margin: '0 0 16px',
            }}>
              Prediction saving, sharing, and leaderboards will be available before the tournament begins.
            </p>

            {/* Placeholder buttons */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                disabled
                style={{
                  padding: '10px 24px',
                  background: 'var(--green)',
                  color: '#000',
                  fontFamily: 'var(--font-head)',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'not-allowed',
                  opacity: 0.5,
                }}
              >
                Save Predictions
              </button>
              <button
                disabled
                style={{
                  padding: '10px 24px',
                  background: 'var(--card)',
                  color: 'var(--text-sec)',
                  fontFamily: 'var(--font-head)',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'not-allowed',
                  opacity: 0.5,
                }}
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
