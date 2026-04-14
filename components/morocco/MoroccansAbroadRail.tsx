/**
 * <MoroccansAbroadRail> — horizontal rail of Moroccan players abroad.
 * ─────────────────────────────────────────────────────────────────────
 *
 * The unique differentiator of the Morocco flagship page: a hand-picked
 * roster of Moroccan internationals at major European clubs, each card
 * showing their current form in a single editorial line.
 *
 * LAUNCH STATE (hardcoded):
 *   The 6 players below are the 2026 marquee names. Each `formLine` is a
 *   static editorial string written as of PR merge. This intentionally
 *   goes stale within ~1-2 weeks — that is an accepted launch tradeoff.
 *
 *   By design, the UI does NOT show a "last updated" timestamp. Stale
 *   data without a timestamp reads as evergreen editorial; stale data
 *   with a timestamp reads as broken. We keep the former until the
 *   dynamic form fetcher (Week 4+) lands.
 *
 * TODO(Week 4+): replace the hardcoded list with a scheduled pipeline
 * that pulls `getPlayerLast5Matches()` for each ID once per day and
 * composes the formLine from the data. Component API stays identical;
 * only the data source changes.
 *
 * Scope: Morocco-only. Do not reuse this component on non-Morocco pages.
 */

import Link from 'next/link'
import Image from 'next/image'
import type { Lang } from '@/lib/i18n/config'

// ── Launch data (hardcoded editorial content) ──────────────────────────

interface MoroccanAbroadEntry {
  /** API-Football player ID — matches STAR_IDS in the Morocco page */
  playerId: number
  /** Short display name for the card */
  name: string
  /** Current club for breadcrumb-style label */
  clubName: string
  /** One-line editorial form note. Intentionally static at launch. */
  formLine: string
  /** Visual accent — 'hot' adds a subtle green glow; 'steady' stays neutral */
  sentiment: 'hot' | 'steady' | 'cold'
  /** Optional local translation hints for AR/FR form-line rendering */
  formLineAr?: string
  formLineFr?: string
  /** Photo URL — API-Football player image */
  photoUrl: string
}

const MOROCCANS_ABROAD: MoroccanAbroadEntry[] = [
  {
    playerId: 9,
    name: 'Achraf Hakimi',
    clubName: 'Paris Saint-Germain',
    formLine: '3 assists in last 4 PSG matches',
    formLineAr: '3 تمريرات حاسمة في آخر 4 مباريات مع باريس',
    formLineFr: '3 passes décisives lors des 4 derniers matchs du PSG',
    sentiment: 'hot',
    photoUrl: 'https://media.api-sports.io/football/players/9.png',
  },
  {
    playerId: 37103,
    name: 'Youssef En-Nesyri',
    clubName: 'Al-Ittihad',
    formLine: '2 goals in last 3 Saudi Pro League outings',
    formLineAr: 'هدفان في آخر 3 مباريات بالدوري السعودي',
    formLineFr: "2 buts lors des 3 derniers matchs en Saudi Pro League",
    sentiment: 'steady',
    photoUrl: 'https://media.api-sports.io/football/players/37103.png',
  },
  {
    playerId: 2701,
    name: 'Noussair Mazraoui',
    clubName: 'Manchester United',
    formLine: 'Back in the United starting XI',
    formLineAr: 'عاد إلى التشكيلة الأساسية لمانشستر يونايتد',
    formLineFr: 'De retour dans le XI titulaire de Man United',
    sentiment: 'steady',
    photoUrl: 'https://media.api-sports.io/football/players/2701.png',
  },
  {
    playerId: 47422,
    name: 'Hakim Ziyech',
    clubName: 'Al-Duhail',
    formLine: 'Playmaker role, creating from deep',
    formLineAr: 'دور صانع ألعاب، يبدع من العمق',
    formLineFr: 'Rôle de meneur, créateur depuis la profondeur',
    sentiment: 'steady',
    photoUrl: 'https://media.api-sports.io/football/players/47422.png',
  },
  {
    playerId: 744,
    name: 'Ismael Saibari',
    clubName: 'PSV Eindhoven',
    formLine: 'Brace vs Utrecht in the Eredivisie title race',
    formLineAr: 'ثنائية في مرمى أوتريخت ضمن سباق لقب الدوري الهولندي',
    formLineFr: 'Doublé contre Utrecht dans la course au titre en Eredivisie',
    sentiment: 'hot',
    photoUrl: 'https://media.api-sports.io/football/players/744.png',
  },
  {
    playerId: 74,
    name: 'Azzedine Ounahi',
    clubName: 'Marseille',
    formLine: 'Creative outlet in midfield for OM',
    formLineAr: 'محور إبداعي في وسط ميدان مارسيليا',
    formLineFr: 'Rampe de lancement créative au milieu pour l\'OM',
    sentiment: 'steady',
    photoUrl: 'https://media.api-sports.io/football/players/74.png',
  },
]

// ── Component ───────────────────────────────────────────────────────────

interface Props {
  langPrefix: string
  lang: Lang
}

function pickFormLine(entry: MoroccanAbroadEntry, lang: Lang): string {
  if (lang === 'ar' && entry.formLineAr) return entry.formLineAr
  if (lang === 'fr' && entry.formLineFr) return entry.formLineFr
  return entry.formLine
}

export function MoroccansAbroadRail({ langPrefix, lang }: Props) {
  return (
    <section
      aria-label="Moroccans Abroad"
      style={{
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'thin',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 12,
          paddingBottom: 8,
          // Ensure the rail has enough width for all cards without wrap
          minWidth: 'min-content',
        }}
      >
        {MOROCCANS_ABROAD.map(entry => {
          const href = `${langPrefix}/players/${entry.playerId}`
          const isHot = entry.sentiment === 'hot'

          return (
            <Link
              key={entry.playerId}
              href={href}
              aria-label={`${entry.name}, ${entry.clubName}. ${pickFormLine(entry, lang)}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                minWidth: 160,
                maxWidth: 180,
                padding: '16px 12px 14px',
                textDecoration: 'none',
                background: 'var(--card)',
                border: isHot
                  ? '1px solid var(--green)'
                  : '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Hot accent glow — subtle top edge tint */}
              {isHot && (
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background:
                      'linear-gradient(90deg, transparent 0%, var(--green) 50%, transparent 100%)',
                  }}
                />
              )}

              {/* Circular photo */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid var(--border)',
                  marginBottom: 10,
                  background: 'var(--card-alt)',
                  flexShrink: 0,
                }}
              >
                <Image
                  src={entry.photoUrl}
                  alt={entry.name}
                  width={64}
                  height={64}
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                  }}
                />
              </div>

              {/* Name */}
              <div
                style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: 13,
                  fontWeight: 800,
                  color: 'var(--text)',
                  lineHeight: 1.2,
                  marginBottom: 3,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  maxWidth: '100%',
                }}
              >
                {entry.name}
              </div>

              {/* Club */}
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  fontWeight: 600,
                  color: 'var(--text-faint)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '100%',
                }}
              >
                {entry.clubName}
              </div>

              {/* Form line */}
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  lineHeight: 1.35,
                  color: isHot ? 'var(--green)' : 'var(--text-sec)',
                  fontWeight: isHot ? 600 : 500,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  maxWidth: '100%',
                }}
              >
                {pickFormLine(entry, lang)}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
