'use client'

import { useEffect } from 'react'

interface Props {
  lang: string
  children: React.ReactNode
}

/**
 * Client component that sets document direction based on language.
 * Sets dir/lang on the root <html> element via useEffect.
 * Returns children directly — no wrapper div needed.
 */
export function DirectionProvider({ lang, children }: Props) {
  const isRTL = lang === 'ar'

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang, isRTL])

  return <>{children}</>
}
