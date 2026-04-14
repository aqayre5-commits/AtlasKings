import { notFound } from 'next/navigation'
import { WhatsAppShare } from '@/components/ui/WhatsAppShare'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getArticleBySlug, getArticlesByLang, getRelatedArticles } from '@/lib/articles/getArticles'
import { renderMarkdown } from '@/lib/articles/renderMarkdown'
import { generateArticleMetadata, articleSchema, breadcrumbSchema } from '@/lib/seo/generateMetadata'
import { resolveArticleThumbnail } from '@/lib/articles/thumbnail'
import { formatDate, categoryLabel, categoryColor } from '@/lib/utils'
import { ArticleHero } from '@/components/article/ArticleHero'
import { VideoHero } from '@/components/video/VideoHero'
import { ArticleByline } from '@/components/article/ArticleByline'
import { ArticleBody } from '@/components/article/ArticleBody'
import { StoryCard } from '@/components/cards/StoryCard'
import { StickyNextArticle } from '@/components/article/StickyNextArticle'
import { AdSlot } from '@/components/ads/AdSlot'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'

interface Props {
  params: Promise<{ slug: string; lang: string }>
}

export const revalidate = 3600

export async function generateStaticParams() {
  const langs = ['en', 'ar', 'fr'] as const
  const allParams: { slug: string }[] = []
  for (const lang of langs) {
    const articles = getArticlesByLang(lang)
    allParams.push(...articles.map(a => ({ slug: a.slug })))
  }
  return allParams
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lang } = await params
  const validLang = (['en', 'ar', 'fr'].includes(lang) ? lang : 'en') as 'en' | 'ar' | 'fr'
  const article = getArticleBySlug(slug, validLang) ?? getArticleBySlug(slug, 'en')
  if (!article) return { title: 'Article not found' }
  return generateArticleMetadata(article)
}

