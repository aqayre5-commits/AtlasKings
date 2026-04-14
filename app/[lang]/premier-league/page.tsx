import { pageMetadata } from '@/lib/seo/pageMetadata'
import { SectionPage } from '@/components/layout/SectionPage'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('premier-league', lang, '/premier-league')
}

export const revalidate = 3600

const subLinks = [{"label":"Home","href":"/premier-league"},{"label":"Scores & Fixtures","href":"/premier-league/scores"},{"label":"Table","href":"/premier-league/table"},{"label":"Top Scorers","href":"/premier-league/top-scorers"},{"label":"Teams","href":"/premier-league/teams"},{"label":"Transfers","href":"/premier-league/transfers"}]

export default async function PremierLeaguePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return (
    <SectionPage
      title="Premier League"
      category="premier-league"
      description="English Premier League news, scores, fixtures and standings."
      subLinks={subLinks}
      lang={lang}
    />
  )
}
