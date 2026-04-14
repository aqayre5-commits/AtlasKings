'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'

interface PlayerStat {
  player: { id: number; name: string; nationality: string; photo: string }
  statistics: Array<{
    team: { id: number; name: string; logo: string }
    games: { appearences: number }
    goals: { total: number; assists: number | null }
    cards: { yellow: number; red: number }
  }>
}

interface Props {
  title: string
  color: string
  lang: string
  langPrefix: string
  scorers: PlayerStat[]
  assists: PlayerStat[]
  yellowCards: PlayerStat[]
  redCards: PlayerStat[]
}

type TabKey = 'scorers' | 'assists' | 'yellow' | 'red'

const TAB_CONFIG: { key: TabKey; labelEn: string; labelAr: string; labelFr: string }[] = [
  { key: 'scorers', labelEn: 'Top Scorers', labelAr: 'الهدافون', labelFr: 'Buteurs' },
  { key: 'assists', labelEn: 'Top Assists', labelAr: 'صانعو الأهداف', labelFr: 'Passes décisives' },
  { key: 'yellow', labelEn: 'Yellow Cards', labelAr: 'بطاقات صفراء', labelFr: 'Cartons jaunes' },
  { key: 'red', labelEn: 'Red Cards', labelAr: 'بطاقات حمراء', labelFr: 'Cartons rouges' },
]

export function PlayerStatsPage({ title, color, lang, langPrefix, scorers, assists, yellowCards, redCards }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('scorers')
  const t = getTranslations((lang as Lang) || 'en')
  const p = langPrefix

  const dataMap: Record<TabKey, PlayerStat[]> = { scorers, assists, yellow: yellowCards, red: redCards }
  const data = dataMap[activeTab]

  // Column config per tab
  const getColumns = (tab: TabKey) => {
    switch (tab) {
      case 'scorers': return { stat: 'G', statFn: (s: PlayerStat) => s.statistics[0]?.goals.total ?? 0, secondary: 'A', secFn: (s: PlayerStat) => s.statistics[0]?.goals.assists ?? 0 }
      case 'assists': return { stat: 'A', statFn: (s: PlayerStat) => s.statistics[0]?.goals.assists ?? 0, secondary: 'G', secFn: (s: PlayerStat) => s.statistics[0]?.goals.total ?? 0 }
      case 'yellow': return { stat: '🟨', statFn: (s: PlayerStat) => s.statistics[0]?.cards.yellow ?? 0, secondary: 'Apps', secFn: (s: PlayerStat) => s.statistics[0]?.games.appearences ?? 0 }
      case 'red': return { stat: '🟥', statFn: (s: PlayerStat) => s.statistics[0]?.cards.red ?? 0, secondary: 'Apps', secFn: (s: PlayerStat) => s.statistics[0]?.games.appearences ?? 0 }
    }
  }
  const cols = getColumns(activeTab)

  return (
    <main>
      <div className="page-wrap">
        <div style={{ maxWidth: 720, margin: '0 auto' }}>

          {/* Tab bar */}
          <div style={{
            display: 'flex', gap: 8, padding: '10px 0',
            marginBottom: 0, overflowX: 'auto', WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}>
            {TAB_CONFIG.map(tab => {
              const label = lang === 'ar' ? tab.labelAr : lang === 'fr' ? tab.labelFr : tab.labelEn
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '7px 16px', border: isActive ? `1px solid ${color}` : '1px solid transparent',
                    cursor: 'pointer',
                    borderRadius: 'var(--radius)',
                    background: isActive ? color : 'transparent',
                    fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: isActive ? 800 : 600,
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                    color: isActive ? '#fff' : 'var(--text-sec)',
                    whiteSpace: 'nowrap', flexShrink: 0,
                    transition: 'all var(--t-fast)',
                    minHeight: 'var(--tap-min)',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* Leaderboard */}
          <div className="card" style={{ marginTop: 0, padding: 0, overflow: 'hidden' }}>
            {data.length === 0 ? (
              <div style={{ padding: '48px 20px', textAlign: 'center', fontFamily: 'var(--font-head)', fontSize: 14, color: 'var(--text-faint)' }}>
                {t.ui.loadingStandings}
              </div>
            ) : (
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--card-alt)' }}>
                      {['#', '', 'Player', 'Club', cols.stat, cols.secondary, 'Apps'].map((h, i) => (
                        <th key={`${h}-${i}`} style={{
                          fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
                          letterSpacing: '0.1em', color: 'var(--text-faint)', textTransform: 'uppercase',
                          textAlign: ['Player', 'Club'].includes(h) ? 'left' : 'center',
                          padding: '8px 6px', borderBottom: '1px solid var(--border)',
                          whiteSpace: 'nowrap',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(0, 20).map((s, i) => {
                      const stats = s.statistics[0]
                      return (
                        <tr
                          key={s.player.id}
                          style={{
                            background: i === 0 ? `${color}08` : undefined,
                            borderBottom: i < Math.min(data.length, 20) - 1 ? '1px solid var(--border)' : 'none',
                          }}
                        >
                          <td style={{ textAlign: 'center', padding: '10px 6px', minHeight: 'var(--tap-min)' }}>
                            <span style={{
                              fontFamily: 'var(--font-mono)', fontSize: 11,
                              color: i < 3 ? color : 'var(--text-faint)',
                              fontWeight: i < 3 ? 700 : 400,
                            }}>
                              {i + 1}
                            </span>
                          </td>
                          <td style={{ padding: '10px 6px' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', background: 'var(--card-alt)' }}>
                              <Image src={s.player.photo} alt={s.player.name} width={32} height={32} style={{ objectFit: 'cover' }} />
                            </div>
                          </td>
                          <td style={{ padding: '10px 6px', minWidth: 0 }}>
                            <Link href={`${p}/players/${s.player.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 'var(--tap-min)' }}>
                              <div style={{ fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 700, color: 'var(--text)', lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.player.name}</div>
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', marginTop: 3 }}>{s.player.nationality}</div>
                            </Link>
                          </td>
                          <td style={{ padding: '10px 6px' }}>
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-sec)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{stats?.team.name}</span>
                          </td>
                          <td style={{ textAlign: 'center', padding: '10px 6px' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 800, color }}>{cols.statFn(s)}</span>
                          </td>
                          <td style={{ textAlign: 'center', padding: '10px 6px' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-sec)' }}>{cols.secFn(s)}</span>
                          </td>
                          <td style={{ textAlign: 'center', padding: '10px 6px' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>{stats?.games.appearences ?? 0}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
