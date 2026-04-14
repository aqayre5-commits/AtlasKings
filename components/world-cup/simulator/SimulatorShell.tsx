'use client'

import { useReducer, useEffect, useCallback, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  simulatorReducer,
  createInitialState,
  decodeState,
  encodeState,
  type SimulatorState,
} from '@/lib/simulator/state'
import { SimulatorControls } from './SimulatorControls'
import { GroupStagePanel } from './GroupStagePanel'
import { BestThirdPanel } from './BestThirdPanel'
import { KnockoutBracket } from './KnockoutBracket'
import { PredictionSummary } from './PredictionSummary'
import { ShareModal } from './ShareModal'

const STORAGE_KEY = 'atlas-kings-sim-state'

function loadFromStorage(): Partial<SimulatorState> | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveToStorage(state: SimulatorState) {
  if (typeof window === 'undefined') return
  try {
    const { groupResults, knockout, chaosFactor, step, mode } = state
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ groupResults, chaosFactor, step, mode }),
    )
  } catch {
    // Silently fail on storage errors
  }
}

export function SimulatorShell() {
  const searchParams = useSearchParams()
  const [state, dispatch] = useReducer(simulatorReducer, undefined, createInitialState)
  const [mounted, setMounted] = useState(false)
  const [showShare, setShowShare] = useState(false)

  // Hydration-safe: load saved state after mount
  useEffect(() => {
    // Check URL param first
    const shared = searchParams?.get('p')
    if (shared) {
      const decoded = decodeState(shared)
      if (decoded) {
        dispatch({ type: 'LOAD_STATE', state: decoded })
        setMounted(true)
        return
      }
    }

    // Then check localStorage
    const stored = loadFromStorage()
    if (stored) {
      dispatch({ type: 'LOAD_STATE', state: stored })
    }
    setMounted(true)
  }, [])

  // Auto-save to localStorage on state changes (only after mount)
  useEffect(() => {
    if (mounted) saveToStorage(state)
  }, [state, mounted])

  // Listen for share/reset custom events from child components
  useEffect(() => {
    const handleShare = () => setShowShare(true)
    const handleReset = () => dispatch({ type: 'RESET' })

    window.addEventListener('sim-share', handleShare)
    window.addEventListener('sim-reset', handleReset)
    return () => {
      window.removeEventListener('sim-share', handleShare)
      window.removeEventListener('sim-reset', handleReset)
    }
  }, [])

  // Recalculate standings when group results are loaded from storage/URL
  useEffect(() => {
    if (
      Object.keys(state.groupResults).length > 0 &&
      Object.keys(state.standings).length === 0
    ) {
      // Trigger a no-op result set to force recalculation
      const firstKey = Object.keys(state.groupResults)[0]
      const firstResult = state.groupResults[Number(firstKey)]
      if (firstResult) {
        dispatch({
          type: 'SET_GROUP_RESULT',
          matchNumber: Number(firstKey),
          home: firstResult.home,
          away: firstResult.away,
        })
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSetResult = useCallback(
    (matchNumber: number, home: number, away: number) => {
      dispatch({ type: 'SET_GROUP_RESULT', matchNumber, home, away })
    },
    [],
  )

  const handleSimulateGroups = useCallback(() => {
    dispatch({ type: 'SIMULATE_GROUPS' })
  }, [])

  const handleSelectKnockoutWinner = useCallback(
    (matchNumber: number, winner: any) => {
      dispatch({ type: 'SET_KNOCKOUT_WINNER', matchNumber, winner })
    },
    [],
  )

  const handleSimulateKnockout = useCallback(() => {
    dispatch({ type: 'SIMULATE_KNOCKOUT' })
  }, [])

  const handleAdvanceToKnockout = useCallback(() => {
    dispatch({ type: 'ADVANCE_TO_KNOCKOUT' })
  }, [])

  const showChampion = !!state.champion

  // Show skeleton during hydration to prevent mismatch
  if (!mounted) {
    return (
      <div style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: 14, color: 'var(--text-faint)' }}>
          Loading simulator...
        </div>
      </div>
    )
  }

  return (
    <div>
      <SimulatorControls state={state} dispatch={dispatch} />

      <div
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          padding: '20px var(--edge)',
        }}
      >
        {/* Champion overlay */}
        {showChampion && (
          <div style={{ marginBottom: 24 }}>
            <PredictionSummary state={state} />
          </div>
        )}

        {/* Step panels */}
        {state.step === 'groups' && (
          <>
            <GroupStagePanel
              groups={state.groups}
              results={state.groupResults}
              standings={state.standings}
              onSetResult={handleSetResult}
              onSimulateGroups={handleSimulateGroups}
            />

            {/* Advance button when groups are complete */}
            {Object.keys(state.groupResults).length >=
              state.groups.reduce(
                (sum, g) => sum + g.matches.length,
                0,
              ) && (
              <div
                style={{
                  textAlign: 'center',
                  marginTop: 24,
                }}
              >
                <button
                  onClick={() => {
                    dispatch({ type: 'SET_STEP', step: 'bestThird' })
                  }}
                  style={{
                    minHeight: 'var(--tap-min)',
                    padding: '0 32px',
                    background: 'var(--green)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    fontFamily: 'var(--font-head)',
                    fontSize: 15,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Continue to Best Third-Placed Teams
                </button>
              </div>
            )}
          </>
        )}

        {state.step === 'bestThird' && (
          <>
            <BestThirdPanel bestThird={state.bestThird} />

            {state.bestThird.length > 0 && (
              <div
                style={{
                  textAlign: 'center',
                  marginTop: 24,
                }}
              >
                <button
                  onClick={handleAdvanceToKnockout}
                  style={{
                    minHeight: 'var(--tap-min)',
                    padding: '0 32px',
                    background: 'var(--green)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    fontFamily: 'var(--font-head)',
                    fontSize: 15,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Continue to Knockout Stage
                </button>
              </div>
            )}
          </>
        )}

        {state.step === 'knockout' && (
          <KnockoutBracket
            knockout={state.knockout}
            onSelectWinner={handleSelectKnockoutWinner}
            onSimulateKnockout={handleSimulateKnockout}
          />
        )}
      </div>

      {/* Share modal */}
      {showShare && (
        <ShareModal state={state} onClose={() => setShowShare(false)} />
      )}
    </div>
  )
}
