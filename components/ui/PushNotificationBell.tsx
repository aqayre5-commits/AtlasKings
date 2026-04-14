'use client'

import { useState, useEffect } from 'react'
import { VAPID_PUBLIC_KEY, NOTIFICATION_CATEGORIES, type NotificationCategory } from '@/lib/push/config'
import type { Lang } from '@/lib/i18n/config'

interface Props {
  lang?: Lang
}

type PermissionState = 'default' | 'granted' | 'denied' | 'unsupported'

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = window.atob(base64)
  const arr = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i)
  return arr.buffer as ArrayBuffer
}

export function PushNotificationBell({ lang = 'en' }: Props) {
  const [permission, setPermission] = useState<PermissionState>('default')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPanel, setShowPanel] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<NotificationCategory[]>(['breaking', 'morocco'])
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    // Check browser support
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setSupported(true)
      setPermission(Notification.permission as PermissionState)

      // Check if already subscribed
      navigator.serviceWorker.ready.then(reg =>
        reg.pushManager.getSubscription().then(sub => {
          setSubscribed(!!sub)
        })
      )
    } else {
      setPermission('unsupported')
    }
  }, [])

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error)
    }
  }, [])

  const subscribe = async () => {
    if (!VAPID_PUBLIC_KEY) {
      alert('Push notifications require NEXT_PUBLIC_VAPID_PUBLIC_KEY in .env.local\nRun: npx web-push generate-vapid-keys')
      return
    }

    setLoading(true)
    try {
      const permission = await Notification.requestPermission()
      setPermission(permission as PermissionState)

      if (permission !== 'granted') {
        setLoading(false)
        return
      }

      const reg = await navigator.serviceWorker.ready
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          categories: selectedCategories,
          lang,
        }),
      })

      setSubscribed(true)
      setShowPanel(false)
    } catch (err) {
      console.error('[Push] Subscribe error:', err)
    } finally {
      setLoading(false)
    }
  }

  const unsubscribe = async () => {
    setLoading(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
        await sub.unsubscribe()
      }
      setSubscribed(false)
    } catch (err) {
      console.error('[Push] Unsubscribe error:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleCategory = (cat: NotificationCategory) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  if (!supported) return null

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell button */}
      <button
        onClick={() => subscribed ? unsubscribe() : setShowPanel(p => !p)}
        title={subscribed ? 'Unsubscribe from notifications' : 'Get notifications'}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: subscribed ? 'var(--green-bright)' : '#555',
          position: 'relative',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={subscribed ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          {subscribed && <circle cx="18" cy="6" r="4" fill="var(--live)" stroke="none" />}
        </svg>
        {!subscribed && permission === 'default' && (
          <span style={{
            position: 'absolute', top: 4, right: 4,
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--red)', border: '1px solid var(--hdr-bg)',
          }} />
        )}
      </button>

      {/* Subscription panel */}
      {showPanel && !subscribed && (
        <>
          <div
            onClick={() => setShowPanel(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 199 }}
          />
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)',
            right: 0, width: 300, zIndex: 200,
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)',
            overflow: 'hidden',
          }}>
            {/* Panel header */}
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--card-alt)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'var(--green-light)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>
                  Breaking News Alerts
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-faint)', letterSpacing: '0.05em' }}>
                  Choose what to follow
                </div>
              </div>
            </div>

            {/* Category checkboxes */}
            <div style={{ padding: '8px 0' }}>
              {NOTIFICATION_CATEGORIES.map(cat => {
                const isSelected = selectedCategories.includes(cat.key)
                const label = cat.label[lang] ?? cat.label.en
                return (
                  <button
                    key={cat.key}
                    onClick={() => toggleCategory(cat.key)}
                    style={{
                      width: '100%', padding: '10px 16px',
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: 'none', border: 'none', cursor: 'pointer',
                      textAlign: 'left', transition: 'background 0.1s',
                    }}
                  >
                    {/* Checkbox */}
                    <div style={{
                      width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                      border: `2px solid ${isSelected ? 'var(--green)' : 'var(--border-mid)'}`,
                      background: isSelected ? 'var(--green)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.1s',
                    }}>
                      {isSelected && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5">
                          <polyline points="2,6 5,9 10,3"/>
                        </svg>
                      )}
                    </div>
                    <span style={{ fontSize: 14 }}>{cat.icon}</span>
                    <span style={{
                      fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 600,
                      color: 'var(--text)', flex: 1,
                    }}>
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Permission denied warning */}
            {permission === 'denied' && (
              <div style={{ padding: '10px 16px', background: '#fff5f5', borderTop: '1px solid var(--border)' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--red)', lineHeight: 1.5 }}>
                  Notifications are blocked. Enable them in your browser settings.
                </p>
              </div>
            )}

            {/* Subscribe button */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
              <button
                onClick={subscribe}
                disabled={loading || selectedCategories.length === 0 || permission === 'denied'}
                style={{
                  width: '100%', padding: '10px',
                  fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  background: loading || selectedCategories.length === 0 ? 'var(--border)' : 'var(--green)',
                  color: loading || selectedCategories.length === 0 ? 'var(--text-faint)' : '#fff',
                  border: 'none', borderRadius: 'var(--radius)', cursor: loading ? 'wait' : 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                {loading ? 'Enabling…' : 'Enable Notifications'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
