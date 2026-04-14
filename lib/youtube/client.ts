/**
 * YouTube Data API v3 client with quota management.
 *
 * Free tier: 10,000 units/day. search.list costs 100 units.
 * Hard limit: 90 searches/day (9,000 units), leaving 1,000 buffer.
 *
 * Quota counter stored in memory (resets on server restart).
 * In production, use a persistent counter (Redis, file, etc.).
 */

const API_BASE = 'https://www.googleapis.com/youtube/v3'
const DAILY_LIMIT = 9000  // units (90 searches × 100)
const SEARCH_COST = 100

// In-memory quota counter (resets on restart — fine for dev/build)
let quotaDate = ''
let quotaUsed = 0

function checkQuota(): boolean {
  const today = new Date().toISOString().split('T')[0]
  if (quotaDate !== today) {
    quotaDate = today
    quotaUsed = 0
  }
  return quotaUsed + SEARCH_COST <= DAILY_LIMIT
}

function consumeQuota() {
  quotaUsed += SEARCH_COST
}

export interface YouTubeSearchResult {
  videoId: string
  title: string
  channelTitle: string
  publishedAt: string
  description: string
}

/**
 * Search YouTube for videos matching a query.
 * Returns up to 3 results sorted by relevance.
 * Returns empty array if no API key, quota exhausted, or API error.
 */
export async function searchYouTube(query: string): Promise<YouTubeSearchResult[]> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) return []
  if (!checkQuota()) {
    console.warn('[YouTube] Daily quota exhausted, skipping search')
    return []
  }

  try {
    const params = new URLSearchParams({
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: '3',
      relevanceLanguage: 'en',
      regionCode: 'MA',
      videoCategoryId: '17', // Sports
      order: 'relevance',
      key: apiKey,
    })

    const res = await fetch(`${API_BASE}/search?${params}`, {
      next: { revalidate: 86400 }, // Cache 24h
    })

    if (!res.ok) {
      console.warn(`[YouTube] API error ${res.status}: ${res.statusText}`)
      return []
    }

    consumeQuota()

    const data = await res.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.items ?? []).map((item: any) => ({
      videoId: item.id?.videoId ?? '',
      title: item.snippet?.title ?? '',
      channelTitle: item.snippet?.channelTitle ?? '',
      publishedAt: item.snippet?.publishedAt ?? '',
      description: item.snippet?.description ?? '',
    })).filter((r: YouTubeSearchResult) => r.videoId)
  } catch (err) {
    console.warn('[YouTube] Search failed:', err)
    return []
  }
}

/**
 * Get YouTube auto-generated frame URLs for a video.
 * YouTube generates 4 frames: 0.jpg (custom thumbnail), 1-3.jpg (auto-captured).
 * Frames 1-3 are real video frames — often better than the creator's custom thumbnail.
 */
export function getVideoFrameUrls(videoId: string): string[] {
  return [
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/1.jpg`,
    `https://img.youtube.com/vi/${videoId}/2.jpg`,
    `https://img.youtube.com/vi/${videoId}/3.jpg`,
  ]
}

/** Get the default high-res thumbnail for a video. */
export function getVideoThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}
