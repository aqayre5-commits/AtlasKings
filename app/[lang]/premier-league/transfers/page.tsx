import { pageMetadata } from '@/lib/seo/pageMetadata'
import { SubPage } from '@/components/layout/SubPage'
import { ComingSoon } from '@/components/ui/ComingSoon'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('premier-league/transfers', lang, '/premier-league/transfers')
}

export const revalidate = 3600

const subLinks = [{"label":"Home","href":"/premier-league"},{"label":"Scores & Fixtures","href":"/premier-league/scores"},{"label":"Table","href":"/premier-league/table"},{"label":"Top Scorers","href":"/premier-league/top-scorers"},{"label":"Teams","href":"/premier-league/teams"},{"label":"Transfers","href":"/premier-league/transfers"}]

export default function PremierLeagueTransfersPage() {
  return (
    <SubPage
      section="Premier League"
      sectionHref="/premier-league"
      title="Transfers"
      category="premier-league"
      subLinks={subLinks}
      activeHref="/premier-league/transfers"
    >
      <ComingSoon
        title="Premier League Transfers"
        description="Transfers data for Premier League will be powered by API-Football. Coming soon."
        backHref="/premier-league"
        backLabel="← Back to Premier League"
      />
    </SubPage>
  )
}
