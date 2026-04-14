/**
 * /morocco/qualification — flagship qualification tracker.
 * ─────────────────────────────────────────────────────────────────────
 *
 * The 5-second promise: "Can Morocco qualify for WC 2026 / AFCON, and
 * what's left on the road to get there?"
 *
 * Layout:
 *   1. Quick-facts strip — status verdict + key metadata
 *   2. Curated "Where Morocco stands" editorial paragraph (the one thing
 *      the API cannot give us: context)
 *   3. WC 2026 Group C card — standings table, Morocco row highlighted
 *   4. AFCON qualifying group card — same treatment
 *   5. Remaining fixtures strip (filtered to qualifying comps)
 *   6. Recent qualifying results strip
 *   7. Qualification news rail
 *   8. SportsEvent JSON-LD for the next qualifier
 *
 * Empty-state behaviour: each section hides cleanly if its data is
 * missing. If ALL data is missing, we still render the editorial block
 * so the page is never blank.
 */

import { pageMetadata } from '@/lib/seo/pageMetadata'
import Link from 'next/link'
import { WidgetPageShell } from '@/components/layout/WidgetPageShell'
import { MoroccoSectionHeader } from '@/components/primitives/MoroccoSectionHeader'
import { getTeamRecentResults, getTeamUpcomingFixtures } from '@/lib/api-football/fixtures'
import { getStandings } from '@/lib/api-football/standings'
import { getArticlesForTeam } from '@/lib/articles/getArticles'
import { TeamLogo } from '@/components/ui/TeamLogo'
import { StoryCard } from '@/components/cards/StoryCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { MOROCCO_TEAM_ID } from '@/lib/api-football/leagues'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'
import type { StandingRow } from '@/lib/data/placeholderData'
import type { MatchData } from '@/lib/data/placeholderData'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('morocco/qualification', lang, '/morocco/qualification')
}

export const revalidate = 3600

// ── Curated editorial verdict (one piece of context the API cannot give)
// Keep these updated as qualification progresses. Short, factual, no hype.
const VERDICT: Record<Lang, string> = {
  en: "Morocco enter this qualification cycle as Africa's best-performing side of the 2022 World Cup — the first African semifinalist in history. With a top-15 FIFA ranking, a settled European-based core and home advantage in the 2025 AFCON, the Atlas Lions are one of the continent's clearest favourites to reach both tournaments.",
  ar: "يدخل المغرب دورة التأهل هذه باعتباره أفضل منتخب أفريقي في مونديال 2022 — أول منتخب قاري يصل إلى نصف النهائي في التاريخ. بتصنيف ضمن أفضل 15 عالمياً، ومجموعة أساسية مستقرة من اللاعبين المحترفين في أوروبا، وميزة الأرض في كأس أفريقيا 2025، يُعدّ أسود الأطلس من أبرز المرشحين للتأهل إلى البطولتين.",
  fr: "Le Maroc aborde ce cycle de qualification avec le statut de meilleure équipe africaine de la Coupe du Monde 2022 — premier demi-finaliste africain de l'histoire. Classé dans le top 15 mondial, porté par une ossature stable évoluant en Europe et bénéficiant de l'avantage du terrain à la CAN 2025, les Lions de l'Atlas figurent parmi les favoris clairs du continent pour décrocher les deux billets.",
}

function isQualifyingComp(m: MatchData): boolean {
  const c = m.competition?.toLowerCase() ?? ''
  return c.includes('world cup') || c.includes('afcon') || c.includes('africa cup')
    || c.includes('africa') || c.includes('qualif')
}

/**
 * Walk the flat standings array to find the contiguous group containing
 * a Morocco row. API-Football returns standings as a flat list after
 * getStandings() flattens per-group arrays, so we reconstruct the group
 * by looking for the ascending-position window that contains Morocco.
 */
function findGroupContaining(standings: StandingRow[], teamName: string): StandingRow[] {
  const moroccoRow = standings.find(r => r.team?.includes(teamName))
  if (!moroccoRow) return []
  const idx = standings.indexOf(moroccoRow)
  let start = idx
  while (start > 0 && standings[start - 1].pos < standings[start].pos) start--
  let end = idx
  while (end < standings.length - 1 && standings[end + 1].pos > standings[end].pos) end++
  return standings.slice(start, end + 1)
}

// ── Small presentation atoms (page-local, not worth primitives) ──────

function QuickFact({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 80 }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--green-bright)', marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 800,
        color: 'var(--text)', lineHeight: 1.1,
      }}>
        {value}
      </div>
    </div>
  )
}

