'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { ArticleMeta } from '@/types/article'

interface StickyNextArticleProps {
  article: ArticleMeta
  langPrefix?: string
}

export function StickyNextArticle({ article, langPrefix = '' }: StickyNextArticleProps) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (dismissed) return

    const handleScroll = () => {
      const scrolled = window.scrollY
      const total = document.body.scrollHeight - window.innerHeight
      const pct = total > 0 ? (scrolled / total) * 100 : 0

      // Show when 55% through, hide when at very bottom
      if (pct > 55 && pct < 95) setVisible(true)
      else setVisible(false)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [dismissed])

  if (dismissed) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      zIndex: 50,
      transform: visible ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
    }}>
      <div style={{
        background: '#0c0c0c',
        borderTop: '2px solid var(--green)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
      }}>
        <div style={{
          maxWidth: 1080, margin: '0 auto',
          padding: '12px 20px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          {/* Label */}
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--green-bright)', flexShrink: 0, whiteSpace: 'nowrap',
          }}>
            Up Next
          </span>

          {/* Article thumb */}
          {article.image && (
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--radius-sm)',
              overflow: 'hidden', flexShrink: 0,
              background: '#1a1a1a',
            }}>
              <img
                src={article.image}
                alt={article.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Title */}
          <Link
            href={`${langPrefix}/articles/${article.slug}`}
            style={{
              flex: 1, minWidth: 0,
              fontFamily: 'var(--font-head)', fontSize: 14, fontWeight: 700,
              color: '#fff', textDecoration: 'none', lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {article.title}
          </Link>

          {/* Read button */}
          <Link
            href={`${langPrefix}/articles/${article.slug}`}
            style={{
              fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: '#fff', textDecoration: 'none',
              background: 'var(--green)', border: 'none',
              borderRadius: 'var(--radius-sm)', padding: '8px 14px',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            Read →
          </Link>

          {/* Dismiss */}
          <button
            onClick={() => { setDismissed(true); setVisible(false) }}
            aria-label="Dismiss"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#444', padding: 4, flexShrink: 0,
              display: 'flex', alignItems: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
