/**
 * /morocco/squad — Morocco national team player pool.
 * ─────────────────────────────────────────────────────────────────────
 *
 * The 5-second promise: "Who is in Morocco's full player pool right now?"
 *
 * This is deliberately NOT a windowed call-up. api-football's
 * /players/squads endpoint returns the federation-registered pool (all
 * Atlas Lions-eligible players on the federation roster), which is
 * typically ~35–40 names. There is no clean public feed for the latest
 * international-window call-up, and hand-curating that list would drift
 * between windows — producing exactly the kind of stale data a football
 * publication can't afford to ship.
 *
 * Instead, this page is honest about what it shows: the full player
 * pool, auto-updating, grouped by position, captain flagged. The
 * "who matters this week" narrative lives at /morocco/key-players —
 * these two pages are intentionally distinct:
 *
 *   /morocco/squad        → the full pool (auto, ~40 players)
 *   /morocco/key-players  → the stars (curated, ~7 players)
 *
 * Captain handling: Achraf Hakimi (api-football id 9) is flagged with a
 * captain pill.
 */

import { pageMetadata } from '@/lib/seo/pageMetadata'
import Image from 'next/image'
import Link from 'next/link'
import { WidgetPageShell } from '@/components/layout/WidgetPageShell'
import { MoroccoSectionHeader } from '@/components/primitives/MoroccoSectionHeader'
import { getTeamSquad } from '@/lib/api-football/teams'
import { EmptyState } from '@/components/ui/EmptyState'
import { MOROCCO_TEAM_ID } from '@/lib/api-football/leagues'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('morocco/squad', lang, '/morocco/squad')
}

export const revalidate = 86400

// Api-football player id for the current Morocco captain. Update if the
// captaincy changes.
const CAPTAIN_ID = 9 // Achraf Hakimi

const POS_ORDER = ['Goalkeeper', 'Defender', 'Midfielder', 'Attacker']
const POS_COLORS: Record<string, string> = {
  Goalkeeper: 'var(--gold)',
  Defender: 'var(--navy)',
  Midfielder: 'var(--green)',
  Attacker: 'var(--red)',
}

const POS_LABEL_EN: Record<string, string> = {
  Goalkeeper: 'Goalkeepers',
  Defender: 'Defenders',
  Midfielder: 'Midfielders',
  Attacker: 'Forwards',
}

const DEK: Record<Lang, string> = {
  en: "Morocco's full federation-registered player pool — every Atlas Lion currently eligible for the senior national team, grouped by position. For the current first-choice spine, see Key Players.",
  ar: 'مجموع لاعبي المنتخب المغربي المسجّلين لدى الجامعة — كل لاعب أسود الأطلس مؤهّل حاليًا للمنتخب الأول، مرتّبًا حسب المركز. للاطلاع على الركيزة الأساسية الحالية، راجع «اللاعبون الرئيسيون».',
  fr: "Le vivier complet du Maroc inscrit à la fédération — chaque Lion de l'Atlas actuellement éligible pour la sélection A, regroupé par poste. Pour l'ossature titulaire actuelle, voir Joueurs clés.",
}

const POOL_LABEL: Record<Lang, string> = {
  en: 'in the pool',
  ar: 'في المجموع',
  fr: 'dans le vivier',
}

