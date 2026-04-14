'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'
import type { StandingRow } from '@/lib/data/placeholderData'

interface Props {
  lang?: Lang
  standings?: Record<string, { name: string; rows: StandingRow[] }>
}

export function StandingsTabs({ lang = 'en', standings }: Props) {
  const [active, setActive] = useState('pl')
  const t = getTranslations(lang)
  const st = t.ui.standings
  const p = lang === 'en' ? '' : `/${lang}`

  const TABS = [
    { id: 'pl',     label: lang === 'ar' ? 'الإنجليزي' : lang === 'fr' ? 'PL' : 'Prem',    href: `${p}/premier-league/table` },
    { id: 'botola', label: lang === 'ar' ? 'البطولة'   : 'Botola',  href: `${p}/botola-pro/table` },
    { id: 'laliga', label: lang === 'ar' ? 'الليغا'    : 'La Liga', href: `${p}/la-liga/table` },
  ]

  const tab = TABS.find(t => t.id === active)!
  const rows = standings?.[active]?.rows?.slice(0, 6) ?? []

  return (
    <div className="sidebar-card">
      <div className="sec-head">
        <div className="sec-bar b-navy"></div>
        <h2 className="c-navy">{st.title}</h2>
      </div>
      <div className="standings-tabs" role="tablist">
        {TABS.map(t => (
          <button key={t.id} role="tab" aria-selected={active === t.id} className={'s-tab' + (active === t.id ? ' active' : '')} onClick={() => setActive(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      {rows.length > 0 ? (
        <table className="standings-table">
          <thead>
            <tr>
              <th>{st.pos}</th>
              <th>{st.club}</th>
              <th>{st.played}</th>
              <th>{st.gd}</th>
              <th>{st.points}</th>
              <th>{st.form}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.team}>
                <td className="st-pos">{row.pos}</td>
                <td className="st-team">{row.team}</td>
                <td className="st-num">{row.played}</td>
                <td className="st-num">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                <td className="st-pts">{row.pts}</td>
                <td>
                  <span className="st-form">
                    {row.form.split('').map((r, i) => (
                      <i key={i} className={'fd ' + (r === 'W' ? 'fw' : r === 'L' ? 'fl' : 'fdraw')}></i>
                    ))}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{ padding: '24px 14px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>
          {t.ui.loadingStandings}
        </div>
      )}
      <div className="st-foot">
        <Link href={tab.href}>{t.sections.allStandings}</Link>
      </div>
    </div>
  )
}
