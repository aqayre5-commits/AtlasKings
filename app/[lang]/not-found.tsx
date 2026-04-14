'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TEXTS: Record<string, { title: string; desc: string; back: string }> = {
  en: { title: 'Page Not Found', desc: "The page you're looking for doesn't exist or has moved.", back: '← Back to Home' },
  ar: { title: 'الصفحة غير موجودة', desc: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.', back: '→ العودة للرئيسية' },
  fr: { title: 'Page introuvable', desc: 'La page que vous cherchez n\'existe pas ou a été déplacée.', back: '← Retour à l\'accueil' },
}

export default function NotFound() {
  const pathname = usePathname()
  const lang = pathname?.startsWith('/ar') ? 'ar' : pathname?.startsWith('/fr') ? 'fr' : 'en'
  const t = TEXTS[lang] ?? TEXTS.en
  const home = lang === 'en' ? '/' : `/${lang}/`

  return (
    <main>
      <div className="page-wrap">
        <div style={{
          padding: '80px 20px', textAlign: 'center',
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{
            fontFamily: 'var(--font-head)', fontSize: 80, fontWeight: 800,
            color: 'var(--border)', lineHeight: 1, marginBottom: 16, fontStyle: 'italic',
          }}>
            404
          </div>
          <h1 style={{
            fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 800,
            letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 12,
          }}>
            {t.title}
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-sec)', marginBottom: 32,
          }}>
            {t.desc}
          </p>
          <Link href={home} style={{
            fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: '#fff', textDecoration: 'none',
            background: 'var(--green)', padding: '10px 24px', borderRadius: 'var(--radius)',
          }}>
            {t.back}
          </Link>
        </div>
      </div>
    </main>
  )
}
