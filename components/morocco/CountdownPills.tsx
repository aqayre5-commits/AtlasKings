'use client'

import { useState, useEffect } from 'react'

interface Props {
  targetDate: string
  lang?: 'en' | 'ar' | 'fr'
}

const LABELS: Record<string, { days: string; hrs: string; min: string; announced: string }> = {
  en: { days: 'DAYS', hrs: 'HRS', min: 'MIN', announced: 'SQUAD ANNOUNCED' },
  ar: { days: 'يوم', hrs: 'ساعة', min: 'دقيقة', announced: 'تم الإعلان عن التشكيلة' },
  fr: { days: 'JOURS', hrs: 'HRS', min: 'MIN', announced: 'EFFECTIF ANNONCE' },
}

function calc(target: number) {
  const diff = Math.max(0, target - Date.now())
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    expired: diff <= 0,
  }
}

export function CountdownPills({ targetDate, lang = 'en' }: Props) {
  const target = new Date(targetDate).getTime()
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState(() => calc(target))
  const t = LABELS[lang] ?? LABELS.en

  useEffect(() => {
    setMounted(true)
    const id = setInterval(() => setTime(calc(target)), 60_000)
    return () => clearInterval(id)
  }, [target])

  if (!mounted) {
    return <div style={{ height: 48 }} /> // SSR placeholder
  }

  if (time.expired) {
    return (
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.06em',
          color: '#fff',
          background: 'var(--green, #006233)',
          padding: '6px 14px',
          borderRadius: 'var(--radius-sm, 4px)',
        }}
      >
        {t.announced}
      </span>
    )
  }

  const pills: [number, string][] = [
    [time.days, t.days],
    [time.hours, t.hrs],
    [time.minutes, t.min],
  ]

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      {pills.map(([value, label]) => (
        <div
          key={label}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--red, #c1121f)',
            color: '#fff',
            borderRadius: 8,
            width: 64,
            height: 64,
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.15)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '2rem',
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {String(value).padStart(2, '0')}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: '0.08em',
              opacity: 0.8,
              marginTop: 3,
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
