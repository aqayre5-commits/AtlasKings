import { pageMetadata } from '@/lib/seo/pageMetadata'
import StandingsWidgetPage from '@/components/pages/StandingsWidgetPage'
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('botola-pro/table', lang, '/botola-pro/table')
}
export default async function BotolaTablePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <StandingsWidgetPage title="Botola Pro" section="Botola Pro" sectionHref="/botola-pro" category="botola-pro" leagueId={200} lang={lang} />
}
