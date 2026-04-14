import { pageMetadata } from '@/lib/seo/pageMetadata'
import { SectionPage } from '@/components/layout/SectionPage'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('la-liga', lang, '/la-liga')
}

export const revalidate = 3600

const subLinks = [{"label":"Home","href":"/la-liga"},{"label":"Scores & Fixtures","href":"/la-liga/scores"},{"label":"Table","href":"/la-liga/table"},{"label":"Top Scorers","href":"/la-liga/top-scorers"},{"label":"Teams","href":"/la-liga/teams"},{"label":"Transfers","href":"/la-liga/transfers"}]

export default async function LaLigaPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return (
    <SectionPage
      title="La Liga"
      category="la-liga"
      description="Spanish La Liga news, scores, fixtures and standings."
      subLinks={subLinks}
      lang={lang}
    />
  )
}
