'use client'

/**
 * v2 simulator shell.
 *
 * Thin orchestration layer that owns the v2 reducer, handles
 * hydration from URL params / localStorage, and routes the active
 * step to the right panel.
 *
 * Phase 1–3 delivery:
 *   - Groups step: legacy <GroupStagePanel> (Phase 4 replaces it with
 *     a redesigned prediction card grid)
 *   - Best-third step: legacy <BestThirdPanel>
 *   - Knockout step: new <BracketCanvas> with SVG-style connectors
 *   - Always-visible <MonteCarloPanel> under the sticky controls
 *
 * Phase 4 will bring a redesigned group-entry UX and a Morocco path
 * widget; Phase 5 brings short-link permalinks and OG preview cards.
 * Until then the legacy panels stay in place — they already dispatch
 * v1-compatible action shapes that the v2 reducer handles natively.
 */

import { useReducer, useEffect, useCallback, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  simulatorReducerV2,
  createInitialStateV2,
  decodeStateV2,
  encodeStateV2,
} from '@/lib/simulator/v2/state'
import {
  runMonteCarloGroupsOnly,
  runMonteCarloKnockoutOnly,
} from '@/lib/simulator/monteCarlo'
import type { SimulatorStateV2 } from '@/lib/simulator/v2/types'
import type { SimTeam } from '@/lib/simulator/groups'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'
import { SimulatorControlsV2 } from './SimulatorControlsV2'
import { MonteCarloPanel } from './MonteCarloPanel'
import { BracketCanvas } from './BracketCanvas'
import { GroupsPanelV2 } from './GroupsPanelV2'
import { BestThirdPanel } from '@/components/world-cup/simulator/BestThirdPanel'
import { ShareModal } from '@/components/world-cup/simulator/ShareModal'

const STORAGE_KEY = 'atlas-kings-sim-state-v2'

interface Props {
  lang?: string
}

function loadFromStorage(): Partial<SimulatorStateV2> | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveToStorage(state: SimulatorStateV2) {
  if (typeof window === 'undefined') return
  try {
    // Only persist the minimal fields needed to rehydrate. Skip the
    // Monte Carlo slice (re-running is fast and it bloats storage).
    // Don't persist `step` — page always opens on groups.
    // User advances to knockout via the action bar.
    const { groupResults, chaosFactor, mode, strengthModel, lockedMatches } = state
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ groupResults, chaosFactor, mode, strengthModel, lockedMatches }),
    )
  } catch {
    // Silently fail on storage errors (quota, private mode, etc.)
  }
}

