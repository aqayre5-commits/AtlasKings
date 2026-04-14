'use client'

/**
 * v2 sticky action bar — filled Moroccan-colored pill buttons, centred.
 *
 *   [ ▶ Simulate Group Stage ]  [ 📱 Share ]  [ Knockout → ]
 *       green/red                  gold         green (when ready)
 */

import type { SimulatorStateV2, SimActionV2 } from '@/lib/simulator/v2/types'

interface Props {
  state: SimulatorStateV2
  dispatch: React.Dispatch<SimActionV2>
  onShare: () => void
  onSimulate: () => void
  lang: 'en' | 'ar' | 'fr'
}

const COPY: Record<'en' | 'ar' | 'fr', {
  simulate: string
  resimulate: string
  share: string
  knockout: string
  simulating: string
}> = {
  en: { simulate: 'Simulate Group Stage', resimulate: 'Re-simulate', share: 'Share', knockout: 'Knockout', simulating: 'Simulating...' },
  ar: { simulate: '\u0645\u062D\u0627\u0643\u0627\u0629 \u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0627\u062A', resimulate: '\u0625\u0639\u0627\u062F\u0629', share: '\u0645\u0634\u0627\u0631\u0643\u0629', knockout: '\u0627\u0644\u0625\u0642\u0635\u0627\u0626\u064A\u0627\u062A', simulating: '\u062C\u0627\u0631\u064D...' },
  fr: { simulate: 'Simuler les groupes', resimulate: 'Re-simuler', share: 'Partager', knockout: 'Eliminatoires', simulating: 'Simulation...' },
}

// Shared pill button style
const pill: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '12px 24px',
  minHeight: 48,
  border: 'none',
  borderRadius: 'var(--radius, 8px)',
  fontFamily: 'var(--font-head)',
  fontSize: 14,
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  whiteSpace: 'nowrap',
}

export function SimulatorControlsV2({ state, dispatch, onShare, onSimulate, lang }: Props) {
  const t = COPY[lang] ?? COPY.en
  const isRTL = lang === 'ar'
  const isRunning = state.mcStatus === 'running'
  const groupsComplete = Object.keys(state.groupResults).length >= 72

  return (
    <div
      style={{
        direction: isRTL ? 'rtl' : 'ltr',
        padding: '16px 0',
        display: 'flex',
        justifyContent: 'center',
        gap: 12,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'contents' }}>
        {/* ▶ Simulate — Red (primary action) */}
        <button
          type="button"
          onClick={onSimulate}
          disabled={isRunning}
          style={{
            ...pill,
            background: isRunning ? 'var(--card-alt)' : groupsComplete ? 'var(--green, #0a5229)' : 'var(--red, #c1121f)',
            color: isRunning ? 'var(--text-faint)' : '#fff',
            cursor: isRunning ? 'wait' : 'pointer',
            boxShadow: isRunning ? 'none' : groupsComplete ? '0 2px 8px rgba(10, 82, 41, 0.3)' : '0 2px 8px rgba(193, 18, 31, 0.3)',
          }}
        >
          {isRunning
            ? t.simulating
            : groupsComplete
              ? `\u21BB ${t.resimulate}`
              : `\u25B6 ${t.simulate}`
          }
        </button>

        {/* 📱 Share — Gold */}
        <button
          type="button"
          onClick={onShare}
          style={{
            ...pill,
            background: 'var(--gold, #b8820a)',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(184, 130, 10, 0.3)',
          }}
        >
          {`\uD83D\uDCF1 ${t.share}`}
        </button>

        {/* Knockout → Green (enabled when groups complete) */}
        <button
          type="button"
          onClick={() => {
            dispatch({ type: 'ADVANCE_TO_KNOCKOUT' })
            dispatch({ type: 'SET_STEP', step: 'knockout' })
          }}
          disabled={!groupsComplete}
          style={{
            ...pill,
            background: groupsComplete ? 'var(--green, #0a5229)' : '#1a1a1a',
            color: '#fff',
            opacity: groupsComplete ? 1 : 0.4,
            cursor: groupsComplete ? 'pointer' : 'not-allowed',
            boxShadow: groupsComplete ? '0 2px 8px rgba(10, 82, 41, 0.3)' : 'none',
          }}
        >
          {`${t.knockout} \u2192`}
        </button>
      </div>
    </div>
  )
}