function GroupTable({ rows, highlightTeam }: { rows: StandingRow[]; highlightTeam: string }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>#</th>
          <th className="left">Team</th>
          <th>P</th>
          <th>W</th>
          <th>D</th>
          <th>L</th>
          <th>GD</th>
          <th>Pts</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => {
          const isMorocco = row.team.includes(highlightTeam)
          return (
            <tr
              key={`${row.pos}-${row.team}`}
              style={{
                background: isMorocco ? 'rgba(10, 82, 41, 0.14)' : 'transparent',
                fontWeight: isMorocco ? 700 : 400,
                borderLeft: isMorocco ? '3px solid var(--green)' : '3px solid transparent',
              }}
            >
              <td>{row.pos}</td>
              <td className="team-name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <TeamLogo src={row.logo} alt={row.team} size={16} />
                {row.team}
              </td>
              <td>{row.played}</td>
              <td>{row.won}</td>
              <td>{row.drawn}</td>
              <td>{row.lost}</td>
              <td>{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
              <td className="pts">{row.pts}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function FixtureRow({ m, langPrefix }: { m: MatchData; langPrefix: string }) {
  const isDone = m.status === 'FT'
  const homeWon = isDone && (m.home.score ?? 0) > (m.away.score ?? 0)
  const awayWon = isDone && (m.away.score ?? 0) > (m.home.score ?? 0)
  return (
    <Link href={`${langPrefix}/matches/${m.id}`} className="match-card">
      <div className="match-card-team">
        <TeamLogo src={m.home.logo} alt={m.home.name} size={18} />
        <span className={`match-card-team-name${homeWon ? ' winner' : ''}`}>{m.home.name}</span>
        {isDone && <span className="match-card-score">{m.home.score}</span>}
      </div>
      <div className="match-card-team">
        <TeamLogo src={m.away.logo} alt={m.away.name} size={18} />
        <span className={`match-card-team-name${awayWon ? ' winner' : ''}`}>{m.away.name}</span>
        {isDone && <span className="match-card-score">{m.away.score}</span>}
      </div>
      <div className="match-card-meta">
        <span className="match-card-date">{m.competition} · {m.date}</span>
        <span className={`match-card-status ${isDone ? 'ft' : 'time'}`}>
          {isDone ? 'FT' : m.time}
        </span>
      </div>
    </Link>
  )
}

// ── Page ─────────────────────────────────────────────────────────────

export default async function MoroccoQualificationPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = getTranslations((lang as Lang) || 'en')
  const s = t.sections
  const p = lang === 'en' ? '' : `/${lang}`
  const langKey = (lang as 'en' | 'ar' | 'fr') || 'en'

  const [wcStandings, afconStandings, recent, upcoming] = await Promise.all([
    getStandings('wc').catch(() => [] as StandingRow[]),
    getStandings('afcon').catch(() => [] as StandingRow[]),
    getTeamRecentResults(MOROCCO_TEAM_ID, 10).catch(() => [] as MatchData[]),
    getTeamUpcomingFixtures(MOROCCO_TEAM_ID, 6).catch(() => [] as MatchData[]),
  ])

  const articles = getArticlesForTeam('morocco', langKey, 6).filter(a => {
    const text = `${a.title} ${a.excerpt} ${(a.tags ?? []).join(' ')}`.toLowerCase()
    return text.includes('qualif') || text.includes('group') || text.includes('afcon')
      || text.includes('world cup') || text.includes('تصفي') || text.includes('مجموع') || text.includes('كأس')
  }).slice(0, 4)

  const moroccoGroupRows = findGroupContaining(wcStandings, 'Morocco')
  const moroccoAfconRows = findGroupContaining(afconStandings, 'Morocco')

  const qualifyingRecent = recent.filter(isQualifyingComp)
  const qualifyingUpcoming = upcoming.filter(isQualifyingComp)

  // Morocco's position in the group (if available), used for the verdict
  const moroccoRowWc = moroccoGroupRows.find(r => r.team.includes('Morocco'))
  const groupStatus = moroccoRowWc
    ? `${moroccoRowWc.pts} pts · ${moroccoRowWc.won}W-${moroccoRowWc.drawn}D-${moroccoRowWc.lost}L`
    : '—'

  // SportsEvent JSON-LD for the next qualifying fixture.
  // inLanguage matches the page locale for consistency with the rest
  // of the JSON-LD stack (FAQPage on /tickets, Place on /stadiums,
  // TouristDestination on /cities, SportsEvent on the WC 2030 hub).
  const nextQualifier = qualifyingUpcoming[0]
  const sportsEventJsonLd = nextQualifier ? {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    inLanguage: langKey,
    name: `${nextQualifier.home.name} vs ${nextQualifier.away.name}`,
    sport: 'Soccer',
    startDate: nextQualifier.date,
    homeTeam: { '@type': 'SportsTeam', name: nextQualifier.home.name },
    awayTeam: { '@type': 'SportsTeam', name: nextQualifier.away.name },
    eventStatus: 'https://schema.org/EventScheduled',
  } : null

  const hasAnyData =
    moroccoGroupRows.length > 0 || moroccoAfconRows.length > 0 ||
    qualifyingRecent.length > 0 || qualifyingUpcoming.length > 0

  return (
    <WidgetPageShell section="Morocco" sectionHref="/morocco" title={s.qualification} category="morocco" lang={lang}>
      {sportsEventJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsEventJsonLd) }}
        />
      )}

      {/* ── 1. Quick-facts strip ─────────────────────────────────── */}
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--card-alt)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 24,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <QuickFact label={s.wc2026Label} value={`${s.group} C`} />
        <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch' }} />
        <QuickFact label={s.fifaRanking} value="#13" />
        <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch' }} />
        <QuickFact label={s.coach} value="Ouahbi" />
        <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch' }} />
        <QuickFact label={s.group} value={groupStatus} />
      </div>

      {/* ── 2. Editorial verdict ─────────────────────────────────── */}
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid var(--border)',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 15,
          lineHeight: 1.55,
          color: 'var(--text-sec)',
          margin: 0,
          maxWidth: 680,
        }}>
          {VERDICT[langKey] ?? VERDICT.en}
        </p>
      </div>

      {/* ── 3. WC 2026 Group C table ─────────────────────────────── */}
      {moroccoGroupRows.length > 0 && (
        <div style={{ padding: '16px 16px 0' }}>
          <MoroccoSectionHeader
            title={`${s.wc2026Label} — ${s.group} C`}
            as="h2"
          />
          <GroupTable rows={moroccoGroupRows} highlightTeam="Morocco" />
        </div>
      )}

      {/* ── 4. AFCON qualifying group table ───────────────────────── */}
      {moroccoAfconRows.length > 0 && (
        <div style={{ padding: '24px 16px 0' }}>
          <MoroccoSectionHeader
            title={s.afconQualifiers}
            as="h2"
          />
          <GroupTable rows={moroccoAfconRows} highlightTeam="Morocco" />
        </div>
      )}

      {/* ── 5. Remaining qualifying fixtures ──────────────────────── */}
      {qualifyingUpcoming.length > 0 && (
        <div style={{ padding: '24px 16px 0' }}>
          <MoroccoSectionHeader
            title={s.upcomingFixtures}
            as="h2"
          />
          <div className="match-card-grid">
            {qualifyingUpcoming.map(m => (
              <div key={m.id} className="match-card">
                <div className="match-card-team">
                  <TeamLogo src={m.home.logo} alt={m.home.name} size={18} />
                  <span className="match-card-team-name">{m.home.name}</span>
                </div>
                <div className="match-card-team">
                  <TeamLogo src={m.away.logo} alt={m.away.name} size={18} />
                  <span className="match-card-team-name">{m.away.name}</span>
                </div>
                <div className="match-card-meta">
                  <span className="match-card-date">{m.competition} · {m.date}</span>
                  <span className="match-card-status time">{m.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 6. Recent qualifying results ──────────────────────────── */}
      {qualifyingRecent.length > 0 && (
        <div style={{ padding: '24px 16px 0' }}>
          <MoroccoSectionHeader
            title={s.recentResults}
            as="h2"
          />
          <div className="match-card-grid">
            {qualifyingRecent.slice(0, 6).map(m => (
              <FixtureRow key={m.id} m={m} langPrefix={p} />
            ))}
          </div>
        </div>
      )}

      {/* ── 7. Qualification news rail ────────────────────────────── */}
      {articles.length > 0 && (
        <div style={{ padding: '24px 16px 16px' }}>
          <MoroccoSectionHeader
            title={s.latestNews}
            as="h2"
            href={`${p}/morocco/news`}
            hrefLabel={s.allMorocco}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {articles.map(a => (
              <StoryCard key={a.slug} article={a} langPrefix={p} variant="horizontal" />
            ))}
          </div>
        </div>
      )}

      {/* ── 8. Absolute fallback ──────────────────────────────────── */}
      {!hasAnyData && articles.length === 0 && (
        <div style={{ padding: 16 }}>
          <EmptyState
            icon="🇲🇦"
            title={s.qualification}
            description="Live qualification data will appear here once match feeds are available."
          />
        </div>
      )}
    </WidgetPageShell>
  )
}
