import Link from 'next/link'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { ArticleMeta } from '@/types/article'

interface HeadlineListProps {
  articles: ArticleMeta[]
  langPrefix?: string
}

export function HeadlineList({ articles, langPrefix = '' }: HeadlineListProps) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
      marginTop: 'var(--gap)',
    }}>
      <SectionHeader title="Top Headlines" color="var(--red)" />
      <ul style={{ listStyle: 'none' }}>
        {articles.map((article, i) => (
          <li key={article.slug}>
            <Link
              href={`${langPrefix}/articles/${article.slug}`}
              style={{
                display: 'block',
                padding: '11px 14px',
                borderBottom: i < articles.length - 1 ? '1px solid var(--border)' : 'none',
                textDecoration: 'none',
                color: 'var(--text)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 500,
                lineHeight: 1.45,
                transition: 'background 0.12s',
              }}
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
