import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { categoryColor } from '@/lib/utils'
import { getArticlesForSectionAsync } from '@/lib/articles/getArticles'
import { getTodayFixtures } from '@/lib/api-football/fixtures'
import { getStandings } from '@/lib/api-football/standings'
import { AdSlot } from '@/components/ads/AdSlot'
import { EmptyState } from '@/components/ui/EmptyState'
import { TeamLogo } from '@/components/ui/TeamLogo'
import { StoryCard } from '@/components/cards/StoryCard'
import { MatchCard } from '@/components/primitives/MatchCard'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'
import type { ArticleCategory } from '@/types/article'
import type { LeagueKey } from '@/lib/api-football/leagues'

interface SubLink { label: string; href: string }

interface SectionPageProps {
  title: string
  category: ArticleCategory
  description: string
  /** Optional localised dek rendered above the widget grid. */
  descriptionByLang?: Record<'en' | 'ar' | 'fr', string>
  subLinks: SubLink[]
  activeSubLink?: string
  children?: React.ReactNode
  lang?: string
  /** When true, hides breadcrumb + dek (section has its own SectionBar). */
  hideBreadcrumb?: boolean
}

const LEAGUE_KEYS: Record<string, LeagueKey> = {
  'morocco': 'afcon', 'botola-pro': 'botola', 'premier-league': 'pl',
  'la-liga': 'laliga', 'champions-league': 'ucl', 'world-cup': 'wc',
}

const SECTION_STYLES: Record<string, { color: string; icon: string; league: string }> = {
  'morocco':          { color: '#0a5229', icon: '🇲🇦', league: 'National Team' },
  'botola-pro':       { color: '#0a5229', icon: '🏆', league: 'Botola Pro' },
  'premier-league':   { color: '#3d195b', icon: '⚽', league: 'Premier League' },
  'la-liga':          { color: '#ee8700', icon: '⚽', league: 'La Liga' },
  'champions-league': { color: '#0a1f5c', icon: '⭐', league: 'Champions League' },
  'transfers':        { color: '#c1121f', icon: '🔄', league: 'Transfer Window' },
  'world-cup':        { color: '#c0000b', icon: '🏆', league: 'World Cup 2026' },
}

