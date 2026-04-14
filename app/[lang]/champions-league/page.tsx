import { pageMetadata } from '@/lib/seo/pageMetadata'
import { SectionPage } from '@/components/layout/SectionPage'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('champions-league', lang, '/champions-league')
}

export const revalidate = 3600

const subLinks = [{"label":"Home","href":"/champions-league"},{"label":"Scores & Fixtures","href":"/champions-league/scores"},{"label":"Groups","href":"/champions-league/groups"},{"label":"Teams","href":"/champions-league/teams"}]

export default async function ChampionsLeaguePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return (
    <SectionPage
      title="Champions League"
      category="champions-league"
      description="UEFA Champions League news, scores, fixtures and results."
      subLinks={subLinks}
      lang={lang}
    />
  )
}
