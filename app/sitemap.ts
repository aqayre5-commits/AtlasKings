import type { MetadataRoute } from 'next'
import { getAllSlugs } from '@/lib/articles/getArticles'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://atlaskings.com'
const LANGS = ['en', 'ar', 'fr'] as const

/** Build alternates map for a path across all 3 languages */
function langAlternates(path: string): Record<string, string> {
  const clean = path.startsWith('/') ? path : `/${path}`
  return {
    en: `${SITE_URL}${clean}`,
    ar: `${SITE_URL}/ar${clean}`,
    fr: `${SITE_URL}/fr${clean}`,
  }
}

/** Build alternates map for the root path "/" */
function rootAlternates(): Record<string, string> {
  return {
    en: SITE_URL,
    ar: `${SITE_URL}/ar`,
    fr: `${SITE_URL}/fr`,
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Static routes — generate for all 3 languages with alternates
  const staticPaths = [
    { path: '', priority: 1.0, freq: 'hourly' as const },
    { path: '/scores', priority: 0.9, freq: 'always' as const },
    { path: '/standings', priority: 0.9, freq: 'hourly' as const },
    { path: '/morocco', priority: 0.9, freq: 'hourly' as const },
    { path: '/morocco/fixtures', priority: 0.8, freq: 'hourly' as const },
    { path: '/morocco/squad', priority: 0.7, freq: 'daily' as const },
    { path: '/morocco/key-players', priority: 0.7, freq: 'daily' as const },
    { path: '/morocco/top-scorers', priority: 0.6, freq: 'monthly' as const },
    { path: '/morocco/news', priority: 0.8, freq: 'hourly' as const },
    { path: '/morocco/qualification', priority: 0.8, freq: 'daily' as const },
    { path: '/botola-pro', priority: 0.8, freq: 'hourly' as const },
    { path: '/botola-pro/scores', priority: 0.8, freq: 'hourly' as const },
    { path: '/botola-pro/table', priority: 0.8, freq: 'daily' as const },
    { path: '/premier-league', priority: 0.8, freq: 'hourly' as const },
    { path: '/premier-league/scores', priority: 0.8, freq: 'hourly' as const },
    { path: '/premier-league/table', priority: 0.8, freq: 'daily' as const },
    { path: '/la-liga', priority: 0.8, freq: 'hourly' as const },
    { path: '/la-liga/scores', priority: 0.8, freq: 'hourly' as const },
    { path: '/la-liga/table', priority: 0.8, freq: 'daily' as const },
    { path: '/champions-league', priority: 0.8, freq: 'hourly' as const },
    { path: '/champions-league/scores', priority: 0.8, freq: 'hourly' as const },
    { path: '/transfers', priority: 0.7, freq: 'hourly' as const },
    { path: '/transfers/done-deals', priority: 0.6, freq: 'hourly' as const },
    { path: '/wc-2026', priority: 0.9, freq: 'daily' as const },
    { path: '/wc-2026/fixtures', priority: 0.9, freq: 'hourly' as const },
    { path: '/wc-2026/standings', priority: 0.8, freq: 'daily' as const },
    { path: '/wc-2026/bracket', priority: 0.8, freq: 'daily' as const },
    { path: '/wc-2026/teams', priority: 0.7, freq: 'weekly' as const },
    { path: '/wc-2026/stats', priority: 0.8, freq: 'daily' as const },
    { path: '/wc-2026/predictor', priority: 0.7, freq: 'weekly' as const },
    { path: '/world-cup-2030', priority: 0.9, freq: 'daily' as const },
    { path: '/world-cup-2030/stadiums', priority: 0.9, freq: 'weekly' as const },
    { path: '/world-cup-2030/cities', priority: 0.9, freq: 'weekly' as const },
    { path: '/world-cup-2030/construction', priority: 0.8, freq: 'weekly' as const },
    { path: '/world-cup-2030/travel', priority: 0.8, freq: 'monthly' as const },
    { path: '/world-cup-2030/tickets', priority: 0.8, freq: 'monthly' as const },
    { path: '/about', priority: 0.4, freq: 'monthly' as const },
    { path: '/contact', priority: 0.3, freq: 'monthly' as const },
    { path: '/privacy', priority: 0.2, freq: 'yearly' as const },
    { path: '/terms', priority: 0.2, freq: 'yearly' as const },
    { path: '/cookies', priority: 0.2, freq: 'yearly' as const },
  ]

  const staticRoutes: MetadataRoute.Sitemap = staticPaths.flatMap(({ path, priority, freq }) => {
    const alts = path === '' ? rootAlternates() : langAlternates(path)
    return LANGS.map(lang => ({
      url: lang === 'en'
        ? (path === '' ? SITE_URL : `${SITE_URL}${path}`)
        : `${SITE_URL}/${lang}${path}`,
      lastModified: now,
      changeFrequency: freq,
      priority,
      alternates: { languages: alts },
    }))
  })

  // Article routes — all languages with alternates
  const fileArticleRoutes: MetadataRoute.Sitemap = LANGS.flatMap(lang => {
    const slugs = getAllSlugs(lang)
    return slugs.map(slug => ({
      url: lang === 'en' ? `${SITE_URL}/articles/${slug}` : `${SITE_URL}/${lang}/articles/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: {
        languages: langAlternates(`/articles/${slug}`),
      },
    }))
  })

  // DB article slugs (async — try/catch for graceful fallback)
  let dbArticleRoutes: MetadataRoute.Sitemap = []
  try {
    const { getDBArticleSlugs } = await import('@/lib/db/articles')
    const fileSlugs = new Set(LANGS.flatMap(l => getAllSlugs(l)))

    for (const lang of LANGS) {
      const dbSlugs = await getDBArticleSlugs(lang)
      for (const slug of dbSlugs) {
        if (!fileSlugs.has(slug)) {
          dbArticleRoutes.push({
            url: lang === 'en' ? `${SITE_URL}/articles/${slug}` : `${SITE_URL}/${lang}/articles/${slug}`,
            lastModified: now,
            changeFrequency: 'weekly' as const,
            priority: 0.9,
            alternates: {
              languages: langAlternates(`/articles/${slug}`),
            },
          })
        }
      }
    }
  } catch {
    // DB unavailable — skip DB articles in sitemap
  }

  return [...staticRoutes, ...fileArticleRoutes, ...dbArticleRoutes]
}
