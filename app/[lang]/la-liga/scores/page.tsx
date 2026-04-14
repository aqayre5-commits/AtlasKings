import { pageMetadata } from '@/lib/seo/pageMetadata'
import ScoresFixturesPage from '@/components/pages/ScoresFixturesPage'
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('la-liga/scores', lang, '/la-liga/scores')
}
export const revalidate = 60
export default async function LaLigaScoresPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <ScoresFixturesPage title="La Liga" section="La Liga" sectionHref="/la-liga" category="la-liga" leagueKey="laliga" lang={lang} />
}
