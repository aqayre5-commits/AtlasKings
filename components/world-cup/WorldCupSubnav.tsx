'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'

interface Props {
  lang?: string
}

export function WorldCupSubnav({ lang = 'en' }: Props) {
  const pathname = usePathname()
  const t = getTranslations(lang as Lang)
  const sn = t.subnav
  const prefix = lang === 'en' ? '' : `/${lang}`
  const base = `${prefix}/wc-2026`

  const NAV_ITEMS = [
    { label: sn.overview,        path: '',           icon: '🏟️' },
    { label: sn.fixturesResults, path: '/fixtures',  icon: null },
    { label: sn.table,           path: '/standings',  icon: null },
    { label: sn.bracket,         path: '/bracket',    icon: null },
    { label: sn.teams,           path: '/teams',      icon: null },
    { label: sn.playerStats,     path: '/stats',      icon: null },
    { label: 'Predictor',        path: '/predictor',  icon: '🎯' },
  ]

  return (
    <nav
      aria-label="World Cup 2026"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: 'var(--hdr-bg)',
        borderBottom: '1px solid var(--hdr-border)',
      }}
    >
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 var(--edge)',
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        alignItems: 'stretch',
        minHeight: 44,
      }}>
        {NAV_ITEMS.map(item => {
          const href = `${base}${item.path}`
          const isActive = item.path === ''
            ? pathname === base || pathname === `${base}/`
            : pathname.startsWith(href)

          return (
            <Link
              key={item.path || 'overview'}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              style={{
                flexShrink: 0,
                padding: '0 14px',
                fontFamily: 'var(--font-head)',
                fontSize: 12,
                fontWeight: isActive ? 800 : 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'all var(--t-fast)',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                color: isActive ? '#ffffff' : 'var(--hdr-muted)',
                borderBottom: isActive ? '2px solid var(--green-bright)' : '2px solid transparent',
                position: 'relative',
              }}
            >
              {item.icon && <span style={{ fontSize: 13 }}>{item.icon}</span>}
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
