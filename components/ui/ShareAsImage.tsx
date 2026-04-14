'use client'

/**
 * Share as image — captures a DOM element as a PNG using html2canvas
 * and shares it via WhatsApp (mobile) or downloads it (desktop).
 *
 * html2canvas handles cross-origin images (flags) via useCORS/allowTaint
 * which html-to-image cannot do.
 */

import { useCallback, useState } from 'react'

interface Props {
  /** CSS selector of the element to capture */
  targetSelector: string
  /** Text caption sent alongside the image */
  caption: string
  /** URL to include in the share */
  url?: string
  /** Language for button label */
  lang?: 'en' | 'ar' | 'fr'
  /** Visual variant */
  variant?: 'icon' | 'button'
}

const LABELS = {
  en: 'Share as image',
  ar: '\u0634\u0627\u0631\u0643 \u0643\u0635\u0648\u0631\u0629',
  fr: 'Partager en image',
}

export function ShareAsImage({ targetSelector, caption, url, lang = 'en', variant = 'icon' }: Props) {
  const [capturing, setCapturing] = useState(false)
  const label = LABELS[lang] ?? LABELS.en

  const handleShare = useCallback(async () => {
    const target = document.querySelector(targetSelector) as HTMLElement
    if (!target) {
      // Element not found — fall back to text share
      const shareUrl = url ?? window.location.href
      window.open(`https://wa.me/?text=${encodeURIComponent(`${caption}\n${shareUrl}`)}`, '_blank')
      return
    }

    setCapturing(true)
    try {
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default

      // Pre-set crossorigin on all images so html2canvas can read them
      // without tainting the canvas. flagcdn.com supports CORS.
      const images = target.querySelectorAll('img')
      const origCrossOrigins: Map<HTMLImageElement, string | null> = new Map()
      images.forEach(img => {
        origCrossOrigins.set(img, img.getAttribute('crossorigin'))
        img.setAttribute('crossorigin', 'anonymous')
        // Force reload with CORS by appending cache buster
        if (img.src.startsWith('http')) {
          const sep = img.src.includes('?') ? '&' : '?'
          img.src = `${img.src}${sep}_cors=1`
        }
      })

      // Wait for images to reload with CORS
      await Promise.all(
        Array.from(images).map(
          img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r })
        ),
      )

      const canvas = await html2canvas(target, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        imageTimeout: 8000,
      })

      // Restore original image attributes
      origCrossOrigins.forEach((orig, img) => {
        if (orig === null) img.removeAttribute('crossorigin')
        else img.setAttribute('crossorigin', orig)
        // Remove cache buster from src
        img.src = img.src.replace(/[?&]_cors=1$/, '')
      })

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('Canvas toBlob failed'))),
          'image/png',
          0.95,
        )
      })

      const file = new File([blob], 'atlas-kings-group.png', { type: 'image/png' })
      const shareText = url ? `${caption}\n${url}` : `${caption}\n${window.location.href}`

      // Mobile: Web Share API with file
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          text: shareText,
          files: [file],
        })
        return
      }

      // Desktop: download the image + open WhatsApp Web with caption
      const dataUrl = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'atlas-kings-group.png'
      a.click()

      // Open WhatsApp Web with the caption text after a short delay
      // so user can attach the downloaded image
      const shareUrl = url ?? window.location.href
      setTimeout(() => {
        window.open(
          `https://web.whatsapp.com/send?text=${encodeURIComponent(`${caption}\n${shareUrl}\n\n📎 Attach the downloaded image above`)}`,
          '_blank',
        )
      }, 500)
    } catch (err) {
      console.warn('[ShareAsImage] capture failed:', err)
      // Fallback: text-only WhatsApp share
      const shareUrl = url ?? window.location.href
      window.open(`https://wa.me/?text=${encodeURIComponent(`${caption}\n${shareUrl}`)}`, '_blank')
    } finally {
      setCapturing(false)
    }
  }, [targetSelector, caption, url])

  // ── WhatsApp icon SVG ──
  const WaIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="white"/>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.11-1.14l-.29-.174-3.01.79.81-2.95-.19-.3A7.963 7.963 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" fill="white"/>
    </svg>
  )

  if (variant === 'icon') {
    return (
      <button
        onClick={handleShare}
        disabled={capturing}
        title={label}
        aria-label={label}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: '#25D366',
          border: 'none',
          cursor: capturing ? 'wait' : 'pointer',
          opacity: capturing ? 0.6 : 1,
          flexShrink: 0,
          transition: 'transform 0.15s ease',
        }}
      >
        <WaIcon size={20} />
      </button>
    )
  }

  return (
    <button
      onClick={handleShare}
      disabled={capturing}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        background: '#25D366',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius, 8px)',
        fontFamily: 'var(--font-head)',
        fontSize: 12,
        fontWeight: 700,
        cursor: capturing ? 'wait' : 'pointer',
        opacity: capturing ? 0.6 : 1,
      }}
    >
      <WaIcon size={16} />
      {capturing ? '...' : label}
    </button>
  )
}
