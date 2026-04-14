/**
 * <HomeHero> — Morocco-first hero cascade resolver for the homepage.
 *
 * §4 guardrail: one clear hero only, chosen by this server-side cascade:
 *
 *   Priority 1 — LIVE Morocco match
 *     → <LiveMatchScore moroccoMatch> with the full MatchDetail payload.
 *       NOTE: Priority 1 requires a dedicated footballData.match(id) call
 *       because todayMatches returns MatchData (list shape) not MatchDetail
 *       (header shape). That fetch is INTENTIONALLY conditional — it only
 *       fires when a live Morocco match is actually detected, so on a normal
 *       day the hero stays cheap (zero extra API calls).
 *
 *   Priority 2 — Morocco's next match within the next 72 hours
 *     → <MoroccoHeroBanner variant="page"> with countdown + patriotic chrome.
 *
 *   Priority 3 — Featured Morocco article
 *     → Plain <StoryCard variant="lead">. No patriotic framing around it —
 *       per §4 guardrail, article-fallback heroes win on content, not chrome.
 *
 *   Priority 4 — Top-scored article overall (the graceful fallback)
 *     → Same plain <StoryCard variant="lead">. No chrome.
 *
 * This component is a pure server async component. It owns the fetching
 * side-effects that belong to the cascade (Priority 1's MatchDetail call)
 * so the page file stays readable and the cost is isolated.
 */

import { footballData } from '@/lib/data/service'
import { MOROCCO_TEAM_ID, MOROCCAN_TEAMS } from '@/lib/api-football/leagues'
import { MoroccoHeroBanner, type MoroccoMatch } from '@/components/primitives/MoroccoHeroBanner'
import { LiveMatchScore } from '@/components/primitives/LiveMatchScore'
import { StoryCard } from '@/components/cards/StoryCard'
import type { MatchData } from '@/lib/data/types'
import type { ArticleMeta } from '@/types/article'
import type { Lang } from '@/lib/i18n/config'

// ── Inputs ──────────────────────────────────────────────────────────────

export interface HomeHeroProps {
  lang: Lang
  langPrefix: string
  /** Fetched by the page from footballData.todayMatches(). */
  todayMatches: MatchData[]
  /** Fetched by the page from footballData.teamUpcoming(MOROCCO_TEAM_ID, 1). */
  moroccoUpcoming: MatchData[]
  /** Fetched by the page — usually the top-scored article from getAllArticles. */
  fallbackArticle: ArticleMeta | null
  /** Optional: the top-scored Morocco article from the pipeline. */
  featuredMoroccoArticle?: ArticleMeta | null
}

// ── Morocco team detection (name-based, per §4 plan) ────────────────────

const MOROCCAN_CLUB_NAME_FRAGMENTS = Object.values(MOROCCAN_TEAMS)
  .map(t => t.name.toLowerCase())

function isMoroccoTeamMatch(m: MatchData): boolean {
  const home = m.home.name.toLowerCase()
  const away = m.away.name.toLowerCase()
  if (home === 'morocco' || away === 'morocco') return true
  for (const frag of MOROCCAN_CLUB_NAME_FRAGMENTS) {
    if (home.includes(frag) || away.includes(frag)) return true
    // Also match shorter forms: "raja casablanca" → "raja", etc.
    const short = frag.split(' ')[0]
    if (short.length >= 4 && (home.includes(short) || away.includes(short))) return true
  }
  return false
}

function isLiveStatus(status: string): boolean {
  return status === 'LIVE' || status === 'HT'
}

// ── Priority 2 window: 72 hours from now ───────────────────────────────

const MOROCCO_COUNTDOWN_WINDOW_MS = 72 * 60 * 60 * 1000

function isWithinWindow(dateIso: string, windowMs: number): boolean {
  const target = new Date(dateIso).getTime()
  if (Number.isNaN(target)) return false
  const diff = target - Date.now()
  return diff > 0 && diff <= windowMs
}

// ── MatchData → MoroccoMatch adapter for Priority 2 ─────────────────────
//
// MoroccoHeroBanner expects a MoroccoMatch shape that exposes the opponent
// (non-Morocco team) and home/away flag. MatchData uses raw home/away
// names. This adapter bridges the two without introducing a new shared
// type — the adapter is homepage-specific coupling and stays inline.

