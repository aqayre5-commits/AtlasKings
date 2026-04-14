import { cn, categoryLabel, categoryColor } from '@/lib/utils'

interface BadgeProps {
  category: string
  className?: string
}

export function CategoryBadge({ category, className }: BadgeProps) {
  const label = categoryLabel(category)
  const color = categoryColor(category)

  return (
    <span
      className={cn('inline-block font-head text-[9px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded-sm leading-relaxed', className)}
      style={{ color, background: `${color}18` }}
    >
      {label}
    </span>
  )
}

interface KickerProps {
  label: string
  className?: string
}

export function Kicker({ label, className }: KickerProps) {
  return (
    <span
      className={cn(
        'inline-block font-head text-[10px] font-extrabold tracking-[0.18em] uppercase',
        'text-[var(--red)] bg-white px-2 py-0.5 rounded-sm leading-relaxed',
        className
      )}
    >
      {label}
    </span>
  )
}
