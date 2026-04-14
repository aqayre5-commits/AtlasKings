/**
 * Homepage — §4 rebuild.
 *
 * Editorial hierarchy, Morocco-first:
 *   1. Brand h1 + tagline ("The Home of Moroccan Football")
 *   2. <HomeHero> — single cascade-resolved hero (live Morocco → next Morocco
 *      → featured Morocco article → top article). See components/home/HomeHero.tsx.
 *   3. Today's fixtures strip (MatchCard list-row).
 *   4. Morocco spotlight — <MoroccoSectionHeader> + lead + grid. This is the
 *      section with unmistakably greater visual weight than European sections.
 *   5. Top stories by European section — plain section headers, neutral border.
 *   6. Latest news feed — red border kept as the site's "newsroom" signal.
 *
 * §4 guardrails honoured:
 *   - One clear hero only (resolved server-side in <HomeHero>).
 *   - Priority 1 full-match fetch is conditional inside HomeHero.
 *   - Priorities 3/4 render plain <StoryCard variant="lead"> with no chrome.
 *   - Morocco primitives are reused, not reinvented.
 *   - CountdownBanner removed from the homepage surface.
 */

import { pageMetadata } from '@/lib/seo/pageMetadata'
import Link from 'next/link'
import { StandingsTabs } from '@/components/home/StandingsTabs'
import { HomeHero } from '@/components/home/HomeHero'
import { getArticlesForSectionAsync, getAllArticles } from '@/lib/articles/getArticles'
import { getTranslations } from '@/lib/i18n/translations'
import { footballData } from '@/lib/data/service'
import { StoryCard } from '@/components/cards/StoryCard'
import { MatchCard } from '@/components/primitives/MatchCard'
import { MoroccoSectionHeader } from '@/components/primitives/MoroccoSectionHeader'
import { AdSlot } from '@/components/ads/AdSlot'
import { MOROCCO_TEAM_ID } from '@/lib/api-football/leagues'
import type { Lang } from '@/lib/i18n/config'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('home', lang, '/')
}

export const revalidate = 60

// ── Localised h1 + dek ──────────────────────────────────────────────────
// Kept inline rather than threaded through translations.ts — this is a
// one-off brand statement used only here. The footer tagline uses the
// same EN string intentionally (single brand voice).

