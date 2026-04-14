/**
 * <MatchCard> — canonical match card design primitive.
 * ─────────────────────────────────────────────────────────────────────
 *
 * One component, four layouts, opinionated defaults. Every match-rendering
 * surface on the site (home hero, scores list, fixtures grid, match detail
 * related list) should use this instead of hand-rolling a fixture card.
 *
 * Design rules enforced:
 *
 *  1. **Server component.** No 'use client' — ships zero JS for list pages.
 *     Live-updating scores on the match detail page are a separate concern,
 *     handled by <LiveMatchScore>.
 *
 *  2. **Layout-keyed variants, NOT page-keyed.** Valid: variant="hero".
 *     Never: context="home-hero". The component has no idea where it's used.
 *
 *  3. **Small modifier surface.** 5 booleans only (showLeague, showVenue,
 *     showStatus, highlightLive, showActions). Each has a per-variant
 *     default so most pages pass zero modifiers.
 *
 *  4. **One data shape.** Always consumes MatchData (the normalised shape
 *     used by every fetcher in lib/api-football and every method on
 *     footballData.*). Data shaping stays outside the component.
 *
 *  5. **No arbitrary styling props.** `className` exists only for
 *     positioning the card inside a page layout (grid cell, flex item).
 *     Visual style is 100% variant-driven.
 *
 * Adding a new variant requires updating:
 *   - MatchCardVariant type
 *   - DEFAULT_MODIFIERS map
 *   - the switch at the bottom of the component
 * Nothing else.
 */

import Link from 'next/link'
import Image from 'next/image'
import type { MatchData } from '@/lib/data/placeholderData'

// ── Types ────────────────────────────────────────────────────────────────

export type MatchCardVariant = 'compact' | 'default' | 'hero' | 'list-row'

export interface MatchCardProps {
  /** Normalised match payload. Produced by every footballData.* list method. */
  match: MatchData

  /** Layout variant. Drives geometry, typography, spacing. */
  variant?: MatchCardVariant

  /** i18n path prefix for the match link (e.g. '' for English, '/fr' for French). */
  langPrefix?: string

  /** Positioning-only className (grid cell, flex item). No styling overrides. */
  className?: string

  // ── Boolean modifiers (each has a per-variant default) ──

  /** Show competition + matchday label. */
  showLeague?: boolean
  /** Show venue + city. */
  showVenue?: boolean
  /** Show match status chip (LIVE / HT / FT / kickoff). */
  showStatus?: boolean
  /** Highlight live matches with a green border + pulsing dot. */
  highlightLive?: boolean
  /** Render a "View match" CTA button. */
  showActions?: boolean
}

// ── Per-variant modifier defaults ────────────────────────────────────────

interface Modifiers {
  showLeague: boolean
  showVenue: boolean
  showStatus: boolean
  highlightLive: boolean
  showActions: boolean
}

const DEFAULT_MODIFIERS: Record<MatchCardVariant, Modifiers> = {
  hero: {
    showLeague: true,
    showVenue: true,
    showStatus: true,
    highlightLive: true,
    showActions: true,
  },
  default: {
    showLeague: true,
    showVenue: true,
    showStatus: true,
    highlightLive: true,
    showActions: false,
  },
  compact: {
    showLeague: false,
    showVenue: false,
    showStatus: true,
    highlightLive: true,
    showActions: false,
  },
  'list-row': {
    showLeague: true,
    showVenue: false,
    showStatus: true,
    highlightLive: true,
    showActions: false,
  },
}

// ── Internal derived state ───────────────────────────────────────────────

interface DerivedMatchState {
  isLive: boolean
  isDone: boolean
  isUpcoming: boolean
  homeWon: boolean
  awayWon: boolean
  statusLabel: string
  leagueLabel: string
}

function deriveState(match: MatchData): DerivedMatchState {
  const isLive = match.status === 'LIVE' || match.status === 'HT'
  const isDone = match.status === 'FT'
  const isUpcoming = match.status === 'NS' || match.status === 'PST'
  const homeScore = match.home.score ?? 0
  const awayScore = match.away.score ?? 0
  const homeWon = isDone && homeScore > awayScore
  const awayWon = isDone && awayScore > homeScore

  const statusLabel = isLive
    ? match.status === 'HT'
      ? 'HT'
      : match.elapsed != null
        ? `${match.elapsed}'`
        : 'LIVE'
    : isDone
      ? 'FT'
      : match.status === 'PST'
        ? 'POSTPONED'
        : match.time

  const roundShort = match.round?.replace('Regular Season - ', 'MD ') ?? ''
  const leagueLabel = roundShort
    ? `${match.competition} · ${roundShort}`
    : match.competition

  return { isLive, isDone, isUpcoming, homeWon, awayWon, statusLabel, leagueLabel }
}

// ── Small inline subcomponents (shared across variants) ─────────────────

function LeagueLabel({ text, align = 'left' }: { text: string; align?: 'left' | 'center' }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--text-faint)',
        textAlign: align,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  )
}

