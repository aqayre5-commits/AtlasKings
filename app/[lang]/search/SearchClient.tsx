'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatRelativeTime, categoryLabel, categoryColor } from '@/lib/utils'

interface SearchResult {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readingTime?: number
}

export function SearchClient({ initialQuery }: { initialQuery: string }) {
  const router = useRouter()
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
  const langMatch = pathname.match(/^\/(fr|ar|es)\//)
  const lang = langMatch ? langMatch[1] : 'en'
  const p = lang === 'en' ? '' : `/${lang}`
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    inputRef.current?.focus()
    if (initialQuery) performSearch(initialQuery)
  }, [])

  async function performSearch(q: string) {
    if (q.length < 2) { setResults([]); setSearched(false); return }
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.results)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setQuery(q)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      performSearch(q)
      router.replace(`${p}/search?q=${encodeURIComponent(q)}`, { scroll: false })
    }, 300)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query)
  }

  return (
    <main>
      {/* Search header */}
      <div style={{ background: 'var(--hdr-bg)', borderBottom: '3px solid var(--green)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 20px' }}>
          <nav style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.05em', color: '#555', marginBottom: 16, display: 'flex', gap: 6 }}>
            <Link href={`${p}/`} style={{ color: '#555', textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            <span style={{ color: '#888' }}>Search</span>
          </nav>

          {/* Search bar */}
          <form onSubmit={handleSubmit}>
            <div style={{ position: 'relative', maxWidth: 640 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#444', pointerEvents: 'none' }}>
                <circle cx="11" cy="11" r="7.5"/><path strokeLinecap="round" d="M20 20l-3.5-3.5"/>
              </svg>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={handleChange}
                placeholder="Search players, teams, competitions…"
                aria-label="Search"
                style={{
                  width: '100%', height: 52,
                  border: '1px solid #2a2a2a', borderRadius: 'var(--radius)',
                  padding: '0 16px 0 46px',
                  fontFamily: 'var(--font-body)', fontSize: 16,
                  background: '#111', color: '#eee', outline: 'none',
                }}
              />
              {loading && (
                <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%',
                    border: '2px solid #333',
                    borderTopColor: 'var(--green)',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="page-wrap">
        {/* Results count */}
        {searched && !loading && (
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--text-faint)', marginBottom: 16,
            letterSpacing: '0.04em',
          }}>
            {results.length === 0
              ? `No results for "${query}"`
              : `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`}
          </p>
        )}

        {/* Results grid */}
        {results.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1, background: 'var(--border)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
          }}>
            {results.map(result => {
              const color = categoryColor(result.category)
              return (
                <Link key={result.slug} href={`${p}/articles/${result.slug}`} style={{
                  display: 'block', textDecoration: 'none', color: 'inherit',
                  background: 'var(--card)', padding: '18px 20px',
                  transition: 'background 0.12s',
                }}>
                  <span style={{
                    display: 'inline-block', marginBottom: 8,
                    fontFamily: 'var(--font-head)', fontSize: 9, fontWeight: 800,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color, background: `${color}15`,
                    padding: '2px 8px', borderRadius: 'var(--radius-sm)',
                  }}>
                    {categoryLabel(result.category)}
                  </span>
                  <h2 style={{
                    fontFamily: 'var(--font-head)', fontSize: 17, fontWeight: 700,
                    lineHeight: 1.25, color: 'var(--text)', marginBottom: 8,
                  }}>
                    {result.title}
                  </h2>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: 13,
                    color: 'var(--text-sec)', lineHeight: 1.55,
                    marginBottom: 10,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {result.excerpt}
                  </p>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                    color: 'var(--text-faint)', letterSpacing: '0.03em',
                  }}>
                    {formatRelativeTime(result.date)}
                    {result.readingTime && ` · ${result.readingTime} min read`}
                  </span>
                </Link>
              )
            })}
          </div>
        )}

        {/* Empty state */}
        {searched && !loading && results.length === 0 && (
          <div style={{
            padding: '60px 20px', textAlign: 'center',
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚽</div>
            <h2 style={{
              fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: 'var(--text)', marginBottom: 10,
            }}>
              No results found
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-sec)', marginBottom: 24 }}>
              Try searching for a player, team or competition.
            </p>
            <Link href={`${p}/`} style={{
              fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--red)', textDecoration: 'none',
            }}>
              ← Back to home
            </Link>
          </div>
        )}

        {/* Default state */}
        {!searched && (
          <div style={{
            padding: '48px 20px', textAlign: 'center',
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)',
          }}>
            <p style={{ fontFamily: 'var(--font-head)', fontSize: 15, color: 'var(--text-faint)', letterSpacing: '0.04em' }}>
              Type to search articles, players and teams
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) translateY(-50%); } }
        @media (max-width: 767px) {
          .search-results-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
