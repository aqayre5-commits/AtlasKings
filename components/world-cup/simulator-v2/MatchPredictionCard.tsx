'use client'

/**
 * Unified match prediction card — the primitive every match surface
 * in the v2 predictor renders with.
 *
 * Single component, two variants:
 *   variant="group"    — used inside <GroupsPanelV2>. Shows venue,
 *                        matchday, editable scoreline, click-to-pick
 *                        team rows.
 *   variant="knockout" — used inside <BracketCanvas>. Tighter layout,
 *                        no venue strip, unlocks only when both slots
 *                        have teams assigned.
 *
 * Interaction model (designed to be fast for bulk entry):
 *   1. Click a team row          → that team wins 1-0 (increments on
 *                                   repeat clicks for 2-0, 3-0…)
 *   2. Click the other team row  → flips the winner, resets to 1-0
 *   3. Click the scoreline       → opens inline editors for both
 *                                   sides so you can type exact
 *                                   scores
 *   4. Click the × clear button  → resets to no prediction
 *
 * A probability bar at the foot renders only when the caller supplies
 * a `probabilities` prop — that's populated from the Monte Carlo
 * results in MonteCarloPanel and from the strength model in group /
 * knockout panels when no MC has been run yet.
 */

import { useState, useEffect } from 'react'
import { countryFlagUrl, teamNameFromCode } from '@/lib/data/wc2026'

export type MatchCardVariant = 'group' | 'knockout'

export interface MatchCardProbabilities {
  home: number
  draw?: number
  away: number
}

interface Props {
  matchNumber: number
  homeCode: string | null
  awayCode: string | null
  homeScore: number | null
  awayScore: number | null
  /** Team CODE of the confirmed winner, if any. Knockout only. */
  winnerCode?: string | null
  variant?: MatchCardVariant
  /** Free-text subhead: venue + date for groups, stage label for R32. */
  subhead?: string
  /** Abstract label when the slot has no team yet (e.g. "1A", "W73"). */
  homeLabel?: string
  awayLabel?: string
  /** Called with the new scoreline. Fire-and-forget. */
  onChange?: (matchNumber: number, home: number, away: number) => void
  /** Called with the new winner code (knockout only). */
  onSelectWinner?: (matchNumber: number, winnerCode: string) => void
  /** Clear the match prediction. */
  onClear?: (matchNumber: number) => void
  /** Populate the win/draw/away probability bar beneath the card. */
  probabilities?: MatchCardProbabilities
  /** Render a gold halo around the card (Morocco path / lock). */
  highlight?: boolean
  /** Visually locked — read only. */
  locked?: boolean
}