const HOME_TAGLINE: Record<Lang, { h1: string; dek: string }> = {
  en: {
    h1: 'The Home of Moroccan Football',
    dek: 'Morocco-first football coverage — Atlas Lions, Botola Pro, and the leagues that shape the game.',
  },
  ar: {
    h1: 'موطن كرة القدم المغربية',
    dek: 'تغطية كروية من قلب المغرب — أسود الأطلس، البطولة الاحترافية، والبطولات التي تصنع اللعبة.',
  },
  fr: {
    h1: 'Le temple du football marocain',
    dek: "Une couverture centrée sur le Maroc — les Lions de l'Atlas, la Botola Pro et les compétitions qui font le football.",
  },
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const validLang = (['en', 'ar', 'fr'].includes(lang) ? lang : 'en') as Lang
  const t = getTranslations(validLang)
  const s = t.sections
  const p = lang === 'en' ? '' : `/${lang}`
  const tagline = HOME_TAGLINE[validLang] ?? HOME_TAGLINE.en

  // ── Football data — all fetches go through the unified data service.
  // Each call is guarded internally (never throws) and returns a safe
  // default on failure, so the page always renders.
  const [todayMatches, standings, moroccoUpcoming] = await Promise.all([
    footballData.todayMatches(),
    footballData.allStandings(),
    footballData.teamUpcoming(MOROCCO_TEAM_ID, 1),
  ])

  const allArticles = await getAllArticles(validLang)
  const featured = allArticles.find(a => a.featured) ?? allArticles[0]
  const headlines = allArticles.slice(0, 8)

  // Section articles
  const [moroccoArticles, botolaArticles, uclArticles, plArticles] = await Promise.all([
    getArticlesForSectionAsync('morocco', validLang, 5),
    getArticlesForSectionAsync('botola-pro', validLang, 4),
    getArticlesForSectionAsync('champions-league', validLang, 4),
    getArticlesForSectionAsync('premier-league', validLang, 4),
  ])

  const { live: liveMatches } = footballData.splitLive(todayMatches)

  // Sidebar top stories (for desktop rail)
  const sidebarStories = allArticles.filter(a => a.slug !== featured?.slug).slice(0, 6)

  // Featured Morocco article for Priority 3 (top-scored Morocco story).
  const featuredMoroccoArticle = moroccoArticles[0] ?? null

  return (
    <main>
      <div className="page-wrap">
        {/* Desktop: 2-column (main + sidebar) | Mobile: single column */}
        <div className="widget-shell">

          {/* ═══ MAIN CONTENT COLUMN ═══ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>

            {/* ═══ 1. BRAND H1 + DEK ═══ */}
            <header
              data-home-tagline
              style={{
                paddingBottom: 4,
              }}
            >
              <h1
                style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: 'clamp(28px, 5vw, 44px)',
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: '-0.01em',
                  color: 'var(--text)',
                  margin: '0 0 10px',
                }}
              >
                {tagline.h1}
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(14px, 2vw, 16px)',
                  lineHeight: 1.5,
                  color: 'var(--text-sec)',
                  margin: 0,
                  maxWidth: 640,
                }}
              >
                {tagline.dek}
              </p>
            </header>

            {/* ═══ 2. SINGLE CASCADE HERO ═══ */}
            <HomeHero
              lang={validLang}
              langPrefix={p}
              todayMatches={todayMatches}
              moroccoUpcoming={moroccoUpcoming}
              fallbackArticle={featured ?? null}
              featuredMoroccoArticle={featuredMoroccoArticle}
            />

            {/* ═══ 3. TODAY'S FIXTURES STRIP ═══ */}
            {todayMatches.length > 0 && (
              <div style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', overflow: 'hidden',
              }}>
                <div style={{
                  padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)' }}>
                    {liveMatches.length > 0 ? s.live : s.latestResults}
                  </span>
                  <Link href={`${p}/scores`} style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--red)', textDecoration: 'none', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>
                    {s.allScores}
                  </Link>
                </div>
                {todayMatches.slice(0, 5).map(m => (
                  <MatchCard key={m.id} match={m} variant="list-row" langPrefix={p} />
                ))}
              </div>
            )}

            {/* ═══ 4. MOROCCO SPOTLIGHT — greater visual weight ═══ */}
            {moroccoArticles.length >= 2 && (
              <section data-morocco-spotlight>
                <MoroccoSectionHeader
                  title={t.nav.morocco}
                  href={`${p}/morocco`}
                  hrefLabel={s.allMorocco}
                />
                {/* Lead + grid layout: lead on top/left, 3 more in a grid
                    beneath on desktop, stacked on mobile. */}
                <div
                  style={{
                    display: 'grid',
                    gap: 'var(--gap)',
                    gridTemplateColumns: '1fr',
                  }}
                >
                  <StoryCard article={moroccoArticles[0]} langPrefix={p} variant="lead" />
                  <div
                    style={{
                      display: 'grid',
                      gap: 'var(--gap)',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    }}
                  >
                    {moroccoArticles.slice(1, 5).map(a => (
                      <StoryCard key={a.slug} article={a} langPrefix={p} showExcerpt={false} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ═══ 5. EUROPEAN SECTIONS — toned down ═══ */}
            {[
              { title: t.nav.botolaP, articles: botolaArticles, href: '/botola-pro' },
              { title: t.nav.ucl, articles: uclArticles, href: '/champions-league' },
              { title: t.nav.premierLeague, articles: plArticles, href: '/premier-league' },
            ]
              .filter(sec => sec.articles.length >= 2)
              .map(sec => (
                <section key={sec.href}>
                  <h2 style={{
                    fontFamily: 'var(--font-head)', fontSize: 'var(--h3)', fontWeight: 800,
                    letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text)',
                    marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    {sec.title}
                    <Link href={`${p}${sec.href}`} style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-sec)', textDecoration: 'none', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                    }}>
                      →
                    </Link>
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {sec.articles.slice(0, 3).map(a => (
                      <StoryCard key={a.slug} article={a} langPrefix={p} variant="horizontal" />
                    ))}
                  </div>
                </section>
              ))}

            {/* ═══ 6. LATEST NEWS FEED ═══ */}
            {headlines.length > 3 && (
              <section>
                <h2 style={{
                  fontFamily: 'var(--font-head)', fontSize: 'var(--h3)', fontWeight: 800,
                  letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text)',
                  marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid var(--red)',
                }}>
                  {s.topHeadlines}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--gap)' }}>
                  {headlines.slice(3, 9).map(a => (
                    <StoryCard key={a.slug} article={a} langPrefix={p} showExcerpt={false} />
                  ))}
                </div>
              </section>
            )}

            <AdSlot size="banner" id="ad-home-bottom" />
          </div>

          {/* ═══ DESKTOP SIDEBAR ═══ */}
          <aside className="sidebar">
            {/* Standings tabs */}
            <StandingsTabs lang={validLang} standings={standings} />

            {/* Top stories */}
            {sidebarStories.length > 0 && (
              <div style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', overflow: 'hidden', marginTop: 'var(--gap)',
              }}>
                <div style={{
                  padding: '10px 16px', borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)' }}>
                    {s.topStories}
                  </span>
                </div>
                {sidebarStories.map(a => (
                  <StoryCard key={a.slug} article={a} langPrefix={p} variant="horizontal" showImage={false} showExcerpt={false} />
                ))}
              </div>
            )}

            <AdSlot size="sidebar-rectangle" id="ad-home-sidebar" />
          </aside>
        </div>
      </div>
    </main>
  )
}
