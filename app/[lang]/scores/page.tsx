import { pageMetadata } from '@/lib/seo/pageMetadata'
import ScoresFixturesPage from '@/components/pages/ScoresFixturesPage'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('scores', lang, '/scores')
}
export const revalidate = 60

export default async function GlobalScoresPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <ScoresFixturesPage title="All Scores & Fixtures" section="Scores & Fixtures" sectionHref="/scores" category="morocco" lang={lang} />
}
