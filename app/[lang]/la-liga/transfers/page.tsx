import { pageMetadata } from '@/lib/seo/pageMetadata'
import { SubPage } from '@/components/layout/SubPage'
import { ComingSoon } from '@/components/ui/ComingSoon'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('la-liga/transfers', lang, '/la-liga/transfers')
}

export const revalidate = 3600

const subLinks = [{"label":"Home","href":"/la-liga"},{"label":"Scores & Fixtures","href":"/la-liga/scores"},{"label":"Table","href":"/la-liga/table"},{"label":"Top Scorers","href":"/la-liga/top-scorers"},{"label":"Teams","href":"/la-liga/teams"},{"label":"Transfers","href":"/la-liga/transfers"}]

export default function LaLigaTransfersPage() {
  return (
    <SubPage
      section="La Liga"
      sectionHref="/la-liga"
      title="Transfers"
      category="la-liga"
      subLinks={subLinks}
      activeHref="/la-liga/transfers"
    >
      <ComingSoon
        title="La Liga Transfers"
        description="Transfers data for La Liga will be powered by API-Football. Coming soon."
        backHref="/la-liga"
        backLabel="← Back to La Liga"
      />
    </SubPage>
  )
}
