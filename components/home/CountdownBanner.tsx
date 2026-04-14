'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'

interface MatchInfo {
  homeTeam: string
  awayTeam: string
  date: string        // ISO date string
  competition: string
  round?: string
  venue?: string
}

interface Props {
  lang?: Lang
  match?: MatchInfo | null
}

export function CountdownBanner({ lang = 'en', match }: Props) {
  const [time, setTime] = useState({ d: '--', h: '--', m: '--', s: '--' })
  const t = getTranslations(lang)
  const m = t.ui.match
  const p = lang === 'en' ? '' : `/${lang}`

  useEffect(() => {
    if (!match) return
    const target = new Date(match.date).getTime()
    if (isNaN(target)) return

    const pad = (n: number) => String(n).padStart(2, '0')
    const tick = () => {
      const diff = Math.max(0, target - Date.now())
      if (diff === 0) return
      setTime({
        d: pad(Math.floor(diff / 86400000)),
        h: pad(Math.floor((diff % 86400000) / 3600000)),
        m: pad(Math.floor((diff % 3600000) / 60000)),
        s: pad(Math.floor((diff % 60000) / 1000)),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [match])

  // Don't render if no match or match is in the past
  if (!match) return null
  const target = new Date(match.date).getTime()
  if (isNaN(target) || target < Date.now()) return null

  const dateLabel = new Date(match.date).toLocaleDateString(
    lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-GB',
    { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }
  )

  return (
    <div className="card nm-banner">
      <div className="nm-banner-inner">
        <div className="nm-banner-left">
          <div className="nm-banner-meta">
            <span className="nm-banner-comp">{match.competition}{match.round ? ` · ${match.round}` : ''}</span>
            <span className="nm-banner-date">{dateLabel}{match.venue ? ` · ${match.venue}` : ''}</span>
          </div>
          <div className="nm-banner-teams">
            <div className="nm-banner-team">
              <div className="nm-banner-crest ph-ucl" />
              <span className="nm-banner-name">{match.homeTeam}</span>
            </div>
            <div className="nm-banner-vs">{m.vs}</div>
            <div className="nm-banner-team">
              <div className="nm-banner-crest ph-transfer" />
              <span className="nm-banner-name">{match.awayTeam}</span>
            </div>
          </div>
        </div>

        <div className="nm-banner-centre">
          <p className="nm-banner-kicks">{m.kicksOffIn}</p>
          <div className="nm-banner-clock">
            <div className="nm-clock-block">
              <span className="nm-clock-num">{time.d}</span>
              <span className="nm-clock-lbl">{m.days}</span>
            </div>
            <span className="nm-clock-sep">:</span>
            <div className="nm-clock-block">
              <span className="nm-clock-num">{time.h}</span>
              <span className="nm-clock-lbl">{m.hours}</span>
            </div>
            <span className="nm-clock-sep">:</span>
            <div className="nm-clock-block">
              <span className="nm-clock-num">{time.m}</span>
              <span className="nm-clock-lbl">{m.mins}</span>
            </div>
            <span className="nm-clock-sep">:</span>
            <div className="nm-clock-block">
              <span className="nm-clock-num">{time.s}</span>
              <span className="nm-clock-lbl">{m.secs}</span>
            </div>
          </div>
        </div>

        <div className="nm-banner-right">
          <div className="nm-banner-links">
            <Link href={`${p}/scores`} className="nm-banner-link">
              {lang === 'ar' ? 'النتائج' : lang === 'fr' ? 'Résultats' : 'Scores & Fixtures'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
