import { pageMetadata } from '@/lib/seo/pageMetadata'
import TeamsPage from '@/components/pages/TeamsPage'
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('la-liga/teams', lang, '/la-liga/teams')
}
export const revalidate = 86400
export default async function LaLigaTeamsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <TeamsPage title="La Liga" section="La Liga" sectionHref="/la-liga" category="la-liga" leagueKey="laliga" lang={lang} />
}
