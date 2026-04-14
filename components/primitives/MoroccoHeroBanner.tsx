'use client'

/**
 * <MoroccoHeroBanner> — patriotic hero primitive for Morocco surfaces.
 * ─────────────────────────────────────────────────────────────────────
 *
 * Lifted from components/world-cup/MoroccoHeroBanner and generalized
 * with a `variant` prop so the same primitive serves:
 *
 *   - variant="wc"   → WC 2026 tournament hub (/wc-2026)
 *     Shows: "FIFA World Cup 2026" subtitle, GROUP + FIFA RANK badges,
 *            "View All Fixtures" + "View Squad" CTAs
 *
 *   - variant="page" → Morocco flagship page (/morocco)
 *     Shows: "The digital home of the Atlas Lions" tagline, no badges,
 *            "View Fixtures" + "View Squad" + "Latest News" CTAs
 *
 * Everything else — green gradient, red/green/red flag stripe, live
 * countdown, next-match card, RTL support, patriotic overlay — is
 * identical across variants.
 *
 * Tone: patriotic + premium. Never governmental or federation-official.
 * Do not imply affiliation with FRMF or any official body.
 *
 * Backward compatibility: components/world-cup/MoroccoHeroBanner.tsx
 * is a re-export shim. The WC page passes no `variant` prop, so the
 * default must be `variant="wc"` to preserve that call site unchanged.
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Lang } from '@/lib/i18n/config'

// ── Types ────────────────────────────────────────────────────────────────

export interface MoroccoMatch {
  opponent: string
  opponentCode: string
  opponentFlag: string
  /** ISO date/datetime. Countdown target. */
  date: string
  venue: string
  city: string
  isHome: boolean
  matchNumber: number
  status: 'upcoming' | 'live' | 'finished'
  homeScore?: number
  awayScore?: number
}

export type MoroccoHeroVariant = 'wc' | 'page'

export interface MoroccoHeroCTA {
  label: string
  href: string
  style?: 'primary' | 'secondary'
}

export interface MoroccoHeroBannerProps {
  lang: Lang
  langPrefix: string
  /** Next match to show in the countdown block. Null hides the countdown. */
  nextMatch?: MoroccoMatch | null
  /**
   * Layout variant. Default "wc" preserves the WC 2026 page call site
   * which was built before the lift and passes no `variant` prop.
   */
  variant?: MoroccoHeroVariant
  /** Group letter. Only shown when variant="wc". */
  moroccoGroup?: string
  /** FIFA rank. Only shown when variant="wc". */
  moroccoRank?: number
  /**
   * Override CTA buttons. When omitted, variant-appropriate defaults render.
   * Passing an empty array hides CTAs entirely.
   */
  ctas?: MoroccoHeroCTA[]
}

// ── Localised strings ───────────────────────────────────────────────────

interface HeroCopy {
  title: string
  wcSubtitle: string
  pageTagline: string
  nextMatch: string
  group: string
  fifaRank: string
  days: string
  hours: string
  mins: string
  secs: string
  viewFixtures: string
  viewSquad: string
  latestNews: string
  morocco: string
  vs: string
  live: string
}

