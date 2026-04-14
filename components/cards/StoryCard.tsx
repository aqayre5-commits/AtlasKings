// Story Card — Mobile-first design
// Spec: thumbnail | section label | headline (2-line clamp) | summary (2-line clamp) | metadata
// Tap target: full card

import Link from 'next/link'
import Image from 'next/image'
import { resolveArticleThumbnail } from '@/lib/articles/thumbnail'
import { formatRelativeTime, categoryColor, getArticleHref, isExternalArticle } from '@/lib/utils'
import type { ArticleMeta } from '@/types/article'

interface StoryCardProps {
  article: ArticleMeta
  langPrefix?: string
  variant?: 'default' | 'lead' | 'compact' | 'horizontal'
  showExcerpt?: boolean
  showImage?: boolean
}

export function StoryCard({
  article,
  langPrefix = '',
  variant = 'default',
  showExcerpt = true,
  showImage = true,
}: StoryCardProps) {
  const thumbnail = resolveArticleThumbnail(article)
  const color = categoryColor(article.category)
  const href = getArticleHref(article, langPrefix)
  const external = isExternalArticle(article)
  const categoryLabel = article.category.replace(/-/g, ' ')

  // Horizontal variant (compact list item)
  if (variant === 'horizontal') {
    return (
      <Link
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener' : undefined}
        className="story-card"
        style={{
          display: 'flex', gap: 12, padding: '12px 0',
          textDecoration: 'none', alignItems: 'flex-start',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {showImage && thumbnail && (
          <div style={{
            width: 88, height: 66, borderRadius: 'var(--radius-sm)',
            overflow: 'hidden', flexShrink: 0, position: 'relative',
          }}>
            <Image src={thumbnail} alt={article.title} fill style={{ objectFit: 'cover' }}  sizes="88px" />
            {article.videoId && (
              <div style={{
                position: 'absolute', bottom: 4, right: 4,
                width: 20, height: 14, borderRadius: 3,
                background: 'rgba(193, 18, 31, 0.9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width={8} height={8} viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
              </div>
            )}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color, lineHeight: 1,
          }}>
            {categoryLabel}
          </span>
          <h3 className="story-title" style={{
            fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 700,
            color: 'var(--text)', lineHeight: 1.3, margin: '4px 0 0',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            transition: 'color 0.15s ease',
          }}>
            {article.title}
          </h3>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)', marginTop: 4, display: 'block' }}>
            {formatRelativeTime(article.date)}
          </span>
        </div>
      </Link>
    )
  }

  // Lead variant (large hero card)
  if (variant === 'lead') {
    return (
      <Link
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener' : undefined}
        className="story-card"
        style={{ display: 'block', textDecoration: 'none' }}
      >
        {/* Image */}
        {showImage && (
          <div style={{
            position: 'relative', width: '100%', aspectRatio: '16/9',
            borderRadius: 'var(--radius)', overflow: 'hidden',
            background: `linear-gradient(140deg, ${color}33 0%, #111 100%)`,
          }}>
            {thumbnail && (
              <Image src={thumbnail} alt={article.title} fill style={{ objectFit: 'cover' }}  sizes="(max-width: 768px) 100vw, 800px" />
            )}
            {/* Category chip overlay */}
            <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#fff', background: color, padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
              }}>
                {categoryLabel}
              </span>
            </div>
          </div>
        )}
        {/* Text */}
        <div style={{ padding: '12px 0 0' }}>
          <h2 style={{
            fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 800,
            fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.2, margin: 0,
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {article.title}
          </h2>
          {showExcerpt && article.excerpt && (
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-sec)',
              lineHeight: 1.5, margin: '8px 0 0',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {article.excerpt}
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>
              {formatRelativeTime(article.date)}
            </span>
            {article.readingTime && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>
                · {article.readingTime} min read
              </span>
            )}
          </div>
        </div>
      </Link>
    )
  }

  // Default card (vertical card with image on top)
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener' : undefined}
      style={{
        display: 'block', textDecoration: 'none',
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        transition: 'transform var(--t-base), box-shadow var(--t-base)',
      }}
    >
      {/* Thumbnail */}
      {showImage && (
        <div style={{
          position: 'relative', width: '100%', aspectRatio: '16/9',
          background: `linear-gradient(140deg, ${color}22 0%, #111 100%)`,
          overflow: 'hidden',
        }}>
          {thumbnail && (
            <Image src={thumbnail} alt={article.title} fill style={{ objectFit: 'cover' }}  sizes="(max-width: 768px) 100vw, 400px" />
          )}
        </div>
      )}
      {/* Content */}
      <div style={{ padding: 14 }}>
        {/* Section label */}
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color, display: 'inline-block', marginBottom: 6,
        }}>
          {categoryLabel}
        </span>
        {/* Headline — 2 line clamp */}
        <h3 style={{
          fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 700,
          color: 'var(--text)', lineHeight: 1.3, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {article.title}
        </h3>
        {/* Summary — 2 line clamp */}
        {showExcerpt && article.excerpt && (
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-sec)',
            lineHeight: 1.5, margin: '6px 0 0',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {article.excerpt}
          </p>
        )}
        {/* Metadata */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>
            {formatRelativeTime(article.date)}
          </span>
          {article.author && article.author !== 'Atlas Kings' && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>
              · {article.author}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
