'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { SimGroup, GroupStandingRow } from '@/lib/simulator/groups'
import { MatchScoreInput } from './MatchScoreInput'
import { GroupTable } from './GroupTable'

interface Props {
  groups: SimGroup[]
  results: Record<number, { home: number; away: number }>
  standings: Record<string, GroupStandingRow[]>
  onSetResult: (matchNumber: number, home: number, away: number) => void
  onSimulateGroups: () => void
}

export function GroupStagePanel({
  groups,
  results,
  standings,
  onSetResult,
  onSimulateGroups,
}: Props) {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null)

  const totalMatches = groups.reduce((sum, g) => sum + g.matches.length, 0)
  const completedMatches = Object.keys(results).length
  const progressPct = totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0

  return (
    <div>
      {/* Progress bar + Simulate button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 20,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: 1, minWidth: 200 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 6,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--text)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {completedMatches}/{totalMatches} matches predicted
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--text-faint)',
              }}
            >
              {Math.round(progressPct)}%
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: 'var(--border)',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progressPct}%`,
                background: 'var(--green)',
                borderRadius: 3,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        <button
          onClick={onSimulateGroups}
          style={{
            minHeight: 'var(--tap-min)',
            padding: '0 20px',
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
            whiteSpace: 'nowrap',
          }}
        >
          Simulate All Groups
        </button>
      </div>

      {/* Group cards grid */}
      <div
        className="sim-groups-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--gap)',
        }}
      >
        <style>{`
          @media (max-width: 900px) {
            .sim-groups-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 600px) {
            .sim-groups-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
        {groups.map((group) => {
          const isHovered = hoveredGroup === group.letter
          const groupStandings = standings[group.letter] ?? []

          return (
            <div
              key={group.letter}
              className="sim-groups-grid-card"
              onMouseEnter={() => setHoveredGroup(group.letter)}
              onMouseLeave={() => setHoveredGroup(null)}
              style={{
                background: 'var(--card)',
                border: `1px solid ${isHovered ? 'var(--green)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                transform: isHovered ? 'translateY(-2px)' : 'none',
                boxShadow: isHovered
                  ? 'var(--shadow-md)'
                  : 'var(--shadow-sm)',
              }}
            >
              {/* Group header */}
              <div
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--card-alt)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 4,
                      height: 16,
                      borderRadius: 2,
                      background: 'var(--green)',
                      flexShrink: 0,
                    }}
                  />
                  <h3
                    style={{
                      fontFamily: 'var(--font-head)',
                      fontSize: 14,
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--text)',
                      margin: 0,
                    }}
                  >
                    Group {group.letter}
                  </h3>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 4,
                    alignItems: 'center',
                  }}
                >
                  {group.teams.map((team) => (
                    <Image
                      key={team.code}
                      src={team.flagUrl}
                      alt={team.name}
                      width={16}
                      height={12}
                      style={{
                        objectFit: 'contain',
                        borderRadius: 2,
                      }}
                      unoptimized
                    />
                  ))}
                </div>
              </div>

              {/* Match list */}
              <div>
                {group.matches.map((match) => {
                  const home = group.teams.find(
                    (t) => t.code === match.homeCode,
                  )
                  const away = group.teams.find(
                    (t) => t.code === match.awayCode,
                  )
                  if (!home || !away) return null

                  const result = results[match.matchNumber]

                  return (
                    <MatchScoreInput
                      key={match.matchNumber}
                      homeCode={match.homeCode}
                      awayCode={match.awayCode}
                      homeTeam={home}
                      awayTeam={away}
                      homeScore={result?.home ?? null}
                      awayScore={result?.away ?? null}
                      onChange={(h, a) =>
                        onSetResult(match.matchNumber, h, a)
                      }
                    />
                  )
                })}
              </div>

              {/* Standings table */}
              {groupStandings.length > 0 && (
                <GroupTable
                  standings={groupStandings}
                  groupLetter={group.letter}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
