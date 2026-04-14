export default function Loading() {
  return (
    <main>
      <div className="page-wrap">
        <div className="widget-shell">
          {/* Main content column skeleton */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
            {/* Hero skeleton */}
            <div style={{
              width: '100%',
              aspectRatio: '16/9',
              borderRadius: 'var(--radius)',
              background: 'linear-gradient(90deg, var(--card-alt) 25%, var(--card-hover) 50%, var(--card-alt) 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }} />

            {/* Section skeleton */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{
                height: 20, width: 160, borderRadius: 4,
                background: 'var(--card-alt)',
              }} />
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, padding: '12px 0',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <div style={{
                    width: 88, height: 66, borderRadius: 'var(--radius-sm)',
                    background: 'linear-gradient(90deg, var(--card-alt) 25%, var(--card-hover) 50%, var(--card-alt) 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                    flexShrink: 0,
                  }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ height: 12, width: 60, borderRadius: 4, background: 'var(--card-alt)' }} />
                    <div style={{ height: 16, width: '80%', borderRadius: 4, background: 'var(--card-alt)' }} />
                    <div style={{ height: 12, width: 100, borderRadius: 4, background: 'var(--card-alt)' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Cards grid skeleton */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--gap)' }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{
                  background: 'var(--card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', overflow: 'hidden',
                }}>
                  <div style={{
                    width: '100%', aspectRatio: '16/9',
                    background: 'linear-gradient(90deg, var(--card-alt) 25%, var(--card-hover) 50%, var(--card-alt) 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                  }} />
                  <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ height: 10, width: 60, borderRadius: 4, background: 'var(--card-alt)' }} />
                    <div style={{ height: 16, width: '90%', borderRadius: 4, background: 'var(--card-alt)' }} />
                    <div style={{ height: 12, width: '60%', borderRadius: 4, background: 'var(--card-alt)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar skeleton */}
          <aside className="sidebar">
            <div style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', height: 400,
              background: 'linear-gradient(90deg, var(--card-alt) 25%, var(--card-hover) 50%, var(--card-alt) 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }} />
          </aside>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </main>
  )
}
