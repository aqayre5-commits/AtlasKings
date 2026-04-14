import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { AdSlot } from '@/components/ads/AdSlot'
import { getArticlesForSectionAsync } from '@/lib/articles/getArticles'
import { formatRelativeTime, getArticleHref, isExternalArticle } from '@/lib/utils'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'
import Link from 'next/link'
import type { ArticleCategory } from '@/types/article'

interface Props {
  section: string
  sectionHref: string
  title: string
  category: ArticleCategory
  children: React.ReactNode
  lang?: string
}

export async function WidgetPageShell({ section, sectionHref, title, category, children, lang = 'en' }: Props) {
  const p = lang === 'en' ? '' : `/${lang}`
  const t = getTranslations((lang as Lang) || 'en')
  const articles = await getArticlesForSectionAsync(category, (lang as 'en' | 'ar' | 'fr') || 'en', 5)

  return (
    <main>
      <div className="page-wrap">

        <div className="widget-shell">
          <div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {children}
            </div>
          </div>

          <aside className="sidebar">
            {articles.length > 0 && (
              <div className="sidebar-card">
                <div className="sec-head">
                  <div className="sec-bar b-red" />
                  <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)' }}>
                    {t.sections.latestNews}
                  </h2>
                </div>
                {articles.map(a => (
                  <Link key={a.slug} href={getArticleHref(a, p)} target={isExternalArticle(a) ? '_blank' : undefined} rel={isExternalArticle(a) ? 'noopener' : undefined} className="sidebar-article-link">
                    <div className="sidebar-article-title">{a.title}</div>
                    <div className="sidebar-article-date">{formatRelativeTime(a.date)}</div>
                  </Link>
                ))}
              </div>
            )}

            <AdSlot size="sidebar-rectangle" id={`ad-${category}-widget`} />
          </aside>
        </div>
      </div>
    </main>
  )
}
