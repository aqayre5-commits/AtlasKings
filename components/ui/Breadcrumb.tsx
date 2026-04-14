import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  langPrefix?: string
}

export function Breadcrumb({ items, langPrefix = '' }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb">
      <Link href={`${langPrefix}/`}>Home</Link>
      {items.map((item, i) => (
        <span key={i} style={{ display: 'contents' }}>
          <span className="sep">›</span>
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span className="current">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
