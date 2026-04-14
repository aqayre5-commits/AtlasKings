/**
 * GET /api/live/[id]
 * ────────────────────────────────────────────────────────────────────
 *
 * Single source of truth for client-side live match polling.
 *
 * Architecture:
 *
 *   Browser (useLiveMatch hook)
 *         │   GET /api/live/12345      (every ~20s while LIVE)
 *         ▼
 *   Vercel Edge Cache                  (honors s-maxage)
 *         │   cache miss → hits origin
 *         ▼
 *   This route handler
 *         │
 *         ▼
 *   footballData.match(id)  ──►  api-football/match-detail  ──►  api-football.com
 *
 * Cache strategy (deliberately simple for the MVP):
 *
 *   - Live matches:     s-maxage=20, stale-while-revalidate=40
 *   - Upcoming (NS):    s-maxage=300, stale-while-revalidate=600
 *   - Finished (FT…):   s-maxage=3600, stale-while-revalidate=86400
 *
 * Why it works:
 *   Vercel's edge cache dedupes identical requests within the `s-maxage`
 *   window to a single origin hit. A few hundred concurrent viewers of the
 *   same match => 1 upstream call every 20 seconds. That keeps us well
 *   inside API-Football's Pro plan rate limits (7500/day) even with a
 *   handful of simultaneous live games.
 *
 * When to add Redis/Edge Config later:
 *   - If we observe >10k concurrent live viewers on a single match, OR
 *   - If we need cross-region deduping, OR
 *   - If we add match-event push notifications that need a shared store.
 *
 *   The swap point is this file alone. Page-level code and the
 *   useLiveMatch() hook don't change — they keep calling /api/live/[id].
 *
 * Error handling:
 *   footballData.match() never throws — it returns `null` on any failure.
 *   We propagate that as HTTP 404 with a `no-store` cache header so we
 *   don't poison the edge cache with a transient upstream blip.
 */

import { NextResponse } from 'next/server'
import { footballData } from '@/lib/data/service'
import type { MatchDetail } from '@/lib/data/types'

// Force this route to run per-request on the Node runtime. Using the Node
// runtime (not edge) keeps us compatible with every transitive dependency
// in `lib/api-football/*` and avoids subtle edge-runtime surprises. Vercel
// still caches the response at the edge because of the Cache-Control header.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ── Cache header helpers ────────────────────────────────────────────────

const LIVE_STATUSES = new Set(['LIVE', 'HT', '1H', '2H', 'ET', 'P', 'BT'])
const FINISHED_STATUSES = new Set(['FT', 'AET', 'PEN'])

function cacheHeaderFor(status?: string): string {
  if (!status) {
    return 'public, s-maxage=60, stale-while-revalidate=120'
  }
  if (LIVE_STATUSES.has(status)) {
    // 20s fresh window — edge dedupes thousands of clients to 1 origin hit
    return 'public, s-maxage=20, stale-while-revalidate=40'
  }
  if (FINISHED_STATUSES.has(status)) {
    // Match is over — scores, events, stats are frozen
    return 'public, s-maxage=3600, stale-while-revalidate=86400'
  }
  // NS, TBD, PST — not yet started
  return 'public, s-maxage=300, stale-while-revalidate=600'
}

// ── Response shape ──────────────────────────────────────────────────────

export interface LiveMatchResponse {
  ok: true
  match: MatchDetail
  /** Server-side timestamp (ms) the payload was freshly fetched at. */
  fetchedAt: number
  /** Normalised status — hook uses this to decide polling cadence. */
  state: 'upcoming' | 'live' | 'finished' | 'other'
}

export interface LiveMatchErrorResponse {
  ok: false
  error: string
}

function deriveState(status?: string): LiveMatchResponse['state'] {
  if (!status) return 'other'
  if (LIVE_STATUSES.has(status)) return 'live'
  if (FINISHED_STATUSES.has(status)) return 'finished'
  if (status === 'NS' || status === 'TBD') return 'upcoming'
  return 'other'
}

// ── Route handler ───────────────────────────────────────────────────────

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  // Reject obviously bad IDs before burning an upstream call.
  if (!id || !/^\d+$/.test(id)) {
    return NextResponse.json<LiveMatchErrorResponse>(
      { ok: false, error: 'Invalid match id' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  const match = await footballData.match(id)

  if (!match) {
    // Upstream failure OR unknown id — either way, don't poison the edge cache.
    return NextResponse.json<LiveMatchErrorResponse>(
      { ok: false, error: 'Match not found' },
      { status: 404, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  const status = match.fixture?.status?.short
  const body: LiveMatchResponse = {
    ok: true,
    match,
    fetchedAt: Date.now(),
    state: deriveState(status),
  }

  return NextResponse.json(body, {
    status: 200,
    headers: {
      'Cache-Control': cacheHeaderFor(status),
      // Let downstream code (CDN logs, debug panels) identify the tier.
      'X-Atlas-Cache-Tier': body.state,
    },
  })
}
