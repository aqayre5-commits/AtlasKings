// Article Pipeline — fetch RSS → filter new → rewrite with AI → save as markdown
import fs from 'fs'
import path from 'path'
import { fetchAllFeeds, type RSSItem } from './fetcher'
import { rewriteArticle, translateArticle, detectCategory, detectTeams, detectType } from './rewriter'
import { getTrackedOpponents, matchOpponent } from './opponents'
import { slugify } from '@/lib/utils'

const CONTENT_DIR = path.join(process.cwd(), 'content/articles')
const ARTICLES_DIR = path.join(CONTENT_DIR, 'en')

/**
 * Get all existing article slugs to avoid duplicates.
 */
function getExistingSlugs(): Set<string> {
  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true })
    return new Set()
  }
  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'))
  return new Set(files.map(f => f.replace('.md', '')))
}

/**
 * Check if an RSS item has already been processed (by comparing normalized titles).
 */
function getTitleIndex(): Set<string> {
  const indexPath = path.join(ARTICLES_DIR, '.title-index.json')
  try {
    if (fs.existsSync(indexPath)) {
      return new Set(JSON.parse(fs.readFileSync(indexPath, 'utf8')))
    }
  } catch {}
  return new Set()
}

function saveTitleIndex(index: Set<string>) {
  const indexPath = path.join(ARTICLES_DIR, '.title-index.json')
  fs.writeFileSync(indexPath, JSON.stringify([...index]))
}

/**
 * Escape a string for safe inclusion inside a YAML double-quoted scalar.
 * Handles backslashes (must come first), double quotes, and newlines.
 */
function yamlEscape(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, ' ')
}

/**
 * Hostname allowlist for article hero images.
 *
 * Must stay in sync with `images.remotePatterns` in `next.config.js`.
 * URLs from disallowed hosts are dropped from the frontmatter, and the
 * article falls through to `resolveArticleThumbnail()` at render time
 * for a safe api-sports.io fallback via the player/team/venue chain.
 *
 * This is the trust boundary between unvetted RSS source images and
 * the build: adding a new host here requires also adding it to
 * `next.config.js` or `<Image>` will throw at render time.
 */
const ALLOWED_IMAGE_HOSTS: Array<string | RegExp> = [
  'media.api-sports.io',
  'media-2.api-sports.io',
  'media-3.api-sports.io',
  /\.r2\.dev$/,
]

function isAllowedImageUrl(url: string | undefined): boolean {
  if (!url) return false
  try {
    const hostname = new URL(url).hostname
    return ALLOWED_IMAGE_HOSTS.some(pattern =>
      typeof pattern === 'string' ? pattern === hostname : pattern.test(hostname),
    )
  } catch {
    return false
  }
}

/**
 * Save a rewritten article as a markdown file.
 *
 * Frontmatter contract (post §2 article pass):
 *   title         → article headline
 *   excerpt       → 1-sentence summary, used as dek + meta description
 *   category      → ArticleCategory slug
 *   author        → "Atlas Kings Editorial Team" (decision C1)
 *   date          → ISO datePublished
 *   modified      → ISO dateModified (mirrors date on creation)
 *   image         → hero image URL extracted from the RSS source
 *   imageAlt      → alt text for the hero image
 *   trustState    → editorial review state (default: 'automated')
 *   sourceUrl     → original RSS item URL (provenance)
 *   priority      → editorial weight 0-100 for ranking
 *   type          → ArticleType slug
 *   teams         → list of team slugs detected in body
 *   players       → list of player slugs detected in body (currently empty)
 *
 * Backward compat: missing fields are tolerated by the parser; older
 * articles without `trustState`/`modified`/`sourceUrl` continue to work
 * but render with the default state.
 */
