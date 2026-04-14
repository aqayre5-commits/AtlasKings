'use client'

import { cn } from '@/lib/utils'

type AdSize = 'banner' | 'sidebar-rectangle' | 'sidebar-tall' | 'in-article' | 'mobile-banner'

const AD_DIMENSIONS: Record<AdSize, { w: number; h: number; label: string }> = {
  'banner':             { w: 728, h: 90,  label: '728×90' },
  'sidebar-rectangle':  { w: 300, h: 250, label: '300×250' },
  'sidebar-tall':       { w: 300, h: 600, label: '300×600' },
  'in-article':         { w: 320, h: 100, label: '320×100' },
  'mobile-banner':      { w: 320, h: 50,  label: '320×50' },
}

interface AdSlotProps {
  size: AdSize
  id: string
  className?: string
}

export function AdSlot({ size, id, className }: AdSlotProps) {
  const dim = AD_DIMENSIONS[size]
  const isProd = process.env.NODE_ENV === 'production'

  if (isProd) {
    // Production: render actual ad script
    // Replace with your AdSense publisher ID
    return (
      <div id={id} className={cn('overflow-hidden', className)}>
        {/* AdSense / Ezoic script goes here */}
      </div>
    )
  }

  // Development: show clearly labelled placeholder
  return (
    <div
      className={cn(
        'flex items-center justify-center border border-dashed border-[var(--border-mid)]',
        'bg-[var(--card-alt)] rounded',
        className
      )}
      style={{ minHeight: dim.h, maxWidth: dim.w }}
    >
      <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-[#ccc]">
        Ad · {dim.label}
      </span>
    </div>
  )
}
