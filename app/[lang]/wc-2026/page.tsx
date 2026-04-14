import { pageMetadata } from '@/lib/seo/pageMetadata'
import { WorldCupPageShell } from '@/components/world-cup/WorldCupPageShell'
import { MoroccoHeroBanner } from '@/components/world-cup/MoroccoHeroBanner'
import { MoroccoGroupCard } from '@/components/world-cup/MoroccoGroupCard'
import { LiveMatchRail } from '@/components/world-cup/LiveMatchRail'
import { HeroFeature } from '@/components/world-cup/HeroFeature'
import { MiniStandings } from '@/components/world-cup/MiniStandings'
import { PlayerLeaderboard } from '@/components/world-cup/PlayerLeaderboard'
import { FixturesPreview } from '@/components/world-cup/FixturesPreview'
import { BracketTree } from '@/components/world-cup/BracketTree'
import { getWorldCupOverview } from '@/lib/api-football/worldcup'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'
import Link from 'next/link'
// Canonical WC 2026 data — single source of truth. Any edits to
// Morocco's group composition, fixtures, or venues must go through
// `lib/data/wc2026.ts`, not inline here.
import {
  MOROCCO_GROUP_LETTER,
  MOROCCO_FIFA_RANK,
  getMoroccoGroupTableRows,
  getMoroccoFixtureCards,
  getStaticGroupStandings,
} from '@/lib/data/wc2026'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('world-cup-2026', lang, '/wc-2026')
}

export const revalidate = 1800

// Morocco's group data — resolved from the canonical module so the
// hub always reflects the official FIFA seeded order (C1 Brazil,
// C2 Morocco, C3 Haiti, C4 Scotland) and the correct verified venues.
const MOROCCO_GROUP = MOROCCO_GROUP_LETTER
const MOROCCO_RANK = MOROCCO_FIFA_RANK
const MOROCCO_GROUP_TEAMS = getMoroccoGroupTableRows()
const MOROCCO_FIXTURES = getMoroccoFixtureCards()

// Launch Session 1.4: Morocco-first h1 + dek on the WC 2026 hub.
// Inlined per-locale rather than threaded through translations.ts
// because this is a single-page brand statement that mirrors the
// homepage pattern.
const HUB_HEADER: Record<Lang, { h1: string; dek: string }> = {
  en: {
    h1: 'FIFA World Cup 2026',
    dek: "Morocco's road to the 2026 tournament in USA, Canada & Mexico — Group C, fixtures, squad and live coverage.",
  },
  ar: {
    h1: 'كأس العالم 2026',
    dek: 'طريق المغرب إلى مونديال 2026 في الولايات المتحدة وكندا والمكسيك — المجموعة C، المباريات، التشكيلة والتغطية المباشرة.',
  },
  fr: {
    h1: 'Coupe du Monde 2026',
    dek: "La route du Maroc vers le tournoi 2026 aux États-Unis, au Canada et au Mexique — Groupe C, calendrier, effectif et couverture en direct.",
  },
}

