import { pageMetadata } from '@/lib/seo/pageMetadata'
import StandingsWidgetPage from '@/components/pages/StandingsWidgetPage'
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('premier-league/table', lang, '/premier-league/table')
}
export default async function PremierLeagueTablePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <StandingsWidgetPage title="Premier League" section="Premier League" sectionHref="/premier-league" category="premier-league" leagueId={39} lang={lang} />
}
