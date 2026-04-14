/**
 * /[lang]/morocco — the Atlas Lions flagship.
 * ────────────────────────────────────────────────────────────────────
 *
 * Week 3 flagship polish. This page is the emotional and editorial
 * anchor of Atlas Kings. Every other Morocco surface descends from the
 * identity established here.
 *
 * Tone: patriotic and premium. Never governmental, never imply official
 * federation affiliation. The page is a Morocco-first PUBLICATION, not
 * a federation site.
 *
 * Primitive composition:
 *   - <MoroccoHeroBanner variant="page">   — patriotic hero + countdown + CTAs
 *   - <MoroccoSectionHeader>                — branded strip labels
 *   - <MoroccansAbroadRail>                 — unique differentiator
 *   - <TrustBadge state="automated">        — editorial positioning signal
 *   - <MatchCard variant="list-row">        — per-row league labels (cross-competition)
 *   - <StoryCard variant="lead" / "default" / "horizontal"> — article rendering
 *
 * Scope guardrails:
 *   - No sub-page cleanup in this PR
 *   - No article page wiring in this PR
 *   - No homepage changes in this PR
 *   - Featured match dedup: if the live/featured match also appears in
 *     `recent` or `upcoming`, it MUST be filtered out of those strips.
 */

import { pageMetadata } from '@/lib/seo/pageMetadata'
import Image from 'next/image'
import Link from 'next/link'
import { getTeamRecentResults, getTeamUpcomingFixtures, getNextMatch } from '@/lib/api-football/fixtures'
import { getStandings } from '@/lib/api-football/standings'
import { getTeamSquad } from '@/lib/api-football/teams'
import { getArticlesForSectionAsync } from '@/lib/articles/getArticles'
import { MOROCCO_TEAM_ID } from '@/lib/api-football/leagues'
import { MoroccoHeroBanner } from '@/components/primitives/MoroccoHeroBanner'
import { MoroccoSectionHeader } from '@/components/primitives/MoroccoSectionHeader'
import { TrustBadge } from '@/components/primitives/TrustBadge'
import { MoroccansAbroadRail } from '@/components/morocco/MoroccansAbroadRail'
import { StoryCard } from '@/components/cards/StoryCard'
import { MatchCard } from '@/components/primitives/MatchCard'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { TeamLogo } from '@/components/ui/TeamLogo'
import { EmptyState } from '@/components/ui/EmptyState'
import { AdSlot } from '@/components/ads/AdSlot'
import type { Lang } from '@/lib/i18n/config'
import type { MatchData } from '@/lib/data/types'
import { getMoroccoFixtureCards } from '@/lib/data/wc2026'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('morocco', lang, '/morocco')
}

export const revalidate = 60

// ── Star player IDs for the Key Players rail ──────────────────────────
const STAR_IDS = [9, 37103, 2701, 47422, 744, 74, 545, 129678]

const POS_COLORS: Record<string, string> = {
  Goalkeeper: 'var(--gold)',
  Defender: 'var(--navy)',
  Midfielder: 'var(--green)',
  Attacker: 'var(--red)',
}

// ── Localised page-level copy ──────────────────────────────────────────
// Kept inline rather than extended into lib/i18n/translations.ts so this
// PR has zero cross-cutting schema impact. Move into the shared
// translations file in a later sweep if the strings get reused.

interface MoroccoPageCopy {
  h1: string
  dek: string
  thisWeek: string
  moroccansAbroad: string
  recentResults: string
  wcQualification: string
  upcomingFixtures: string
  keyPlayers: string
  moreNews: string
  allFixtures: string
  fullTable: string
  allPlayers: string
  allNews: string
  editorialDisclosureIntro: string
  editorialDisclosureLinkText: string
  emptyStateTitle: string
  emptyStateDescription: string
}

