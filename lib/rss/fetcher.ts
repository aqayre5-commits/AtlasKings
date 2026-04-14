// RSS Feed Fetcher — parses XML feeds into structured items
import { RSS_FEEDS, type FeedSource } from './feeds'

export interface RSSItem {
  title: string
  description: string
  link: string
  pubDate: string
  source: string
  sourceLang: 'en' | 'fr' | 'es' | 'ar' | string
  sourcePriority: number
  sourceCategories: string[]
  /**
   * First image URL extracted from the RSS item, if any.
   * Walks: <enclosure url type="image/*"> → <media:content medium="image">
   *      → <media:thumbnail> → first <img src> in description.
   * Used by the pipeline to set the article hero image at write time.
   */
  imageUrl?: string
}

/**
 * Best-effort image URL extraction from a single RSS <item> block.
 *
 * Walks the most common patterns publishers use to attach images:
 *   1. <enclosure url="..." type="image/*">
 *   2. <media:content url="..." medium="image">  (Media RSS)
 *   3. <media:thumbnail url="...">                (Media RSS)
 *   4. <itunes:image href="...">                  (rare but seen)
 *   5. First <img src="..."> in <description> HTML
 *
 * Returns the first match found, or undefined.
 *
 * Why regex over a real XML parser: same reason `parseRSSXml` is regex —
 * zero dependencies, fast, and the patterns we care about are flat enough
 * that regex is reliable. Publishers who emit non-standard image tags
 * (rare) will fall through to the existing `resolveArticleThumbnail()`
 * fallback chain at render time, so this is best-effort by design.
 */
function extractImageUrl(itemBlock: string): string | undefined {
  // 1. Enclosure with image MIME type
  const enclosureMatch = itemBlock.match(
    /<enclosure[^>]*\burl=["']([^"']+)["'][^>]*\btype=["']image\/[^"']+["']/i,
  )
    ?? itemBlock.match(
      /<enclosure[^>]*\btype=["']image\/[^"']+["'][^>]*\burl=["']([^"']+)["']/i,
    )
  if (enclosureMatch?.[1]) return enclosureMatch[1]

  // 2. media:content with medium="image" (or no medium but image URL extension)
  const mediaContentMatch = itemBlock.match(
    /<media:content[^>]*\burl=["']([^"']+)["'][^>]*\bmedium=["']image["']/i,
  )
    ?? itemBlock.match(
      /<media:content[^>]*\bmedium=["']image["'][^>]*\burl=["']([^"']+)["']/i,
    )
    ?? itemBlock.match(
      /<media:content[^>]*\burl=["']([^"']+\.(?:jpg|jpeg|png|webp|gif))["']/i,
    )
  if (mediaContentMatch?.[1]) return mediaContentMatch[1]

  // 3. media:thumbnail
  const mediaThumbMatch = itemBlock.match(/<media:thumbnail[^>]*\burl=["']([^"']+)["']/i)
  if (mediaThumbMatch?.[1]) return mediaThumbMatch[1]

  // 4. iTunes image (occasionally used)
  const itunesMatch = itemBlock.match(/<itunes:image[^>]*\bhref=["']([^"']+)["']/i)
  if (itunesMatch?.[1]) return itunesMatch[1]

  // 5. First <img src="..."> inside the description body
  // CDATA-wrapped or plain — both work because the regex doesn't care about
  // CDATA delimiters.
  const descImgMatch = itemBlock.match(/<img[^>]*\bsrc=["']([^"']+)["']/i)
  if (descImgMatch?.[1]) return descImgMatch[1]

  return undefined
}

/**
 * Parse RSS XML into items. Handles both RSS 2.0 and Atom formats.
 * Uses regex parsing to avoid XML library dependencies.
 *
 * If the source declares a keywordFilter, items must contain at least one
 * keyword (case-insensitive) in title or description to be kept.
 */
function parseRSSXml(xml: string, source: FeedSource): RSSItem[] {
  const items: RSSItem[] = []
  const hasFilter = source.keywordFilter && source.keywordFilter.length > 0
  const lowerKeywords = hasFilter
    ? source.keywordFilter!.map(k => k.toLowerCase())
    : []

  // Match <item> blocks (RSS 2.0)
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi
  let match

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]

    const title = block.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1]?.trim()
    const description = block.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1]?.trim()
    const link = block.match(/<link[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/)?.[1]?.trim()
    const pubDate = block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/)?.[1]?.trim()

    if (!title || title.length <= 10) continue

    const cleanTitle = cleanHtml(title)
    const cleanDesc = cleanHtml(description ?? '')

    // Apply keyword filter if set — item must match at least one keyword
    if (hasFilter) {
      const haystack = `${cleanTitle} ${cleanDesc}`.toLowerCase()
      const matched = lowerKeywords.some(k => haystack.includes(k))
      if (!matched) continue
    }

    items.push({
      title: cleanTitle,
      description: cleanDesc,
      link: link ?? '',
      pubDate: pubDate ?? new Date().toISOString(),
      source: source.name,
      sourceLang: source.lang,
      sourcePriority: source.priority,
      sourceCategories: source.categories,
      imageUrl: extractImageUrl(block),
    })
  }

  return items
}

/**
 * Strip HTML tags and decode entities.
 */
function cleanHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Fetch a single RSS feed with timeout and error handling.
 */
async function fetchFeed(source: FeedSource): Promise<RSSItem[]> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(source.url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
      next: { revalidate: 3600 }, // Cache 1 hour
    })

    clearTimeout(timeout)

    if (!res.ok) return []

    const xml = await res.text()

    // Skip if response is HTML, not XML
    if (xml.trimStart().startsWith('<!doctype') || xml.trimStart().startsWith('<html')) {
      return []
    }

    return parseRSSXml(xml, source)
  } catch (err) {
    console.warn(`[RSS] Failed to fetch ${source.name}:`, (err as Error).message)
    return []
  }
}

/**
 * Fetch all RSS feeds in parallel. Returns deduplicated items sorted by date.
 */
export async function fetchAllFeeds(): Promise<RSSItem[]> {
  const results = await Promise.allSettled(
    RSS_FEEDS.map(feed => fetchFeed(feed))
  )

  const allItems: RSSItem[] = []
  const seenTitles = new Set<string>()

  for (const result of results) {
    if (result.status === 'fulfilled') {
      for (const item of result.value) {
        // Deduplicate by normalized title
        const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 50)
        if (!seenTitles.has(key)) {
          seenTitles.add(key)
          allItems.push(item)
        }
      }
    }
  }

  // Sort newest first
  allItems.sort((a, b) =>
    new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  )

  return allItems
}
