import { pageMetadata } from '@/lib/seo/pageMetadata'
import { SubPage } from '@/components/layout/SubPage'
import ApiSportsWidget from '@/components/ui/ApiSportsWidget'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('champions-league/groups', lang, '/champions-league/groups')
}

export const revalidate = 3600

const subLinks = [{"label":"Home","href":"/champions-league"},{"label":"Scores & Fixtures","href":"/champions-league/scores"},{"label":"Groups","href":"/champions-league/groups"},{"label":"Teams","href":"/champions-league/teams"}]

export default async function ChampionsLeagueGroupsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return (
    <SubPage
      section="Champions League"
      sectionHref="/champions-league"
      title="Groups"
      category="champions-league"
      subLinks={subLinks}
      activeHref="/champions-league/groups"
    >
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <ApiSportsWidget type="standings" leagueId={2} lang={lang} minHeight={500} />
      </div>
    </SubPage>
  )
}