const COPY: Record<Lang, HeroCopy> = {
  en: {
    title: 'ATLAS LIONS',
    wcSubtitle: 'FIFA World Cup 2026',
    pageTagline: 'The digital home of the Atlas Lions',
    nextMatch: 'NEXT MATCH',
    group: 'GROUP',
    fifaRank: 'FIFA RANK',
    days: 'DAYS',
    hours: 'HRS',
    mins: 'MIN',
    secs: 'SEC',
    viewFixtures: 'View Fixtures',
    viewSquad: 'View Squad',
    latestNews: 'Latest News',
    morocco: 'Morocco',
    vs: 'vs',
    live: 'LIVE',
  },
  ar: {
    title: 'أسود الأطلس',
    wcSubtitle: 'كأس العالم 2026',
    pageTagline: 'الموطن الرقمي لأسود الأطلس',
    nextMatch: 'المباراة القادمة',
    group: 'المجموعة',
    fifaRank: 'تصنيف فيفا',
    days: 'أيام',
    hours: 'ساعات',
    mins: 'دقائق',
    secs: 'ثواني',
    viewFixtures: 'المباريات',
    viewSquad: 'التشكيلة',
    latestNews: 'آخر الأخبار',
    morocco: 'المغرب',
    vs: 'ضد',
    live: 'مباشر',
  },
  fr: {
    title: "LIONS DE L'ATLAS",
    wcSubtitle: 'Coupe du Monde FIFA 2026',
    pageTagline: "La maison numérique des Lions de l'Atlas",
    nextMatch: 'PROCHAIN MATCH',
    group: 'GROUPE',
    fifaRank: 'CLASSEMENT FIFA',
    days: 'JOURS',
    hours: 'HRS',
    mins: 'MIN',
    secs: 'SEC',
    viewFixtures: 'Calendrier',
    viewSquad: 'Effectif',
    latestNews: 'Actualités',
    morocco: 'Maroc',
    vs: 'vs',
    live: 'EN DIRECT',
  },
}

// ── Countdown hook ──────────────────────────────────────────────────────

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })

  useEffect(() => {
    const target = new Date(targetDate).getTime()
    const update = () => {
      const diff = Math.max(0, target - Date.now())
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
      })
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return timeLeft
}

// ── Default CTAs per variant ────────────────────────────────────────────

function defaultCtas(
  variant: MoroccoHeroVariant,
  langPrefix: string,
  t: HeroCopy,
): MoroccoHeroCTA[] {
  if (variant === 'wc') {
    return [
      { label: t.viewFixtures, href: `${langPrefix}/wc-2026/fixtures`, style: 'primary' },
      { label: t.viewSquad, href: `${langPrefix}/morocco/squad`, style: 'secondary' },
    ]
  }
  return [
    { label: t.viewFixtures, href: `${langPrefix}/morocco/fixtures`, style: 'primary' },
    { label: t.viewSquad, href: `${langPrefix}/morocco/squad`, style: 'secondary' },
    { label: t.latestNews, href: `${langPrefix}/morocco/news`, style: 'secondary' },
  ]
}

// ── Component ───────────────────────────────────────────────────────────

