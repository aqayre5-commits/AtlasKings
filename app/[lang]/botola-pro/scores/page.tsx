import { pageMetadata } from '@/lib/seo/pageMetadata'
import ScoresFixturesPage from '@/components/pages/ScoresFixturesPage'
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('botola-pro/scores', lang, '/botola-pro/scores')
}
export const revalidate = 60
export default async function BotolaScoresPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <ScoresFixturesPage title="Botola Pro" section="Botola Pro" sectionHref="/botola-pro" category="botola-pro" leagueKey="botola" lang={lang} />
}
