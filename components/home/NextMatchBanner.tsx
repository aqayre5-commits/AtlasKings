'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface NextMatchBannerProps {
  competition: string
  date: string        // ISO string
  venue: string
  homeTeam: string
  awayTeam: string
  matchId?: string
  homeForm?: string   // e.g. "WWDWW"
  awayForm?: string
  langPrefix?: string
}

function FormDots({ form }: { form: string }) {
  return (
    <span style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {form.split('').map((r, i) => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
          background: r === 'W' ? 'var(--live)' : r === 'L' ? 'var(--red)' : '#c0bbb4',
        }} />
      ))}
    </span>
  )
}

function useCountdown(targetDate: string) {
  const [diff, setDiff] = useState(0)

  useEffect(() => {
    const target = new Date(targetDate).getTime()
    const tick = () => setDiff(Math.max(0, target - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  const pad = (n: number) => String(n).padStart(2, '0')

  return { d: pad(d), h: pad(h), m: pad(m), s: pad(s) }
}

export function NextMatchBanner({
  competition, date, venue,
  homeTeam, awayTeam, matchId,
  homeForm = 'WWDWW', awayForm = 'WLWWD',
  langPrefix = '',
}: NextMatchBannerProps) {
  const { d, h, m, s } = useCountdown(date)
  const displayDate = new Date(date).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  })

  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
      marginTop: 'var(--gap)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: 16,
        background: 'linear-gradient(135deg, #f2faf6 0%, #fff 60%)',
        borderTop: '3px solid var(--green)',
      }}>

        {/* Left: competition + teams */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <span style={{
              fontFamily: 'var(--font-head)', fontSize: 10, fontWeight: 800,
              letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--green)',
            }}>
              {competition}
            </span>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--text-faint)', marginTop: 3,
            }}>
              {displayDate} · {venue}
            </p>
          </div>

          {/* Teams */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                border: '1.5px solid var(--border)',
                background: '#0a1f5c',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>
                  {homeTeam.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <span style={{
                fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 800, color: 'var(--text)',
              }}>
                {homeTeam}
              </span>
            </div>
            <span style={{
              fontFamily: 'var(--font-head)', fontSize: 14, fontWeight: 700,
              color: 'var(--border-mid)', flexShrink: 0,
            }}>
              vs
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                border: '1.5px solid var(--border)',
                background: '#111',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>
                  {awayTeam.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <span style={{
                fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 800, color: 'var(--text)',
              }}>
                {awayTeam}
              </span>
            </div>
          </div>
        </div>

        {/* Centre: countdown */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          padding: '0 24px',
          borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)',
          margin: '0 8px',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-faint)',
          }}>
            Kicks off in
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {[{ v: d, l: 'days' }, { v: h, l: 'hrs' }, { v: m, l: 'min' }, { v: s, l: 'sec' }].map(({ v, l }, i) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 40 }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700,
                    color: 'var(--green)', lineHeight: 1,
                  }}>
                    {v}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 600,
                    letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-faint)',
                  }}>
                    {l}
                  </span>
                </div>
                {i < 3 && (
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700,
                    color: 'var(--border-mid)', paddingBottom: 12,
                  }}>:</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: form + links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
            <span style={{ fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 600, color: 'var(--text-sec)' }}>
              {homeTeam}
            </span>
            <FormDots form={homeForm} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
            <span style={{ fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 600, color: 'var(--text-sec)' }}>
              {awayTeam}
            </span>
            <FormDots form={awayForm} />
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            {matchId && (
              <Link href={`${langPrefix}/matches/${matchId}`} style={{
                fontFamily: 'var(--font-head)', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'var(--green)', textDecoration: 'none',
                background: 'var(--green-light)', border: '1px solid #b0d8c0',
                borderRadius: 'var(--radius-sm)', padding: '5px 11px',
                whiteSpace: 'nowrap',
              }}>
                Preview
              </Link>
            )}
            <Link href={`${langPrefix}/fixtures`} style={{
              fontFamily: 'var(--font-head)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--green)', textDecoration: 'none',
              background: 'var(--green-light)', border: '1px solid #b0d8c0',
              borderRadius: 'var(--radius-sm)', padding: '5px 11px',
            }}>
              Fixtures
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
