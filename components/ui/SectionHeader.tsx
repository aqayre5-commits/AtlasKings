import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  color: string        // CSS color value for the accent bar
  ctaLabel?: string
  ctaHref?: string
  className?: string
}

export function SectionHeader({ title, color, ctaLabel, ctaHref, className }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 px-3.5 h-[42px] border-b border-[var(--border)] bg-[var(--card-alt)]',
        className
      )}
    >
      {/* Accent bar */}
      <div
        className="w-1 h-[18px] rounded-sm flex-shrink-0"
        style={{ background: color }}
      />

      {/* Title */}
      <h2
        className="font-head text-[13px] font-extrabold tracking-[0.1em] uppercase leading-none"
        style={{ color }}
      >
        {title}
      </h2>

      {/* CTA link */}
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="ml-auto font-head text-[11px] font-bold tracking-[0.08em] uppercase text-[var(--red)] hover:text-[var(--red-dark)] transition-colors flex-shrink-0"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  )
}
