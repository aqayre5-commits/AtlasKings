'use client'

/**
 * <LiveMatchScore> — canonical match-detail header.
 *
 * This is the SINGLE score/status renderer for /matches/[id]. There is no
 * secondary bespoke header anywhere on the page; this primitive owns the
 * top-of-page presentation entirely.
 *
 * Data plumbing:
 *   - First paint comes from `initial` (server-rendered via footballData.match()).
 *   - Hydration kicks in the useLiveMatch hook, which polls /api/live/[id]
 *     every 20s while LIVE, every 5min while upcoming, and stops once FT.
 *   - Hidden tabs pause polling via the Page Visibility API.
 *
 * Visual tone (§3 guardrail): calm, premium, readable first. No pulsing red
 * backgrounds, no shouting. Live state is signalled by a small green dot +
 * elapsed minute chip. The card stays white on a neutral border. Morocco
 * matches add a thin red/green/red flag stripe and a subtle green border
 * accent, but the card body stays calm.
 */

import Image from 'next/image'
import { useLiveMatch } from '@/lib/data/live'
import type { MatchDetail } from '@/lib/data/types'
import type { Lang } from '@/lib/i18n/config'

// ── Types ────────────────────────────────────────────────────────────────

export interface LiveMatchScoreProps {
  matchId: string | number
  initial?: MatchDetail | null
  /** Language for localized labels (kickoff time, status text). */
  lang?: Lang
  /** When true, renders the Morocco variant (red/green/red stripe + green accent). */
  moroccoMatch?: boolean
  /** Optional className for positioning. */
  className?: string
}

// ── Localized labels ────────────────────────────────────────────────────

const LABELS: Record<Lang, Record<string, string>> = {
  en: {
    live: 'LIVE',
    halfTime: 'HT',
    fullTime: 'FT',
    aet: 'AET',
    pen: 'PEN',
    kickoff: 'KICK-OFF',
    scheduled: 'Scheduled',
    finalScore: 'Full Time',
    halfTimeScore: 'HT',
    extraTime: 'AET',
    penalties: 'PEN',
    venue: 'Venue',
    referee: 'Referee',
    round: 'Round',
    atlasLions: 'ATLAS LIONS',
    updated: 'Updated',
    secondsAgo: 's ago',
  },
  ar: {
    live: 'مباشر',
    halfTime: 'استراحة',
    fullTime: 'نهاية',
    aet: 'وقت إضافي',
    pen: 'ركلات ترجيح',
    kickoff: 'انطلاق',
    scheduled: 'مجدولة',
    finalScore: 'نهاية المباراة',
    halfTimeScore: 'استراحة',
    extraTime: 'وقت إضافي',
    penalties: 'ركلات ترجيح',
    venue: 'الملعب',
    referee: 'الحكم',
    round: 'الجولة',
    atlasLions: 'أسود الأطلس',
    updated: 'آخر تحديث',
    secondsAgo: 'ث',
  },
  fr: {
    live: 'EN DIRECT',
    halfTime: 'MT',
    fullTime: 'TF',
    aet: 'AP',
    pen: 'TAB',
    kickoff: "COUP D'ENVOI",
    scheduled: 'Programmé',
    finalScore: 'Temps réglementaire',
    halfTimeScore: 'Mi-temps',
    extraTime: 'Après prolongation',
    penalties: 'Tirs au but',
    venue: 'Stade',
    referee: 'Arbitre',
    round: 'Journée',
    atlasLions: "LIONS DE L'ATLAS",
    updated: 'Mis à jour',
    secondsAgo: 's',
  },
}

// ── Helpers ─────────────────────────────────────────────────────────────

function formatKickoff(dateIso: string, lang: Lang): { time: string; date: string } {
  const d = new Date(dateIso)
  const locale = lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-GB'
  return {
    time: d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
    date: d.toLocaleDateString(locale, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }),
  }
}

