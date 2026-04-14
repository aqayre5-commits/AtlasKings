import { type ClassValue, clsx } from 'clsx'

// Combine class names
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Get article URL with language prefix
export function getArticleHref(article: { slug: string; externalUrl?: string }, langPrefix: string = ''): string {
  if (article.externalUrl) return article.externalUrl
  return `${langPrefix}/articles/${article.slug}`
}

// Check if article links externally
export function isExternalArticle(article: { slug: string }): boolean {
  return false // All articles are internal (RSS pipeline saves locally)
}

// Format date for display: "4 Apr 2026"
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Format relative time: "2h ago", "30 min ago"
export function formatRelativeTime(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  return formatDate(dateStr)
}

// Estimate reading time in minutes
export function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

// Generate URL slug from title
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Truncate text to word boundary
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '…'
}

// Map category to display label
export function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'morocco': 'Morocco',
    'botola-pro': 'Botola Pro',
    'premier-league': 'Premier League',
    'la-liga': 'La Liga',
    'champions-league': 'Champions League',
    'transfers': 'Transfers',
    'world-cup': 'World Cup',
    'analysis': 'Analysis',
    'opinion': 'Opinion',
  }
  return labels[category] ?? category
}

// Map category to brand colour
export function categoryColor(category: string): string {
  const colors: Record<string, string> = {
    'morocco': '#0a5229',
    'botola-pro': '#0a5229',
    'premier-league': '#3d195b',
    'la-liga': '#ee8700',
    'champions-league': '#0a1f5c',
    'transfers': '#c0000b',
    'world-cup': '#c0000b',
    'analysis': '#484848',
    'opinion': '#484848',
  }
  return colors[category] ?? '#c0000b'
}
