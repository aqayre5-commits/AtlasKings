'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { SimulatorState } from '@/lib/simulator/state'
import { encodeState } from '@/lib/simulator/state'

interface Props {
  state: SimulatorState
  onClose: () => void
}

export function ShareModal({ state, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  const champion = state.champion

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?p=${encodeState(state)}`
      : ''

  const shareText = champion
    ? `I predicted ${champion.name} to win World Cup 2026! Make your prediction:`
    : 'Check out my World Cup 2026 prediction!'

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const input = document.createElement('input')
      input.value = shareUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [shareUrl])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`

  const socialButtons: {
    label: string
    bg: string
    color: string
    url: string
  }[] = [
    { label: 'WhatsApp', bg: '#25D366', color: '#fff', url: whatsappUrl },
    { label: 'Twitter / X', bg: '#1a1a1a', color: '#fff', url: twitterUrl },
    { label: 'Facebook', bg: '#1877F2', color: '#fff', url: facebookUrl },
  ]

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: 420,
          width: '100%',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 16,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--text)',
              margin: 0,
            }}
          >
            Share Prediction
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 32,
              height: 32,
              minHeight: 'var(--tap-min)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-sec)',
              fontSize: 18,
              fontWeight: 700,
              transition: 'all 0.2s ease',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            X
          </button>
        </div>

        {/* Preview card */}
        {champion && (
          <div
            style={{
              margin: '16px',
              padding: 20,
              background: 'var(--card-alt)',
              border: '2px solid var(--gold)',
              borderRadius: 'var(--radius)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                fontWeight: 700,
                color: 'var(--gold)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 8,
              }}
            >
              My Prediction
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              <Image
                src={champion.flagUrl}
                alt={champion.name}
                width={40}
                height={30}
                style={{
                  objectFit: 'contain',
                  borderRadius: 3,
                  border: '2px solid var(--gold)',
                }}
                unoptimized
              />
              <span
                style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: 22,
                  fontWeight: 800,
                  color: 'var(--text)',
                  textTransform: 'uppercase',
                }}
              >
                {champion.name}
              </span>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: 11,
                color: 'var(--text-sec)',
                marginTop: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              World Cup 2026 Champion
            </div>
          </div>
        )}

        {/* Social share buttons */}
        <div
          style={{
            padding: '0 16px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {socialButtons.map((btn) => (
            <a
              key={btn.label}
              href={btn.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'var(--tap-min)',
                padding: '0 16px',
                background: btn.bg,
                color: btn.color,
                border: 'none',
                borderRadius: 'var(--radius)',
                fontFamily: 'var(--font-head)',
                fontSize: 13,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {btn.label}
            </a>
          ))}

          {/* Copy link */}
          <button
            onClick={handleCopy}
            style={{
              minHeight: 'var(--tap-min)',
              padding: '0 16px',
              background: 'transparent',
              color: copied ? 'var(--green)' : 'var(--text)',
              border: `1px solid ${copied ? 'var(--green)' : 'var(--border)'}`,
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-head)',
              fontSize: 13,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  )
}
