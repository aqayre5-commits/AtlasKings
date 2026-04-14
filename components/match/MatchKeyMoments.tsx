/**
 * <MatchKeyMoments> — post-match narrative summary.
 *
 * Renders the top 3-5 most significant events as a short "key moments"
 * recap. Significance ranking: goals first, then red cards, then yellow
 * cards and substitutions as filler if space remains.
 *
 * Only renders when the match is finished (FT / AET / PEN). During live
 * or pre-match states the <MatchEventsTimeline> handles event display.
 *
 * Pure server component.
 */

import type { MatchDetail } from '@/lib/data/types'
import type { Lang } from '@/lib/i18n/config'

interface Props {
  match: MatchDetail
  lang?: Lang
}

const LABELS: Record<Lang, {
  title: string
  kicker: string
}> = {
  en: {
    title: 'Key Moments',
    kicker: 'Match Report',
  },
  ar: {
    title: 'اللحظات الحاسمة',
    kicker: 'تقرير المباراة',
  },
  fr: {
    title: 'Temps forts',
    kicker: 'Résumé du match',
  },
}

// Significance score — higher is more important.
function significance(event: MatchDetail['events'][number]): number {
  const type = event.type.toLowerCase()
  const detail = event.detail.toLowerCase()
  if (type === 'goal') {
    if (detail.includes('missed penalty')) return 5
    return 10
  }
  if (type === 'card') {
    if (detail.includes('red')) return 8
    if (detail.includes('second yellow')) return 7
    return 2
  }
  if (type === 'subst' || type === 'substitution') return 1
  if (type === 'var') return 3
  return 0
}

function eventIcon(event: MatchDetail['events'][number]): string {
  const type = event.type.toLowerCase()
  const detail = event.detail.toLowerCase()
  if (type === 'goal') return detail.includes('own goal') ? '⚽' : '⚽'
  if (type === 'card') return detail.includes('red') ? '🟥' : '🟨'
  if (type === 'subst' || type === 'substitution') return '⇄'
  return '•'
}

export function MatchKeyMoments({ match, lang = 'en' }: Props) {
  const L = LABELS[lang] ?? LABELS.en
  const events = match.events ?? []

  // Rank by significance, then chronological within the same score.
  const ranked = [...events]
    .map((e, originalIndex) => ({ e, originalIndex, score: significance(e) }))
    .filter(r => r.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.originalIndex - b.originalIndex
    })
    .slice(0, 5)
    // Resort the top-5 chronologically for narrative flow
    .sort((a, b) => a.originalIndex - b.originalIndex)
    .map(r => r.e)

  if (ranked.length === 0) return null

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
      <div
        style={{
          padding: '14px 18px 12px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--card-alt)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--green)',
            marginBottom: 4,
          }}
        >
          {L.kicker}
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text)',
            margin: 0,
          }}
        >
          {L.title}
        </h2>
      </div>

      <ol
        style={{
          listStyle: 'none',
          margin: 0,
          padding: '8px 0',
        }}
      >
        {ranked.map((event, i) => {
          const minute = `${event.time.elapsed}${event.time.extra ? `+${event.time.extra}` : ''}'`
          return (
            <li
              key={`${i}-${event.time.elapsed}-${event.player.id}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                padding: '12px 18px',
                borderBottom: i < ranked.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--text-sec)',
                  background: 'var(--card-alt)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 8px',
                  minWidth: 44,
                  textAlign: 'center',
                  flexShrink: 0,
                }}
              >
                {minute}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 2,
                  }}
                >
                  <span aria-hidden style={{ fontSize: 13, flexShrink: 0 }}>
                    {eventIcon(event)}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 14,
                      fontWeight: 700,
                      color: 'var(--text)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {event.player.name}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'var(--text-faint)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {event.detail} · {event.team.name}
                  {event.assist?.name && ` · Assist: ${event.assist.name}`}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
