import { pageMetadata } from '@/lib/seo/pageMetadata'
import TeamsPage from '@/components/pages/TeamsPage'
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('premier-league/teams', lang, '/premier-league/teams')
}
export const revalidate = 86400
export default async function PLTeamsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <TeamsPage title="Premier League" section="Premier League" sectionHref="/premier-league" category="premier-league" leagueKey="pl" lang={lang} />
}