export default async function WorldCup2026Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const validLang = (['en', 'ar', 'fr'].includes(lang) ? lang : 'en') as Lang
  const t = getTranslations(validLang)
  const p = lang === 'en' ? '' : `/${lang}`
  const header = HUB_HEADER[validLang] ?? HUB_HEADER.en

  const overview = await getWorldCupOverview()

  // "All Groups" grid. We used to read `overview.miniStandings` here,
  // but pre-tournament the live API returns rows in arbitrary order
  // (and sometimes only the handful of groups that happen to have
  // fixtures scheduled) — which produced the "4 groups, reversed
  // alphabetical" bug. Instead we render the full 12-group skeleton
  // from the canonical WC 2026 module in official seeded PDF order,
  // excluding Morocco's Group C since it's already shown above in
  // <MoroccoGroupCard>. Switch this back to `overview.miniStandings`
  // once real match data exists and the API returns a correct order.
  const liveHasData = overview.miniStandings.some(g =>
    g.rows.some(r => (r.played ?? 0) > 0),
  )
  const otherGroups = liveHasData
    ? overview.miniStandings.filter(g => g.group !== `Group ${MOROCCO_GROUP}`)
    : getStaticGroupStandings({ excludeGroup: MOROCCO_GROUP })

  return (
    <WorldCupPageShell
      title={header.h1}
      description={header.dek}
      lang={lang}
      isHub
      hideBreadcrumb
    >
      {/* ═══ 1. LIVE MATCHES (only during tournament) ═══ */}
      {overview.liveMatches.length > 0 && (
        <LiveMatchRail matches={overview.liveMatches} langPrefix={p} lang={validLang} />
      )}

      {/* ═══ 2. MOROCCO HERO BANNER — patriotic, Morocco-first ═══ */}
      <div style={{ marginTop: overview.liveMatches.length > 0 ? 'var(--gap)' : 0 }}>
        <MoroccoHeroBanner
          lang={validLang}
          langPrefix={p}
          // Hero countdown needs a full ISO timestamp (kickoffUTC);
          // MoroccoGroupCard further down keeps the YYYY-MM-DD `date`.
          nextMatch={{ ...MOROCCO_FIXTURES[0], date: MOROCCO_FIXTURES[0].kickoffUTC }}
          moroccoGroup={MOROCCO_GROUP}
          moroccoRank={MOROCCO_RANK}
        />
      </div>

      {/* ═══ 3. MOROCCO'S GROUP — enlarged, highlighted ═══ */}
      <div style={{ marginTop: 'var(--section-gap)' }}>
        <MoroccoGroupCard
          group={MOROCCO_GROUP}
          teams={MOROCCO_GROUP_TEAMS}
          fixtures={MOROCCO_FIXTURES}
          langPrefix={p}
          lang={lang}
        />
      </div>

      {/* ═══ 4. OTHER GROUPS (grid) + TOP SCORERS ═══ */}
      {(otherGroups.length > 0 || overview.topScorers.length > 0) && (
        <div style={{ marginTop: 'var(--section-gap)' }}>
          {/* Section header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <h2 style={{
              fontFamily: 'var(--font-head)', fontSize: 'var(--h3)', fontWeight: 800,
              letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text)',
              margin: 0, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ width: 4, height: 18, borderRadius: 2, background: 'var(--green)', display: 'inline-block' }} />
              {t.sections?.allGroups || 'All Groups'}
            </h2>
            <Link href={`${p}/wc-2026/standings`} style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
              color: 'var(--red)', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              {t.sections?.allWC || 'View All'} →
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--gap)',
          }}>
            {otherGroups.length > 0 && (
              <div>
                <MiniStandings groups={otherGroups} />
              </div>
            )}
            {overview.topScorers.length > 0 && (
              <PlayerLeaderboard
                title={t.ui?.player?.goals || 'Top Scorers'}
                rows={overview.topScorers}
                statLabel={t.ui?.player?.goals || 'Goals'}
                langPrefix={p}
              />
            )}
          </div>
        </div>
      )}

      {/* ═══ 5. UPCOMING FIXTURES (all teams) ═══ */}
      {overview.fixturesPreview.length > 0 && (
        <div style={{ marginTop: 'var(--section-gap)' }}>
          <FixturesPreview
            title={t.sections?.upcomingFixtures || 'Upcoming Fixtures'}
            fixtures={overview.fixturesPreview}
            langPrefix={p}
            lang={lang}
          />
        </div>
      )}

      {/* ═══ 6. PREDICTOR CTA ═══
           Redesigned to align with the v2 brand language:
           • Dark green gradient (shared with the bracket centre pill)
           • Official WC 2026 trophy SVG on the right so the card
             reads as "the predictor" instantly
           • Copy localised inline for EN / AR / FR
           • Standard --radius + --section-gap for consistency with
             every other section on this hub. */}
      <div style={{ marginTop: 'var(--section-gap)' }}>
        <Link
          href={`${p}/wc-2026/predictor`}
          aria-label={
            validLang === 'ar'
              ? 'توقع نتائج كأس العالم 2026'
              : validLang === 'fr'
                ? 'Prédire la Coupe du Monde 2026'
                : 'Predict the FIFA World Cup 2026'
          }
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            gap: 20,
            textDecoration: 'none',
            background: 'linear-gradient(135deg, #0a5229 0%, #073d1e 55%, #041a0e 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 28px',
            border: '1px solid rgba(230, 180, 80, 0.25)',
            boxShadow: '0 4px 20px rgba(10, 82, 41, 0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'relative', zIndex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#e6b450', marginBottom: 8,
            }}>
              {validLang === 'ar' ? 'تفاعلي' : validLang === 'fr' ? 'Interactif' : 'Interactive'}
            </div>
            <h3 style={{
              fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 900,
              fontStyle: 'italic', color: '#ffffff', margin: 0, lineHeight: 1.15,
              letterSpacing: '0.01em',
            }}>
              {validLang === 'ar'
                ? 'توقع كأس العالم 2026'
                : validLang === 'fr'
                  ? 'Prédisez la Coupe du Monde 2026'
                  : 'Predict the World Cup 2026'}
            </h3>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 13,
              color: 'rgba(255,255,255,0.7)', margin: '10px 0 0', lineHeight: 1.55,
              maxWidth: 520,
            }}>
              {validLang === 'ar'
                ? 'أكمل مباريات المجموعات، شغّل محاكاة مونت كارلو، وشارك توقعاتك.'
                : validLang === 'fr'
                  ? 'Remplissez les matchs de groupes, lancez la simulation Monte Carlo et partagez votre tableau.'
                  : 'Fill in group matches, run the Monte Carlo simulation, and share your bracket.'}
            </p>
            <div style={{
              fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 800,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#1a1a1a', marginTop: 18,
              background: 'linear-gradient(135deg, #e6b450 0%, #c48f1f 100%)',
              display: 'inline-flex',
              padding: '9px 18px', borderRadius: 'var(--radius-sm)',
              boxShadow: '0 2px 10px rgba(230, 180, 80, 0.35)',
            }}>
              {validLang === 'ar'
                ? 'ابدأ التوقع ←'
                : validLang === 'fr'
                  ? 'Commencer →'
                  : 'Start Predicting →'}
            </div>
          </div>
          {/* Trophy logo — drops below 420 px viewport via CSS */}
          <div
            className="predictor-cta-trophy"
            style={{
              width: 96,
              height: 112,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: 'drop-shadow(0 4px 12px rgba(196, 143, 31, 0.4))',
            }}
            aria-hidden="true"
          >
            <img
              src="/brand/wc-2026-trophy.svg"
              alt=""
              style={{ width: 'auto', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </Link>
      </div>

      {/* ═══ 7. BRACKET PREVIEW ═══ */}
      {overview.bracketPreview.length > 0 && (
        <div style={{ marginTop: 'var(--section-gap)' }}>
          <BracketTree matches={overview.bracketPreview} langPrefix={p} lang={validLang} />
        </div>
      )}

      {/* ═══ 8. ALSO COVER: WC 2030 (Launch Session 2.5) ═══
           Reciprocal crosslink to the WC 2030 cluster. Morocco is
           one of the 2030 co-hosts so the two tournaments are a
           natural story pair for diaspora readers. */}
      <div style={{ marginTop: 'var(--section-gap)' }}>
        <Link
          href={`${p}/world-cup-2030`}
          style={{
            display: 'block',
            textDecoration: 'none',
            background: 'linear-gradient(135deg, #0a5229 0%, #041a0e 60%, #1a1a2e 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 20px',
            border: '1px solid rgba(62, 204, 120, 0.2)',
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
              marginBottom: 6,
            }}
          >
            {validLang === 'ar' ? 'أيضاً' : validLang === 'fr' ? 'Aussi' : 'Also'}
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 18,
              fontWeight: 800,
              fontStyle: 'italic',
              color: '#ffffff',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {validLang === 'ar'
              ? 'المغرب يستضيف كأس العالم 2030'
              : validLang === 'fr'
              ? 'Le Maroc accueille la Coupe du Monde 2030'
              : 'Morocco Hosts the 2030 FIFA World Cup'}
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'rgba(255,255,255,0.65)',
              margin: '8px 0 0',
              lineHeight: 1.5,
            }}
          >
            {validLang === 'ar'
              ? 'ستة ملاعب في ست مدن. أول كأس عالم تستضيفه شمال أفريقيا.'
              : validLang === 'fr'
              ? "Six stades à travers six villes. La première Coupe du Monde organisée en Afrique du Nord."
              : 'Six stadiums across six cities. The first World Cup hosted in North Africa.'}
          </p>
        </Link>
      </div>
    </WorldCupPageShell>
  )
}
