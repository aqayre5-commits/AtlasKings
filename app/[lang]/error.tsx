'use client'

import { useEffect } from 'react'

const TEXTS: Record<string, { title: string; desc: string; retry: string; home: string }> = {
  en: {
    title: 'Something Went Wrong',
    desc: 'We encountered an error loading this page. This is usually temporary.',
    retry: 'Try Again',
    home: '← Back to Home',
  },
  ar: {
    title: 'حدث خطأ ما',
    desc: 'واجهنا خطأ أثناء تحميل هذه الصفحة. عادة ما يكون مؤقتًا.',
    retry: 'حاول مرة أخرى',
    home: '→ العودة للرئيسية',
  },
  fr: {
    title: 'Une erreur est survenue',
    desc: 'Nous avons rencontré une erreur lors du chargement de cette page. C\'est généralement temporaire.',
    retry: 'Réessayer',
    home: '← Retour à l\'accueil',
  },
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Atlas Kings] Page error:', error)
  }, [error])

  // Detect lang from URL
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
  const lang = pathname.startsWith('/ar') ? 'ar' : pathname.startsWith('/fr') ? 'fr' : 'en'
  const t = TEXTS[lang] ?? TEXTS.en
  const home = lang === 'en' ? '/' : `/${lang}/`

  return (
    <main>
      <div className="page-wrap">
        <div style={{
          padding: '60px 20px', textAlign: 'center',
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)',
          maxWidth: 520, margin: '40px auto',
        }}>
          <div style={{
            fontFamily: 'var(--font-head)', fontSize: 64, fontWeight: 800,
            color: 'var(--red)', lineHeight: 1, marginBottom: 16,
          }}>
            ⚠
          </div>
          <h1 style={{
            fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 800,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            color: 'var(--text)', marginBottom: 12,
          }}>
            {t.title}
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 14,
            color: 'var(--text-sec)', marginBottom: 32, lineHeight: 1.6,
          }}>
            {t.desc}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={reset}
              style={{
                fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#fff', background: 'var(--red)',
                padding: '10px 24px', borderRadius: 'var(--radius)',
                border: 'none', cursor: 'pointer',
              }}
            >
              {t.retry}
            </button>
            <a href={home} style={{
              fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--text-sec)', textDecoration: 'none',
              padding: '10px 24px', borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              display: 'inline-flex', alignItems: 'center',
            }}>
              {t.home}
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
