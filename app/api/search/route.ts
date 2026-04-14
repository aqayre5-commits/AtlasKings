import { NextRequest, NextResponse } from 'next/server'
import { getArticlesByLang } from '@/lib/articles/getArticles'
import type { Lang } from '@/lib/i18n/config'

export const runtime = 'nodejs'

const VALID_LANGS = new Set<string>(['en', 'ar', 'fr'])

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.toLowerCase().trim()
  const langParam = request.nextUrl.searchParams.get('lang') ?? 'en'
  const lang = VALID_LANGS.has(langParam) ? (langParam as Lang) : 'en'

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [], query: '' })
  }

  const articles = getArticlesByLang(lang)

  const results = articles
    .filter(article => {
      return (
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        article.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    })
    .slice(0, 8)
    .map(article => ({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      date: article.date,
      readingTime: article.readingTime,
    }))

  return NextResponse.json({ results, query })
}
