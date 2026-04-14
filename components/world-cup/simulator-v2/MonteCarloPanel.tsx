'use client'

/**
 * Monte Carlo control panel.
 *
 * Two modes driven entirely by `state.step`:
 *
 *   Groups step  — "Simulate groups" button. Running the ensemble
 *                  commits its sample DIRECTLY to state (no preview).
 *                  The groups tab shows the populated standings +
 *                  ADV% column on return.
 *
 *   Knockout step — "Simulate knockout" button, gated on groups
 *                   being complete. Running the ensemble commits
 *                   the R32 → Final cascade directly to state and
 *                   the bracket canvas renders the result.
 *
 * There is no preview → apply two-step. Undo rolls back the entire
 * simulated tournament as a single history snapshot.
 *
 * Heavy lifting lives in `lib/simulator/monteCarlo.ts` —
 * `runMonteCarloGroupsOnly` and `runMonteCarloKnockoutOnly` do the
 * ensemble runs + best-of-K sample picking. This component is pure
 * presentation + dispatch wiring.
 */

import { useRef, useState } from 'react'
import {
  runMonteCarloGroupsOnly,
  runMonteCarloKnockoutOnly,
} from '@/lib/simulator/monteCarlo'
import type { SimulatorStateV2, SimActionV2 } from '@/lib/simulator/v2/types'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'

interface Props {
  state: SimulatorStateV2
  dispatch: React.Dispatch<SimActionV2>
  lang: 'en' | 'ar' | 'fr'
}

const ITERATION_OPTIONS = [
  { value: 1_000, label: '1k' },
  { value: 10_000, label: '10k' },
  { value: 100_000, label: '100k' },
] as const

export function MonteCarloPanel({ state, dispatch, lang }: Props) {
  const t = getTranslations(lang as Lang).simulator.mc
  const [selected, setSelected] = useState<number>(10_000)
  const [lastError, setLastError] = useState<string | null>(null)
  const runTokenRef = useRef(0)

  const isRunning = state.mcStatus === 'running'
  const groupsComplete = Object.keys(state.groupResults).length >= 72
  const onGroupsStep = state.step === 'groups'
  const onKnockoutStep = state.step === 'knockout'

  // One-shot groups runner: runs the ensemble, then dispatches
  // MC_APPLY_GROUPS_SAMPLE which commits the sample directly to
  // state. No preview/apply two-step. Undo rolls back.
  const handleSimulateGroups = async () => {
    if (isRunning) return
    setLastError(null)
    dispatch({ type: 'MC_START' })
    const token = ++runTokenRef.current
    try {
      const out = await runMonteCarloGroupsOnly(
        {
          iterations: selected,
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
    } catch (err) {
      if (token !== runTokenRef.current) return
      setLastError(err instanceof Error ? err.message : String(err))
      dispatch({ type: 'MC_ERROR' })
    }
  }

  // Same one-shot flow for the knockout ensemble. Requires a
  // populated R32 bracket (groupsComplete gate).
  const handleSimulateKnockout = async () => {
    if (isRunning || !groupsComplete) return
    setLastError(null)
    dispatch({ type: 'MC_START' })
    const token = ++runTokenRef.current
    try {
      const out = await runMonteCarloKnockoutOnly(
        {
          iterations: selected,
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
      dispatch({
        type: 'MC_APPLY_KNOCKOUT_SAMPLE',
        sample: out.sample,
        iterations: out.iterations,
      })
    } catch (err) {
      if (token !== runTokenRef.current) return
      setLastError(err instanceof Error ? err.message : String(err))
      dispatch({ type: 'MC_ERROR' })
    }
  }

  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: 20,
        direction: lang === 'ar' ? 'rtl' : 'ltr',
      }}
    >
      {/* ─── Header ─── */}
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text)',
          }}
        >
          {t.title}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            lineHeight: 1.4,
            color: 'var(--text-faint)',
            marginTop: 4,
          }}
        >
          {t.subtitle}
        </div>
      </div>

      {/* ─── Iteration selector ─── */}
      <div
        role="radiogroup"
        aria-label={t.iterations}
        style={{ display: 'flex', gap: 6, marginBottom: 12 }}
      >
        {ITERATION_OPTIONS.map(opt => {
          const active = opt.value === selected
          return (
            <button
              key={opt.value}
              role="radio"
              aria-checked={active}
              disabled={isRunning}
              onClick={() => setSelected(opt.value)}
              style={{
                flex: 1,
                minHeight: 44,
                padding: '8px 12px',
                background: active ? 'var(--green)' : 'var(--card-alt)',
                color: active ? '#fff' : 'var(--text)',
                border: active ? '2px solid var(--green)' : '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                opacity: isRunning && !active ? 0.55 : 1,
              }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      {/* ─── Context-aware simulate button ─── */}
      {onGroupsStep && (
        <button
          onClick={handleSimulateGroups}
          disabled={isRunning}
          style={{
            width: '100%',
            minHeight: 'var(--tap-min, 44px)',
            background: isRunning ? 'var(--card-alt)' : 'var(--green)',
            color: isRunning ? 'var(--text-faint)' : '#fff',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-head)',
            fontSize: 14,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            cursor: isRunning ? 'wait' : 'pointer',
            marginBottom: 10,
          }}
        >
          {isRunning ? t.running : `▶  ${t.simulateGroups}`}
        </button>
      )}

      {onKnockoutStep && (
        <>
          <button
            onClick={handleSimulateKnockout}
            disabled={isRunning || !groupsComplete}
            style={{
              width: '100%',
              minHeight: 'var(--tap-min, 40px)',
              background: !groupsComplete
                ? 'var(--card-alt)'
                : isRunning
                  ? 'var(--card-alt)'
                  : 'var(--green)',
              color: !groupsComplete || isRunning ? 'var(--text-faint)' : '#fff',
              border: !groupsComplete ? '1px dashed var(--border)' : 'none',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-head)',
              fontSize: 12,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              cursor: !groupsComplete ? 'not-allowed' : isRunning ? 'wait' : 'pointer',
              marginBottom: 10,
            }}
          >
            {isRunning ? t.running : `▶  ${t.simulateKnockout}`}
          </button>
          {!groupsComplete && (
            <div
              style={{
                padding: 10,
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(193, 18, 31, 0.05)',
                border: '1px solid rgba(193, 18, 31, 0.2)',
                color: 'var(--text-sec)',
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                lineHeight: 1.5,
                marginBottom: 10,
              }}
            >
              {t.lockedUntilGroups}
            </div>
          )}
        </>
      )}

      {/* ─── Progress bar ─── */}
      {isRunning && (
        <div
          aria-live="polite"
          style={{
            height: 6,
            background: 'var(--card-alt)',
            borderRadius: 999,
            overflow: 'hidden',
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: `${state.mcProgress}%`,
              height: '100%',
              background: 'var(--green)',
              transition: 'width 120ms linear',
            }}
          />
        </div>
      )}

      {lastError && (
        <div
          style={{
            padding: 8,
            marginBottom: 12,
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(193, 18, 31, 0.08)',
            border: '1px solid rgba(193, 18, 31, 0.3)',
            color: 'var(--red)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
          }}
        >
          {lastError}
        </div>
      )}

      {/* ─── Footnote ─── */}
      <div
        style={{
          marginTop: 12,
          paddingTop: 10,
          borderTop: '1px solid var(--border)',
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          lineHeight: 1.6,
          color: 'var(--text-faint)',
        }}
      >
        {t.footnote}
      </div>
    </div>
  )
}

