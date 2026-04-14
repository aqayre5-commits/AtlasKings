'use client'

/**
 * WhatsApp share button — 3 variants for different contexts.
 *
 * Uses wa.me deep link which works on both mobile (opens WhatsApp)
 * and desktop (opens WhatsApp Web). No API key needed.
 *
 * Variants:
 *   icon    — small green circle, icon only (cards, inline)
 *   button  — full "Share on WhatsApp" button (articles, hero)
 *   float   — fixed bottom-right on mobile (article pages)
 */

interface Props {
  /** The text to share (title, score, etc.) */
  text: string
  /** The URL to include in the share. Defaults to current page. */
  url?: string
  /** Visual variant */
  variant?: 'icon' | 'button' | 'float'
  /** Language for button label */
  lang?: 'en' | 'ar' | 'fr'
}

const LABELS = {
  en: 'Share on WhatsApp',
  ar: 'شارك على واتساب',
  fr: 'Partager sur WhatsApp',
}

function buildWhatsAppUrl(text: string, url?: string): string {
  const fullText = url ? `${text}\n${url}` : text
  return `https://wa.me/?text=${encodeURIComponent(fullText)}`
}

export function WhatsAppShare({ text, url, variant = 'button', lang = 'en' }: Props) {
  const handleClick = () => {
    const shareUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '')
    window.open(buildWhatsAppUrl(text, shareUrl), '_blank', 'noopener,noreferrer')
  }

  const label = LABELS[lang] ?? LABELS.en

  // ── Icon variant: small green circle ──
  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        title={label}
        aria-label={label}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: '#25D366',
          border: 'none',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(37,211,102,0.4)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
      >
        <WhatsAppIcon size={18} />
      </button>
    )
  }

  // ── Float variant: fixed bottom-right on mobile ──
  if (variant === 'float') {
    return (
      <button
        onClick={handleClick}
        aria-label={label}
        className="whatsapp-float"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#25D366',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(37,211,102,0.4)',
          transition: 'transform 0.15s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        <WhatsAppIcon size={28} />
      </button>
    )
  }

  // ── Button variant: full labeled button ──
  return (
    <button
      onClick={handleClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 20px',
        background: '#25D366',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius, 8px)',
        fontFamily: 'var(--font-head)',
        fontSize: 13,
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'background 0.15s ease, transform 0.15s ease',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#1EBE5A'; e.currentTarget.style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { e.currentTarget.style.background = '#25D366'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <WhatsAppIcon size={18} />
      {label}
    </button>
  )
}

/** WhatsApp SVG icon — white on transparent. */
function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
        fill="white"
      />
      <path
        d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.11-1.14l-.29-.174-3.01.79.81-2.95-.19-.3A7.963 7.963 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"
        fill="white"
      />
    </svg>
  )
}
