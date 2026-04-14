import { pageMetadata } from '@/lib/seo/pageMetadata'
import TeamsPage from '@/components/pages/TeamsPage'
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('champions-league/teams', lang, '/champions-league/teams')
}
export const revalidate = 86400
export default async function UCLTeamsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <TeamsPage title="Champions League" section="Champions League" sectionHref="/champions-league" category="champions-league" leagueKey="ucl" lang={lang} />
}
