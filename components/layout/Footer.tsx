import Link from 'next/link'
import { type Lang } from '@/lib/i18n/config'
import { getTranslations } from '@/lib/i18n/translations'

interface FooterProps {
  lang: Lang
}

// Launch Session 3.2: global AI-assisted workflow disclosure, rendered
// above the legal strip on every page. Previously the disclosure only
// appeared on /morocco — the footer surface is more durable and
// universal. Wording matches the existing /morocco card and links to
// /editorial for the full editorial policy.
const AI_DISCLOSURE: Record<Lang, { text: string; link: string }> = {
  en: {
    text: 'Atlas Kings is a Morocco-first football publication using AI-assisted workflows for speed, translation, and research, with editorial review on key stories and flagship pages.',
    link: 'Editorial guidelines',
  },
  ar: {
    text: 'أطلس كينغز منصّة كروية تجعل المغرب في المقدّمة، وتستعين بسير عمل مدعومة بالذكاء الاصطناعي لتسريع التغطية والترجمة والبحث، مع مراجعة تحريرية على القصص المحورية والصفحات الرئيسية.',
    link: 'المبادئ التحريرية',
  },
  fr: {
    text: "Atlas Kings est une publication football centrée sur le Maroc qui s'appuie sur des flux de travail assistés par IA pour la vitesse, la traduction et la recherche, avec une relecture éditoriale sur les articles clés et les pages phares.",
    link: 'Charte éditoriale',
  },
}

export function Footer({ lang }: FooterProps) {
  const t = getTranslations(lang)
  const f = t.ui.footer
  const p = lang === 'en' ? '' : `/${lang}`
  const isRTL = lang === 'ar'
  const disclosure = AI_DISCLOSURE[lang] ?? AI_DISCLOSURE.en

  return (
    <footer className="site-footer" aria-label="Site footer" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="footer-inner">
        <div className="footer-body">

          {/* Brand */}
          <div className="footer-brand-block">
            <Link href={`${p}/`} className="footer-logo">
              <img src="/images/logo.png" alt="Atlas Kings" style={{ height: 52, width: 'auto', display: 'block' }} />
            </Link>
            <p className="footer-tagline">{f.tagline}</p>
          </div>

          {/* Nav groups */}
          <div className="footer-links">
            <div className="footer-link-group">
              <h4>{f.coverage}</h4>
              <Link href={`${p}/botola-pro`} className="hl">{t.nav.botolaP}</Link>
              <Link href={`${p}/morocco`}>{t.nav.morocco}</Link>
              <Link href={`${p}/champions-league`}>{t.nav.ucl}</Link>
              <Link href={`${p}/premier-league`}>{t.nav.premierLeague}</Link>
              <Link href={`${p}/wc-2026`}>{t.nav.wc2026}</Link>
              <Link href={`${p}/world-cup-2030`}>{t.nav.wc2030}</Link>
              <Link href={`${p}/transfers`}>{t.nav.transfers}</Link>
            </div>
            <div className="footer-link-group">
              <h4>{f.about}</h4>
              <Link href={`${p}/about`}>{f.aboutUs}</Link>
              <Link href={`${p}/editorial`}>{f.editorial}</Link>
              <Link href={`${p}/contact`}>{f.contact}</Link>
              <Link href={`${p}/advertise`}>{f.advertise}</Link>
            </div>
          </div>

          {/* Social links removed in Launch Session 2.7 — all three
              targets were href="#" placeholders. Restore the X /
              Instagram / YouTube block here once real social accounts
              exist, using the same .footer-social-link markup from
              git history. */}
        </div>

        {/* AI-assisted workflow disclosure — Launch Session 3.2.
            Single durable surface above the legal strip, shown on
            every page. Keeps the flagship /morocco card unchanged. */}
        <div
          data-ai-disclosure
          style={{
            borderTop: '1px solid var(--border)',
            padding: '14px 0 12px',
            marginTop: 20,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              lineHeight: 1.6,
              color: 'var(--text-faint)',
              margin: 0,
              maxWidth: 820,
            }}
          >
            {disclosure.text}{' '}
            <Link
              href={`${p}/editorial`}
              style={{
                color: 'var(--text-sec)',
                textDecoration: 'underline',
                textUnderlineOffset: 2,
              }}
            >
              {disclosure.link}
            </Link>
            .
          </p>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span className="footer-copy">{f.rights}</span>
          <div className="footer-legal">
            <Link href={`${p}/privacy`}>{f.privacy}</Link>
            <Link href={`${p}/terms`}>{f.terms}</Link>
            <Link href={`${p}/cookies`}>{f.cookies}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
