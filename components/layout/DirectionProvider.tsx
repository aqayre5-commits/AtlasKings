'use client'

import { useEffect } from 'react'

interface Props {
  lang: string
  children: React.ReactNode
}

/**
 * Client component that sets document direction based on language.
 * Updates immediately on client-side navigation (no full page reload needed).
 */
export function DirectionProvider({ lang, children }: Props) {
  const isRTL = lang === 'ar'

  useEffect(() => {
    // Update the root <html> element direction on every language change
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    document.documentElement.style.direction = isRTL ? 'rtl' : 'ltr'

    // Cleanup: reset to LTR if component unmounts
    return () => {
      document.documentElement.dir = 'ltr'
      document.documentElement.style.direction = 'ltr'
    }
  }, [lang, isRTL])

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {children}
    </div>
  )
}
