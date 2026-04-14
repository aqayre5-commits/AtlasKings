import Link from 'next/link'
import { TeamLogo } from '@/components/ui/TeamLogo'
import type { FixtureLite } from '@/types/world-cup'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'

interface Props {
  matches: FixtureLite[]
  langPrefix: string
  /** Locale for the "Live now" section label. Defaults to 'en'. */
  lang?: Lang
}

export function LiveMatchRail({ matches, langPrefix, lang = 'en' }: Props) {
  if (matches.length === 0) return null
  const t = getTranslations(lang)

  const liveLabel = t.sections?.liveNow ?? 'Live Now'
  return (
    <section aria-label={liveLabel}>
      {/* Section header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
      }}>
        <span style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--live)',
          animation: 'pulse 1.4s ease-in-out infinite',
          flexShrink: 0,
        }} />
        <h2 style={{
          fontFamily: 'var(--font-head)',
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--text)',
          margin: 0,
        }}>
          {liveLabel}
        </h2>
      </div>

      {/* Horizontal scroll rail */}
      <div style={{
        display: 'flex',
        gap: 12,
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: 8,
        scrollbarWidth: 'none',
      }}>
        {matches.map(match => {
          const isLive = match.status === 'LIVE' || match.status === 'HT'

          return (
            <Link
              key={match.id}
              href={`${langPrefix}/world-cup/matches/${match.id}`}
              style={{
                display: 'block',
                textDecoration: 'none',
                flexShrink: 0,
                width: 200,
                background: 'var(--card)',
                border: '1px solid var(--green)',
                borderRadius: 'var(--radius)',
                padding: 14,
                position: 'relative',
                minHeight: 'var(--tap-min)',
              }}
            >
              {/* LIVE badge */}
              {isLive && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  marginBottom: 10,
                }}>
                  <span style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: 'var(--live)',
                    animation: 'pulse 1.4s ease-in-out infinite',
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    fontWeight: 700,
                    color: 'var(--live)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}>
                    {match.status === 'HT' ? 'Half Time' : 'LIVE'}
                  </span>
                </div>
              )}

              {/* Home team */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 6,
              }}>
                <TeamLogo src={match.homeTeam.flagUrl} alt={match.homeTeam.name} size={18} />
                <span style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--text)',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {match.homeTeam.shortName || match.homeTeam.name}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--green-bright)',
                }}>
                  {match.homeScore ?? '-'}
                </span>
              </div>

              {/* Away team */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <TeamLogo src={match.awayTeam.flagUrl} alt={match.awayTeam.name} size={18} />
                <span style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--text)',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {match.awayTeam.shortName || match.awayTeam.name}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--green-bright)',
                }}>
                  {match.awayScore ?? '-'}
                </span>
              </div>

              {/* Stage / Group */}
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-sec)',
                marginTop: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                {match.roundLabel}{match.group ? ` \u00B7 ${match.group}` : ''}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
