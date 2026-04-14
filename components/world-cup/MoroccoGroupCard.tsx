import Image from 'next/image'
import Link from 'next/link'
import { countryFlagUrl } from '@/lib/data/wc2026'

interface TeamRow {
  rank: number
  name: string
  code: string
  flagUrl: string
  played: number
  won: number
  drawn: number
  lost: number
  gf: number
  ga: number
  gd: number
  points: number
  isMorocco?: boolean
}

interface MoroccoFixture {
  opponent: string
  opponentCode: string
  opponentFlag: string
  date: string
  venue: string
  city: string
  isHome: boolean
  status: 'upcoming' | 'live' | 'finished'
  homeScore?: number
  awayScore?: number
}

interface Props {
  group: string
  teams: TeamRow[]
  fixtures: MoroccoFixture[]
  langPrefix: string
  lang?: string
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: { moroccoGroup: "MOROCCO'S GROUP", matchday: 'MATCHDAY', viewAll: 'Full Table', pts: 'PTS', team: 'TEAM', p: 'P', w: 'W', d: 'D', l: 'L', gd: 'GD', vs: 'vs', fixtures: "Morocco's Fixtures" },
  ar: { moroccoGroup: 'مجموعة المغرب', matchday: 'يوم المباراة', viewAll: 'الجدول الكامل', pts: 'نقاط', team: 'الفريق', p: 'لعب', w: 'فوز', d: 'تعادل', l: 'خسارة', gd: 'فارق', vs: 'ضد', fixtures: 'مباريات المغرب' },
  fr: { moroccoGroup: 'GROUPE DU MAROC', matchday: 'JOURNÉE', viewAll: 'Tableau complet', pts: 'PTS', team: 'ÉQUIPE', p: 'J', w: 'V', d: 'N', l: 'D', gd: 'DB', vs: 'vs', fixtures: 'Matchs du Maroc' },
}

export function MoroccoGroupCard({ group, teams, fixtures, langPrefix, lang = 'en' }: Props) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en

  return (
    <section aria-label={t.moroccoGroup}>
      <div style={{
        background: 'var(--card)',
        border: '2px solid var(--green)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '12px 16px',
          background: 'var(--green)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16 }}>🇲🇦</span>
            <h3 style={{
              fontFamily: 'var(--font-head)', fontSize: 14, fontWeight: 800,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: '#ffffff', margin: 0,
            }}>
              {t.moroccoGroup} · {group}
            </h3>
          </div>
          <Link href={`${langPrefix}/wc-2026/standings`} style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
            color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            {t.viewAll} →
          </Link>
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '8px 16px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, color: 'var(--text-faint)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {t.team}
              </th>
              <th style={{ width: 32, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, color: 'var(--text-faint)', padding: '8px 0' }}>{t.p}</th>
              <th style={{ width: 32, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, color: 'var(--text-faint)', padding: '8px 0' }}>{t.w}</th>
              <th style={{ width: 32, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, color: 'var(--text-faint)', padding: '8px 0' }}>{t.d}</th>
              <th style={{ width: 32, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, color: 'var(--text-faint)', padding: '8px 0' }}>{t.l}</th>
              <th style={{ width: 36, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, color: 'var(--text-faint)', padding: '8px 0' }}>{t.gd}</th>
              <th style={{ width: 36, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, color: 'var(--text-faint)', padding: '8px 4px' }}>{t.pts}</th>
            </tr>
          </thead>
          <tbody>
            {teams.map(row => (
              <tr
                key={row.code}
                style={{
                  borderBottom: '1px solid var(--border)',
                  background: row.isMorocco ? 'var(--green-light)' : 'transparent',
                  borderLeft: row.isMorocco ? '3px solid var(--green)' : '3px solid transparent',
                }}
              >
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--text-faint)', width: 16 }}>
                      {row.rank}
                    </span>
                    <Image
                      src={countryFlagUrl(row.code, 40)}
                      alt={`${row.name} flag`}
                      width={22}
                      height={14}
                      style={{ objectFit: 'cover', borderRadius: 2, boxShadow: '0 0 0 1px rgba(0,0,0,0.12)' }}
                      unoptimized
                    />
                    <span style={{
                      fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: row.isMorocco ? 800 : 700,
                      color: 'var(--text)',
                    }}>
                      {row.name}
                    </span>
                    {row.isMorocco && (
                      <span style={{ fontSize: 12 }}>🇲🇦</span>
                    )}
                  </div>
                </td>
                <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-sec)' }}>{row.played}</td>
                <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-sec)' }}>{row.won}</td>
                <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-sec)' }}>{row.drawn}</td>
                <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-sec)' }}>{row.lost}</td>
                <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-sec)' }}>
                  {row.gd > 0 ? `+${row.gd}` : row.gd}
                </td>
                <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                  {row.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Morocco's fixtures */}
        {fixtures.length > 0 && (
          <div style={{ borderTop: '2px solid var(--border)' }}>
            <div style={{
              padding: '10px 16px', background: 'var(--card-alt)',
              borderBottom: '1px solid var(--border)',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'var(--green)',
              }}>
                {t.fixtures}
              </span>
            </div>
            {fixtures.map((f, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 16px', borderBottom: i < fixtures.length - 1 ? '1px solid var(--border)' : 'none',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                  <Image
                    src={countryFlagUrl('MAR', 40)}
                    alt="Morocco"
                    width={22}
                    height={14}
                    style={{ objectFit: 'cover', borderRadius: 2, boxShadow: '0 0 0 1px rgba(0,0,0,0.12)' }}
                    unoptimized
                  />
                  <span style={{ fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                    Morocco
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>{t.vs}</span>
                  <Image
                    src={countryFlagUrl(f.opponentCode, 40)}
                    alt={f.opponent}
                    width={22}
                    height={14}
                    style={{ objectFit: 'cover', borderRadius: 2, boxShadow: '0 0 0 1px rgba(0,0,0,0.12)' }}
                    unoptimized
                  />
                  <span style={{ fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                    {f.opponent}
                  </span>
                </div>
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--green)' }}>
                    {new Date(f.date + 'T18:00:00').toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)' }}>
                    {f.city}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
