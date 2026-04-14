import Link from 'next/link'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({ icon = '📋', title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon" role="img">{icon}</span>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="empty-state-action">{actionLabel}</Link>
      )}
    </div>
  )
}
