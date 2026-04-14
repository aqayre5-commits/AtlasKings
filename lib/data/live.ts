'use client'

/**
 * useLiveMatch(id, initialData?)
 * ─────────────────────────────────────────────────────────────────────
 *
 * Client-side polling hook for live match data.
 *
 *   const { match, state, isLive, lastUpdated, error } =
 *     useLiveMatch(matchId, serverRenderedData)
 *
 * Design goals:
 *
 *  1. SEO first.  The initial payload is rendered on the server (RSC)
 *     and passed in as `initialData`. The hook NEVER waits for a first
 *     fetch before returning — it hands back `initialData` immediately,
 *     then mutates it on each poll. Google sees a fully-rendered match.
 *
 *  2. Polite polling.  Cadence depends on the current match state:
 *       - live       → 20s   (matches edge cache window)
 *       - upcoming   → 5min
 *       - finished   → one final refresh, then stop
 *       - unknown    → 60s
 *
 *  3. Tab-aware.  We use the Page Visibility API to pause polling the
 *     instant the tab is hidden, and resume (with an immediate refresh)
 *     when it comes back into focus. This is the single biggest lever
 *     against wasted API calls in real traffic.
 *
 *  4. Failure-tolerant.  A fetch error does NOT clear the displayed
 *     data — we keep the last known state and set `error`. The next
 *     tick retries.
 *
 *  5. Future-proof.  Everything talks to `/api/live/[id]`. When we
 *     later add Redis or Edge Config for cross-region deduping, only
 *     the route handler changes — this hook and every consuming page
 *     stay exactly as they are.
 *
 * NOTE: this file has `'use client'` at the top so it can be imported
 * from server components without manually wrapping every call site.
 * Only the hook itself runs on the client.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import type { MatchDetail } from '@/lib/data/types'
import type {
  LiveMatchResponse,
} from '@/app/api/live/[id]/route'

// ── Polling cadence (milliseconds) ──────────────────────────────────────

const POLL_INTERVAL_MS = {
  live: 20_000, // matches the edge cache s-maxage
  upcoming: 5 * 60_000,
  finished: 0, // stop polling
  other: 60_000,
} as const

export type MatchState = LiveMatchResponse['state']

export interface UseLiveMatchResult {
  /** The most recent match payload. Starts as initialData, mutates on each poll. */
  match: MatchDetail | null
  /** Normalised match state — drives UI (live badge, countdown, full-time ribbon). */
  state: MatchState
  /** True when `state === 'live'`. Convenience for the common case. */
  isLive: boolean
  /** ms timestamp of the most recent successful fetch, or null if none yet. */
  lastUpdated: number | null
  /** Last fetch error message, cleared on next successful poll. */
  error: string | null
  /** Manual refresh — useful for pull-to-refresh or retry buttons. */
  refresh: () => void
}

/**
 * Derive a match state from a MatchDetail payload without calling the API.
 * Used so the hook can report a correct `state` on the very first render
 * (using the server-supplied initialData) before any fetch has happened.
 */
function deriveStateFromDetail(detail: MatchDetail | null | undefined): MatchState {
  const status = detail?.fixture?.status?.short
  if (!status) return 'other'
  if (['LIVE', 'HT', '1H', '2H', 'ET', 'P', 'BT'].includes(status)) return 'live'
  if (['FT', 'AET', 'PEN'].includes(status)) return 'finished'
  if (status === 'NS' || status === 'TBD') return 'upcoming'
  return 'other'
}

export function useLiveMatch(
  matchId: string | number | null | undefined,
  initialData?: MatchDetail | null,
): UseLiveMatchResult {
  const id = matchId != null ? String(matchId) : null

  const [match, setMatch] = useState<MatchDetail | null>(initialData ?? null)
  const [state, setState] = useState<MatchState>(deriveStateFromDetail(initialData))
  const [lastUpdated, setLastUpdated] = useState<number | null>(
    initialData ? Date.now() : null,
  )
  const [error, setError] = useState<string | null>(null)

  // We keep the last-known polling state in a ref so the tick callback
  // can compute the next delay without re-subscribing on every render.
  const stateRef = useRef(state)
  useEffect(() => { stateRef.current = state }, [state])

  // AbortController per in-flight request so tab-switching or unmounting
  // cancels the request immediately instead of leaving ghost fetches.
  const abortRef = useRef<AbortController | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── The single fetch primitive ────────────────────────────────────────

  const fetchNow = useCallback(async (): Promise<MatchState | null> => {
    if (!id) return null
    // Cancel any previous in-flight request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch(`/api/live/${id}`, {
        signal: controller.signal,
        // Let the browser follow edge cache rules — we set s-maxage on the
        // route, so Vercel caches the response. `cache: 'no-store'` here
        // would bypass the edge and hit origin every time, which is the
        // opposite of what we want.
      })

      if (!res.ok) {
        // 404 / 400 / 5xx — surface the error but keep current data visible.
        const text = await res.text().catch(() => '')
        setError(`HTTP ${res.status}${text ? `: ${text.slice(0, 120)}` : ''}`)
        return null
      }

      const body = (await res.json()) as LiveMatchResponse
      if (!body.ok) {
        setError('Bad response')
        return null
      }

      setMatch(body.match)
      setState(body.state)
      setLastUpdated(body.fetchedAt)
      setError(null)
      return body.state
    } catch (err) {
      // AbortError is expected on tab hide / unmount — ignore.
      if ((err as Error).name === 'AbortError') return null
      setError((err as Error).message || 'Network error')
      return null
    }
  }, [id])

  // ── The polling loop ─────────────────────────────────────────────────

  useEffect(() => {
    if (!id) return

    let cancelled = false

    const clearPending = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    const scheduleNext = (forState: MatchState) => {
      clearPending()
      const delay = POLL_INTERVAL_MS[forState]
      if (delay <= 0) return // finished → stop polling entirely
      // Don't schedule if the tab is hidden — the visibilitychange handler
      // will trigger an immediate fetch when it comes back.
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        return
      }
      timeoutRef.current = setTimeout(async () => {
        if (cancelled) return
        const next = (await fetchNow()) ?? stateRef.current
        if (!cancelled) scheduleNext(next)
      }, delay)
    }

    // ── Initial tick ──
    // If we have server-rendered initialData, the first render already
    // shows a match. We still kick off one immediate background fetch
    // to top up any elapsed-seconds that accumulated between SSR and
    // hydration. If we don't have initialData, this is the first load.
    ;(async () => {
      if (cancelled) return
      const next = (await fetchNow()) ?? stateRef.current
      if (!cancelled) scheduleNext(next)
    })()

    // ── Tab visibility ──
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        // Fire an immediate refresh and resume the loop
        ;(async () => {
          if (cancelled) return
          const next = (await fetchNow()) ?? stateRef.current
          if (!cancelled) scheduleNext(next)
        })()
      } else {
        // Tab hidden — drop the pending timeout. In-flight fetches are
        // aborted by the next fetchNow() call (or by unmount cleanup).
        clearPending()
        abortRef.current?.abort()
      }
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', onVisibility)
    }

    return () => {
      cancelled = true
      clearPending()
      abortRef.current?.abort()
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVisibility)
      }
    }
    // We intentionally omit `fetchNow` from deps — it's stable per `id`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const refresh = useCallback(() => {
    void fetchNow()
  }, [fetchNow])

  return {
    match,
    state,
    isLive: state === 'live',
    lastUpdated,
    error,
    refresh,
  }
}