export default async function ArticlePage({ params }: Props) {
  const { slug, lang } = await params
  const validLang = (['en', 'ar', 'fr'].includes(lang) ? lang : 'en') as 'en' | 'ar' | 'fr'
  const t = getTranslations((lang as Lang) || 'en')
  const p = lang === 'en' ? '' : `/${lang}`

  let article = getArticleBySlug(slug, validLang) ?? getArticleBySlug(slug, 'en')

  // Try database if not in files
  if (!article) {
    try {
      const { getDBArticleBySlug } = await import('@/lib/db/articles')
      const dbArticle = await getDBArticleBySlug(slug, validLang)
      if (dbArticle) {
        article = {
          ...dbArticle.meta,
          slug,
          content: dbArticle.content,
          language: validLang,
        } as any
      }
    } catch {
      // DB unavailable
    }
  }
  if (!article) notFound()

  const html = await renderMarkdown(article.content)
  const related = getRelatedArticles(article.slug, article.category, validLang, 6)
  const allArticles = getArticlesByLang(validLang)
  const currentIndex = allArticles.findIndex(a => a.slug === article.slug)
  const nextArticle = allArticles[currentIndex + 1] ?? allArticles[0]

  const color = categoryColor(article.category)
  const label = categoryLabel(article.category)

  // Run the thumbnail fallback chain at render time. Articles published
  // by the new pipeline (post §2) usually carry an explicit `image` field
  // from the source RSS enclosure; legacy articles without it fall through
  // the player → team → venue → competition → category chain so the hero
  // is never just a gradient placeholder.
  const heroImage = resolveArticleThumbnail({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    author: article.author,
    date: article.date,
    image: article.image,
    teams: article.teams,
    tags: article.tags,
  })

  // Source name for the byline provenance line. Pulled from the article
  // body footer ("*Source: <name>*") that the pipeline writes — defaults
  // to undefined when none.
  const sourceMatch = article.content.match(/\*Source:\s*([^*]+)\*\s*$/m)
  const sourceName = sourceMatch?.[1]?.trim()

  // Sidebar recent articles
  const sidebarArticles = allArticles
    .filter(a => a.slug !== article.slug)
    .slice(0, 5)

  return (
    <>
      {/* JSON-LD schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema(article)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema([
            { name: t.nav.home, href: `${p}/` },
            { name: label, href: `${p}/${article.category}` },
            { name: article.title, href: `${p}/articles/${article.slug}` },
          ]))
        }}
      />

      <main>
        <div className="page-wrap">

          {/* Breadcrumb — category href now uses the lang prefix correctly */}
          <nav aria-label="Breadcrumb" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            marginBottom: 16,
            fontFamily: 'var(--font-mono)', fontSize: 10,
            letterSpacing: '0.05em', color: 'var(--text-faint)',
          }}>
            <Link href={`${p}/`} style={{ color: 'var(--text-faint)', textDecoration: 'none' }}>{t.nav.home}</Link>
            <span>›</span>
            <Link href={`${p}/${article.category}`} style={{ color: 'var(--text-faint)', textDecoration: 'none' }}>
              {label}
            </Link>
            <span>›</span>
            <span style={{ color: 'var(--text-sec)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>
              {article.title}
            </span>
          </nav>

          {/* Two column layout — stacks on mobile */}
          <div className="article-layout">

            {/* ── MAIN: Article ── */}
            <article className="article-main">
              {/* Hero — video embed if available, otherwise static image */}
              {article.videoId ? (
                <VideoHero
                  videoId={article.videoId}
                  title={article.title}
                  category={article.category}
                  frameUrl={article.videoFrame}
                />
              ) : (
                <ArticleHero
                  title={article.title}
                  category={article.category}
                  image={heroImage}
                  imageAlt={article.imageAlt}
                />
              )}

              {/* Title */}
              <h1 className="article-title" style={{
                fontFamily: 'var(--font-head)',
                fontSize: 'clamp(24px, 5vw, 36px)',
                fontWeight: 800,
                fontStyle: 'italic',
                lineHeight: 1.08,
                letterSpacing: '0.01em',
                color: 'var(--text)',
                marginBottom: 16,
              }}>
                {article.title}
              </h1>

              {/* Excerpt / standfirst */}
              {article.excerpt && (
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(15px, 3vw, 18px)',
                  lineHeight: 1.6,
                  color: 'var(--text-sec)',
                  marginBottom: 20,
                  fontWeight: 500,
                }}>
                  {article.excerpt}
                </p>
              )}

              {/* Byline + trust badge + dates + share + source provenance */}
              <ArticleByline
                author={article.author}
                date={article.date}
                modified={article.modified}
                readingTime={article.readingTime}
                trustState={article.trustState}
                sourceUrl={article.sourceUrl}
                sourceName={sourceName}
                lang={validLang}
              />

              {/* WhatsApp share — inline after byline */}
              <div style={{ marginBottom: 20 }}>
                <WhatsAppShare
                  text={article.title}
                  url={`https://atlaskings.com${p}/articles/${article.slug}`}
                  variant="button"
                  lang={validLang}
                />
              </div>

              {/* Article body with mid-article ad */}
              <ArticleBody html={html} />

              {/* Tag chips removed in Launch Session 1.5 — the
                  /tag/[tag] archive pages were never implemented, so
                  the chips were emitting 404-bound links. Re-introduce
                  if/when tag archive pages ship as a dedicated sprint. */}

              {/* Related articles */}
              {related.length > 0 && (
                <section style={{ marginTop: 40 }}>
                  <h2 style={{
                    fontFamily: 'var(--font-head)', fontSize: 'var(--h3)', fontWeight: 800,
                    letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text)',
                    marginBottom: 16, paddingBottom: 10, borderBottom: `2px solid ${color}`,
                  }}>
                    {t.ui.moreToRead}
                  </h2>
                  <div className="related-grid">
                    {related.slice(0, 6).map(a => (
                      <StoryCard key={a.slug} article={a} langPrefix={p} />
                    ))}
                  </div>
                </section>
              )}
            </article>

            {/* WhatsApp floating share — mobile only */}
            <WhatsAppShare
              text={article.title}
              url={`https://atlaskings.com${p}/articles/${article.slug}`}
              variant="float"
              lang={validLang}
            />

            {/* ── SIDEBAR (desktop only) ── */}
            <aside className="article-sidebar">
              <AdSlot size="sidebar-rectangle" id="ad-article-top" />

              {/* More to read */}
              {sidebarArticles.length > 0 && (
                <div style={{
                  background: 'var(--card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', overflow: 'hidden',
                }}>
                  <div style={{
                    padding: '10px 14px', borderBottom: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <div style={{ width: 3, height: 14, borderRadius: 2, background: color }} />
                    <span style={{
                      fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 800,
                      letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)',
                    }}>
                      {t.ui.moreToRead}
                    </span>
                  </div>
                  {sidebarArticles.map((a, i) => (
                    <Link
                      key={a.slug}
                      href={`${p}/articles/${a.slug}`}
                      style={{
                        display: 'flex', gap: 10, padding: '10px 14px',
                        borderBottom: i < sidebarArticles.length - 1 ? '1px solid var(--border)' : 'none',
                        textDecoration: 'none', color: 'inherit',
                        transition: 'background 0.12s',
                        minHeight: 'var(--tap-min)',
                      }}
                    >
                      {a.image && (
                        <div style={{
                          width: 60, height: 44, flexShrink: 0,
                          borderRadius: 'var(--radius-sm)', overflow: 'hidden',
                          background: '#111',
                        }}>
                          <img src={a.image} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 700,
                          lineHeight: 1.3, color: 'var(--text)',
                          display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                          {a.title}
                        </p>
                        <p style={{
                          marginTop: 4, fontFamily: 'var(--font-mono)',
                          fontSize: 9, color: 'var(--text-faint)', letterSpacing: '0.03em',
                        }}>
                          {formatDate(a.date)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <AdSlot size="sidebar-rectangle" id="ad-article-bottom" />
            </aside>
          </div>
        </div>
      </main>

      {/* Sticky next article bar */}
      {nextArticle && <StickyNextArticle article={nextArticle} />}
    </>
  )
}
