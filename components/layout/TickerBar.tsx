'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import type { TickerData, TickerMatch } from '@/lib/ticker/getTickerData'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'

interface Props {
  data: TickerData
  lang?: Lang
}

function LiveDot() {
  return (
    <span style={{
      display: 'inline-block',
      width: 6, height: 6,
      borderRadius: '50%',
      background: '#0d9940',
      flexShrink: 0,
      animation: 'tickerpulse 1.4s ease-in-out infinite',
    }} />
  )
}

function PlayerLabel({ name }: { name: string }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.04em',
      color: '#b8820a',
      whiteSpace: 'nowrap',
      marginRight: 2,
    }}>
      {name}
    </span>
  )
}

function MatchPill({ match, langPrefix = '' }: { match: TickerMatch; langPrefix?: string }) {
  const isLive = match.status === 'LIVE' || match.status === '1H' ||
    match.status === '2H' || match.status === 'ET' || match.status === 'P'
  const isHT = match.status === 'HT'
  const isFT = match.status === 'FT' || match.status === 'AET' || match.status === 'PEN'
  const isNS = match.status === 'NS'

  return (
    <Link
      href={`${langPrefix}/matches/${match.id}`}
      className="ticker-pill"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        padding: '0 14px',
        height: '100%',
        textDecoration: 'none',
        flexShrink: 0,
        borderRight: '1px solid #222',
        transition: 'background 0.12s',
        background: match.isMorocco ? 'rgba(10,82,41,0.25)' : 'transparent',
        position: 'relative',
      }}
    >
      {/* Moroccan player label (Tier 3 matches) */}
      {match.moroccanPlayer && (
        <PlayerLabel name={match.moroccanPlayer} />
      )}

      {/* Competition flag */}
      <span style={{ fontSize: 11, lineHeight: 1, flexShrink: 0 }}>
        {match.flag}
      </span>

      {/* Home team */}
      <span style={{
        fontFamily: 'var(--font-head)',
        fontSize: 12, fontWeight: match.isMorocco ? 800 : 700,
        letterSpacing: '0.04em',
        color: match.isMorocco ? '#7ae8a4' : '#d0d0d0',
        whiteSpace: 'nowrap',
      }}>
        {match.homeShort}
      </span>

      {/* Score or time */}
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: isNS ? 11 : 13,
        fontWeight: 700,
        color: isLive ? '#0d9940' : isHT ? '#f59e0b' : isFT ? '#666' : '#3ecc78',
        letterSpacing: isNS ? '0.02em' : '0.04em',
        minWidth: isNS ? 38 : 28,
        textAlign: 'center',
        flexShrink: 0,
        lineHeight: 1,
      }}>
        {isNS
          ? match.time
          : isHT
            ? 'HT'
            : isFT
              ? `${match.homeScore ?? 0}–${match.awayScore ?? 0}`
              : `${match.homeScore ?? 0}–${match.awayScore ?? 0}`
        }
      </span>

      {/* Away team */}
      <span style={{
        fontFamily: 'var(--font-head)',
        fontSize: 12, fontWeight: match.isMorocco ? 800 : 700,
        letterSpacing: '0.04em',
        color: match.isMorocco ? '#7ae8a4' : '#d0d0d0',
        whiteSpace: 'nowrap',
      }}>
        {match.awayShort}
      </span>

      {/* Live minute indicator */}
      {isLive && match.elapsed && (
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9, fontWeight: 600,
          color: '#0d9940', letterSpacing: '0.02em',
          flexShrink: 0,
        }}>
          {match.elapsed}&apos;
        </span>
      )}
    </Link>
  )
}

export function TickerBar({ data, lang = 'en' }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const autoScrollRef = useRef<ReturnType<typeof setInterval>>(undefined)
  const t = getTranslations(lang)
  const p = lang === 'en' ? '' : `/${lang}`

  // Restore dismissed state from session
  useEffect(() => {
    try { if (sessionStorage.getItem('ticker-dismissed')) setDismissed(true) } catch {}
  }, [])

  // Set --header-h when ticker is visible so SectionBar sticky offset is correct
  useEffect(() => {
    if (dismissed) return
    const isMobile = window.matchMedia('(max-width: 767px)').matches
    document.documentElement.style.setProperty('--header-h', isMobile ? '138px' : '92px')
    return () => { document.documentElement.style.removeProperty('--header-h') }
  }, [dismissed])

  const handleDismiss = () => {
    setDismissed(true)
    try { sessionStorage.setItem('ticker-dismissed', '1') } catch {}
    // Reset CSS variable so sticky subnav uses default offset
    document.documentElement.style.removeProperty('--header-h')
  }

  const isLive = data.state === 'live'
  const isIntl = data.state === 'international'

  if (dismissed) return null

  // Check scroll state
  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true })
      window.addEventListener('resize', checkScroll)
    }
    return () => {
      el?.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
      clearInterval(autoScrollRef.current)
    }
  }, [])

  // Auto-scroll for live matches — slow, continuous
  useEffect(() => {
    if (!isLive || isPaused) {
      clearInterval(autoScrollRef.current)
      return
    }
    autoScrollRef.current = setInterval(() => {
      const el = scrollRef.current
      if (!el) return
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 4) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        el.scrollBy({ left: 1, behavior: 'auto' })
      }
    }, 30)
    return () => clearInterval(autoScrollRef.current)
  }, [isLive, isPaused])

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' })
  }

  const labelColor = isLive ? '#0d9940' : isIntl ? '#b8820a' : '#3ecc78'
  const labelBg = isLive ? 'rgba(13,153,64,0.15)' : isIntl ? 'rgba(184,130,10,0.15)' : 'rgba(62,204,120,0.08)'

  return (
    <div
      className="scores-ticker"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* State label */}
      <div className="ticker-label" style={{ background: labelBg }}>
        {isLive && <LiveDot />}
        <span style={{ color: labelColor }}>
          {data.label}
        </span>
      </div>

      {/* Scroll left button */}
      {canScrollLeft && (
        <button className="ticker-scroll-btn ticker-scroll-left" onClick={() => scroll('left')} aria-label="Scroll left">
          ‹
        </button>
      )}

      {/* Scrollable match pills */}
      <div
        ref={scrollRef}
        className="ticker-track"
        style={{ flex: 1, overflow: 'hidden' }}
      >
        <div className="ticker-inner">
          {data.matches.map(match => (
            <MatchPill key={match.id} match={match} langPrefix={p} />
          ))}
        </div>
      </div>

      {/* Scroll right button */}
      {canScrollRight && (
        <button className="ticker-scroll-btn ticker-scroll-right" onClick={() => scroll('right')} aria-label="Scroll right">
          ›
        </button>
      )}

      {/* All scores link */}
      <Link href={`${p}/scores`} className="ticker-all-link">
        {t.sections.allScores}
      </Link>

      {/* Mobile dismiss button */}
      <button
        onClick={handleDismiss}
        aria-label="Dismiss ticker"
        className="ticker-dismiss"
        style={{
          background: 'none',
          border: 'none',
          color: '#666',
          fontSize: 14,
          cursor: 'pointer',
          padding: '0 8px',
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        &times;
      </button>

      <style>{`
        @keyframes tickerpulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        .ticker-pill:hover {
          background: rgba(255,255,255,0.04) !important;
        }
        .ticker-dismiss {
          display: none;
        }
        @media (max-width: 768px) {
          .ticker-dismiss {
            display: block;
          }
        }
      `}</style>
    </div>
  )
}