export function SimulatorShellV2({ lang = 'en' }: Props) {
  const searchParams = useSearchParams()
  const [state, dispatch] = useReducer(simulatorReducerV2, undefined, createInitialStateV2)
  const [mounted, setMounted] = useState(false)
  const [showShare, setShowShare] = useState(false)

  const normalizedLang = (lang === 'ar' || lang === 'fr' ? lang : 'en') as 'en' | 'ar' | 'fr'
  const i18n = getTranslations(normalizedLang as Lang).simulator

  // Hydration: URL first, then localStorage.
  useEffect(() => {
    const shared = searchParams?.get('p')
    if (shared) {
      const decoded = decodeStateV2(shared)
      if (decoded) {
        dispatch({ type: 'LOAD_STATE', state: decoded })
        setMounted(true)
        return
      }
    }
    const stored = loadFromStorage()
    if (stored) {
      dispatch({ type: 'LOAD_STATE', state: stored })
    }
    setMounted(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist on every change after mount.
  useEffect(() => {
    if (mounted) saveToStorage(state)
  }, [state, mounted])

  // Once group results are hydrated we need a nudge to recompute the
  // standings — dispatching SET_GROUP_RESULT with the existing value
  // triggers the tiebreaker recalculation. Same trick as v1.
  useEffect(() => {
    if (
      Object.keys(state.groupResults).length > 0 &&
      Object.keys(state.standings).length === 0
    ) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Child panels still emit `sim-share` / `sim-reset` custom events
  // (v1 buttons inside <GroupStagePanel> etc.). Bridge them to v2.
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
    (matchNumber: number, winner: SimTeam) => {
      dispatch({ type: 'SET_KNOCKOUT_WINNER', matchNumber, winner })
    },
    [],
  )
  const handleAdvanceToKnockout = useCallback(() => {
    dispatch({ type: 'ADVANCE_TO_KNOCKOUT' })
  }, [])

  // Unified simulate handler — called from the action bar
  const runTokenRef = useRef(0)
  const handleSimulate = useCallback(async () => {
    if (state.mcStatus === 'running') return
    const token = ++runTokenRef.current
    dispatch({ type: 'MC_START' })

    if (state.step === 'knockout') {
      // Knockout simulation
      try {
        const out = await runMonteCarloKnockoutOnly(
          {
            iterations: 10_000,
            chaosFactor: state.chaosFactor,
            strengthModel: state.strengthModel,
            lockedMatches: state.lockedMatches,
            lockedGroupResults: state.groupResults,
          },
          state.knockout,
          ({ completed, total }) => {
            if (token !== runTokenRef.current) return
            dispatch({ type: 'MC_PROGRESS', progress: Math.round((completed / total) * 100) })
          },
        )
        if (token !== runTokenRef.current) return
        dispatch({ type: 'MC_APPLY_KNOCKOUT_SAMPLE', sample: out.sample, iterations: out.iterations })
      } catch { dispatch({ type: 'MC_ERROR' }) }
    } else {
      // Groups simulation
      try {
        const out = await runMonteCarloGroupsOnly(
          {
            iterations: 10_000,
            chaosFactor: state.chaosFactor,
            strengthModel: state.strengthModel,
            lockedMatches: state.lockedMatches,
            lockedGroupResults: state.groupResults,
          },
          ({ completed, total }) => {
            if (token !== runTokenRef.current) return
            dispatch({ type: 'MC_PROGRESS', progress: Math.round((completed / total) * 100) })
          },
        )
        if (token !== runTokenRef.current) return
        dispatch({
          type: 'MC_APPLY_GROUPS_SAMPLE',
          sample: out.sample,
          iterations: out.iterations,
          reachR32: out.reachR32,
        })
      } catch { dispatch({ type: 'MC_ERROR' }) }
    }
  }, [state.step, state.mcStatus, state.chaosFactor, state.strengthModel, state.lockedMatches, state.groupResults, state.knockout])

  // The share modal consumes the v1 SimulatorState shape. Build an
  // adapter object on the fly — v2 is a superset so this is zero-
  // copy for every field the modal actually reads.
  const shareModalState = state as unknown as import('@/lib/simulator/state').SimulatorState

  // Hydration skeleton.
  if (!mounted) {
    return (
      <div
        style={{
          minHeight: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ fontFamily: 'var(--font-head)', fontSize: 14, color: 'var(--text-faint)' }}>
          {i18n.loading}
        </div>
      </div>
    )
  }

  const allMatches = state.groups.reduce((sum, g) => sum + g.matches.length, 0)
  const groupsComplete = Object.keys(state.groupResults).length >= allMatches

  return (
    <div>
      {/* Action bar moved inside grid main column below */}

      {/* On the knockout step the bracket needs full viewport
          width to render both halves + the centre column without
          horizontal clipping. Groups / Best-3rd keep the two-column
          layout with the MC sidebar on the right. */}
      {state.step === 'knockout' ? (
        <div
          style={{
            maxWidth: 1480,
            margin: '0 auto',
            padding: '20px var(--edge)',
          }}
        >
          <BracketCanvas
            knockout={state.knockout}
            onSelectWinner={handleSelectKnockoutWinner}
            montecarlo={state.montecarlo}
            lang={normalizedLang}
            groupsComplete={groupsComplete}
            simulatorState={state}
            onSimulateKnockout={handleSimulate}
            actionButtons={
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                <KoBtn bg="var(--green, #0a5229)" onClick={() => dispatch({ type: 'SET_STEP', step: 'groups' })}>
                  {normalizedLang === 'ar' ? '\u2192 \u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0627\u062A' : '\u2190 Groups'}
                </KoBtn>
                <KoBtn bg={state.mcStatus === 'running' ? 'var(--card-alt)' : 'var(--red, #c1121f)'} onClick={handleSimulate} disabled={state.mcStatus === 'running'}>
                  {state.mcStatus === 'running' ? 'Simulating...' : '\u25B6 Simulate'}
                </KoBtn>
                <KoBtn bg="var(--gold, #b8820a)" onClick={() => setShowShare(true)}>
                  {'\uD83D\uDCF1 Share'}
                </KoBtn>
                <KoBtn bg="#1a1a1a" onClick={() => window.print()}>
                  {'\uD83D\uDDA8 Print'}
                </KoBtn>
              </div>
            }
          />
        </div>
      ) : (
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '20px var(--edge)',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(260px, 320px)',
            gap: 20,
          }}
          className="sim-v2-grid"
        >
          <div>
            {/* Action buttons — centred above Group C */}
            <SimulatorControlsV2
              state={state}
              dispatch={dispatch}
              onShare={() => setShowShare(true)}
              onSimulate={handleSimulate}
              lang={normalizedLang}
            />

            {/* Groups panel */}
            <GroupsPanelV2 state={state} dispatch={dispatch} lang={normalizedLang} />

            {/* Best Third table — appears inline after groups when complete */}
            {groupsComplete && state.bestThird.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <BestThirdPanel bestThird={state.bestThird} lang={normalizedLang} />
              </div>
            )}
          </div>

          <aside
            style={{
              position: 'sticky',
              top: 'calc(var(--header-h, 60px) + 60px)',
              alignSelf: 'start',
              maxHeight: 'calc(100vh - var(--header-h, 60px) - 80px)',
              overflowY: 'auto',
            }}
            className="sim-v2-aside"
          >
            <MonteCarloPanel state={state} dispatch={dispatch} lang={normalizedLang} />
          </aside>
        </div>
      )}

      {showShare && <ShareModal state={shareModalState} onClose={() => setShowShare(false)} />}

      {/* Collapse the sidebar on narrow viewports — the MC panel
          moves to the end of the main column so it doesn't squeeze
          the groups / bracket. */}
      <style jsx>{`
        @media (max-width: 980px) {
          :global(.sim-v2-grid) {
            grid-template-columns: 1fr !important;
          }
          :global(.sim-v2-aside) {
            position: static !important;
            max-height: none !important;
            order: -1;
          }
        }
      `}</style>
    </div>
  )
}

/** Small knockout action button — used in the centre column above the trophy. */
function KoBtn({ bg, onClick, disabled, children }: {
  bg: string; onClick: () => void; disabled?: boolean; children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 16px',
        minHeight: 36,
        background: bg,
        color: disabled ? 'var(--text-faint)' : '#fff',
        border: 'none',
        borderRadius: 'var(--radius-sm, 4px)',
        fontFamily: 'var(--font-head)',
        fontSize: 11,
        fontWeight: 700,
        cursor: disabled ? 'wait' : 'pointer',
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}
