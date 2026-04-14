'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { type Lang, LANG_COOKIE, LANG_COOKIE_MAX_AGE } from '@/lib/i18n/config'
import { getTranslations } from '@/lib/i18n/translations'
import { PushNotificationBell } from '@/components/ui/PushNotificationBell'
import { TickerBar } from '@/components/layout/TickerBar'
import type { TickerData } from '@/lib/ticker/getTickerData'

interface HeaderProps {
  lang: Lang
  tickerData?: TickerData | null
}

function buildNavLinks(lang: Lang, t: ReturnType<typeof getTranslations>) {
  const p = lang === 'en' ? '' : `/${lang}`
  return [
    { key: 'home',      label: t.nav.home,         href: `${p}/`,                 className: 'nav-link' },
    { key: 'morocco',   label: t.nav.morocco,       href: `${p}/morocco`,          className: 'nav-link morocco-link' },
    { key: 'botola',    label: t.nav.botolaP,       href: `${p}/botola-pro`,       className: 'nav-link' },
    { key: 'pl',        label: t.nav.premierLeague, href: `${p}/premier-league`,   className: 'nav-link' },
    { key: 'laliga',    label: t.nav.laLiga,        href: `${p}/la-liga`,          className: 'nav-link' },
    { key: 'ucl',       label: t.nav.ucl,           href: `${p}/champions-league`, className: 'nav-link' },
    { key: 'transfers', label: t.nav.transfers,     href: `${p}/transfers`,        className: 'nav-link' },
    { key: 'wc26',      label: t.nav.wc2026,          href: `${p}/wc-2026`,          className: 'nav-link wc-link' },
    { key: 'wc30',      label: t.nav.wc2030,          href: `${p}/world-cup-2030`,   className: 'nav-link wc-link' },
  ]
}

const LANG_OPTIONS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'AR' },
  { code: 'fr', label: 'FR' },
]

