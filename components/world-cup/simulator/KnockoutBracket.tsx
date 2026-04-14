'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { KnockoutSlot } from '@/lib/simulator/knockout'
import { STAGE_ORDER, STAGE_LABELS } from '@/lib/simulator/knockout'
import type { SimTeam } from '@/lib/simulator/groups'
import type { StageKey } from '@/types/world-cup'
import { KnockoutMatch } from './KnockoutMatch'

interface Props {
  knockout: KnockoutSlot[]
  onSelectWinner: (matchNumber: number, winner: SimTeam) => void
  onSimulateKnockout: () => void
}

export function KnockoutBracket({ knockout, onSelectWinner, onSimulateKnockout }: Props) {
  const [mobileStage, setMobileStage] = useState<StageKey>('r32')

  const r32 = knockout.filter(m => m.stage === 'r32')
  const r16 = knockout.filter(m => m.stage === 'r16')
  const qf = knockout.filter(m => m.stage === 'qf')
  const sf = knockout.filter(m => m.stage === 'sf')
  const final = knockout.find(m => m.stage === 'final')
  const bronze = knockout.find(m => m.stage === 'bronze')
  const champion = final?.winner

  // Split bracket into left and right halves
  const leftR32 = r32.slice(0, 8)
  const rightR32 = r32.slice(8, 16)
  const leftR16 = r16.slice(0, 4)
  const rightR16 = r16.slice(4, 8)
  const leftQF = qf.slice(0, 2)
  const rightQF = qf.slice(2, 4)
  const leftSF = sf.filter(m => m.matchNumber === 101)
  const rightSF = sf.filter(m => m.matchNumber === 102)

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, flexWrap: 'wrap', gap: 12,
      }}>
        <h3 style={{
          fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800,
          textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text)', margin: 0,
        }}>
          Knockout Stage
        </h3>
        <button onClick={onSimulateKnockout} style={{
          minHeight: 'var(--tap-min)', padding: '0 24px',
          background: 'var(--green)', color: '#fff', border: 'none',
          borderRadius: 'var(--radius)', fontFamily: 'var(--font-head)',
          fontSize: 13, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.04em', cursor: 'pointer', transition: 'all 0.2s ease',
        }}>
          Simulate All
        </button>
      </div>

      {/* ═══ DESKTOP: Full bracket with trophy center ═══ */}
      <div className="ko-desktop">
        {/* Trophy + Champion — centered above the bracket */}
        <div style={{
          textAlign: 'center', marginBottom: 32,
        }}>
          <div style={{ fontSize: 48, marginBottom: 4 }}>🏆</div>
          <div style={{
            fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            color: champion ? 'var(--gold)' : 'var(--text-faint)',
            marginBottom: champion ? 8 : 0,
          }}>
            Champion
          </div>
          {champion && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 20px', borderRadius: 'var(--radius)',
              background: 'var(--card)', border: '2px solid var(--gold)',
              boxShadow: '0 0 20px rgba(184,130,10,0.15)',
            }}>
              <Image src={champion.flagUrl} alt={champion.name} width={28} height={20}
                style={{ objectFit: 'contain', borderRadius: 2 }} unoptimized />
              <span style={{
                fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 800,
                color: 'var(--text)', textTransform: 'uppercase',
              }}>
                {champion.name}
              </span>
            </div>
          )}
        </div>

        {/* Main bracket grid: left side | final | right side */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '4fr auto 4fr',
          gap: 24,
          alignItems: 'center',
        }}>
          {/* LEFT HALF: R32 → R16 → QF → SF (flows left to right) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: 8,
          }}>
            <RoundColumn label="Round of 32" matches={leftR32} onSelectWinner={onSelectWinner} />
            <RoundColumn label="Round of 16" matches={leftR16} onSelectWinner={onSelectWinner} />
            <RoundColumn label="Quarter-Finals" matches={leftQF} onSelectWinner={onSelectWinner} />
            <RoundColumn label="Semi-Finals" matches={leftSF} onSelectWinner={onSelectWinner} />
          </div>

          {/* CENTER: Final + Bronze */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 20, minWidth: 200,
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                color: 'var(--gold)', textAlign: 'center', marginBottom: 8,
              }}>
                Final
              </div>
              {final && <KnockoutMatch slot={final} onSelectWinner={onSelectWinner} highlight />}
            </div>
            <div style={{ opacity: 0.7 }}>
              <div style={{
                fontFamily: 'var(--font-head)', fontSize: 10, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                color: 'var(--text-faint)', textAlign: 'center', marginBottom: 6,
              }}>
                Bronze Final
              </div>
              {bronze && <KnockoutMatch slot={bronze} onSelectWinner={onSelectWinner} />}
            </div>
          </div>

          {/* RIGHT HALF: SF ← QF ← R16 ← R32 (flows right to left) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: 8,
          }}>
            <RoundColumn label="Semi-Finals" matches={rightSF} onSelectWinner={onSelectWinner} />
            <RoundColumn label="Quarter-Finals" matches={rightQF} onSelectWinner={onSelectWinner} />
            <RoundColumn label="Round of 16" matches={rightR16} onSelectWinner={onSelectWinner} />
            <RoundColumn label="Round of 32" matches={rightR32} onSelectWinner={onSelectWinner} />
          </div>
        </div>
      </div>

      {/* ═══ MOBILE: Stage tab pills + match list ═══ */}
      <div className="ko-mobile">
        <div style={{
          display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8,
          marginBottom: 16, scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
        }}>
          {STAGE_ORDER.map(stage => {
            const matches = knockout.filter(m => m.stage === stage)
            const done = matches.filter(m => m.winner).length
            const isActive = mobileStage === stage
            return (
              <button key={stage} onClick={() => setMobileStage(stage)} style={{
                flexShrink: 0, padding: '7px 14px', borderRadius: 'var(--radius)', border: 'none',
                background: isActive ? 'var(--green)' : 'var(--card-alt)',
                color: isActive ? '#fff' : 'var(--text-sec)',
                fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: isActive ? 800 : 600,
                letterSpacing: '0.04em', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.2s ease', minHeight: 'var(--tap-min)',
              }}>
                {STAGE_LABELS[stage]}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, marginLeft: 6, opacity: 0.7 }}>
                  {done}/{matches.length}
                </span>
              </button>
            )
          })}
        </div>

        {/* Champion mobile */}
        {champion && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '12px 16px', marginBottom: 16,
            background: 'var(--card)', border: '2px solid var(--gold)', borderRadius: 'var(--radius)',
          }}>
            <span style={{ fontSize: 24 }}>🏆</span>
            <Image src={champion.flagUrl} alt={champion.name} width={24} height={16}
              style={{ objectFit: 'contain', borderRadius: 2 }} unoptimized />
            <span style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>
              {champion.name}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {knockout.filter(m => m.stage === mobileStage).map(match => (
            <KnockoutMatch key={match.matchNumber} slot={match} onSelectWinner={onSelectWinner}
              highlight={match.stage === 'final'} />
          ))}
        </div>
      </div>

      <style>{`
        .ko-desktop { display: block; }
        .ko-mobile { display: none; }
        @media (max-width: 1024px) {
          .ko-desktop { display: none; }
          .ko-mobile { display: block; }
        }
      `}</style>
    </div>
  )
}

/** Single column of matches in a round */
function RoundColumn({ label, matches, onSelectWinner }: {
  label: string
  matches: KnockoutSlot[]
  onSelectWinner: (matchNumber: number, winner: SimTeam) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.1em',
        color: 'var(--text-faint)', textAlign: 'center',
        marginBottom: 8, paddingBottom: 6,
        borderBottom: '1px solid var(--border)',
      }}>
        {label}
      </div>
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 6,
        justifyContent: 'space-around', flex: 1,
      }}>
        {matches.map(match => (
          <KnockoutMatch key={match.matchNumber} slot={match} onSelectWinner={onSelectWinner} />
        ))}
      </div>
    </div>
  )
}