export async function SectionPage({ title, category, description, descriptionByLang, subLinks, children, lang = 'en', hideBreadcrumb }: SectionPageProps) {
  const color = categoryColor(category)
  const style = SECTION_STYLES[category] ?? { color, icon: '⚽', league: title }
  const leagueKey = LEAGUE_KEYS[category]
  const p = lang === 'en' ? '' : `/${lang}`
  const t = getTranslations((lang as Lang) || 'en')
  const s = t.sections

  const [matches, standings] = await Promise.all([
    leagueKey ? getTodayFixtures(leagueKey).catch(() => []) : Promise.resolve([]),
    leagueKey ? getStandings(leagueKey).catch(() => []) : Promise.resolve([]),
  ])

  const allArticles = await getArticlesForSectionAsync(category, lang as 'en' | 'ar' | 'fr', 12)
  const leadArticle = allArticles[0]
  const secondaryArticles = allArticles.slice(1, 4)
  const moreArticles = allArticles.slice(4, 10)
  const sidebarArticles = allArticles.slice(0, 5)

  const liveMatches = matches.filter(m => m.status === 'LIVE' || m.status === 'HT')
  const featuredMatch = liveMatches[0] ?? matches[0]
  const hasMatchDay = matches.length > 0

  // Launch Session 3.1: pick the localised dek only when the caller
  // provided a descriptionByLang map. When not provided, nothing
  // renders — keeps the existing league hubs visually unchanged.
  const localisedDek = descriptionByLang
    ? (descriptionByLang[(['en', 'ar', 'fr'] as const).find(l => l === lang) ?? 'en'] ?? descriptionByLang.en)
    : null

  return (
    <main>
      <div className="page-wrap">
        {/* Mobile: single column | Desktop: 8/4 grid */}
        <div className="widget-shell">

          {/* ═══ MAIN CONTENT ═══ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>

            {/* 1. LIVE / NEXT KEY MATCH CARD */}
            {featuredMatch && (
              <MatchCard match={featuredMatch} variant="hero" langPrefix={p} />
            )}

            {/* 2. LEAD STORY */}
            {leadArticle && (
              <StoryCard article={leadArticle} langPrefix={p} variant="lead" />
            )}

            {/* 3. MINI SCORES CAROUSEL (if match day) */}
            {hasMatchDay && matches.length > 1 && (
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
                  <Link href={`${p}/${category === 'morocco' ? 'morocco/fixtures' : category + '/scores'}`} style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--red)', textDecoration: 'none', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>
                    {s.allMatches}
                  </Link>
                </div>
                {/* Fixture rows — parent strip already labels "LIVE" / "LATEST
                    RESULTS" above, and the whole strip is scoped to a single
                    league, so per-row league headers would be redundant.
                    Same override pattern as /scores and /fixtures. */}
                {matches.slice(0, 5).map(m => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    variant="list-row"
                    langPrefix={p}
                    showLeague={false}
                  />
                ))}
              </div>
            )}

            {/* 4. SECONDARY STORIES (3 cards) */}
            {secondaryArticles.length > 0 && (
              <div>
                <h2 style={{
                  fontFamily: 'var(--font-head)', fontSize: 'var(--h3)', fontWeight: 800,
                  letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text)',
                  marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${style.color}`,
                }}>
                  {s.latestNews}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--gap)' }}>
                  {secondaryArticles.map(a => (
                    <StoryCard key={a.slug} article={a} langPrefix={p} />
                  ))}
                </div>
              </div>
            )}

            {/* 5. MINI TABLE CARD (top 5) */}
            {standings.length > 0 && category !== 'transfers' && (
              <div style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', overflow: 'hidden',
              }}>
                <div style={{
                  padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)' }}>
                    {s.standings}
                  </span>
                  <Link href={`${p}/${category}/table`} style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--red)', textDecoration: 'none', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>
                    {s.fullTable}
                  </Link>
                </div>
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
                    {standings.slice(0, 5).map(row => (
                      <tr key={`${row.pos}-${row.team}`}>
                        <td>{row.pos}</td>
                        <td className="team-name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
            )}

            {/* 6. MORE NEWS FEED */}
            {moreArticles.length > 0 && (
              <div>
                <h2 style={{
                  fontFamily: 'var(--font-head)', fontSize: 'var(--h3)', fontWeight: 800,
                  letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text)',
                  marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${style.color}`,
                }}>
                  {s.moreNews}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {moreArticles.map(a => (
                    <StoryCard key={a.slug} article={a} langPrefix={p} variant="horizontal" />
                  ))}
                </div>
              </div>
            )}

            {/* No articles state */}
            {allArticles.length === 0 && (
              <div className="card">
                <EmptyState icon="📰" title={s.latestNews} description="" />
              </div>
            )}

            {children}
          </div>

          {/* ═══ DESKTOP SIDE RAIL ═══ */}
          <aside className="sidebar">
            {/* Quick standings */}
            {standings.length > 0 && category !== 'transfers' && (
              <div style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 'var(--gap)',
              }}>
                <div style={{
                  padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)' }}>
                    {s.standings}
                  </span>
                  <Link href={`${p}/${category}/table`} style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--red)', textDecoration: 'none', fontWeight: 700,
                  }}>
                    {s.fullTable}
                  </Link>
                </div>
                <table className="data-table">
                  <thead>
                    <tr><th>#</th><th className="left">Team</th><th>Pts</th></tr>
                  </thead>
                  <tbody>
                    {standings.slice(0, 6).map(row => (
                      <tr key={`${row.pos}-${row.team}`}>
                        <td>{row.pos}</td>
                        <td className="team-name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <TeamLogo src={row.logo} alt={row.team} size={14} />
                          {row.team}
                        </td>
                        <td className="pts">{row.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Top stories */}
            {sidebarArticles.length > 0 && (
              <div style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 'var(--gap)',
              }}>
                <div style={{
                  padding: '10px 16px', borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)' }}>
                    {s.topStories}
                  </span>
                </div>
                {sidebarArticles.map(a => (
                  <StoryCard key={a.slug} article={a} langPrefix={p} variant="horizontal" showImage={false} showExcerpt={false} />
                ))}
              </div>
            )}

            <AdSlot size="sidebar-rectangle" id={`ad-${category}`} />
          </aside>
        </div>
      </div>
    </main>
  )
}
