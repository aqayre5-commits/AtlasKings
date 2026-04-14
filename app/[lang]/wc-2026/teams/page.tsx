import { pageMetadata } from '@/lib/seo/pageMetadata'
import { WorldCupPageShell } from '@/components/world-cup/WorldCupPageShell'
import { TeamGrid } from '@/components/world-cup/TeamGrid'
import { getWorldCupTeams } from '@/lib/api-football/worldcup'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('world-cup-2026/teams', lang, '/wc-2026/teams')
}

export const revalidate = 1800

export default async function WorldCupTeamsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = getTranslations((lang as Lang) || 'en')
  const p = lang === 'en' ? '' : `/${lang}`

  const teams = await getWorldCupTeams().catch(() => [])

  return (
    <WorldCupPageShell
      title={t.subnav.teams}
      description=""
      lang={lang}
    >
      <TeamGrid teams={teams} langPrefix={p} />
    </WorldCupPageShell>
  )
}
