/**
 * /[lang]/matches/[id] — native flagship match detail page.
 *
 * §3 rebuild:
 *   - Removes both <ApiSportsWidget> iframe dependencies (game + h2h).
 *   - Consolidates score rendering into a single canonical <LiveMatchScore>
 *     header. No duplicate bespoke score block.
 *   - Adds native events timeline, lineups, statistics, pre-match context,
 *     and post-match key moments — each rendered from `MatchDetail` arrays.
 *   - Adds full generateMetadata() with SportsEvent JSON-LD.
 *   - Breadcrumb now includes the league link where one exists.
 *   - Applies Morocco treatment when either team is Morocco / a Moroccan
 *     club: red/green/red flag stripe + green border accent on the header.
 *
 * Data source: `footballData.match(id)` (via safe-fetch wrapper) — the
 * data service layer catches upstream failures and returns null, which
 * renders the <EmptyState> fallback instead of crashing.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { footballData } from '@/lib/data/service'
import { detectLeagueKey, leagueKeyToSlug } from '@/lib/api-football/match-detail'
import { MOROCCO_TEAM_ID, MOROCCAN_TEAMS, LEAGUES, type LeagueKey } from '@/lib/api-football/leagues'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { EmptyState } from '@/components/ui/EmptyState'
import { LiveMatchScore } from '@/components/primitives/LiveMatchScore'
import { WhatsAppShare } from '@/components/ui/WhatsAppShare'
import { MatchEventsTimeline } from '@/components/match/MatchEventsTimeline'
import { MatchLineups } from '@/components/match/MatchLineups'
import { MatchStatistics } from '@/components/match/MatchStatistics'
import { MatchKeyMoments } from '@/components/match/MatchKeyMoments'
import { MatchPreMatchContext } from '@/components/match/MatchPreMatchContext'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'
import type { MatchDetail } from '@/lib/data/types'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://atlaskings.com'
const MOROCCAN_CLUB_IDS = new Set(Object.values(MOROCCAN_TEAMS).map(t => t.id))

interface Props {
  params: Promise<{ id: string; lang: string }>
}

// ── Status helpers ──────────────────────────────────────────────────────

const LIVE_STATUSES = new Set(['1H', '2H', 'HT', 'ET', 'P', 'LIVE', 'BT'])
const FINISHED_STATUSES = new Set(['FT', 'AET', 'PEN'])

function isMoroccoMatch(match: MatchDetail): boolean {
  const homeId = match.teams.home.id
  const awayId = match.teams.away.id
  if (homeId === MOROCCO_TEAM_ID || awayId === MOROCCO_TEAM_ID) return true
  if (MOROCCAN_CLUB_IDS.has(homeId) || MOROCCAN_CLUB_IDS.has(awayId)) return true
  return false
}

// ── Metadata ────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, lang } = await params
  const validLang = (['en', 'ar', 'fr'].includes(lang) ? lang : 'en') as Lang
  const match = await footballData.match(id)

  if (!match) {
    return { title: { absolute: 'Match not found — Atlas Kings' } }
  }

  const home = match.teams.home.name
  const away = match.teams.away.name
  const competition = match.league.name
  const status = match.fixture.status.short
  const isDone = FINISHED_STATUSES.has(status)
  const score = isDone
    ? ` — ${match.goals.home ?? 0}-${match.goals.away ?? 0}`
    : ''

  const title = `${home} vs ${away}${score} — ${competition} — Atlas Kings`
  const description = `Live score, lineups, events and statistics from ${home} vs ${away} in ${competition}.`

  const prefix = lang === 'en' ? '' : `/${lang}`
  const url = `${SITE_URL}${prefix}/matches/${id}`

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/matches/${id}`,
        ar: `${SITE_URL}/ar/matches/${id}`,
        fr: `${SITE_URL}/fr/matches/${id}`,
        'x-default': `${SITE_URL}/matches/${id}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'Atlas Kings',
      locale: validLang === 'ar' ? 'ar_MA' : validLang === 'fr' ? 'fr_FR' : 'en_GB',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

// ── SportsEvent JSON-LD ────────────────────────────────────────────────

function sportsEventSchema(match: MatchDetail, lang: Lang, url: string) {
  const status = match.fixture.status.short
  const eventStatus = FINISHED_STATUSES.has(status)
    ? 'EventCompleted'
    : LIVE_STATUSES.has(status)
      ? 'EventInProgress'
      : status === 'PST'
        ? 'EventPostponed'
        : status === 'CANC' || status === 'ABD'
          ? 'EventCancelled'
          : 'EventScheduled'

  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${match.teams.home.name} vs ${match.teams.away.name}`,
    url,
    startDate: match.fixture.date,
    eventStatus: `https://schema.org/${eventStatus}`,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: match.fixture.venue?.name ?? 'TBD',
      address: match.fixture.venue?.city ?? undefined,
    },
    homeTeam: {
      '@type': 'SportsTeam',
      name: match.teams.home.name,
      logo: match.teams.home.logo,
    },
    awayTeam: {
      '@type': 'SportsTeam',
      name: match.teams.away.name,
      logo: match.teams.away.logo,
    },
    organizer: {
      '@type': 'SportsOrganization',
      name: match.league.name,
      logo: match.league.logo,
    },
    superEvent: {
      '@type': 'SportsEvent',
      name: `${match.league.name}${match.league.round ? ` · ${match.league.round}` : ''}`,
    },
    inLanguage: lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-GB',
  }
}

// ── Page ────────────────────────────────────────────────────────────────

export default async function MatchPage({ params }: Props) {
  const { id, lang } = await params
  const validLang = (['en', 'ar', 'fr'].includes(lang) ? lang : 'en') as Lang
  const t = getTranslations(validLang)
  const s = t.sections
  const p = lang === 'en' ? '' : `/${lang}`

  // All match data flows through the data service so upstream API failures
  // are caught and return null instead of throwing.
  const match = await footballData.match(id)

  if (!match) {
    return (
      <main>
        <div className="page-wrap">
          <div className="card" style={{ padding: 40 }}>
            <EmptyState
              icon="⚽"
              title="Match not found"
              description="The match may have been rescheduled or the link may be stale."
              actionLabel={t.ui.backToHome}
              actionHref={`${p}/`}
            />
          </div>
        </div>
      </main>
    )
  }

  // Derived flags
  const status = match.fixture.status.short
  const isLive = LIVE_STATUSES.has(status)
  const isFinished = FINISHED_STATUSES.has(status)
  const isNotStarted = status === 'NS' || status === 'TBD'
  const moroccoMatch = isMoroccoMatch(match)

  // League breadcrumb link — null when league has no site presence
  const leagueKey: LeagueKey = detectLeagueKey(match.league.id)
  const leagueSlug = leagueKeyToSlug(leagueKey)
  const leagueLabel = match.league.name

  const canonicalUrl = `${SITE_URL}${p}/matches/${id}`
  const jsonLd = sportsEventSchema(match, validLang, canonicalUrl)

  return (
    <>
      {/* SportsEvent JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        <div className="page-wrap">
          <Breadcrumb
            langPrefix={p}
            items={[
              leagueSlug
                ? { label: leagueLabel, href: `${p}/${leagueSlug}` }
                : { label: leagueLabel },
              { label: `${match.teams.home.name} v ${match.teams.away.name}` },
            ]}
          />

          <div
            style={{
              maxWidth: 860,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--gap)',
            }}
          >
            {/* ═══ 1. CANONICAL SCORE HEADER ═══ */}
            <LiveMatchScore
              matchId={id}
              initial={match}
              lang={validLang}
              moroccoMatch={moroccoMatch}
            />

            {/* WhatsApp share — share the score */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
              <WhatsAppShare
                text={`${match.teams.home.name} ${match.goals.home ?? ''} - ${match.goals.away ?? ''} ${match.teams.away.name}`}
                url={`https://atlaskings.com${p}/matches/${id}`}
                variant="icon"
                lang={validLang}
              />
            </div>

            {/* ═══ 2. PRE-MATCH CONTEXT (only when NS) ═══ */}
            {isNotStarted && <MatchPreMatchContext match={match} lang={validLang} />}

            {/* ═══ 3. POST-MATCH KEY MOMENTS (only when FT/AET/PEN) ═══ */}
            {isFinished && <MatchKeyMoments match={match} lang={validLang} />}

            {/* ═══ 4. EVENTS TIMELINE ═══
                 Always renders. Empty state handles pre-match case. */}
            <MatchEventsTimeline match={match} lang={validLang} />

            {/* ═══ 5. LINEUPS ═══
                 Always renders. Empty state handles pre-announcement case.
                 Launch Session 2.4: langPrefix threaded for player deeplinks. */}
            <MatchLineups match={match} lang={validLang} langPrefix={p} />

            {/* ═══ 6. STATISTICS ═══
                 Always renders. Empty state handles pre-match case. */}
            <MatchStatistics match={match} lang={validLang} />

            {/* ═══ 7. RELATED LINKS FOOTER ═══ */}
            <nav
              aria-label="Related"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
                padding: '16px 20px',
                background: 'var(--card-alt)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
              }}
            >
              {leagueSlug && (
                <RelatedLink href={`${p}/${leagueSlug}/scores`} label={`${leagueLabel} Scores`} />
              )}
              <RelatedLink href={`${p}/scores`} label={s.scoresAndFixtures} />
              {moroccoMatch && (
                <RelatedLink href={`${p}/morocco`} label="🇲🇦 Morocco Hub" />
              )}
            </nav>
          </div>
        </div>
      </main>
    </>
  )
}

// ── Small helpers ───────────────────────────────────────────────────────

function RelatedLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        fontFamily: 'var(--font-head)',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: 'var(--text)',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        padding: '8px 14px',
        textDecoration: 'none',
        minHeight: 36,
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {label}
    </Link>
  )
}
