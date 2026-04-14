'use client'

/**
 * PWA install prompt — shows a banner on mobile when the app
 * is installable but not yet installed. Uses the beforeinstallprompt
 * event to trigger the native install dialog.
 *
 * Dismisses for the session if user closes it.
 */

import { useEffect, useState, useRef } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const LABELS = {
  en: { title: 'Get the Atlas Kings app', action: 'Install', dismiss: 'Not now' },
  ar: { title: '\u062D\u0645\u0651\u0644 \u062A\u0637\u0628\u064A\u0642 \u0623\u0637\u0644\u0633 \u0643\u064A\u0646\u063A\u0632', action: '\u062A\u062B\u0628\u064A\u062A', dismiss: '\u0644\u0627\u062D\u0642\u064B\u0627' },
  fr: { title: 'Installer Atlas Kings', action: 'Installer', dismiss: 'Plus tard' },
}

export function InstallPrompt({ lang = 'en' }: { lang?: string }) {
  const [show, setShow] = useState(false)
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null)
  const t = LABELS[lang as keyof typeof LABELS] ?? LABELS.en

  useEffect(() => {
    // Don't show if already dismissed this session
    try { if (sessionStorage.getItem('pwa-dismissed')) return } catch {}

    // Don't show if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) return

    const handler = (e: Event) => {
      e.preventDefault()
      deferredPrompt.current = e as BeforeInstallPromptEvent
      setShow(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt.current) return
    await deferredPrompt.current.prompt()
    const { outcome } = await deferredPrompt.current.userChoice
    if (outcome === 'accepted') setShow(false)
    deferredPrompt.current = null
  }

  const handleDismiss = () => {
    setShow(false)
    try { sessionStorage.setItem('pwa-dismissed', '1') } catch {}
  }

  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: '#0c0c0c',
        borderTop: '2px solid #C1121F',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
      }}
    >
      {/* App icon */}
      <img
        src="/images/icon-192.png"
        alt="Atlas Kings"
        width={40}
        height={40}
        style={{ borderRadius: 8, flexShrink: 0 }}
      />

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-head)',
          fontSize: 14,
          fontWeight: 700,
          color: '#fff',
        }}>
          {t.title}
        </div>
      </div>

      {/* Install button */}
      <button
        onClick={handleInstall}
        style={{
          background: '#C1121F',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '8px 18px',
          fontFamily: 'var(--font-head)',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        {t.action}
      </button>

      {/* Dismiss */}
      <button
        onClick={handleDismiss}
        style={{
          background: 'none',
          border: 'none',
          color: '#666',
          fontSize: 18,
          cursor: 'pointer',
          padding: '0 4px',
          flexShrink: 0,
        }}
        aria-label={t.dismiss}
      >
        &times;
      </button>
    </div>
  )
}
