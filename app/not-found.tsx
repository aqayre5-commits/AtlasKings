import Link from 'next/link'

export default function RootNotFound() {
  return (
    <main>
      <div style={{
        maxWidth: 520, margin: '80px auto', padding: '60px 20px',
        textAlign: 'center', background: '#ffffff',
        border: '1px solid #e6e4e0', borderRadius: 8,
      }}>
        <div style={{
          fontFamily: 'system-ui, sans-serif', fontSize: 80, fontWeight: 800,
          color: '#e6e4e0', lineHeight: 1, marginBottom: 16,
        }}>
          404
        </div>
        <h1 style={{
          fontFamily: 'system-ui, sans-serif', fontSize: 24, fontWeight: 700,
          color: '#0f0f0f', marginBottom: 12,
        }}>
          Page Not Found
        </h1>
        <p style={{
          fontFamily: 'system-ui, sans-serif', fontSize: 14,
          color: '#4a4a4a', marginBottom: 32,
        }}>
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link href="/" style={{
          fontFamily: 'system-ui, sans-serif', fontSize: 14, fontWeight: 600,
          color: '#ffffff', textDecoration: 'none',
          background: '#0a5229', padding: '10px 24px', borderRadius: 6,
        }}>
          ← Back to Home
        </Link>
      </div>
    </main>
  )
}
