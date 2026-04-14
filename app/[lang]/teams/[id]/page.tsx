import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { EmptyState } from '@/components/ui/EmptyState'
import ApiSportsWidget from '@/components/ui/ApiSportsWidget'
import { TEAM_SLUG_TO_ID } from '@/lib/api-football/id-maps'
import { getTeamById } from '@/lib/api-football/teams'

export const revalidate = 3600

export default async function TeamPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params
  const numericId = TEAM_SLUG_TO_ID[id] ?? (isNaN(Number(id)) ? undefined : Number(id))

  if (!numericId) {
    return (
      <main>
        <div className="page-wrap">
          <div className="card"><EmptyState icon="🔍" title="Team not found" actionLabel="Back to home" actionHref={`${lang === 'en' ? '' : `/${lang}`}/`} /></div>
        </div>
      </main>
    )
  }

  const p = lang === 'en' ? '' : `/${lang}`
  const teamInfo = await getTeamById(numericId).catch(() => null)
  const teamName = teamInfo?.team?.name ?? `Team #${numericId}`

  return (
    <main>
      <div className="page-wrap">
        <Breadcrumb items={[{ label: teamName }]} langPrefix={p} />

        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--gap)' }}>
          <h2 className="section-heading">{teamName}</h2>
          <ApiSportsWidget type="team" teamId={numericId} lang={lang} minHeight={600} />
        </div>
      </div>
    </main>
  )
}
