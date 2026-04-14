import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  noPadding?: boolean
}

export function Card({ children, className, noPadding = true }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--card)] border border-[var(--border)] rounded shadow-[var(--shadow-sm)] overflow-hidden',
        className
      )}
    >
      {children}
    </div>
  )
}
