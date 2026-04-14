import Link from 'next/link'
import { formatRelativeTime, categoryLabel, categoryColor } from '@/lib/utils'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { ArticleMeta } from '@/types/article'

interface SectionCardProps {
  title: string
  category: string
  articles: ArticleMeta[]
  ctaLabel?: string
  ctaHref?: string
  langPrefix?: string
}

export function SectionCard({ title, category, articles, ctaLabel, ctaHref, langPrefix = '' }: SectionCardProps) {
  const color = categoryColor(category)

  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
      marginTop: 'var(--gap)',
    }}>
      <SectionHeader
        title={title}
        color={color}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
      />

      {/* 2-col article grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 1,
        background: 'var(--border)',
      }}>
        {articles.slice(0, 2).map(article => (
          <Link
            key={article.slug}
            href={`${langPrefix}/articles/${article.slug}`}
            style={{
              display: 'block',
              textDecoration: 'none',
              color: 'inherit',
              background: 'var(--card)',
              overflow: 'hidden',
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
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.35s ease' }}
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
              {article.category && (
                <span style={{
                  display: 'inline-block', marginBottom: 7,
                  fontFamily: 'var(--font-head)', fontSize: 9, fontWeight: 800,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color, background: `${color}15`,
                  padding: '2px 7px 3px', borderRadius: 'var(--radius-sm)', lineHeight: 1.5,
                }}>
                  {categoryLabel(article.category)}
                </span>
              )}
              <h2 style={{
                fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 700,
                lineHeight: 1.22, color: 'var(--text)',
              }}>
                {article.title}
              </h2>
              <p style={{
                marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 10,
                color: 'var(--text-faint)', letterSpacing: '0.03em',
              }}>
                {formatRelativeTime(article.date)}
                {article.readingTime && ` · ${article.readingTime} min read`}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
