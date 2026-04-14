/**
 * /morocco/key-players — WC 2026 Squad Tracker
 * Phase 3: API-Football photos + form dots.
 */

import { pageMetadata } from '@/lib/seo/pageMetadata'
import styles from './squad.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { CountdownPills } from '@/components/morocco/CountdownPills'
import { WhatsAppShare } from '@/components/ui/WhatsAppShare'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'
import { getTeamSquad } from '@/lib/api-football/teams'
import { MOROCCO_TEAM_ID } from '@/lib/api-football/leagues'
import {
  WC_SQUAD,
  STATUS_CONFIG,
  POSITION_GROUPS,
  SQUAD_STATS,
  STAT_ACCENTS,
  GROUP_C_FIXTURES,
  type SquadStatus,
  type FormResult,
} from '@/lib/data/morocco-squad'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('morocco/key-players', lang, '/morocco/key-players')
}

export const revalidate = 3600 // 1 hour — photos from API-Football

// ── Hero copy ──────────────────────────────────────────────────

const HERO: Record<'en' | 'ar' | 'fr', {
  kicker: string; h1: string; sub: string; deadlineLabel: string
  groupLabel: string; vs: string; fullPool: string; fullPoolLink: string
}> = {
  en: {
    kicker: 'ATLAS LIONS \u00B7 FIFA WORLD CUP 2026',
    h1: 'Who Makes the Cut?',
    sub: 'Morocco name their 26-man squad by May 11.',
    deadlineLabel: 'SQUAD DEADLINE',
    groupLabel: 'GROUP C',
    vs: 'vs',
    fullPool: 'See full registered pool (40+ players)',
    fullPoolLink: '/morocco/squad',
  },
  ar: {
    kicker: '\u0623\u0633\u0648\u062F \u0627\u0644\u0623\u0637\u0644\u0633 \u00B7 \u0643\u0623\u0633 \u0627\u0644\u0639\u0627\u0644\u0645 \u0641\u064A\u0641\u0627 2026',
    h1: '\u0645\u0646 \u0633\u064A\u064F\u062E\u062A\u0627\u0631\u061F',
    sub: '\u0627\u0644\u0645\u063A\u0631\u0628 \u064A\u0639\u0644\u0646 \u062A\u0634\u0643\u064A\u0644\u0629 \u0627\u0644\u0640 26 \u0644\u0627\u0639\u0628\u064B\u0627 \u0628\u062D\u0644\u0648\u0644 11 \u0645\u0627\u064A.',
    deadlineLabel: '\u0645\u0648\u0639\u062F \u0627\u0644\u0625\u0639\u0644\u0627\u0646',
    groupLabel: '\u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629 C',
    vs: '\u0636\u062F',
    fullPool: '\u0634\u0627\u0647\u062F \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0643\u0627\u0645\u0644\u0629 (40+ \u0644\u0627\u0639\u0628)',
    fullPoolLink: '/morocco/squad',
  },
  fr: {
    kicker: 'LIONS DE L\'ATLAS \u00B7 COUPE DU MONDE FIFA 2026',
    h1: 'Qui fera partie de la liste ?',
    sub: 'Le Maroc annonce ses 26 joueurs d\'ici le 11 mai.',
    deadlineLabel: 'DATE LIMITE',
    groupLabel: 'GROUPE C',
    vs: 'vs',
    fullPool: 'Voir l\'effectif complet (40+ joueurs)',
    fullPoolLink: '/morocco/squad',
  },
}

const OPPONENT_ISO: Record<string, string> = { BRA: 'br', SCO: 'gb-sct', HAI: 'ht' }

export default async function MoroccoSquadTrackerPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const langKey = (lang === 'ar' || lang === 'fr' ? lang : 'en') as 'en' | 'ar' | 'fr'
  const p = lang === 'en' ? '' : `/${lang}`
  const hero = HERO[langKey]

  // Fetch live squad from API-Football for photos + shirt numbers.
  // Falls back gracefully — cards render without photos if API is down.
  const apiSquad = await getTeamSquad(MOROCCO_TEAM_ID).catch(() => [])
  const photoMap = new Map(apiSquad.map(pl => [pl.id, pl]))

  return (
    <main>
      {/* ═══ ZONE 1 — Hero (light bg) ═══ */}
      <div
        style={{
          background: 'transparent',
          borderBottom: '1px solid var(--border)',
          padding: '2.5rem 0 1.5rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 var(--edge, 16px)' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#B8820A',
              marginBottom: 14,
            }}
          >
            {hero.kicker}
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 'clamp(2.2rem, 6vw, 3.5rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              margin: '0 0 10px',
              color: 'var(--text)',
            }}
          >
            {hero.h1}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              color: 'var(--text-faint)',
              margin: '0 auto',
              maxWidth: 480,
            }}
          >
            {hero.sub}
          </p>
          <div style={{ marginTop: 16 }}>
            <WhatsAppShare
              text={langKey === 'ar' ? 'تشكيلة المغرب المتوقعة لكأس العالم 2026' : langKey === 'fr' ? 'Effectif prevu du Maroc pour le Mondial 2026' : 'Morocco\'s predicted WC 2026 squad'}
              url={`https://atlaskings.com${p}/morocco/key-players`}
              variant="button"
              lang={langKey}
            />
          </div>
        </div>
      </div>

      <div
        className={styles.sectionGrid}
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '2rem var(--edge, 16px)',
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '2rem',
        }}
      >
        {/* ═══ MAIN COLUMN ═══ */}
        <div>

        {/* ═══ ZONE 2 — Stats Bar ═══ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            padding: '2rem 0',
            borderBottom: '1px solid var(--border)',
            background: 'var(--card)',
            borderRadius: 8,
            margin: '1.5rem 0',
            border: '1px solid var(--border)',
            overflow: 'hidden',
          }}
          className={styles.statsBar}
        >
          {SQUAD_STATS.map((stat, i) => (
            <div
              key={stat.value}
              style={{
                textAlign: 'center',
                padding: '0 16px',
                borderTop: `3px solid ${STAT_ACCENTS[i]}`,
                borderRight: i < 3 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
                  fontWeight: 800,
                  color: 'var(--text)',
                  lineHeight: 1,
                  marginTop: 12,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-faint)',
                  marginTop: 6,
                  paddingBottom: 8,
                }}
              >
                {stat.label[langKey]}
              </div>
            </div>
          ))}
        </div>

        {/* ═══ ZONE 4 — Status Legend ═══ */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 12,
            padding: '14px 0 20px',
          }}
        >
          {(Object.keys(STATUS_CONFIG) as SquadStatus[]).map(status => {
            const cfg = STATUS_CONFIG[status]
            return (
              <div
                key={status}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: `${cfg.color}14`,
                  borderRadius: 999,
                  padding: '4px 12px',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: cfg.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: cfg.color,
                  }}
                >
                  {cfg.label[langKey]}
                </span>
              </div>
            )
          })}
        </div>

        {/* ═══ ZONE 5 — Squad Grid ═══ */}
        <div style={{ padding: '1rem 0 2rem' }}>
          {POSITION_GROUPS.map(group => {
            const players = WC_SQUAD.filter(pl => pl.position === group.key)
            return (
              <details key={group.key} open className={styles.detailsSection} style={{ marginBottom: 32 }}>
                <summary style={{ cursor: 'pointer', listStyle: 'none', marginBottom: 16 }}>
                  {/* Section header with red accent underline */}
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'var(--red, #c1121f)',
                        marginBottom: 4,
                      }}
                    >
                      {group.key}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-head)',
                        fontSize: 'clamp(1.2rem, 3vw, 1.4rem)',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: 'var(--text)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {group.label[langKey]} &middot; {players.length}
                    </div>
                    <div
                      style={{
                        width: 40,
                        height: 3,
                        background: 'var(--red, #c1121f)',
                        borderRadius: 2,
                        marginTop: 8,
                      }}
                    />
                  </div>
                </summary>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: 14,
                  }}
                  className={styles.squadGrid}
                >
                  {players.map(player => {
                    const cfg = STATUS_CONFIG[player.status]
                    const copy = player[langKey] ?? player.en
                    const apiPlayer = player.apiId ? photoMap.get(player.apiId) : null
                    const photo = apiPlayer?.photo
                    const shirtNumber = apiPlayer?.number
                    return (
                      <div
                        key={player.name}
                        id={player.name.toLowerCase().replace(/\s+/g, '-')}
                        className={styles.playerCard}
                        style={{
                          background: cfg.tint,
                          border: '1px solid var(--border)',
                          borderInlineStart: `4px solid ${cfg.color}`,
                          borderRadius: 'var(--radius, 8px)',
                          padding: '16px 18px',
                          position: 'relative',
                          cursor: 'pointer',
                        }}
                      >
                        {/* Status badge — dot + text only */}
                        <div
                          style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.color, display: 'inline-block' }} />
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 10,
                              fontWeight: 700,
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              color: cfg.color,
                            }}
                          >
                            {cfg.label[langKey]}
                          </span>
                        </div>

                        {/* Photo + Name row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingRight: 95 }}>
                          {photo ? (
                            <Image
                              src={photo}
                              alt={player.name}
                              width={48}
                              height={48}
                              unoptimized
                              style={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: `2px solid ${cfg.color}`,
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                background: 'var(--border)',
                                border: `2px solid ${cfg.color}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontFamily: 'var(--font-head)',
                                fontSize: 16,
                                fontWeight: 800,
                                color: 'var(--text-faint)',
                                flexShrink: 0,
                              }}
                            >
                              {player.name.charAt(0)}
                            </div>
                          )}
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontFamily: 'var(--font-head)',
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                color: 'var(--text)',
                                lineHeight: 1.2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                              }}
                            >
                              {player.name}
                              {shirtNumber != null && (
                                <span
                                  style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: 10,
                                    fontWeight: 600,
                                    color: 'var(--text-faint)',
                                    background: 'var(--card-alt)',
                                    borderRadius: 3,
                                    padding: '1px 4px',
                                  }}
                                >
                                  #{shirtNumber}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Role */}
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: 'var(--red, #c1121f)',
                            marginTop: 4,
                          }}
                        >
                          {copy.role}
                        </div>

                        {/* Club + league */}
                        <div
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 12,
                            marginTop: 8,
                          }}
                        >
                          <span>{player.country} </span>
                          <span style={{ fontWeight: 600, color: 'var(--text)' }}>{player.club}</span>
                          <span style={{ color: 'var(--text-faint)' }}> &middot; {player.league}</span>
                        </div>

                        {/* Age + caps pills */}
                        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 11,
                              background: 'var(--card-alt)',
                              borderRadius: 4,
                              padding: '2px 6px',
                              color: 'var(--text-sec)',
                            }}
                          >
                            Age {player.age}
                          </span>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 11,
                              background: 'var(--card-alt)',
                              borderRadius: 4,
                              padding: '2px 6px',
                              color: 'var(--text-sec)',
                            }}
                          >
                            {player.caps} caps
                          </span>
                        </div>

                        {/* Form dots — last 5 club results */}
                        {player.form && player.form.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                            <span
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: 8,
                                fontWeight: 700,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                color: 'var(--text-faint)',
                              }}
                            >
                              FORM
                            </span>
                            <div style={{ display: 'flex', gap: 4 }}>
                              {player.form.map((r: FormResult, i: number) => (
                                <span
                                  key={i}
                                  title={r === 'W' ? 'Win' : r === 'D' ? 'Draw' : 'Loss'}
                                  style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    background: r === 'W' ? '#006233' : r === 'D' ? '#9ca3af' : '#c1121f',
                                    display: 'inline-block',
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Blurb — visible on desktop, tap-to-expand on mobile */}
                        <div
                          style={{
                            marginTop: 10,
                            paddingTop: 10,
                            borderTop: '1px solid var(--border)',
                          }}
                        >
                          {/* Desktop: always visible */}
                          <p
                            className={styles.cardBlurbDesktop}
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: 13,
                              lineHeight: 1.5,
                              color: 'var(--text-sec)',
                              fontStyle: 'italic',
                              margin: 0,
                            }}
                          >
                            &ldquo;{copy.blurb}&rdquo;
                          </p>
                          {/* Mobile: tap to expand */}
                          <details className={styles.cardBlurbMobile}>
                            <summary
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: 10,
                                fontWeight: 600,
                                color: 'var(--text-faint)',
                                cursor: 'pointer',
                                listStyle: 'none',
                              }}
                            >
                              Read more &darr;
                            </summary>
                            <p
                              style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: 13,
                                lineHeight: 1.5,
                                color: 'var(--text-sec)',
                                fontStyle: 'italic',
                                margin: '6px 0 0',
                              }}
                            >
                              &ldquo;{copy.blurb}&rdquo;
                            </p>
                          </details>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </details>
            )
          })}
        </div>

        {/* ═══ ZONE 6 — Full pool link ═══ */}
        <div style={{ textAlign: 'center', padding: '0 0 2rem' }}>
          <Link
            href={`${p}${hero.fullPoolLink}`}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--green, #006233)',
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            {hero.fullPool} &rarr;
          </Link>
        </div>

        </div>{/* end main column */}

        {/* ═══ SIDEBAR ═══ */}
        <aside className={styles.sectionSidebar}>
          {/* Widget 1 — Next Match + Countdown */}
          <div className={styles.sidebarWidget}>
            <h3 style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-faint)',
              margin: '0 0 1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)',
            }}>
              {langKey === 'ar' ? 'المباراة القادمة' : langKey === 'fr' ? 'Prochain match' : 'Next Match'}
            </h3>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 20 }}>{'\uD83C\uDDF2\uD83C\uDDE6'}</span>
                <span style={{ fontFamily: 'var(--font-head)', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Morocco vs Brazil</span>
                <span style={{ fontSize: 20 }}>{'\uD83C\uDDE7\uD83C\uDDF7'}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)', marginBottom: 12 }}>
                Jun 15 &middot; Philadelphia
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CountdownPills targetDate="2026-06-15T00:00:00Z" lang={langKey} />
              </div>
            </div>
          </div>

          {/* Widget 2 — Group C */}
          <div className={styles.sidebarWidget}>
            <h3 style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-faint)',
              margin: '0 0 1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)',
            }}>
              {langKey === 'ar' ? 'المجموعة C' : 'Group C'}
            </h3>
            {GROUP_C_FIXTURES.map(f => (
              <div
                key={f.opponentCode}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 0',
                  borderBottom: '1px solid var(--border)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                }}
              >
                <span style={{ fontSize: 14 }}>{'\uD83C\uDDF2\uD83C\uDDE6'}</span>
                <span style={{ color: 'var(--text-faint)', fontSize: 11 }}>vs</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://flagcdn.com/w20/${OPPONENT_ISO[f.opponentCode] ?? 'xx'}.png`}
                  alt={f.opponent}
                  width={16}
                  height={11}
                  style={{ borderRadius: 1 }}
                />
                <span style={{ fontWeight: 600, color: 'var(--text)', flex: 1 }}>{f.opponent}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)' }}>{f.date}</span>
              </div>
            ))}
          </div>

          {/* Widget 3 — Latest News */}
          <div className={styles.sidebarWidget}>
            <h3 style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-faint)',
              margin: '0 0 1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)',
            }}>
              {langKey === 'ar' ? 'آخر الأخبار' : langKey === 'fr' ? 'Dernières actualités' : 'Latest News'}
            </h3>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-faint)', lineHeight: 1.5 }}>
              {langKey === 'ar' ? 'أخبار التشكيلة قريبًا.' : langKey === 'fr' ? 'Actualités effectif à venir.' : 'Squad news coming soon.'}
            </div>
          </div>
        </aside>
      </div>

    </main>
  )
}