function LiveDot() {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        width: 5,
        height: 5,
        borderRadius: '50%',
        background: 'var(--live)',
        animation: 'pulse 1.4s ease-in-out infinite',
        verticalAlign: 'middle',
      }}
    />
  )
}

function StatusChip({ state }: { state: DerivedMatchState }) {
  const { isLive, isDone, statusLabel } = state
  const color = isLive
    ? 'var(--live)'
    : isDone
      ? 'var(--text-faint)'
      : 'var(--green)'

  return (
    <span
      aria-live={isLive ? 'polite' : 'off'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color,
        lineHeight: 1,
      }}
    >
      {isLive && <LiveDot />}
      {statusLabel}
    </span>
  )
}

function TeamRow({
  name,
  logo,
  score,
  won,
  iconSize = 20,
  boldName = true,
}: {
  name: string
  logo?: string
  score?: number | null
  won?: boolean
  iconSize?: number
  boldName?: boolean
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
      {logo && (
        <Image
          src={logo}
          alt={name}
          width={iconSize}
          height={iconSize}
          style={{ objectFit: 'contain', flexShrink: 0 }}
          unoptimized
        />
      )}
      <span
        style={{
          flex: 1,
          fontFamily: 'var(--font-head)',
          fontSize: 14,
          fontWeight: boldName && won ? 800 : 600,
          color: won ? 'var(--text)' : 'var(--text-sec)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </span>
      {score != null && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--text)',
            flexShrink: 0,
            minWidth: 18,
            textAlign: 'right',
          }}
        >
          {score}
        </span>
      )}
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────

