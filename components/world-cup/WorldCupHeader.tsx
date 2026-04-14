interface Props {
  title: string
  description: string
}

export function WorldCupHeader({ title, description }: Props) {
  return (
    <div style={{
      background: 'var(--card)',
      borderBottom: '3px solid var(--green)',
      padding: '28px var(--edge) 24px',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Kicker */}
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--green)',
          display: 'block',
          marginBottom: 8,
        }}>
          FIFA WORLD CUP 2026
        </span>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-head)',
          fontSize: 'clamp(24px, 4.5vw, 38px)',
          fontWeight: 800,
          fontStyle: 'italic',
          color: 'var(--text)',
          lineHeight: 1.1,
          margin: 0,
        }}>
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: 'var(--text-sec)',
            lineHeight: 1.6,
            margin: '8px 0 0',
            maxWidth: 600,
          }}>
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
