import { getPlayerById } from '@/lib/api-football/players'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { EmptyState } from '@/components/ui/EmptyState'
import ApiSportsWidget from '@/components/ui/ApiSportsWidget'
import { PLAYER_SLUG_TO_ID } from '@/lib/api-football/id-maps'

export const revalidate = 3600

export default async function PlayerPage({ params }: { params: Promise<{ id: string; lang: string }> }) {
  const { id, lang } = await params
  const numericId = PLAYER_SLUG_TO_ID[id] ?? (isNaN(Number(id)) ? undefined : Number(id))

  if (!numericId) {
    return (
      <main>
        <div className="page-wrap">
          <div className="card"><EmptyState icon="🔍" title="Player not found" actionLabel="Back to home" actionHref={`${lang === 'en' ? '' : `/${lang}`}/`} /></div>
        </div>
      </main>
    )
  }

  const data = await getPlayerById(numericId).catch(() => null)

  if (!data || !data.player) {
    return (
      <main>
        <div className="page-wrap">
          <div className="card"><EmptyState icon="🔍" title="Player not found" actionLabel="Back to home" actionHref={`${lang === 'en' ? '' : `/${lang}`}/`} /></div>
        </div>
      </main>
    )
  }

  const p = lang === 'en' ? '' : `/${lang}`
  const playerName = data.player?.name ?? `Player #${numericId}`

  return (
    <main>
      <div className="page-wrap">
        <Breadcrumb items={[{ label: playerName }]} langPrefix={p} />

        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--gap)' }}>
          <h2 className="section-heading">{playerName}</h2>
          <ApiSportsWidget type="player" playerId={numericId} lang={lang} minHeight={600} />
        </div>
      </div>
    </main>
  )
}