function saveArticle(params: {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  date: string
  modified?: string
  teams: string[]
  type: string
  priority: number
  source: string
  sourceUrl?: string
  imageUrl?: string
  trustState?: 'editor-reviewed' | 'ai-assisted' | 'automated'
  lang?: string
  videoId?: string
  videoFrame?: string
}) {
  const trustState = params.trustState ?? 'automated'
  const modified = params.modified ?? params.date
  // Trust boundary: only write `image:` frontmatter when the URL host is
  // in the Next.js `remotePatterns` allowlist. Anything else gets dropped
  // silently and `resolveArticleThumbnail()` takes over at render time.
  const safeImageUrl = isAllowedImageUrl(params.imageUrl) ? params.imageUrl : undefined
  const imageLine = safeImageUrl
    ? `image: "${yamlEscape(safeImageUrl)}"\n` +
      `imageAlt: "${yamlEscape(params.title)}"\n`
    : ''
  const sourceUrlLine = params.sourceUrl
    ? `sourceUrl: "${yamlEscape(params.sourceUrl)}"\n`
    : ''
  const videoLine = params.videoId
    ? `videoId: "${params.videoId}"\n` + (params.videoFrame ? `videoFrame: "${yamlEscape(params.videoFrame)}"\n` : '')
    : ''

  const frontmatter = `---
title: "${yamlEscape(params.title)}"
excerpt: "${yamlEscape(params.excerpt)}"
category: ${params.category}
author: Atlas Kings Editorial Team
date: ${params.date}
modified: ${modified}
${imageLine}${sourceUrlLine}${videoLine}trustState: ${trustState}
priority: ${params.priority}
type: ${params.type}
teams: [${params.teams.join(', ')}]
players: []
---

${params.content}

---
*Source: ${params.source}*
`

  const langDir = path.join(CONTENT_DIR, params.lang ?? 'en')
  if (!fs.existsSync(langDir)) fs.mkdirSync(langDir, { recursive: true })
  const filePath = path.join(langDir, `${params.slug}.md`)
  fs.writeFileSync(filePath, frontmatter)
  return filePath
}

/**
 * Run the full pipeline:
 * 1. Fetch all RSS feeds
 * 2. Filter to only new items (not previously processed)
 * 3. Select top N items by source priority
 * 4. Rewrite each with Claude AI
 * 5. Save as markdown files
 *
 * Returns count of new articles created.
 */
