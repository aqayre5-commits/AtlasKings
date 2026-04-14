import { pageMetadata } from '@/lib/seo/pageMetadata'
import ScoresFixturesPage from '@/components/pages/ScoresFixturesPage'
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('premier-league/scores', lang, '/premier-league/scores')
}
export const revalidate = 60
export default async function PremierLeagueScoresPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <ScoresFixturesPage title="Premier League" section="Premier League" sectionHref="/premier-league" category="premier-league" leagueKey="pl" lang={lang} />
}
