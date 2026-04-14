'use client'

/**
 * <MatchPreMatchContext> — countdown + venue details for upcoming matches.
 *
 * Only renders when the match is in NS (not started) state. Shows:
 *   - Countdown to kickoff
 *   - Kickoff date / time in local format
 *   - Venue + city
 *   - Referee if announced
 *
 * Client component because of the live countdown. Otherwise plain server
 * rendering — no polling, no heavy JS.
 */

import { useEffect, useState } from 'react'
import type { MatchDetail } from '@/lib/data/types'
import type { Lang } from '@/lib/i18n/config'

interface Props {
  match: MatchDetail
  lang?: Lang
}

const LABELS: Record<Lang, {
  title: string
  kicker: string
  days: string
  hours: string
  mins: string
  secs: string
  kickoff: string
  venue: string
  referee: string
}> = {
  en: {
    title: 'Kick-off Countdown',
    kicker: 'Pre-match',
    days: 'DAYS',
    hours: 'HRS',
    mins: 'MIN',
    secs: 'SEC',
    kickoff: 'Kick-off',
    venue: 'Venue',
    referee: 'Referee',
  },
  ar: {
    title: 'العد التنازلي للانطلاق',
    kicker: 'قبل المباراة',
    days: 'أيام',
    hours: 'ساعات',
    mins: 'دقائق',
    secs: 'ثواني',
    kickoff: 'الانطلاق',
    venue: 'الملعب',
    referee: 'الحكم',
  },
  fr: {
    title: "Compte à rebours avant le coup d'envoi",
    kicker: 'Avant-match',
    days: 'JOURS',
    hours: 'HRS',
    mins: 'MIN',
    secs: 'SEC',
    kickoff: "Coup d'envoi",
    venue: 'Stade',
    referee: 'Arbitre',
  },
}

function useCountdown(targetIso: string) {
  const [tl, setTl] = useState({ days: 0, hours: 0, mins: 0, secs: 0, expired: false })

  useEffect(() => {
    const target = new Date(targetIso).getTime()
    const update = () => {
      const diff = target - Date.now()
      if (diff <= 0) {
        setTl({ days: 0, hours: 0, mins: 0, secs: 0, expired: true })
        return
      }
      setTl({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
        expired: false,
      })
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [targetIso])

  return tl
}

export function MatchPreMatchContext({ match, lang = 'en' }: Props) {
  const L = LABELS[lang] ?? LABELS.en
  const countdown = useCountdown(match.fixture.date)
  const locale = lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-GB'
  const kickoffDate = new Date(match.fixture.date)

  const kickoffTime = kickoffDate.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  })
  const kickoffDateStr = kickoffDate.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <section
      aria-label={L.title}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '14px 18px 12px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--card-alt)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--green)',
            marginBottom: 4,
          }}
        >
          {L.kicker}
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text)',
            margin: 0,
          }}
        >
          {L.title}
        </h2>
      </div>

      <div style={{ padding: '24px 20px 20px' }}>
        {/* Countdown */}
        {!countdown.expired && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 14,
              marginBottom: 22,
            }}
          >
            {[
              { val: countdown.days, label: L.days },
              { val: countdown.hours, label: L.hours },
              { val: countdown.mins, label: L.mins },
              { val: countdown.secs, label: L.secs },
            ].map(({ val, label }) => (
              <div key={label} style={{ textAlign: 'center', minWidth: 52 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 26,
                    fontWeight: 700,
                    color: 'var(--text)',
                    lineHeight: 1,
                    letterSpacing: '0.02em',
                  }}
                >
                  {String(val).padStart(2, '0')}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    fontWeight: 700,
                    color: 'var(--text-faint)',
                    letterSpacing: '0.1em',
                    marginTop: 6,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Kickoff details */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 12,
            paddingTop: 16,
            borderTop: '1px solid var(--border)',
          }}
        >
          <DetailItem
            label={L.kickoff}
            primary={kickoffTime}
            secondary={kickoffDateStr}
          />
          {match.fixture.venue?.name && (
            <DetailItem
              label={L.venue}
              primary={match.fixture.venue.name}
              secondary={match.fixture.venue.city ?? undefined}
            />
          )}
          {match.fixture.referee && (
            <DetailItem label={L.referee} primary={match.fixture.referee} />
          )}
        </div>
      </div>
    </section>
  )
}

function DetailItem({
  label,
  primary,
  secondary,
}: {
  label: string
  primary: string
  secondary?: string
}) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          fontWeight: 700,
          color: 'var(--text-faint)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-head)',
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--text)',
          lineHeight: 1.2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {primary}
      </div>
      {secondary && (
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-faint)',
            marginTop: 2,
          }}
        >
          {secondary}
        </div>
      )}
    </div>
  )
}