function toMoroccoMatch(m: MatchData): MoroccoMatch | null {
  const homeIsMorocco = m.home.name.toLowerCase() === 'morocco'
  const awayIsMorocco = m.away.name.toLowerCase() === 'morocco'
  if (!homeIsMorocco && !awayIsMorocco) return null

  const opponent = homeIsMorocco ? m.away : m.home
  const opponentCode = opponent.shortName || opponent.name.slice(0, 3).toUpperCase()

  // Venue field is a pre-concatenated "Name, City" string on MatchData.
  // Split best-effort.
  const venueParts = (m.venue ?? '').split(',').map(s => s.trim()).filter(Boolean)
  const venueName = venueParts[0] ?? ''
  const venueCity = venueParts[1] ?? ''

  // MatchData's date is a display string like "Sat, 13 Jun" — not ISO.
  // For the countdown we'd need the real ISO. If not present on this shape,
  // return null and the cascade falls through to priority 3/4. In practice
  // footballData.teamUpcoming() doesn't expose the ISO datetime directly on
  // MatchData, so we prefer to render the static Morocco hero with no
  // countdown target — BUT MoroccoHeroBanner's countdown hook reads
  // `nextMatch.date` as ISO. Defensive: if the field looks non-ISO, fall
  // through so we don't render a broken countdown.
  const dateIso = (m as MatchData & { iso?: string }).iso ?? m.date
  if (!dateIso || !dateIso.includes('T')) {
    // We don't have a real ISO for the countdown. Cascade falls through.
    return null
  }

  return {
    opponent: opponent.name,
    opponentCode,
    opponentFlag: opponent.logo ?? '',
    date: dateIso,
    venue: venueName,
    city: venueCity,
    isHome: homeIsMorocco,
    matchNumber: 0,
    status: 'upcoming',
  }
}

// ── Component ───────────────────────────────────────────────────────────

export async function HomeHero({
  lang,
  langPrefix,
  todayMatches,
  moroccoUpcoming,
  fallbackArticle,
  featuredMoroccoArticle,
}: HomeHeroProps) {
  // ── Priority 1: LIVE Morocco match ──
  // Conditional fetch: only call footballData.match(id) when a live Morocco
  // match is actually present in todayMatches. On normal days this is skipped
  // entirely, so the hero stays cheap.
  const liveMoroccoMatchData = todayMatches.find(
    m => isLiveStatus(m.status) && isMoroccoTeamMatch(m),
  )

  if (liveMoroccoMatchData) {
    const fullMatch = await footballData.match(liveMoroccoMatchData.id)
    if (fullMatch) {
      return (
        <LiveMatchScore
          matchId={liveMoroccoMatchData.id}
          initial={fullMatch}
          lang={lang}
          moroccoMatch
        />
      )
    }
    // Full-match fetch failed — fall through silently.
  }

  // ── Priority 2: Morocco's next match within 72h ──
  const nextMoroccoFixture = moroccoUpcoming[0]
  if (nextMoroccoFixture) {
    const adapted = toMoroccoMatch(nextMoroccoFixture)
    if (adapted && isWithinWindow(adapted.date, MOROCCO_COUNTDOWN_WINDOW_MS)) {
      return (
        <MoroccoHeroBanner
          lang={lang}
          langPrefix={langPrefix}
          variant="page"
          nextMatch={adapted}
        />
      )
    }
  }

  // ── Priority 3: Featured Morocco article (plain card, no chrome) ──
  if (featuredMoroccoArticle) {
    return <StoryCard article={featuredMoroccoArticle} variant="lead" langPrefix={langPrefix} />
  }

  // ── Priority 4: Top article fallback (plain card, no chrome) ──
  if (fallbackArticle) {
    return <StoryCard article={fallbackArticle} variant="lead" langPrefix={langPrefix} />
  }

  // ── Absolute fallback: nothing to render ──
  // The page will still have the h1 tagline, today's fixtures strip, and
  // the Morocco section below — so an empty hero slot is acceptable.
  return null
}
