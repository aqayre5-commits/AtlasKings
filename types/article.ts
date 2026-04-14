export type ArticleCategory =
  | 'morocco'
  | 'botola-pro'
  | 'premier-league'
  | 'la-liga'
  | 'champions-league'
  | 'transfers'
  | 'world-cup'
  | 'analysis'
  | 'opinion'

export type ArticleType =
  | 'breaking'    // Major news, highest urgency
  | 'feature'     // In-depth feature stories
  | 'recap'       // Match recaps / post-match
  | 'preview'     // Pre-match previews
  | 'analysis'    // Tactical / data analysis
  | 'opinion'     // Opinion / editorial
  | 'transfer'    // Transfer news
  | 'standard'    // Default

/**
 * Editorial trust state for an article (Decision C1: organization byline only).
 *
 * Mirrors the three states the <TrustBadge> primitive renders. Stored in
 * frontmatter as a string field so editors can promote/demote without
 * touching code.
 *
 *  - editor-reviewed → A human reviewed the article end-to-end.
 *  - ai-assisted     → Claude drafted, a human did a review pass.
 *  - automated       → Claude drafted, no human review yet (default).
 *
 * Default for the RSS pipeline is `automated`. The other two states are
 * promoted manually by an editor via frontmatter edit.
 */
export type ArticleTrustState =
  | 'editor-reviewed'
  | 'ai-assisted'
  | 'automated'

export interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  category: ArticleCategory
  author: string
  date: string
  /** ISO timestamp of last edit. Defaults to `date` when never modified. */
  modified?: string
  image?: string
  imageAlt?: string
  language: 'en' | 'ar' | 'fr'
  tags?: string[]
  featured?: boolean
  readingTime?: number
  // Scoring fields
  priority?: number           // 1-100 editorial weight (default 50)
  type?: ArticleType          // Content type for multiplier
  teams?: string[]            // Team slugs for team-page boosting (e.g. ['morocco', 'psg'])
  players?: string[]          // Player slugs (e.g. ['hakimi', 'bellingham'])
  // Editorial trust + provenance
  trustState?: ArticleTrustState  // Default: 'automated' when undefined
  sourceUrl?: string              // Original RSS item URL (provenance)
  // Video
  videoId?: string                // YouTube video ID (e.g. 'dQw4w9WgXx')
  videoFrame?: string             // Best frame URL from video (viral frame, not default thumbnail)
}

export interface ArticleMeta {
  slug: string
  title: string
  excerpt: string
  category: ArticleCategory
  author: string
  date: string
  modified?: string
  image?: string
  readingTime?: number
  // Scoring fields available in meta
  featured?: boolean
  tags?: string[]
  priority?: number
  type?: ArticleType
  teams?: string[]
  players?: string[]
  // Trust + provenance
  trustState?: ArticleTrustState
  sourceUrl?: string
  // Computed
  score?: number              // Computed ranking score
  // Video
  videoId?: string
  videoFrame?: string
  // External articles (GNews)
  externalUrl?: string        // Original article URL (for GNews articles)
}
