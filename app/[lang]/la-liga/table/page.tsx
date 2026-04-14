import { pageMetadata } from '@/lib/seo/pageMetadata'
import StandingsWidgetPage from '@/components/pages/StandingsWidgetPage'
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('la-liga/table', lang, '/la-liga/table')
}
export default async function LaLigaTablePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <StandingsWidgetPage title="La Liga" section="La Liga" sectionHref="/la-liga" category="la-liga" leagueId={140} lang={lang} />
}
