// API-Football base client
// Docs: https://www.api-football.com/documentation-v3
// Set APIFOOTBALL_KEY in your .env.local file
//
// Cache policy: every call flows through `next.revalidate` / `next.tags` so
// Next.js's built-in data cache honours our canonical CACHE_TIERS. Callers
// should pass a tier via `withTier(CACHE_TIERS.*, ...)` from lib/data/cache.
// If a caller omits options entirely we fall back to the `daily` tier so
// a new fetcher without an explicit tier is safe by default (never sub-1h).

import { CACHE_TIERS } from '@/lib/data/cache'

const BASE_URL = 'https://v3.football.api-sports.io'

export class APIFootballError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'APIFootballError'
  }
}

interface FetchOptions {
  /** ISR revalidation in seconds. Defaults to CACHE_TIERS.daily. */
  revalidate?: number
  /** Cache tags for on-demand revalidation via `revalidateTag()`. */
  tags?: string[]
}

// Core fetcher — all API calls go through here
export async function apiFetch<T>(
  endpoint: string,
  params: Record<string, string | number>,
  options: FetchOptions = {},
): Promise<T> {
  const key = process.env.APIFOOTBALL_KEY

  // Return empty data gracefully if no API key (dev mode)
  if (!key) {
    console.warn(`[API-Football] No API key set. Add APIFOOTBALL_KEY to .env.local`)
    return null as T
  }

  const url = new URL(`${BASE_URL}/${endpoint}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))

  const res = await fetch(url.toString(), {
    headers: {
      'x-apisports-key': key,
      'x-rapidapi-host': 'v3.football.api-sports.io',
    },
    next: {
      revalidate: options.revalidate ?? CACHE_TIERS.daily.revalidate,
      tags: options.tags,
    },
  })

  if (!res.ok) {
    throw new APIFootballError(res.status, `API-Football error: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()

  // API-Football returns errors inside the response body
  if (data.errors && Object.keys(data.errors).length > 0) {
    const errorMsg = Object.values(data.errors).join(', ')
    throw new APIFootballError(400, `API-Football: ${errorMsg}`)
  }

  return data.response as T
}

// Check remaining API calls (free plan: 100/day, pro: 7500/day)
export async function getApiStatus() {
  const key = process.env.APIFOOTBALL_KEY
  if (!key) return null

  const res = await fetch(`${BASE_URL}/status`, {
    headers: { 'x-apisports-key': key },
    next: { revalidate: CACHE_TIERS.fresh.revalidate },
  })

  if (!res.ok) return null
  const data = await res.json()
  return data.response
}
