import Link from 'next/link'
import { TeamLogo } from '@/components/ui/TeamLogo'
import type { FixtureLite } from '@/types/world-cup'

interface Props {
  title: string
  fixtures: FixtureLite[]
  langPrefix: string
  lang?: string
}

function langToLocale(lang?: string): string {
  const map: Record<string, string> = {
    en: 'en-GB',
    ar: 'ar-MA',
    fr: 'fr-FR',
    es: 'es-ES',
    de: 'de-DE',
    pt: 'pt-BR',
  }
  return (lang && map[lang]) || 'en-GB'
}

function formatDate(dateStr: string, locale: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function FixturesPreview({ title, fixtures, langPrefix, lang }: Props) {
  const locale = langToLocale(lang)
  if (fixtures.length === 0) return null

  // Group fixtures by date
  const grouped = new Map<string, FixtureLite[]>()
  for (const f of fixtures) {
    const dateKey = new Date(f.dateUtc).toISOString().split('T')[0]
    const existing = grouped.get(dateKey) || []
    existing.push(f)
    grouped.set(dateKey, existing)
  }

  return (
    <section aria-label={title}>
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '10px 14px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--card-alt)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <div style={{ width: 4, height: 16, borderRadius: 2, background: 'var(--green)', flexShrink: 0 }} />
          <h3 style={{
            fontFamily: 'var(--font-head)',
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text)',
            margin: 0,
          }}>
            {title}
          </h3>
        </div>

        {/* Grouped fixtures */}
        {Array.from(grouped.entries()).map(([dateKey, dayFixtures]) => (
          <div key={dateKey}>
            {/* Date header */}
            <div style={{
              padding: '8px 14px',
              background: 'var(--card-alt)',
              borderBottom: '1px solid var(--border)',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--text-sec)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                {formatDate(dayFixtures[0].dateUtc, locale)}
              </span>
            </div>

            {/* Fixture cards */}
            {dayFixtures.map(fixture => {
              const isLive = fixture.status === 'LIVE' || fixture.status === 'HT'
              const isDone = fixture.status === 'FT' || fixture.status === 'AET' || fixture.status === 'PEN'

              return (
                <Link
                  key={fixture.id}
                  href={`${langPrefix}/world-cup/matches/${fixture.id}`}
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    padding: '12px 14px',
                    borderBottom: '1px solid var(--border)',
                    transition: 'background var(--t-fast)',
                    minHeight: 72,
                  }}
                >
                  {/* Stage badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--green)',
                      background: 'var(--green-light)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                    }}>
                      {fixture.roundLabel}{fixture.group ? ` \u00B7 ${fixture.group}` : ''}
                    </span>
                    {isLive && (
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--live)', animation: 'pulse 1.4s ease-in-out infinite' }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color: 'var(--live)' }}>LIVE</span>
                      </span>
                    )}
                  </div>

                  {/* Match row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Teams */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Home */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, minHeight: 28 }}>
                        <TeamLogo src={fixture.homeTeam.flagUrl} alt={fixture.homeTeam.name} size={18} />
                        <span style={{
                          fontFamily: 'var(--font-head)',
                          fontSize: 14,
                          fontWeight: 700,
                          color: 'var(--text)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {fixture.homeTeam.name}
                        </span>
                      </div>
                      {/* Away */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 28 }}>
                        <TeamLogo src={fixture.awayTeam.flagUrl} alt={fixture.awayTeam.name} size={18} />
                        <span style={{
                          fontFamily: 'var(--font-head)',
                          fontSize: 14,
                          fontWeight: 700,
                          color: 'var(--text)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {fixture.awayTeam.name}
                        </span>
                      </div>
                    </div>

                    {/* Score / Time */}
                    <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 56 }}>
                      {isLive || isDone ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 16,
                            fontWeight: 700,
                            color: isLive ? 'var(--live)' : 'var(--text)',
                            lineHeight: 1.3,
                          }}>
                            {fixture.homeScore ?? 0}
                          </span>
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 16,
                            fontWeight: 700,
                            color: isLive ? 'var(--live)' : 'var(--text)',
                            lineHeight: 1.3,
                          }}>
                            {fixture.awayScore ?? 0}
                          </span>
                        </div>
                      ) : (
                        <div style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 16,
                          fontWeight: 700,
                          color: 'var(--green)',
                          lineHeight: 1.2,
                        }}>
                          {formatTime(fixture.dateUtc)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Venue */}
                  {fixture.venue && (
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--text-faint)',
                      marginTop: 8,
                    }}>
                      {fixture.venue}, {fixture.city}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </div>
    </section>
  )
}