const COPY: Record<Lang, MoroccoPageCopy> = {
  en: {
    h1: 'The digital home of the Atlas Lions.',
    dek: 'Latest news, live scores, fixtures, standings and squad coverage for the Morocco men\'s national team — plus the Moroccans lighting up the top European leagues.',
    thisWeek: 'This Week in Morocco',
    moroccansAbroad: 'Moroccans Abroad',
    recentResults: 'Recent Results',
    wcQualification: 'WC 2026 — Group C',
    upcomingFixtures: 'Upcoming Fixtures',
    keyPlayers: 'Key Players',
    moreNews: 'More Morocco News',
    allFixtures: 'All fixtures →',
    fullTable: 'Full table →',
    allPlayers: 'All players →',
    allNews: 'All news →',
    editorialDisclosureIntro:
      'Atlas Kings is a Morocco-first football publication using AI-assisted workflows for speed, translation, and research, with editorial review on key stories and flagship pages.',
    editorialDisclosureLinkText: 'Read our Editorial Policy →',
    emptyStateTitle: 'Morocco',
    emptyStateDescription: 'Content loading...',
  },
  ar: {
    h1: 'الموطن الرقمي لأسود الأطلس.',
    // Launch Session 3.1: natural single mention of colloquial "كورة"
    // alongside the formal "كرة القدم المغربية" framing, once in the
    // hub dek only (not in headings). Captures diaspora search
    // behaviour without keyword stuffing.
    dek: 'كل ما يهمّ متابعي الكورة المغربية: آخر الأخبار والنتائج المباشرة والمباريات والترتيب وتشكيلة المنتخب الوطني المغربي — إلى جانب المغاربة الذين يتألقون في أقوى الدوريات الأوروبية.',
    thisWeek: 'هذا الأسبوع في المغرب',
    moroccansAbroad: 'المغاربة في الخارج',
    recentResults: 'النتائج الأخيرة',
    wcQualification: 'كأس العالم 2026 — المجموعة ج',
    upcomingFixtures: 'المباريات القادمة',
    keyPlayers: 'اللاعبون الرئيسيون',
    moreNews: 'المزيد من أخبار المغرب',
    allFixtures: 'جميع المباريات ←',
    fullTable: 'الجدول الكامل ←',
    allPlayers: 'جميع اللاعبين ←',
    allNews: 'جميع الأخبار ←',
    editorialDisclosureIntro:
      'أطلس كينغز منشور كروي يركز على المغرب ويستخدم سير عمل مدعومة بالذكاء الاصطناعي للسرعة والترجمة والبحث، مع مراجعة تحريرية للأخبار الرئيسية والصفحات البارزة.',
    editorialDisclosureLinkText: 'اقرأ سياستنا التحريرية ←',
    emptyStateTitle: 'المغرب',
    emptyStateDescription: 'جاري تحميل المحتوى...',
  },
  fr: {
    h1: 'La maison numérique des Lions de l\'Atlas.',
    dek: "Dernières actualités, scores en direct, calendrier, classements et couverture de l'effectif de l'équipe nationale marocaine — ainsi que les Marocains qui brillent dans les plus grands championnats européens.",
    thisWeek: 'Cette semaine au Maroc',
    moroccansAbroad: 'Marocains à l\'étranger',
    recentResults: 'Résultats récents',
    wcQualification: 'CM 2026 — Groupe C',
    upcomingFixtures: 'Prochains matchs',
    keyPlayers: 'Joueurs clés',
    moreNews: 'Plus d\'actualités du Maroc',
    allFixtures: 'Tous les matchs →',
    fullTable: 'Tableau complet →',
    allPlayers: 'Tous les joueurs →',
    allNews: 'Toutes les actualités →',
    editorialDisclosureIntro:
      "Atlas Kings est une publication football centrée sur le Maroc utilisant des flux de travail assistés par IA pour la rapidité, la traduction et la recherche, avec une révision éditoriale sur les articles clés et les pages phares.",
    editorialDisclosureLinkText: 'Lire notre charte éditoriale →',
    emptyStateTitle: 'Maroc',
    emptyStateDescription: 'Chargement du contenu...',
  },
}

// ── Morocco next match — sourced from the canonical WC 2026 module ──
// `getMoroccoFixtureCards()[0]` is the opener (Match 7 BRA v MAR).
// We override `date` with `kickoffUTC` so the hero countdown has a
// full ISO timestamp (18:00 ET = 22:00 UTC in June DST) rather than
// a date-only string. Both this page and /wc-2026 now read from the
// same canonical source, so they can't drift.
const MOROCCO_OPENER = getMoroccoFixtureCards()[0]
const MOROCCO_NEXT_MATCH = {
  ...MOROCCO_OPENER,
  date: MOROCCO_OPENER.kickoffUTC,
}

