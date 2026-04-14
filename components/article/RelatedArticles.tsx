import Link from 'next/link'
import { formatRelativeTime, categoryLabel, categoryColor } from '@/lib/utils'
import type { ArticleMeta } from '@/types/article'

interface RelatedArticlesProps {
  articles: ArticleMeta[]
  title?: string
  langPrefix?: string
}

export function RelatedArticles({ articles, title = 'More to Read', langPrefix = '' }: RelatedArticlesProps) {
  if (articles.length === 0) return null

  return (
    <section style={{ marginTop: 48 }}>
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 20,
        paddingBottom: 12,
        borderBottom: '2px solid var(--text)',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--text)', lineHeight: 1,
        }}>
          {title}
        </h2>
      </div>

      {/* 3-col grid (2-col on mobile) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
      }}>
        {articles.slice(0, 6).map(article => {
          const color = categoryColor(article.category)
          return (
            <Link
              key={article.slug}
              href={`${langPrefix}/articles/${article.slug}`}
              style={{
                display: 'block', textDecoration: 'none', color: 'inherit',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                transition: 'background 0.14s',
              }}
            >
              {/* Image */}
              <div style={{
                width: '100%', aspectRatio: '16/9',
                overflow: 'hidden', background: '#111',
              }}>
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    background: `linear-gradient(140deg, ${color}22 0%, #050505 100%)`,
                  }} />
                )}
              </div>

              {/* Text */}
              <div style={{ padding: '12px 14px 14px' }}>
                <span style={{
                  display: 'inline-block', marginBottom: 6,
                  fontFamily: 'var(--font-head)', fontSize: 9, fontWeight: 800,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color, background: `${color}15`,
                  padding: '2px 7px 3px', borderRadius: 'var(--radius-sm)',
                  lineHeight: 1.5,
                }}>
                  {categoryLabel(article.category)}
                </span>
                <h3 style={{
                  fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 700,
                  lineHeight: 1.25, color: 'var(--text)',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {article.title}
                </h3>
                <p style={{
                  marginTop: 8,
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: 'var(--text-faint)', letterSpacing: '0.03em',
                }}>
                  {formatRelativeTime(article.date)}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      <style>{`
        @media (max-width: 767px) {
          .related-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}
