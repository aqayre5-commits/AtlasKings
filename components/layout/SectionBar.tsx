'use client'

/**
 * SectionBar — single sticky bar combining section identity + subnav tabs.
 *
 *   [🇲🇦 MOROCCO]  │  Overview  Fixtures  WC 2026 Squad  News
 *
 * 44px dark bar, position: sticky below header + ticker.
 */

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface SectionBarTab {
  label: { en: string; ar: string; fr: string }
  href: string
}

interface Props {
  flag: string
  name: string | { en: string; ar: string; fr: string }
  tabs: SectionBarTab[]
  lang?: string
  accentColor?: string
}

export function SectionBar({ flag, name, tabs, lang = 'en', accentColor = '#C1121F' }: Props) {
  const pathname = usePathname()
  const barRef = useRef<HTMLElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLAnchorElement>(null)
  const [snapped, setSnapped] = useState(false)
  const langKey = (lang === 'ar' || lang === 'fr' ? lang : 'en') as 'en' | 'ar' | 'fr'
  const p = lang === 'en' ? '' : `/${lang}`

  // Detect when bar snaps
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => setSnapped(!entry.isIntersecting),
      { rootMargin: '-90px 0px 0px 0px', threshold: 0 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  // Auto-scroll active tab into view on mobile
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [pathname])

  return (
    <>
      <div ref={sentinelRef} style={{ height: 1, marginBottom: -1 }} aria-hidden="true" />

      <nav
        ref={barRef}
        style={{
          position: 'sticky',
          top: 'var(--header-h, 58px)',
          zIndex: 45,
          background: 'var(--card)',
          borderBottom: '1px solid var(--border)',
          boxShadow: snapped ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
          transition: 'box-shadow 0.15s ease',
          height: 48,
        }}
      >
        <div
          className="section-bar-inner"
          style={{
            maxWidth: 1080,
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'stretch',
            height: '100%',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* Section identity — left-pinned */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexShrink: 0,
              paddingRight: 0,
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>{flag}</span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: langKey === 'ar' ? 13 : 11,
                fontWeight: 700,
                letterSpacing: langKey === 'ar' ? 0 : '0.12em',
                textTransform: langKey === 'ar' ? 'none' as const : 'uppercase' as const,
                color: 'var(--text)',
                whiteSpace: 'nowrap',
              }}
            >
              {typeof name === 'string' ? name : name[langKey]}
            </span>
          </div>

          {/* Divider */}
          <div
            style={{
              width: 1,
              background: 'var(--border)',
              alignSelf: 'center',
              height: 16,
              margin: '0 16px',
              flexShrink: 0,
            }}
          />

          {/* Tabs */}
          {tabs.map(tab => {
            const href = `${p}${tab.href}`
            const isActive = pathname === href || pathname === href + '/'
            return (
              <Link
                key={tab.href}
                href={href}
                ref={isActive ? activeRef : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: langKey === 'ar' ? '0 18px' : '0 16px',
                  fontFamily: 'var(--font-head)',
                  fontSize: langKey === 'ar' ? 13 : 11,
                  fontWeight: 700,
                  letterSpacing: langKey === 'ar' ? 0 : '0.08em',
                  textTransform: langKey === 'ar' ? 'none' as const : 'uppercase' as const,
                  textDecoration: 'none',
                  color: isActive ? 'var(--text)' : 'var(--text-faint)',
                  borderBottom: isActive ? `2px solid ${accentColor}` : '2px solid transparent',
                  marginBottom: -1,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'color 0.15s',
                }}
              >
                {tab.label[langKey]}
              </Link>
            )
          })}
        </div>
      </nav>

      <style>{`
        .section-bar-inner::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  )
}
