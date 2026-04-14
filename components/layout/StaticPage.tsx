import Link from 'next/link'

interface StaticPageProps {
  title: string
  subtitle?: string
  accent?: string // CSS color var
  children: React.ReactNode
  lang?: string
}

export function StaticPage({ title, subtitle, accent = 'var(--red)', children, lang = 'en' }: StaticPageProps) {
  const p = lang === 'en' ? '' : `/${lang}`
  return (
    <main>
      {/* Page hero */}
      <div style={{
        background: 'var(--hdr-bg)',
        borderBottom: `3px solid ${accent}`,
        padding: '28px 20px 24px',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Link href={`${p}/`} style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: '#484848', textDecoration: 'none',
            display: 'inline-block', marginBottom: 18,
          }}>
            ← Home
          </Link>
          <h1 style={{
            fontFamily: 'var(--font-head)', fontSize: 42, fontWeight: 800,
            fontStyle: 'italic', letterSpacing: '0.02em', textTransform: 'uppercase',
            color: '#ffffff', lineHeight: 1, marginBottom: subtitle ? 10 : 0,
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 15,
              color: '#666', lineHeight: 1.6, marginTop: 8,
            }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Page body */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '36px 20px 80px' }}>
        {children}
      </div>
    </main>
  )
}

// Reusable prose section
export function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      {title && (
        <h2 style={{
          fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: 'var(--text)', marginBottom: 14,
          paddingBottom: 10, borderBottom: '2px solid var(--border)',
        }}>
          {title}
        </h2>
      )}
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 15,
        lineHeight: 1.78, color: 'var(--text-sec)',
      }}>
        {children}
      </div>
    </section>
  )
}

export function P({ children }: { children: React.ReactNode }) {
  return <p style={{ marginBottom: '1.1rem' }}>{children}</p>
}

export function InfoCard({ items }: { items: { label: string; value: React.ReactNode }[] }) {
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)', marginBottom: 32,
    }}>
      {items.map(({ label, value }, i) => (
        <div key={label} style={{
          display: 'flex', gap: 16, padding: '14px 20px',
          borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
          alignItems: 'flex-start',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--text-faint)', flexShrink: 0, paddingTop: 2, minWidth: 100,
          }}>
            {label}
          </span>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: 14,
            color: 'var(--text)', lineHeight: 1.5,
          }}>
            {value}
          </span>
        </div>
      ))}
    </div>
  )
}
