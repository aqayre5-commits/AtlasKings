import Link from 'next/link'

interface ComingSoonProps {
  title: string
  description?: string
  backHref?: string
  backLabel?: string
}

export function ComingSoon({
  title,
  description = 'This section is being built. Check back soon.',
  backHref = '/',
  backLabel = '← Back to home',
}: ComingSoonProps) {
  return (
    <div style={{
      padding: '60px 20px',
      textAlign: 'center',
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Icon */}
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: 'var(--green-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path strokeLinecap="round" d="M12 6v6l4 2"/>
        </svg>
      </div>

      <h2 style={{
        fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 800,
        letterSpacing: '0.06em', textTransform: 'uppercase',
        color: 'var(--text)', marginBottom: 10,
      }}>
        {title}
      </h2>
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: 14,
        color: 'var(--text-sec)', marginBottom: 28,
        maxWidth: 400, margin: '0 auto 28px',
      }}>
        {description}
      </p>
      <Link
        href={backHref}
        style={{
          fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--red)', textDecoration: 'none',
        }}
      >
        {backLabel}
      </Link>
    </div>
  )
}