export function MatchPredictionCard({
  matchNumber,
  homeCode,
  awayCode,
  homeScore,
  awayScore,
  winnerCode,
  variant = 'group',
  subhead,
  homeLabel,
  awayLabel,
  onChange,
  onSelectWinner,
  onClear,
  probabilities,
  highlight,
  locked,
}: Props) {
  const isKnockout = variant === 'knockout'
  const hasScore = homeScore !== null && awayScore !== null
  const isHomeWinner = hasScore
    ? (homeScore ?? 0) > (awayScore ?? 0)
    : winnerCode === homeCode
  const isAwayWinner = hasScore
    ? (awayScore ?? 0) > (homeScore ?? 0)
    : winnerCode === awayCode
  const isDraw = hasScore && homeScore === awayScore

  const [editing, setEditing] = useState(false)
  const [draftHome, setDraftHome] = useState<string>(String(homeScore ?? ''))
  const [draftAway, setDraftAway] = useState<string>(String(awayScore ?? ''))

  useEffect(() => {
    if (!editing) {
      setDraftHome(String(homeScore ?? ''))
      setDraftAway(String(awayScore ?? ''))
    }
  }, [homeScore, awayScore, editing])

  const canInteract = !locked && !!homeCode && !!awayCode

  /**
   * Click-to-score: clicking a team row increments *only* that
   * team's score by one. The other team's score is preserved.
   *
   * Starting from empty, this means:
   *   click Brazil    → Brazil 1 - 0 Morocco
   *   click Brazil    → Brazil 2 - 0 Morocco
   *   click Morocco   → Brazil 2 - 1 Morocco
   *   click Morocco   → Brazil 2 - 2 Morocco
   *   click Morocco   → Brazil 2 - 3 Morocco  ← draws and any
   *                                              away wins are
   *                                              now reachable
   *
   * For knockout matches the semantics are different — clicking a
   * team row delegates to `onSelectWinner`, which advances that
   * team to the next round without touching the scoreline. Exact
   * knockout scores are set via the inline editor.
   */
  function handlePickHome() {
    if (!canInteract) return
    if (isKnockout && onSelectWinner && homeCode) {
      onSelectWinner(matchNumber, homeCode)
      return
    }
    const nextHome = (homeScore ?? 0) + 1
    const nextAway = awayScore ?? 0
    onChange?.(matchNumber, nextHome, nextAway)
  }

  function handlePickAway() {
    if (!canInteract) return
    if (isKnockout && onSelectWinner && awayCode) {
      onSelectWinner(matchNumber, awayCode)
      return
    }
    const nextHome = homeScore ?? 0
    const nextAway = (awayScore ?? 0) + 1
    onChange?.(matchNumber, nextHome, nextAway)
  }

  function commitEdits() {
    const h = Math.max(0, Math.min(20, Number(draftHome) || 0))
    const a = Math.max(0, Math.min(20, Number(draftAway) || 0))
    onChange?.(matchNumber, h, a)
    setEditing(false)
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    onClear?.(matchNumber)
  }

  const borderColour = highlight
    ? 'var(--gold, #e6b450)'
    : hasScore || winnerCode
      ? 'var(--green, #0a5229)'
      : 'var(--border)'

  return (
    <div
      data-match={matchNumber}
      style={{
        background: 'var(--card)',
        border: `1px solid ${borderColour}`,
        boxShadow: highlight ? '0 0 0 2px rgba(230, 180, 80, 0.25)' : undefined,
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'border-color 160ms ease, box-shadow 160ms ease',
      }}
    >
      {/* Header strip — venue / matchday. Hidden in knockout-compact. */}
      {subhead && (
        <div
          style={{
            padding: '6px 10px',
            background: 'var(--card-alt)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 6,
            minHeight: 24,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--text-faint)',
              letterSpacing: '0.04em',
            }}
          >
            #{matchNumber}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-faint)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '80%',
              textAlign: 'end',
            }}
          >
            {subhead}
          </span>
        </div>
      )}

      <TeamRow
        code={homeCode}
        label={homeLabel}
        score={homeScore}
        draftScore={editing ? draftHome : null}
        onDraftChange={setDraftHome}
        onCommit={commitEdits}
        isWinner={!!isHomeWinner}
        isDraw={!!isDraw}
        isHome
        interactive={canInteract}
        onPick={handlePickHome}
      />
      <div
        style={{
          height: 1,
          background: 'var(--border)',
        }}
      />
      <TeamRow
        code={awayCode}
        label={awayLabel}
        score={awayScore}
        draftScore={editing ? draftAway : null}
        onDraftChange={setDraftAway}
        onCommit={commitEdits}
        isWinner={!!isAwayWinner}
        isDraw={!!isDraw}
        isHome={false}
        interactive={canInteract}
        onPick={handlePickAway}
      />

      {/* Probability bar */}
      {probabilities && (
        <ProbabilityBar
          home={probabilities.home}
          draw={probabilities.draw}
          away={probabilities.away}
        />
      )}

      {/* Footer actions */}
      {canInteract && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '6px 10px',
            borderTop: '1px solid var(--border)',
            minHeight: 32,
            background: 'var(--card-alt)',
          }}
        >
          <button
            type="button"
            onClick={() => setEditing(v => !v)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-faint)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '2px 6px',
            }}
          >
            {editing ? 'Done' : 'Edit'}
          </button>
          {(hasScore || winnerCode) && onClear && (
            <button
              type="button"
              onClick={handleClear}
              title="Clear prediction"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-faint)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                padding: '0 6px',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Internal team row ─────────────────────────────────────────

interface TeamRowProps {
  code: string | null
  label?: string
  score: number | null
  draftScore: string | null
  onDraftChange: (value: string) => void
  onCommit: () => void
  isWinner: boolean
  isDraw: boolean
  isHome: boolean
  interactive: boolean
  onPick: () => void
}

function TeamRow({
  code,
  label,
  score,
  draftScore,
  onDraftChange,
  onCommit,
  isWinner,
  isDraw,
  interactive,
  onPick,
}: TeamRowProps) {
  const isMorocco = code === 'MAR'
  const hasTeam = !!code
  const name = code ? teamNameFromCode(code) : label ?? '—'

  const background = isWinner
    ? 'rgba(10, 82, 41, 0.15)'
    : isMorocco && !isWinner
      ? 'rgba(10, 82, 41, 0.04)'
      : 'transparent'

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        background,
        borderInlineStart: isWinner ? '3px solid var(--green)' : '3px solid transparent',
        minHeight: 44,
        cursor: interactive && hasTeam ? 'pointer' : 'default',
        transition: 'background 160ms ease',
      }}
      onClick={() => {
        if (interactive && hasTeam) onPick()
      }}
      onKeyDown={e => {
        if ((e.key === 'Enter' || e.key === ' ') && interactive && hasTeam) {
          e.preventDefault()
          onPick()
        }
      }}
      role={interactive && hasTeam ? 'button' : undefined}
      tabIndex={interactive && hasTeam ? 0 : -1}
      aria-label={code ? `Pick ${name} as winner` : undefined}
    >
      {hasTeam && code ? (
        <img
          src={countryFlagUrl(code, 40)}
          alt=""
          width={28}
          height={18}
          loading="lazy"
          style={{
            objectFit: 'cover',
            borderRadius: 2,
            boxShadow: '0 0 0 1px rgba(0,0,0,0.12)',
          }}
        />
      ) : (
        <span
          style={{
            display: 'inline-block',
            width: 28,
            height: 18,
            background: 'var(--card-alt)',
            border: '1px dashed var(--border)',
            borderRadius: 2,
          }}
        />
      )}

      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 13,
            fontWeight: isWinner ? 800 : 600,
            color: hasTeam ? 'var(--text)' : 'var(--text-faint)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </span>
        {code && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--text-faint)',
              letterSpacing: '0.05em',
            }}
          >
            {code}
          </span>
        )}
      </span>

      {draftScore !== null ? (
        <input
          autoFocus
          type="number"
          min={0}
          max={20}
          value={draftScore}
          onChange={e => onDraftChange(e.target.value)}
          onBlur={onCommit}
          onKeyDown={e => {
            if (e.key === 'Enter') onCommit()
            if (e.key === 'Escape') onCommit()
          }}
          onClick={e => e.stopPropagation()}
          style={{
            width: 36,
            height: 28,
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--text)',
            background: 'var(--card)',
            border: '1px solid var(--green)',
            borderRadius: 'var(--radius-sm)',
          }}
        />
      ) : (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 18,
            fontWeight: 800,
            color: isDraw ? 'var(--text-sec)' : isWinner ? 'var(--text)' : 'var(--text-faint)',
            minWidth: 22,
            textAlign: 'end',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {score ?? ''}
        </span>
      )}
    </div>
  )
}

// ─── Probability bar ───────────────────────────────────────────

function ProbabilityBar({ home, draw, away }: { home: number; draw?: number; away: number }) {
  const h = clampPct(home)
  const d = clampPct(draw ?? 0)
  const a = clampPct(away)
  const total = h + d + a
  const norm = total > 0 ? { h: (h / total) * 100, d: (d / total) * 100, a: (a / total) * 100 } : { h: 33, d: 34, a: 33 }

  return (
    <div
      aria-label={`Win probabilities: home ${Math.round(home)}%, draw ${Math.round(draw ?? 0)}%, away ${Math.round(away)}%`}
      style={{
        display: 'flex',
        width: '100%',
        height: 4,
        borderTop: '1px solid var(--border)',
      }}
    >
      <div style={{ width: `${norm.h}%`, background: '#0a5229' }} />
      {draw !== undefined && (
        <div style={{ width: `${norm.d}%`, background: 'var(--card-alt)' }} />
      )}
      <div style={{ width: `${norm.a}%`, background: '#c1121f' }} />
    </div>
  )
}

function clampPct(v: number): number {
  if (!Number.isFinite(v)) return 0
  return Math.max(0, Math.min(100, v))
}