function cleanRound(round: string | undefined): string {
  if (!round) return ''
  return round
    .replace('Regular Season - ', 'MD ')
    .replace('Group Stage - ', 'Group ')
}

// ── Component ───────────────────────────────────────────────────────────

export function LiveMatchScore({
  matchId,
  initial,
  lang = 'en',
  moroccoMatch = false,
  className,
}: LiveMatchScoreProps) {
  const { match, isLive, lastUpdated, error } = useLiveMatch(matchId, initial)
  const L = LABELS[lang] ?? LABELS.en

  // Placeholder card for first-render edge cases (never seen in practice
  // because the server always passes `initial`, but we handle it cleanly).
  if (!match) {
    return (
      <div
        data-match-header
        className={className}
        style={{
          padding: 28,
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--card)',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--text-faint)',
        }}
      >
        {error ? `Unable to load match — ${error}` : 'Loading match…'}
      </div>
    )
  }

  const status = match.fixture.status.short
  const isDone = ['FT', 'AET', 'PEN'].includes(status)
  const isHalfTime = status === 'HT'
  const homeScore = match.goals.home ?? 0
  const awayScore = match.goals.away ?? 0
  const homeWon = isDone && homeScore > awayScore
  const awayWon = isDone && awayScore > homeScore
  const elapsed = match.fixture.status.elapsed
  const kickoff = formatKickoff(match.fixture.date, lang)

  // Compute the center block that sits between the two team columns.
  // Priority: kickoff time (NS) → big score (live/FT) → final-whistle status.
  const showScore = isLive || isDone || isHalfTime

  // Status chip text (below the score)
  let statusChipText: string
  if (isLive && !isHalfTime && elapsed != null) {
    statusChipText = `${L.live} · ${elapsed}'`
  } else if (isHalfTime) {
    statusChipText = L.halfTime
  } else if (status === 'AET') {
    statusChipText = `${L.fullTime} (${L.aet})`
  } else if (status === 'PEN') {
    statusChipText = `${L.fullTime} (${L.pen})`
  } else if (isDone) {
    statusChipText = L.fullTime
  } else {
    statusChipText = L.scheduled
  }

  // Card border + flag stripe config — Morocco matches get the green accent.
  const borderColor = moroccoMatch ? 'var(--green)' : 'var(--border)'

  return (
    <div
      data-match-header
      className={className}
      style={{
        position: 'relative',
        background: 'var(--card)',
        border: `1px solid ${borderColor}`,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      {/* Morocco variant: red/green/red flag stripe at the top */}
      {moroccoMatch && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background:
              'linear-gradient(90deg, #c1121f 0%, #c1121f 33%, #0a5229 33%, #0a5229 66%, #c1121f 66%)',
          }}
        />
      )}

      {/* Competition kicker bar */}
      <div
        style={{
          padding: moroccoMatch ? '14px 16px 10px' : '12px 16px 10px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--card-alt)',
          textAlign: 'center',
        }}
      >
        {moroccoMatch && (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--green-bright)',
              marginBottom: 4,
            }}
          >
            🇲🇦 {L.atlasLions}
          </div>
        )}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-sec)',
          }}
        >
          {match.league.name}
          {match.league.round ? ` · ${cleanRound(match.league.round)}` : ''}
        </div>
      </div>

      {/* Main score block */}
      <div
        style={{
          padding: '28px 20px 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
        }}
      >
        {/* Home team */}
        <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            {match.teams.home.logo && (
              <Image
                src={match.teams.home.logo}
                alt={match.teams.home.name}
                width={56}
                height={56}
                style={{ objectFit: 'contain' }}
                unoptimized
                priority
              />
            )}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 'clamp(13px, 3.2vw, 17px)',
              fontWeight: homeWon ? 800 : 700,
              color: homeWon || !isDone ? 'var(--text)' : 'var(--text-sec)',
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {match.teams.home.name}
          </div>
        </div>

        {/* Center: score or kickoff time */}
        <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 100 }}>
          {showScore ? (
            <>
              <div
                aria-live={isLive ? 'polite' : 'off'}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(34px, 8.5vw, 46px)',
                  fontWeight: 700,
                  color: 'var(--text)',
                  lineHeight: 1,
                  letterSpacing: '0.02em',
                }}
              >
                {homeScore}
                <span style={{ padding: '0 10px', color: 'var(--text-faint)' }}>–</span>
                {awayScore}
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  marginTop: 10,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: isLive ? 'var(--green)' : 'var(--text-faint)',
                }}
              >
                {isLive && (
                  <span
                    aria-hidden
                    style={{
                      display: 'inline-block',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: 'var(--green)',
                      animation: 'pulse 1.4s ease-in-out infinite',
                    }}
                  />
                )}
                {statusChipText}
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(28px, 6.5vw, 36px)',
                  fontWeight: 700,
                  color: 'var(--green)',
                  lineHeight: 1,
                }}
              >
                {kickoff.time}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-faint)',
                }}
              >
                {kickoff.date}
              </div>
            </>
          )}
        </div>

        {/* Away team */}
        <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            {match.teams.away.logo && (
              <Image
                src={match.teams.away.logo}
                alt={match.teams.away.name}
                width={56}
                height={56}
                style={{ objectFit: 'contain' }}
                unoptimized
                priority
              />
            )}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 'clamp(13px, 3.2vw, 17px)',
              fontWeight: awayWon ? 800 : 700,
              color: awayWon || !isDone ? 'var(--text)' : 'var(--text-sec)',
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {match.teams.away.name}
          </div>
        </div>
      </div>

      {/* Score breakdown row — only for finished matches with non-trivial structure */}
      {isDone && shouldShowBreakdown(match) && (
        <div
          style={{
            padding: '10px 16px',
            background: 'var(--card-alt)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'center',
            gap: 18,
            flexWrap: 'wrap',
          }}
        >
          {match.score.halftime.home != null && (
            <BreakdownEntry
              label={L.halfTimeScore}
              home={match.score.halftime.home}
              away={match.score.halftime.away}
            />
          )}
          {status === 'AET' && match.score.extratime?.home != null && (
            <BreakdownEntry
              label={L.extraTime}
              home={match.score.extratime.home}
              away={match.score.extratime.away}
            />
          )}
          {status === 'PEN' && match.score.penalty?.home != null && (
            <BreakdownEntry
              label={L.penalties}
              home={match.score.penalty.home}
              away={match.score.penalty.away}
            />
          )}
        </div>
      )}

      {/* Venue + referee footer */}
      <div
        style={{
          padding: '10px 16px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          flexWrap: 'wrap',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-faint)',
        }}
      >
        {match.fixture.venue?.name && (
          <span>
            {L.venue}: {match.fixture.venue.name}
            {match.fixture.venue.city ? `, ${match.fixture.venue.city}` : ''}
          </span>
        )}
        {match.fixture.referee && (
          <span>
            {L.referee}: {match.fixture.referee}
          </span>
        )}
        {isLive && lastUpdated && (
          <span style={{ color: 'var(--green)' }}>
            {L.updated} {Math.max(0, Math.round((Date.now() - lastUpdated) / 1000))}
            {L.secondsAgo}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Small subcomponents ─────────────────────────────────────────────────

function BreakdownEntry({
  label,
  home,
  away,
}: {
  label: string
  home: number | null
  away: number | null
}) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--text-faint)',
        letterSpacing: '0.04em',
      }}
    >
      <span style={{ color: 'var(--text-sec)', fontWeight: 700 }}>{label}:</span>{' '}
      {home ?? 0}-{away ?? 0}
    </span>
  )
}

function shouldShowBreakdown(match: MatchDetail): boolean {
  return (
    match.score.halftime.home != null ||
    (match.score.extratime?.home != null && match.fixture.status.short === 'AET') ||
    (match.score.penalty?.home != null && match.fixture.status.short === 'PEN')
  )
}
