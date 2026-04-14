const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://atlaskings.com'

interface BreadcrumbItem {
  name: string
  href: string
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[]
  lang?: string
}

/**
 * Server component — renders BreadcrumbList JSON-LD schema.
 * Usage:
 *   <BreadcrumbJsonLd items={[
 *     { name: 'Home', href: '/' },
 *     { name: 'Premier League', href: '/premier-league' },
 *     { name: 'Table', href: '/premier-league/table' },
 *   ]} lang="en" />
 */
export function BreadcrumbJsonLd({ items, lang = 'en' }: BreadcrumbJsonLdProps) {
  const prefix = lang === 'en' ? '' : `/${lang}`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${prefix}${item.href}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
