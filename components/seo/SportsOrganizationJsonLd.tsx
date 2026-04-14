const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://atlaskings.com'

interface SportsOrganizationJsonLdProps {
  name: string
  sport?: string
  url?: string
  logo?: string
  description?: string
}

/**
 * Server component — renders SportsOrganization JSON-LD schema for league/competition pages.
 */
export function SportsOrganizationJsonLd({
  name,
  sport = 'Football',
  url,
  logo,
  description,
}: SportsOrganizationJsonLdProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    name,
    sport,
    ...(url && { url }),
    ...(logo && { logo }),
    ...(description && { description }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
