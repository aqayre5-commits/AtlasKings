import { pageMetadata } from '@/lib/seo/pageMetadata'
import ScoresFixturesPage from '@/components/pages/ScoresFixturesPage'
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('champions-league/scores', lang, '/champions-league/scores')
}
export const revalidate = 60
export default async function UCLScoresPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <ScoresFixturesPage title="Champions League" section="Champions League" sectionHref="/champions-league" category="champions-league" leagueKey="ucl" lang={lang} />
}
