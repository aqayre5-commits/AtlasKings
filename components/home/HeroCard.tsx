import Link from 'next/link'
import { formatRelativeTime, categoryLabel } from '@/lib/utils'
import type { ArticleMeta } from '@/types/article'

interface HeroCardProps {
  article: ArticleMeta
  subArticles?: ArticleMeta[]
  langPrefix?: string
}

export function HeroCard({ article, subArticles = [], langPrefix = '' }: HeroCardProps) {
  return (
    <article style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Hero image + headline */}
      <Link
        href={`${langPrefix}/articles/${article.slug}`}
        style={{
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
          position: 'relative',
          overflow: 'hidden',
          paddingBottom: 14,
          background: 'var(--card)',
        }}
      >
        {/* Image */}
        <div style={{
          width: '100%',
          aspectRatio: '2/1',
          position: 'relative',
          overflow: 'hidden',
          background: '#0a1a0a',
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
              background: 'linear-gradient(140deg, #091e10 0%, #050505 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 600,
                letterSpacing: '0.22em', color: 'rgba(255,255,255,0.06)',
                textTransform: 'uppercase',
              }}>
                Atlas Kings
              </span>
            </div>
          )}

          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.1) 70%, transparent 100%)',
            pointerEvents: 'none',
          }} />

          {/* Text overlay */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '40px 16px 16px',
          }}>
            <span style={{
              display: 'inline-block',
              fontFamily: 'var(--font-head)', fontSize: 10, fontWeight: 800,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'var(--red)', background: '#fff',
              padding: '3px 9px', marginBottom: 10,
              borderRadius: 'var(--radius-sm)', lineHeight: 1.5,
            }}>
              {categoryLabel(article.category)}
            </span>
            <h1 style={{
              fontFamily: 'var(--font-head)', fontSize: 30, fontWeight: 800,
              fontStyle: 'italic', color: '#fff',
              lineHeight: 1.08, letterSpacing: '0.01em',
              textShadow: '0 1px 6px rgba(0,0,0,0.5)',
            }}>
              {article.title}
            </h1>
            <p style={{
              marginTop: 10,
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'rgba(255,255,255,0.45)', letterSpacing: '0.05em',
            }}>
              {formatRelativeTime(article.date)}
            </p>
          </div>
        </div>
      </Link>

      {/* Two sub-articles */}
      {subArticles.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1,
          background: 'var(--border)',
          borderTop: '1px solid var(--border)',
          marginTop: 14,
        }}>
          {subArticles.slice(0, 2).map(sub => (
            <Link key={sub.slug} href={`${langPrefix}/articles/${sub.slug}`} style={{
              display: 'block',
              textDecoration: 'none',
              color: 'inherit',
              background: 'var(--card)',
              transition: 'background 0.14s',
            }}>
              <div style={{
                width: '100%', aspectRatio: '16/9',
                overflow: 'hidden', background: '#111',
              }}>
                {sub.image ? (
                  <img src={sub.image} alt={sub.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    background: 'linear-gradient(140deg, #0c2318 0%, #050505 100%)',
                  }} />
                )}
              </div>
              <div style={{ padding: '12px 14px 14px' }}>
                <h2 style={{
                  fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 700,
                  lineHeight: 1.22, color: 'var(--text)',
                }}>
                  {sub.title}
                </h2>
                <p style={{
                  marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: 'var(--text-faint)', letterSpacing: '0.03em',
                }}>
                  {formatRelativeTime(sub.date)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </article>
  )
}
