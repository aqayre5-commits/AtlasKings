'use client'

import { useState } from 'react'
import type { SimulatorState, SimAction, SimStep } from '@/lib/simulator/state'

interface Props {
  state: SimulatorState
  dispatch: React.Dispatch<SimAction>
}

const STEPS: { key: SimStep; label: string }[] = [
  { key: 'groups', label: 'Groups' },
  { key: 'bestThird', label: 'Best 3rd' },
  { key: 'knockout', label: 'Knockout' },
]

export function SimulatorControls({ state, dispatch }: Props) {
  const [showShare, setShowShare] = useState(false)

  return (
    <div
      style={{
        position: 'sticky',
        top: 58,
        zIndex: 50,
        background: 'var(--hdr-bg)',
        borderBottom: '1px solid var(--hdr-border)',
        padding: '10px 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        {/* Step indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {STEPS.map((step, idx) => {
            const isActive = state.step === step.key
            const stepIndex = STEPS.findIndex((s) => s.key === state.step)
            const isPast = idx < stepIndex

            return (
              <div key={step.key} style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={() => dispatch({ type: 'SET_STEP', step: step.key })}
                  style={{
                    minHeight: 'var(--tap-min)',
                    padding: '0 14px',
                    background: isActive
                      ? 'var(--green)'
                      : isPast
                        ? 'var(--green-light)'
                        : 'transparent',
                    color: isActive
                      ? '#fff'
                      : isPast
                        ? 'var(--green-bright)'
                        : 'var(--hdr-muted)',
                    border: isActive
                      ? '1px solid var(--green)'
                      : '1px solid var(--hdr-border)',
                    borderRadius: 'var(--radius)',
                    fontFamily: 'var(--font-head)',
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {step.label}
                </button>
                {idx < STEPS.length - 1 && (
                  <span
                    style={{
                      color: 'var(--hdr-muted)',
                      fontSize: 10,
                      padding: '0 4px',
                    }}
                  >
                    &#8250;
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Mode toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--hdr-dim)',
            borderRadius: 'var(--radius)',
            padding: 2,
          }}
        >
          {(['manual', 'simulate'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => dispatch({ type: 'SET_MODE', mode })}
              style={{
                minHeight: 32,
                padding: '0 14px',
                background:
                  state.mode === mode ? 'var(--green)' : 'transparent',
                color: state.mode === mode ? '#fff' : 'var(--hdr-muted)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-head)',
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {mode === 'manual' ? 'Manual' : 'Simulate'}
            </button>
          ))}
        </div>

        {/* Chaos slider (simulate mode only) */}
        {state.mode === 'simulate' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--hdr-muted)',
                whiteSpace: 'nowrap',
              }}
            >
              Pure Ranking
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={state.chaosFactor}
              onChange={(e) =>
                dispatch({
                  type: 'SET_CHAOS',
                  value: parseInt(e.target.value),
                })
              }
              style={{
                width: 80,
                accentColor: 'var(--green)',
                cursor: 'pointer',
              }}
              aria-label="Chaos factor"
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--hdr-muted)',
                whiteSpace: 'nowrap',
              }}
            >
              Total Chaos
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--green-bright)',
                minWidth: 28,
                textAlign: 'center',
              }}
            >
              {state.chaosFactor}
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => dispatch({ type: 'SIMULATE_ALL' })}
            style={{
              minHeight: 'var(--tap-min)',
              padding: '0 16px',
              background: 'var(--green)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-head)',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            Simulate All
          </button>

          <button
            onClick={() => dispatch({ type: 'RESET' })}
            style={{
              minHeight: 'var(--tap-min)',
              padding: '0 16px',
              background: 'transparent',
              color: 'var(--red)',
              border: '1px solid var(--red)',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-head)',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            Reset
          </button>

          <button
            onClick={() => {
              // Dispatch a custom event that SimulatorShell listens to
              window.dispatchEvent(new CustomEvent('sim-share'))
            }}
            style={{
              minHeight: 'var(--tap-min)',
              padding: '0 16px',
              background: 'transparent',
              color: 'var(--text-on-dark)',
              border: '1px solid var(--hdr-border)',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-head)',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  )
}