export default async function MoroccoPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const validLang = (['en', 'ar', 'fr'].includes(lang) ? lang : 'en') as Lang
  const copy = COPY[validLang]
  const p = lang === 'en' ? '' : `/${lang}`
  const langKey = (lang as 'en' | 'ar' | 'fr') || 'en'

  // Fetch all data in parallel
  const [recent, upcoming, nextMatch, wcStandings, squad, articles] = await Promise.all([
    getTeamRecentResults(MOROCCO_TEAM_ID, 4).catch(() => []),
    getTeamUpcomingFixtures(MOROCCO_TEAM_ID, 4).catch(() => []),
    getNextMatch().catch(() => null),
    getStandings('wc').catch(() => []),
    getTeamSquad(MOROCCO_TEAM_ID).catch(() => []),
    getArticlesForSectionAsync('morocco', langKey, 12),
  ])

  // Live match detection across both strips
  const liveMatch: MatchData | null =
    [...recent, ...upcoming].find(m => m.status === 'LIVE' || m.status === 'HT') ?? null

  // Dedup guardrail (required verification check #13): if the hero is showing
  // a specific featured match, that match MUST NOT reappear as the first row
  // in Recent Results or Upcoming Fixtures. When the hero uses the static
  // MOROCCO_NEXT_MATCH (no live game), there's no id to dedup against — the
  // filter becomes a no-op. When the hero IS a live match, we filter by id.
  const featuredMatchId = liveMatch?.id
  const dedupedRecent = featuredMatchId
    ? recent.filter(m => m.id !== featuredMatchId)
    : recent
  const dedupedUpcoming = featuredMatchId
    ? upcoming.filter(m => m.id !== featuredMatchId)
    : upcoming

  // Find Morocco's WC group rows
  const moroccoGroupRows = wcStandings.length > 0 ? findGroupContaining(wcStandings, 'Morocco') : []

  // Star players from squad
  const starSet = new Set(STAR_IDS)
  const stars = squad.filter(pl => starSet.has(pl.id)).slice(0, 8)

  // "This Week in Morocco" editorial block — top-scored article as lead,
  // next 3 as supporting grid. Auto-picked from the pipeline; no human
  // curation in this PR (deliberate tradeoff).
  const thisWeekLead = articles[0]
  const thisWeekSupporting = articles.slice(1, 4)
  const moreArticles = articles.slice(4, 9)

  // Localized breadcrumb label for the current page
  const breadcrumbLabel = validLang === 'ar' ? 'المغرب' : validLang === 'fr' ? 'Maroc' : 'Morocco'

  return (
    <main>
      <div className="page-wrap">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
          {/* ═══ 1. PATRIOTIC HERO ═══ */}
          <MoroccoHeroBanner
            lang={validLang}
            langPrefix={p}
            variant="page"
            nextMatch={MOROCCO_NEXT_MATCH}
          />

          {/* ═══ 2. THIS WEEK IN MOROCCO ═══ */}
          {thisWeekLead && (
            <section aria-label={copy.thisWeek}>
              <MoroccoSectionHeader
                title={copy.thisWeek}
                rightSlot={<TrustBadge state="automated" size="small" lang={validLang} />}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)' }}>
                <StoryCard article={thisWeekLead} langPrefix={p} variant="lead" />
                {thisWeekSupporting.length > 0 && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                      gap: 'var(--gap)',
                    }}
                  >
                    {thisWeekSupporting.map(a => (
                      <StoryCard key={a.slug} article={a} langPrefix={p} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ═══ 4. MOROCCANS ABROAD ═══ */}
          <section aria-label={copy.moroccansAbroad}>
            <MoroccoSectionHeader title={copy.moroccansAbroad} />
            <MoroccansAbroadRail langPrefix={p} lang={validLang} />
          </section>

          {/* ═══ 5. RECENT RESULTS ═══ */}
          {dedupedRecent.length > 0 && (
            <section aria-label={copy.recentResults}>
              <MoroccoSectionHeader
                title={copy.recentResults}
                href={`${p}/morocco/fixtures`}
                hrefLabel={copy.allFixtures}
              />
              <div
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                }}
              >
                {/* Cross-competition fixtures — keep showLeague=true for per-row
                    labels (AFCON, WCQ, friendly, etc.). Decision from the
                    Morocco MatchCard migration PR. */}
                {dedupedRecent.slice(0, 3).map(m => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    variant="list-row"
                    langPrefix={p}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ═══ 6. WC 2026 QUALIFICATION ═══ */}
          {moroccoGroupRows.length > 0 && (
            <section aria-label={copy.wcQualification}>
              <MoroccoSectionHeader
                title={copy.wcQualification}
                href={`${p}/morocco/qualification`}
                hrefLabel={copy.fullTable}
              />
              <div
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                }}
              >
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th className="left">Team</th>
                      <th>P</th>
                      <th>GD</th>
                      <th>Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moroccoGroupRows.map(row => (
                      <tr
                        key={`${row.pos}-${row.team}`}
                        style={{
                          background: row.team.includes('Morocco')
                            ? 'rgba(10, 82, 41, 0.08)'
                            : 'transparent',
                          fontWeight: row.team.includes('Morocco') ? 700 : 400,
                        }}
                      >
                        <td>{row.pos}</td>
                        <td
                          className="team-name"
                          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                          <TeamLogo src={row.logo} alt={row.team} size={16} />
                          {row.team}
                        </td>
                        <td>{row.played}</td>
                        <td>{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                        <td className="pts">{row.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Launch Session 2.6: crosslink from Morocco hub to the
                  WC 2026 tournament hub. Natural bridge since Morocco
                  is drawn in Group C of WC 2026. */}
              <Link
                href={`${p}/wc-2026`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 12,
                  padding: '10px 16px',
                  fontFamily: 'var(--font-head)',
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--green-bright)',
                  background: 'rgba(10, 82, 41, 0.08)',
                  border: '1px solid rgba(10, 82, 41, 0.3)',
                  borderRadius: 'var(--radius-sm)',
                  textDecoration: 'none',
                }}
              >
                {lang === 'ar'
                  ? 'المغرب في مونديال 2026 →'
                  : lang === 'fr'
                  ? 'Le Maroc à la CM 2026 →'
                  : 'Morocco at WC 2026 →'}
              </Link>
            </section>
          )}

          {/* ═══ 7. UPCOMING FIXTURES ═══ */}
          {dedupedUpcoming.length > 0 && (
            <section aria-label={copy.upcomingFixtures}>
              <MoroccoSectionHeader title={copy.upcomingFixtures} />
              <div
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                }}
              >
                {dedupedUpcoming.slice(0, 3).map(m => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    variant="list-row"
                    langPrefix={p}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ═══ 8. KEY PLAYERS RAIL ═══ */}
          {stars.length > 0 && (
            <section aria-label={copy.keyPlayers}>
              <MoroccoSectionHeader
                title={copy.keyPlayers}
                href={`${p}/morocco/key-players`}
                hrefLabel={copy.allPlayers}
              />
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  overflowX: 'auto',
                  paddingBottom: 8,
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {stars.map(player => (
                  <Link
                    key={player.id}
                    href={`${p}/players/${player.id}`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minWidth: 90,
                      padding: '12px 8px',
                      textDecoration: 'none',
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '2px solid var(--border)',
                        marginBottom: 8,
                      }}
                    >
                      <Image
                        src={player.photo}
                        alt={player.name}
                        width={52}
                        height={52}
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-head)',
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'var(--text)',
                        textAlign: 'center',
                        lineHeight: 1.2,
                      }}
                    >
                      {player.name.split(' ').slice(-1)[0]}
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 8,
                        fontWeight: 700,
                        color: '#fff',
                        background: POS_COLORS[player.position] ?? 'var(--green)',
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-sm)',
                        marginTop: 4,
                      }}
                    >
                      {player.position?.slice(0, 3).toUpperCase()}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ═══ 9. MORE MOROCCO NEWS ═══ */}
          {moreArticles.length > 0 && (
            <section aria-label={copy.moreNews}>
              <MoroccoSectionHeader
                title={copy.moreNews}
                href={`${p}/morocco/news`}
                hrefLabel={copy.allNews}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {moreArticles.map(a => (
                  <StoryCard key={a.slug} article={a} langPrefix={p} variant="horizontal" />
                ))}
              </div>
            </section>
          )}

          {/* ═══ Empty state fallback ═══ */}
          {articles.length === 0 && recent.length === 0 && upcoming.length === 0 && (
            <EmptyState
              icon="🇲🇦"
              title={copy.emptyStateTitle}
              description={copy.emptyStateDescription}
            />
          )}

          {/* ═══ 10. AD SLOT ═══ */}
          <AdSlot size="banner" id="ad-morocco-home" />

          {/* ═══ 11. EDITORIAL DISCLOSURE FOOTER ═══ */}
          <div
            style={{
              marginTop: 'var(--section-gap)',
              padding: '20px 24px',
              background: 'var(--card-alt)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: 'var(--text-sec)',
                lineHeight: 1.55,
                margin: '0 0 8px',
                maxWidth: 720,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {copy.editorialDisclosureIntro}
            </p>
            <Link
              href={`${p}/editorial`}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--red)',
                textDecoration: 'none',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {copy.editorialDisclosureLinkText}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

/** Find standings rows for the group containing a given team name */
function findGroupContaining(standings: any[], teamName: string): any[] {
  const moroccoRow = standings.find(r => r.team?.includes(teamName))
  if (!moroccoRow) return []
  const idx = standings.indexOf(moroccoRow)
  let start = idx
  while (start > 0 && standings[start - 1].pos < standings[start].pos) start--
  let end = idx
  while (end < standings.length - 1 && standings[end + 1].pos > standings[end].pos) end++
  return standings.slice(start, end + 1)
}