export function MoroccoHeroBanner({
  lang,
  langPrefix,
  nextMatch,
  variant = 'wc',
  moroccoGroup,
  moroccoRank,
  ctas,
}: MoroccoHeroBannerProps) {
  const t = COPY[lang] ?? COPY.en
  // Fallback countdown target: Match 7 BRA v MAR kickoff, 18:00 ET.
  // ET in June is UTC−4, so 18:00 ET = 22:00 UTC. The earlier
  // 18:00 UTC value was 4 hours off actual kickoff.
  const countdown = useCountdown(nextMatch?.date || '2026-06-13T22:00:00Z')
  const isRTL = lang === 'ar'

  const resolvedCtas = ctas ?? defaultCtas(variant, langPrefix, t)
  const subtitleText = variant === 'wc' ? t.wcSubtitle : t.pageTagline
  const showBadges = variant === 'wc' && moroccoGroup && moroccoRank != null

  return (
    <section
      aria-label={t.title}
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #0a5229 0%, #073d1e 40%, #0c1a0f 100%)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        color: '#ffffff',
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      {/* Subtle geometric pattern overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Red/green/red top stripe echoing the Moroccan flag */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background:
            'linear-gradient(90deg, #c1121f 0%, #c1121f 33%, #0a5229 33%, #0a5229 66%, #c1121f 66%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '28px 24px 24px',
        }}
      >
        {/* Header row: title + optional badge cluster */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.55)',
                marginBottom: 4,
              }}
            >
              {subtitleText}
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: 28,
                fontWeight: 800,
                fontStyle: 'italic',
                lineHeight: 1,
                margin: 0,
                letterSpacing: '0.02em',
              }}
            >
              🇲🇦 {t.title}
            </h2>
          </div>

          {showBadges && (
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 12px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    color: 'rgba(255,255,255,0.5)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {t.group}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontSize: 18,
                    fontWeight: 800,
                  }}
                >
                  {moroccoGroup}
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 12px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    color: 'rgba(255,255,255,0.5)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {t.fifaRank}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontSize: 18,
                    fontWeight: 800,
                  }}
                >
                  #{moroccoRank}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next Match card */}
        {nextMatch && (
          <div
            style={{
              background: 'rgba(0,0,0,0.25)',
              borderRadius: 'var(--radius)',
              padding: '20px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#3ecc78',
                marginBottom: 14,
                textAlign: 'center',
              }}
            >
              {nextMatch.status === 'live' ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span
                    aria-hidden
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#3ecc78',
                      animation: 'pulse 1.4s ease-in-out infinite',
                    }}
                  />
                  {t.live}
                </span>
              ) : (
                t.nextMatch
              )}
            </div>

            {/* Morocco vs opponent */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 20,
              }}
            >
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                  <Image
                    src="https://media.api-sports.io/football/teams/31.png"
                    alt="Morocco"
                    width={44}
                    height={44}
                    style={{ objectFit: 'contain' }}
                    unoptimized
                  />
                </div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 14, fontWeight: 700 }}>
                  {t.morocco}
                </div>
              </div>

              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                {nextMatch.status === 'upcoming' ? (
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.4)',
                      fontWeight: 600,
                    }}
                  >
                    {t.vs}
                  </div>
                ) : (
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 28,
                      fontWeight: 700,
                    }}
                  >
                    {nextMatch.homeScore ?? 0} – {nextMatch.awayScore ?? 0}
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                  <Image
                    src={nextMatch.opponentFlag}
                    alt={nextMatch.opponent}
                    width={44}
                    height={44}
                    style={{ objectFit: 'contain' }}
                    unoptimized
                  />
                </div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 14, fontWeight: 700 }}>
                  {nextMatch.opponent}
                </div>
              </div>
            </div>

            {/* Venue */}
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'rgba(255,255,255,0.45)',
                textAlign: 'center',
                marginTop: 12,
              }}
            >
              {nextMatch.venue}, {nextMatch.city}
            </div>

            {/* Countdown for upcoming matches */}
            {nextMatch.status === 'upcoming' && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 12,
                  marginTop: 16,
                  paddingTop: 14,
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {[
                  { val: countdown.days, label: t.days },
                  { val: countdown.hours, label: t.hours },
                  { val: countdown.mins, label: t.mins },
                  { val: countdown.secs, label: t.secs },
                ].map(({ val, label }) => (
                  <div key={label} style={{ textAlign: 'center', minWidth: 44 }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 22,
                        fontWeight: 700,
                        lineHeight: 1,
                        color: '#ffffff',
                      }}
                    >
                      {String(val).padStart(2, '0')}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 8,
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        color: 'rgba(255,255,255,0.4)',
                        marginTop: 4,
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CTAs */}
        {resolvedCtas.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginTop: 16,
              flexWrap: 'wrap',
            }}
          >
            {resolvedCtas.map(cta => {
              const isPrimary = (cta.style ?? 'primary') === 'primary'
              return (
                <Link
                  key={`${cta.href}-${cta.label}`}
                  href={cta.href}
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: isPrimary ? '#0a5229' : '#ffffff',
                    background: isPrimary ? '#ffffff' : 'rgba(255,255,255,0.12)',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    border: isPrimary ? 'none' : '1px solid rgba(255,255,255,0.15)',
                    minHeight: 36,
                  }}
                >
                  {cta.label}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