export async function runPipeline(options?: {
  maxArticles?: number  // Max articles to create per run (default 10)
  dryRun?: boolean      // If true, don't save — just return what would be created
  resetIndex?: boolean  // If true, clear the processed-title index (reprocess all)
}): Promise<{
  fetched: number
  filtered: number
  created: number
  articles: string[]
  errors: string[]
}> {
  const maxArticles = options?.maxArticles ?? 10
  const dryRun = options?.dryRun ?? false
  const resetIndex = options?.resetIndex ?? false
  const errors: string[] = []
  const createdArticles: string[] = []

  console.log('[Pipeline] Starting article pipeline...')

  // 1. Fetch RSS feeds
  const allItems = await fetchAllFeeds()
  console.log(`[Pipeline] Fetched ${allItems.length} total RSS items`)

  // 2. Filter new items (reset index if requested — allows reprocessing all)
  if (resetIndex) {
    console.log('[Pipeline] Resetting title index — all items will be treated as new')
  }
  const titleIndex = resetIndex ? new Set<string>() : getTitleIndex()
  const newItems = allItems.filter(item => {
    const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 60)
    return !titleIndex.has(key)
  })
  console.log(`[Pipeline] ${newItems.length} new items (${allItems.length - newItems.length} already processed)`)

  if (newItems.length === 0) {
    return { fetched: allItems.length, filtered: 0, created: 0, articles: [], errors: [] }
  }

  // 3. Fetch live opponent tracking data
  const opponents = await getTrackedOpponents().catch(() => [])
  console.log(`[Pipeline] Tracking ${opponents.length} opponents: ${opponents.map(o => o.name).join(', ')}`)

  // 4. Score and select top items — boost Morocco-related and opponent articles
  const scoredItems = newItems.map(item => {
    let score = item.sourcePriority
    const text = `${item.title} ${item.description}`.toLowerCase()

    // Boost Morocco player mentions
    const { MOROCCO_SQUAD_NAMES } = require('./feeds')
    const moroccoMentions = (MOROCCO_SQUAD_NAMES as string[]).filter((n: string) => text.includes(n)).length
    if (moroccoMentions > 0) score += 30 // Strong boost

    // Boost opponent mentions
    const oppMatch = matchOpponent(text, opponents)
    if (oppMatch) score += oppMatch.opponent.importance * 3 // importance 10 → +30 boost

    return { ...item, effectiveScore: score }
  })

  const selected = scoredItems
    .sort((a, b) => b.effectiveScore - a.effectiveScore)
    .slice(0, maxArticles)

  console.log(`[Pipeline] Selected ${selected.length} items for rewriting`)

  // 5. Rewrite each with AI
  for (const item of selected) {
    try {
      const result = await rewriteArticle({
        title: item.title,
        description: item.description,
        source: item.source,
      })

      if (!result) {
        errors.push(`Failed to rewrite: ${item.title.slice(0, 50)}`)
        continue
      }

      const category = detectCategory(item.title, item.description, item.sourceCategories)
      const teams = detectTeams(`${item.title} ${item.description}`)
      const type = detectType(item.title)
      const isMorocco = teams.includes('morocco')
      const priority = Math.min(isMorocco ? item.sourcePriority + 10 : item.sourcePriority, 90)

      const slug = slugify(result.title).slice(0, 80)

      // YouTube video discovery — find a matching video for the article
      let videoId: string | undefined
      let videoFrame: string | undefined
      try {
        const { findVideoForArticle } = await import('../youtube/search')
        const vid = await findVideoForArticle({
          title: result.title,
          teams,
          type,
          category,
        })
        if (vid) {
          videoId = vid
          // Use auto-frame 2 (middle of video, often best action shot)
          videoFrame = `https://img.youtube.com/vi/${vid}/2.jpg`
        }
      } catch {
        // YouTube search is optional — proceed without video
      }

      if (!dryRun) {
        const articleDate = new Date(item.pubDate).toISOString()

        // Shared frontmatter context across the 3 language variants
        const sharedFrontmatter = {
          slug,
          category,
          date: articleDate,
          modified: articleDate,
          teams,
          type,
          priority,
          source: item.source,
          sourceUrl: item.link || undefined,
          imageUrl: item.imageUrl,
          trustState: 'automated' as const,
          videoId,
          videoFrame,
        }

        // Save English version
        saveArticle({
          ...sharedFrontmatter,
          title: result.title,
          excerpt: result.excerpt,
          content: result.content,
          lang: 'en',
        })

        // Translate to Arabic and French (non-blocking — don't fail if translation fails)
        try {
          const [arResult, frResult] = await Promise.allSettled([
            translateArticle({ title: result.title, excerpt: result.excerpt, content: result.content, targetLang: 'ar' }),
            translateArticle({ title: result.title, excerpt: result.excerpt, content: result.content, targetLang: 'fr' }),
          ])

          if (arResult.status === 'fulfilled' && arResult.value) {
            saveArticle({
              ...sharedFrontmatter,
              title: arResult.value.title,
              excerpt: arResult.value.excerpt,
              content: arResult.value.content,
              lang: 'ar',
            })
          }
          if (frResult.status === 'fulfilled' && frResult.value) {
            saveArticle({
              ...sharedFrontmatter,
              title: frResult.value.title,
              excerpt: frResult.value.excerpt,
              content: frResult.value.content,
              lang: 'fr',
            })
          }
        } catch {
          // Translation failed — English article still saved
        }
      }

      // Mark as processed
      const titleKey = item.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 60)
      titleIndex.add(titleKey)

      createdArticles.push(result.title)
      console.log(`[Pipeline] ✓ ${result.title.slice(0, 60)}`)
    } catch (err) {
      errors.push(`Error processing: ${item.title.slice(0, 50)} — ${(err as Error).message}`)
    }
  }

  // 5. Save title index
  if (!dryRun) {
    saveTitleIndex(titleIndex)
  }

  console.log(`[Pipeline] Done. Created ${createdArticles.length} articles, ${errors.length} errors.`)

  return {
    fetched: allItems.length,
    filtered: newItems.length,
    created: createdArticles.length,
    articles: createdArticles,
    errors,
  }
}
