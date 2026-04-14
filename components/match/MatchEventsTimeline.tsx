/**
 * <MatchEventsTimeline> — native chronological timeline of match events.
 *
 * Renders goals, cards, substitutions, VAR checks, and penalty misses from
 * `MatchDetail.events`, team-aligned (home events on the left, away on the
 * right) with minute markers.
 *
 * Empty state: polished placeholder ("No events yet" + short explanation)
 * rather than hiding the block — per §3 guardrail, pre-match pages should
 * still feel complete.
 *
 * This is a server component — zero client JS. The live polling loop in
 * <LiveMatchScore> re-renders this indirectly when state updates flow
 * through the page.
 */

import Image from 'next/image'
import type { MatchDetail } from '@/lib/data/types'
import type { Lang } from '@/lib/i18n/config'

// ── Types ────────────────────────────────────────────────────────────────

interface Props {
  match: MatchDetail
  lang?: Lang
}

// ── Localized labels ────────────────────────────────────────────────────

const LABELS: Record<Lang, {
  title: string
  emptyTitle: string
  emptyDesc: string
  assistedBy: string
}> = {
  en: {
    title: 'Timeline',
    emptyTitle: 'No events yet',
    emptyDesc: 'Goals, cards, and substitutions will appear here once the match begins.',
    assistedBy: 'Assist:',
  },
  ar: {
    title: 'الأحداث',
    emptyTitle: 'لا توجد أحداث بعد',
    emptyDesc: 'ستظهر الأهداف والبطاقات والتبديلات هنا بمجرد بدء المباراة.',
    assistedBy: 'تمريرة حاسمة:',
  },
  fr: {
    title: 'Temps forts',
    emptyTitle: 'Pas encore d\'événements',
    emptyDesc: 'Les buts, cartons et remplacements apparaîtront ici dès le coup d\'envoi.',
    assistedBy: 'Passeur:',
  },
}

// ── Event type helpers ─────────────────────────────────────────────────

interface EventVisual {
  icon: string
  color: string
  label: string
}

function eventVisual(type: string, detail: string): EventVisual {
  const t = type.toLowerCase()
  const d = detail.toLowerCase()

  if (t === 'goal') {
    if (d.includes('own goal')) return { icon: '⚽', color: 'var(--red)', label: 'Own goal' }
    if (d.includes('penalty')) return { icon: '⚽', color: 'var(--green)', label: 'Penalty' }
    if (d.includes('missed penalty')) return { icon: '✕', color: 'var(--text-faint)', label: 'Missed penalty' }
    return { icon: '⚽', color: 'var(--green)', label: 'Goal' }
  }
  if (t === 'card') {
    if (d.includes('red')) return { icon: '🟥', color: 'var(--red)', label: 'Red card' }
    if (d.includes('second yellow')) return { icon: '🟨🟥', color: 'var(--red)', label: 'Second yellow' }
    return { icon: '🟨', color: 'var(--gold)', label: 'Yellow card' }
  }
  if (t === 'subst' || t === 'substitution') {
    return { icon: '⇄', color: 'var(--text-sec)', label: 'Substitution' }
  }
  if (t === 'var') {
    return { icon: '📺', color: 'var(--text-sec)', label: 'VAR' }
  }
  return { icon: '•', color: 'var(--text-faint)', label: type }
}

// ── Component ───────────────────────────────────────────────────────────

export function MatchEventsTimeline({ match, lang = 'en' }: Props) {
  const L = LABELS[lang] ?? LABELS.en
  const events = match.events ?? []
  const homeTeamId = match.teams.home.id

  // Sort chronologically — API-Football usually returns in order but defensive
  // sort against extra-time-first sorting or mixed streams.
  const sorted = [...events].sort((a, b) => {
    const timeA = a.time.elapsed * 100 + (a.time.extra ?? 0)
    const timeB = b.time.elapsed * 100 + (b.time.extra ?? 0)
    return timeA - timeB
  })

  return (
    <section
      aria-label={L.title}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      {/* Section header */}
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--card-alt)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text)',
            margin: 0,
          }}
        >
          {L.title}
        </h2>
      </div>

      {sorted.length === 0 ? (
        <EmptyPlaceholder title={L.emptyTitle} description={L.emptyDesc} />
      ) : (
        <div style={{ padding: '8px 0' }}>
          {sorted.map((event, i) => {
            const isHome = event.team.id === homeTeamId
            const visual = eventVisual(event.type, event.detail)
            const minute = `${event.time.elapsed}${event.time.extra ? `+${event.time.extra}` : ''}'`

            return (
              <div
                key={`${i}-${event.time.elapsed}-${event.player.id}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 44px 1fr',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 16px',
                  borderBottom: i < sorted.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                {/* Home side */}
                <div
                  style={{
                    textAlign: 'right',
                    minWidth: 0,
                    opacity: isHome ? 1 : 0.35,
                  }}
                >
                  {isHome && (
                    <EventRow
                      visual={visual}
                      playerName={event.player.name}
                      detail={event.detail}
                      align="right"
                      assistLabel={L.assistedBy}
                      assistName={event.assist?.name ?? null}
                    />
                  )}
                </div>

                {/* Minute marker */}
                <div
                  style={{
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--text-sec)',
                    letterSpacing: '0.03em',
                    background: 'var(--card-alt)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '4px 0',
                    minWidth: 36,
                  }}
                >
                  {minute}
                </div>

                {/* Away side */}
                <div
                  style={{
                    textAlign: 'left',
                    minWidth: 0,
                    opacity: !isHome ? 1 : 0.35,
                  }}
                >
                  {!isHome && (
                    <EventRow
                      visual={visual}
                      playerName={event.player.name}
                      detail={event.detail}
                      align="left"
                      assistLabel={L.assistedBy}
                      assistName={event.assist?.name ?? null}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

// ── Subcomponents ───────────────────────────────────────────────────────

function EventRow({
  visual,
  playerName,
  detail,
  align,
  assistLabel,
  assistName,
}: {
  visual: EventVisual
  playerName: string
  detail: string
  align: 'left' | 'right'
  assistLabel: string
  assistName: string | null
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
        gap: 8,
        flexDirection: align === 'right' ? 'row-reverse' : 'row',
      }}
    >
      <span
        aria-hidden
        style={{
          fontSize: 13,
          flexShrink: 0,
          color: visual.color,
        }}
      >
        {visual.icon}
      </span>
      <div
        style={{
          minWidth: 0,
          textAlign: align,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {playerName}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--text-faint)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {detail}
          {assistName && (
            <>
              {' · '}
              <span style={{ textTransform: 'none', color: 'var(--text-sec)' }}>
                {assistLabel} {assistName}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div
      style={{
        padding: '36px 20px',
        textAlign: 'center',
      }}
    >
      <div
        aria-hidden
        style={{
          fontSize: 28,
          marginBottom: 10,
          opacity: 0.5,
        }}
      >
        ⏱
      </div>
      <div
        style={{
          fontFamily: 'var(--font-head)',
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--text)',
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          color: 'var(--text-sec)',
          maxWidth: 360,
          margin: '0 auto',
          lineHeight: 1.5,
        }}
      >
        {description}
      </div>
    </div>
  )
}
