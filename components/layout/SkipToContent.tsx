'use client'

interface SkipToContentProps {
  label: string
}

export function SkipToContent({ label }: SkipToContentProps) {
  return (
    <a
      href="#main-content"
      className="skip-to-content"
      style={{
        position: 'absolute',
        left: '-9999px',
        top: 'auto',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        zIndex: 9999,
      }}
      onFocus={(e) => {
        Object.assign(e.currentTarget.style, {
          position: 'fixed', left: '16px', top: '16px',
          width: 'auto', height: 'auto', overflow: 'visible',
          background: '#0a5229', color: '#ffffff',
          padding: '12px 24px', borderRadius: '6px',
          fontFamily: 'var(--font-head)', fontSize: '14px',
          fontWeight: '700', letterSpacing: '0.06em',
          textTransform: 'uppercase', textDecoration: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        })
      }}
      onBlur={(e) => {
        Object.assign(e.currentTarget.style, {
          position: 'absolute', left: '-9999px',
          width: '1px', height: '1px', overflow: 'hidden',
        })
      }}
    >
      {label}
    </a>
  )
}