export default async function MoroccoSquadPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const langKey = (lang as 'en' | 'ar' | 'fr') || 'en'
  const p = lang === 'en' ? '' : `/${lang}`

  // Localised page title — "Player Pool" rather than the translations
  // "Squad" / "التشكيلة" / "Effectif" to match the reframed promise.
  const PAGE_TITLE: Record<Lang, string> = {
    en: 'Player Pool',
    ar: 'مجموع اللاعبين',
    fr: 'Vivier des joueurs',
  }

  const squad = await getTeamSquad(MOROCCO_TEAM_ID).catch(() => [])

  type Player = (typeof squad)[number]
  const grouped: Record<string, Player[]> = {}
  for (const player of squad) {
    const pos = player.position || 'Unknown'
    if (!grouped[pos]) grouped[pos] = []
    grouped[pos].push(player)
  }

  const sortedGroups = POS_ORDER.filter(pos => grouped[pos]?.length > 0)

  return (
    <WidgetPageShell
      section="Morocco"
      sectionHref="/morocco"
      title={PAGE_TITLE[langKey]}
      category="morocco"
      lang={lang}
    >
      {/* ── Dek ───────────────────────────────────────────────────── */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)' }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          lineHeight: 1.55,
          color: 'var(--text-sec)',
          margin: 0,
          maxWidth: 640,
        }}>
          {DEK[langKey] ?? DEK.en}
        </p>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--green-bright)',
          marginTop: 10,
        }}>
          {squad.length} {POOL_LABEL[langKey]}
        </div>
      </div>

      {/* ── Position groups ───────────────────────────────────────── */}
      {sortedGroups.length > 0 ? (
        sortedGroups.map(pos => (
          <div key={pos} style={{ padding: '24px 16px 0' }}>
            <MoroccoSectionHeader
              title={`${POS_LABEL_EN[pos] ?? pos} (${grouped[pos].length})`}
              as="h2"
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: 0,
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
              }}
            >
              {grouped[pos].map(player => {
                const isCaptain = player.id === CAPTAIN_ID
                return (
                  <Link
                    key={player.id}
                    href={`${p}/players/${player.id}`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '18px 12px 14px',
                      textDecoration: 'none',
                      borderBottom: '1px solid var(--border)',
                      borderRight: '1px solid var(--border)',
                      background: isCaptain ? 'rgba(10, 82, 41, 0.06)' : 'transparent',
                      transition: 'background var(--t-fast)',
                      position: 'relative',
                      minHeight: 'var(--tap-min)',
                    }}
                  >
                    {/* Captain pill */}
                    {isCaptain && (
                      <span
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          fontFamily: 'var(--font-mono)',
                          fontSize: 8,
                          fontWeight: 800,
                          letterSpacing: '0.08em',
                          color: '#fff',
                          background: 'var(--red)',
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        C
                      </span>
                    )}

                    {/* Photo */}
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        background: 'var(--card-alt)',
                        border: `2px solid ${isCaptain ? 'var(--green)' : 'var(--border)'}`,
                        marginBottom: 10,
                        flexShrink: 0,
                      }}
                    >
                      {player.photo ? (
                        <Image
                          src={player.photo}
                          alt={player.name}
                          width={72}
                          height={72}
                          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'var(--font-head)',
                            fontSize: 20,
                            fontWeight: 800,
                            color: 'var(--text-faint)',
                          }}
                        >
                          {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <div
                      style={{
                        fontFamily: 'var(--font-head)',
                        fontSize: 14,
                        fontWeight: 700,
                        color: 'var(--text)',
                        textAlign: 'center',
                        lineHeight: 1.25,
                      }}
                    >
                      {player.name}
                    </div>

                    {/* Number + position pill */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                      {player.number && (
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 11,
                            fontWeight: 700,
                            color: 'var(--text-sec)',
                          }}
                        >
                          #{player.number}
                        </span>
                      )}
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 9,
                          fontWeight: 700,
                          color: '#fff',
                          background: POS_COLORS[pos] ?? 'var(--green)',
                          padding: '2px 7px',
                          borderRadius: 'var(--radius-sm)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {pos.slice(0, 3).toUpperCase()}
                      </span>
                    </div>

                    {/* Age */}
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'var(--text-faint)',
                        marginTop: 4,
                      }}
                    >
                      Age {player.age}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))
      ) : (
        <div style={{ padding: 16 }}>
          <EmptyState
            icon="🇲🇦"
            title="Squad loading"
            description="The Morocco squad will appear here once the feed is available."
          />
        </div>
      )}

      {/* Bottom breathing room */}
      {sortedGroups.length > 0 && <div style={{ height: 24 }} />}
    </WidgetPageShell>
  )
}