export function Header({ lang, tickerData }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const t = getTranslations(lang)
  const NAV_LINKS = buildNavLinks(lang, t)
  const MOBILE_STRIP_KEYS = ['home', 'morocco', 'botola', 'pl', 'ucl', 'transfers', 'wc26', 'wc30']

  // ── ALL STATE FIRST ──
  const [activeSection,   setActiveSection]   = useState<string>('home')
  const [drawerOpen,      setDrawerOpen]       = useState(false)
  const [mobStripSection, setMobStripSection]  = useState('home')
  // leaveTimer removed — nav is click-only now

  // Detect section from URL
  useEffect(() => {
    const isLanding = pathname === '/' || pathname === `/${lang}` || pathname === `/${lang}/`
    if (isLanding) {
      setActiveSection('home')
      return
    }
    // World Cup — detect which tab
    if (pathname.includes('world-cup-2030')) {
      setActiveSection('wc30')
      return
    }
    if (pathname.includes('world-cup-2026') || pathname.includes('wc-2026')) {
      setActiveSection('wc26')
      return
    }
    const found = NAV_LINKS.find(l =>
      l.key !== 'home' && l.key !== 'wc26' && l.key !== 'wc30' &&
      pathname.replace(`/${lang}`, '').startsWith(l.href.replace(`/${lang}`, '').replace(/\/$/, ''))
    )
    setActiveSection(found ? found.key : 'home')
  }, [pathname, lang])

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawerOpen(false) }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  // Close drawer on ANY route change (including language switch)
  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  const switchLang = useCallback((newLang: Lang) => {
    document.cookie = `${LANG_COOKIE}=${newLang}; max-age=${LANG_COOKIE_MAX_AGE}; path=/; samesite=lax`
    const cleanPath = pathname.replace(/^\/(en|ar|fr)/, '') || '/'
    router.push(newLang === 'en' ? cleanPath : `/${newLang}${cleanPath}`)
  }, [pathname, router])

  // ── NAV CLICK HANDLER ──
  const handleNavClick = (key: string) => {
    setActiveSection(key)
  }

  // ── DERIVED ──
  const isAtHome = mobStripSection === 'home'
  const stripTabs = MOBILE_STRIP_KEYS.map(k => ({
    key: k,
    label: NAV_LINKS.find(n => n.key === k)?.label ?? k,
    href:  NAV_LINKS.find(n => n.key === k)?.href ?? '/',
  }))

  const isRTL = lang === 'ar'
  const p = lang === 'en' ? '' : `/${lang}`

  return (
    <>
      {/* ══ MOBILE DRAWER ══ */}
      <div className={`drawer-overlay${drawerOpen ? ' open' : ''}`} onClick={() => setDrawerOpen(false)} />
      <div className={`drawer${drawerOpen ? ' open' : ''}`} role="dialog" aria-label="Navigation menu"
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <div className="drawer-header">
          <Link href={`${p}/`} className="drawer-logo" onClick={() => setDrawerOpen(false)}>
            <Image src="/images/logo.png" alt="Atlas Kings" width={120} height={40} priority />
          </Link>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <nav className="drawer-nav">
          {NAV_LINKS.map(link => (
            <div className="drawer-item" key={link.key}>
              <Link href={link.href}
                className={`drawer-link${link.key === 'morocco' ? ' morocco' : ''}${activeSection === link.key ? ' active' : ''}`}
                onClick={() => { setActiveSection(link.key); setMobStripSection(link.key); setDrawerOpen(false) }}>
                {link.key === 'morocco' ? '🇲🇦 ' : ''}{link.label}
              </Link>
            </div>
          ))}
        </nav>
        <div className="drawer-footer">
          <div className="drawer-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="7.5"/><path strokeLinecap="round" d="M20 20l-3.5-3.5"/>
            </svg>
            <input type="text" placeholder={t.ui.search.placeholder} aria-label={t.nav.search} />
          </div>
          <div className="drawer-lang">
            {LANG_OPTIONS.map(({ code, label }) => (
              <button key={code} className={lang === code ? 'active' : ''} aria-pressed={lang === code}
                onClick={() => { switchLang(code); setDrawerOpen(false) }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ HEADER ══ */}
      <header className="site-header" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <div className="header-inner">
          <Link href={`${p}/`} className="logo" aria-label="Atlas Kings home">
            <Image src="/images/logo.png" alt="Atlas Kings" width={132} height={44} priority style={{ display: 'block' }} />
          </Link>

          <nav className="header-nav" aria-label="Main navigation">
            {NAV_LINKS.map(link => (
              <Link key={link.key} href={link.href}
                className={`${link.className}${activeSection === link.key ? ' active' : ''}`}
                aria-current={activeSection === link.key ? 'page' : undefined}
                onClick={() => handleNavClick(link.key)}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="header-utils">
            <PushNotificationBell lang={lang} />
            <LangSwitcher lang={lang} options={LANG_OPTIONS} onSwitch={switchLang} />
          </div>

          <button className="mobile-menu-btn" aria-label="Open menu" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <button className="mobile-lang-btn" id="mobileLang" onClick={() => {
            const langs: Lang[] = ['en', 'ar', 'fr']
            const next = langs[(langs.indexOf(lang) + 1) % 3]
            switchLang(next)
          }}>
            {lang.toUpperCase()}
          </button>
        </div>

        {/* Scores ticker */}
        {tickerData && tickerData.state === 'live' && tickerData.matches.length > 0 && (
          <TickerBar data={tickerData} lang={lang} />
        )}

        {/* Mobile tab strip — top-level section links only.
            Section-specific tabs live in each section's <SectionBar>. */}
        <div className="mobile-tab-strip" role="navigation">
          <button className="mob-strip-label" onClick={() => setDrawerOpen(true)}>
            <span className="mob-strip-label-icon">{'⚽'}</span>
            <span className="mob-strip-label-text">{t.nav.home}</span>
            <span className="mob-strip-label-arrow">{'›'}</span>
          </button>
          <div className="mob-strip-links">
            {stripTabs.map(tab => (
              <Link key={tab.key} href={tab.href}
                className={`mob-tab${tab.key === activeSection ? ' active' : ''}`}>
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </header>
    </>
  )
}

/** Globe icon + dropdown language switcher. */
function LangSwitcher({
  lang,
  options,
  onSwitch,
}: {
  lang: Lang
  options: { code: Lang; label: string }[]
  onSwitch: (code: Lang) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [open])

  return (
    <div ref={ref} className="lang-switcher" style={{ position: 'relative', flexShrink: 0 }}>
      {/* Globe button */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label="Change language"
        aria-expanded={open}
        className="lang-switcher-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 10px',
          background: open ? '#1e1e1e' : 'transparent',
          border: '1px solid #333',
          borderRadius: 'var(--radius-sm)',
          color: '#cccccc',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.06em',
          transition: 'all 0.15s ease',
        }}
      >
        {/* Globe SVG */}
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <circle cx={12} cy={12} r={10} />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        {lang.toUpperCase()}
        <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ opacity: 0.6, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 4,
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            zIndex: 200,
            minWidth: 100,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          {options.map(({ code, label }) => (
            <button
              key={code}
              type="button"
              onClick={() => { onSwitch(code); setOpen(false) }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '10px 14px',
                background: lang === code ? 'var(--green)' : 'transparent',
                color: lang === code ? '#fff' : '#aaa',
                border: 'none',
                borderBottom: '1px solid #222',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                fontWeight: lang === code ? 700 : 500,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                transition: 'background 0.12s ease',
                textAlign: 'left',
              }}
            >
              {label}
              {lang === code && (
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} style={{ marginLeft: 'auto' }}>
                  <path d="M5 12l5 5L20 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
