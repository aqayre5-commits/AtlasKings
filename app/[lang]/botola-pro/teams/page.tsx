import { pageMetadata } from '@/lib/seo/pageMetadata'
import TeamsPage from '@/components/pages/TeamsPage'
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('botola-pro/teams', lang, '/botola-pro/teams')
}
export const revalidate = 86400
export default async function BotolaTeamsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <TeamsPage title="Botola Pro" section="Botola Pro" sectionHref="/botola-pro" category="botola-pro" leagueKey="botola" lang={lang} />
}
