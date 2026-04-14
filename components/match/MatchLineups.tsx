/**
 * <MatchLineups> — native lineup and formation display.
 *
 * Two columns (home / away), each showing:
 *   - Formation label ("4-3-3")
 *   - Coach name
 *   - Starting XI (11 players)
 *   - Substitutes
 *
 * Empty state: polished "Lineups will be announced around kickoff"
 * placeholder rather than hiding the section — per §3 guardrail.
 *
 * Pure server component.
 */

import Image from 'next/image'
import Link from 'next/link'
import type { MatchDetail } from '@/lib/data/types'
import type { Lang } from '@/lib/i18n/config'

// ── Types ────────────────────────────────────────────────────────────────

interface Props {
  match: MatchDetail
  lang?: Lang
  /** Lang prefix for player deeplinks (e.g. "" for EN, "/ar" for AR) */
  langPrefix?: string
}

// ── Localized labels ────────────────────────────────────────────────────

const LABELS: Record<Lang, {
  title: string
  formation: string
  startingXI: string
  substitutes: string
  coach: string
  emptyTitle: string
  emptyDesc: string
}> = {
  en: {
    title: 'Lineups',
    formation: 'Formation',
    startingXI: 'Starting XI',
    substitutes: 'Substitutes',
    coach: 'Coach',
    emptyTitle: 'Lineups not yet announced',
    emptyDesc: 'Team sheets are usually published about an hour before kick-off.',
  },
  ar: {
    title: 'التشكيلات',
    formation: 'التشكيل',
    startingXI: 'التشكيلة الأساسية',
    substitutes: 'البدلاء',
    coach: 'المدرب',
    emptyTitle: 'لم يتم الإعلان عن التشكيلات',
    emptyDesc: 'عادة ما يتم نشر التشكيلات قبل بدء المباراة بحوالي ساعة.',
  },
  fr: {
    title: 'Compositions',
    formation: 'Système',
    startingXI: 'Titulaires',
    substitutes: 'Remplaçants',
    coach: 'Entraîneur',
    emptyTitle: 'Compositions non encore annoncées',
    emptyDesc: "Les compositions sont publiées environ une heure avant le coup d'envoi.",
  },
}

// ── Component ───────────────────────────────────────────────────────────

export function MatchLineups({ match, lang = 'en', langPrefix = '' }: Props) {
  const L = LABELS[lang] ?? LABELS.en
  const lineups = match.lineups ?? []

  const hasBothLineups = lineups.length >= 2

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
      {/* Section header */}
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--card-alt)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text)',
            margin: 0,
          }}
        >
          {L.title}
        </h2>
      </div>

      {!hasBothLineups ? (
        <EmptyPlaceholder title={L.emptyTitle} description={L.emptyDesc} />
      ) : (
        <div
          className="match-lineups-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 1,
            background: 'var(--border)',
          }}
        >
          {lineups.slice(0, 2).map((lineup, i) => (
            <TeamLineup key={lineup.team.id ?? i} lineup={lineup} labels={L} langPrefix={langPrefix} />
          ))}
        </div>
      )}
    </section>
  )
}

// ── Subcomponents ───────────────────────────────────────────────────────

function TeamLineup({
  lineup,
  labels,
  langPrefix,
}: {
  lineup: MatchDetail['lineups'][number]
  labels: { formation: string; startingXI: string; substitutes: string; coach: string }
  langPrefix: string
}) {
  return (
    <div
      style={{
        background: 'var(--card)',
        padding: '18px 18px 20px',
      }}
    >
      {/* Team header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 14,
        }}
      >
        {lineup.team.logo && (
          <Image
            src={lineup.team.logo}
            alt={lineup.team.name}
            width={28}
            height={28}
            style={{ objectFit: 'contain', flexShrink: 0 }}
            unoptimized
          />
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 14,
              fontWeight: 800,
              color: 'var(--text)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {lineup.team.name}
          </div>
          {lineup.formation && (
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--green)',
                letterSpacing: '0.06em',
                marginTop: 2,
              }}
            >
              {labels.formation}: {lineup.formation}
            </div>
          )}
        </div>
      </div>

      {/* Starting XI */}
      <SectionLabel>{labels.startingXI}</SectionLabel>
      <PlayerList players={lineup.startXI?.map(p => p.player) ?? []} langPrefix={langPrefix} />

      {/* Substitutes */}
      {lineup.substitutes && lineup.substitutes.length > 0 && (
        <>
          <SectionLabel>{labels.substitutes}</SectionLabel>
          <PlayerList
            players={lineup.substitutes.map(p => p.player)}
            muted
            langPrefix={langPrefix}
          />
        </>
      )}

      {/* Coach */}
      {lineup.coach?.name && (
        <>
          <SectionLabel>{labels.coach}</SectionLabel>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text)',
              padding: '6px 0',
            }}
          >
            {lineup.coach.name}
          </div>
        </>
      )}
    </div>
  )
}

function PlayerList({
  players,
  muted = false,
  langPrefix,
}: {
  players: Array<{ id: number; name: string; number: number; pos: string }>
  muted?: boolean
  langPrefix: string
}) {
  if (!players || players.length === 0) return null
  return (
    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: '0 0 16px',
      }}
    >
      {players.map(player => {
        const row = (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '6px 0',
              borderBottom: '1px solid var(--border)',
              opacity: muted ? 0.85 : 1,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <span
              aria-hidden
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--text-faint)',
                width: 22,
                textAlign: 'right',
                flexShrink: 0,
              }}
            >
              {player.number ?? '—'}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text)',
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {player.name}
            </span>
            {player.pos && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  fontWeight: 700,
                  color: 'var(--text-faint)',
                  letterSpacing: '0.04em',
                  padding: '2px 6px',
                  background: 'var(--card-alt)',
                  borderRadius: 'var(--radius-sm)',
                  flexShrink: 0,
                }}
              >
                {player.pos}
              </span>
            )}
          </div>
        )
        // Wrap in a Link when we have a stable id so the row navigates
        // to /players/{id}. Players without an id fall back to a plain
        // li (e.g. scraped lineups that don't carry an api-football id).
        return (
          <li key={player.id} style={{ listStyle: 'none' }}>
            {player.id ? (
              <Link
                href={`${langPrefix}/players/${player.id}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                {row}
              </Link>
            ) : (
              row
            )}
          </li>
        )
      })}
    </ul>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        fontWeight: 700,
        color: 'var(--text-faint)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginTop: 12,
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  )
}

function EmptyPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div
      style={{
        padding: '40px 20px',
        textAlign: 'center',
      }}
    >
      <div
        aria-hidden
        style={{
          fontSize: 28,
          marginBottom: 10,
          opacity: 0.5,
        }}
      >
        👥
      </div>
      <div
        style={{
          fontFamily: 'var(--font-head)',
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--text)',
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          color: 'var(--text-sec)',
          maxWidth: 360,
          margin: '0 auto',
          lineHeight: 1.5,
        }}
      >
        {description}
      </div>
    </div>
  )
}