export function MatchCard({
  match,
  variant = 'default',
  langPrefix = '',
  className,
  showLeague,
  showVenue,
  showStatus,
  highlightLive,
  showActions,
}: MatchCardProps) {
  const defaults = DEFAULT_MODIFIERS[variant]
  const mod: Modifiers = {
    showLeague: showLeague ?? defaults.showLeague,
    showVenue: showVenue ?? defaults.showVenue,
    showStatus: showStatus ?? defaults.showStatus,
    highlightLive: highlightLive ?? defaults.highlightLive,
    showActions: showActions ?? defaults.showActions,
  }

  const state = deriveState(match)
  const href = `${langPrefix}/matches/${match.id}`
  const liveAccent = mod.highlightLive && state.isLive

  // ── Variant: hero ─────────────────────────────────────────────────────
  if (variant === 'hero') {
    return (
      <Link
        href={href}
        className={className}
        aria-label={`${match.home.name} vs ${match.away.name}`}
        style={{
          display: 'block',
          textDecoration: 'none',
          background: liveAccent
            ? 'linear-gradient(135deg, #041a04 0%, #0a0a0a 100%)'
            : 'var(--card)',
          border: liveAccent ? '1px solid var(--green)' : '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 20px',
          position: 'relative',
          overflow: 'hidden',
          color: liveAccent ? '#ffffff' : 'var(--text)',
        }}
      >
        {mod.showLeague && (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textAlign: 'center',
              color: liveAccent ? 'var(--green-bright)' : 'var(--text-faint)',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            {liveAccent && <LiveDot />}
            {state.leagueLabel}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
          }}
        >
          {/* Home */}
          <div style={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
            {match.home.logo && (
              <Image
                src={match.home.logo}
                alt={match.home.name}
                width={44}
                height={44}
                style={{ objectFit: 'contain', margin: '0 auto' }}
                unoptimized
              />
            )}
            <div
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: 14,
                fontWeight: state.homeWon ? 800 : 700,
                color: liveAccent ? '#ffffff' : 'var(--text)',
                marginTop: 8,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {match.home.name}
            </div>
          </div>

          {/* Score / kickoff */}
          <div style={{ textAlign: 'center', flexShrink: 0, minWidth: 96 }}>
            {state.isLive || state.isDone ? (
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 32,
                  fontWeight: 700,
                  lineHeight: 1,
                  color: liveAccent ? 'var(--green-bright)' : 'var(--text)',
                }}
              >
                {match.home.score ?? 0} – {match.away.score ?? 0}
              </div>
            ) : (
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 28,
                  fontWeight: 700,
                  lineHeight: 1,
                  color: 'var(--green)',
                }}
              >
                {match.time}
              </div>
            )}
            {mod.showStatus && (
              <div style={{ marginTop: 8 }}>
                <StatusChip state={state} />
              </div>
            )}
            {!mod.showStatus && !(state.isLive || state.isDone) && (
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--text-faint)',
                  marginTop: 6,
                }}
              >
                {match.date}
              </div>
            )}
          </div>

          {/* Away */}
          <div style={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
            {match.away.logo && (
              <Image
                src={match.away.logo}
                alt={match.away.name}
                width={44}
                height={44}
                style={{ objectFit: 'contain', margin: '0 auto' }}
                unoptimized
              />
            )}
            <div
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: 14,
                fontWeight: state.awayWon ? 800 : 700,
                color: liveAccent ? '#ffffff' : 'var(--text)',
                marginTop: 8,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {match.away.name}
            </div>
          </div>
        </div>

        {mod.showVenue && match.venue && (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: liveAccent ? 'rgba(255,255,255,0.45)' : 'var(--text-faint)',
              textAlign: 'center',
              marginTop: 14,
            }}
          >
            {match.venue}
          </div>
        )}

        {mod.showActions && (
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-head)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: liveAccent ? '#0a0a0a' : '#ffffff',
                background: liveAccent ? 'var(--green-bright)' : 'var(--green)',
              }}
            >
              View Match →
            </span>
          </div>
        )}
      </Link>
    )
  }

  // ── Variant: compact ──────────────────────────────────────────────────
  if (variant === 'compact') {
    return (
      <Link
        href={href}
        className={className}
        aria-label={`${match.home.name} vs ${match.away.name}`}
        style={{
          display: 'block',
          textDecoration: 'none',
          background: 'var(--card)',
          border: `1px solid ${liveAccent ? 'var(--green)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)',
          padding: '12px 14px',
          minWidth: 180,
        }}
      >
        {mod.showStatus && (
          <div style={{ marginBottom: 6 }}>
            <StatusChip state={state} />
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <TeamRow
            name={match.home.shortName || match.home.name}
            logo={match.home.logo}
            score={state.isLive || state.isDone ? match.home.score : undefined}
            won={state.homeWon}
          />
          <TeamRow
            name={match.away.shortName || match.away.name}
            logo={match.away.logo}
            score={state.isLive || state.isDone ? match.away.score : undefined}
            won={state.awayWon}
          />
        </div>
        {!state.isLive && !state.isDone && (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-faint)',
              marginTop: 8,
              textAlign: 'right',
            }}
          >
            {match.time} · {match.date}
          </div>
        )}
      </Link>
    )
  }

  // ── Variant: list-row ─────────────────────────────────────────────────
  if (variant === 'list-row') {
    return (
      <Link
        href={href}
        className={className}
        aria-label={`${match.home.name} vs ${match.away.name}`}
        style={{
          display: 'block',
          textDecoration: 'none',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          borderLeft: liveAccent ? '3px solid var(--green)' : '3px solid transparent',
          transition: 'background var(--t-fast)',
          background: 'var(--card)',
          minHeight: 72,
        }}
      >
        {mod.showLeague && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
              gap: 8,
            }}
          >
            <LeagueLabel text={state.leagueLabel} />
            {mod.showStatus && <StatusChip state={state} />}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Teams stacked */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <TeamRow
              name={match.home.name}
              logo={match.home.logo}
              won={state.homeWon}
              iconSize={20}
            />
            <TeamRow
              name={match.away.name}
              logo={match.away.logo}
              won={state.awayWon}
              iconSize={20}
            />
          </div>

          {/* Score / kickoff column */}
          <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 56 }}>
            {state.isLive || state.isDone ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 16,
                    fontWeight: 700,
                    color: state.isLive ? 'var(--live)' : 'var(--text)',
                    lineHeight: 1.3,
                  }}
                >
                  {match.home.score ?? 0}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 16,
                    fontWeight: 700,
                    color: state.isLive ? 'var(--live)' : 'var(--text)',
                    lineHeight: 1.3,
                  }}
                >
                  {match.away.score ?? 0}
                </span>
              </div>
            ) : (
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--green)',
                  lineHeight: 1.2,
                }}
              >
                {match.time}
              </div>
            )}
            {!mod.showLeague && mod.showStatus && (
              <div style={{ marginTop: 4 }}>
                <StatusChip state={state} />
              </div>
            )}
          </div>
        </div>

        {mod.showVenue && match.venue && (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-faint)',
              marginTop: 8,
            }}
          >
            {match.venue}
          </div>
        )}
      </Link>
    )
  }

  // ── Variant: default (card) ───────────────────────────────────────────
  return (
    <Link
      href={href}
      className={className}
      aria-label={`${match.home.name} vs ${match.away.name}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        background: 'var(--card)',
        border: `1px solid ${liveAccent ? 'var(--green)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        padding: '14px 16px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {mod.showLeague && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
            gap: 8,
          }}
        >
          <LeagueLabel text={state.leagueLabel} />
          {mod.showStatus && <StatusChip state={state} />}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <TeamRow
          name={match.home.name}
          logo={match.home.logo}
          score={state.isLive || state.isDone ? match.home.score : undefined}
          won={state.homeWon}
          iconSize={24}
        />
        <TeamRow
          name={match.away.name}
          logo={match.away.logo}
          score={state.isLive || state.isDone ? match.away.score : undefined}
          won={state.awayWon}
          iconSize={24}
        />
      </div>

      {!state.isLive && !state.isDone && (
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-faint)',
            marginTop: 10,
            textAlign: 'right',
          }}
        >
          {match.time} · {match.date}
        </div>
      )}

      {mod.showVenue && match.venue && (
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-faint)',
            marginTop: 8,
            paddingTop: 8,
            borderTop: '1px solid var(--border)',
          }}
        >
          {match.venue}
        </div>
      )}
    </Link>
  )
}
