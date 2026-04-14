import { pageMetadata } from '@/lib/seo/pageMetadata'
import { WorldCupPageShell } from '@/components/world-cup/WorldCupPageShell'
import { BracketTree } from '@/components/world-cup/BracketTree'
import { getWorldCupBracket } from '@/lib/api-football/worldcup'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('world-cup-2026/bracket', lang, '/wc-2026/bracket')
}

export const revalidate = 1800

export default async function WorldCupBracketPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = getTranslations((lang as Lang) || 'en')
  const p = lang === 'en' ? '' : `/${lang}`

  const bracket = await getWorldCupBracket().catch(() => [])

  return (
    <WorldCupPageShell
      title={t.subnav.bracket}
      description=""
      lang={lang}
    >
      <BracketTree matches={bracket} langPrefix={p} lang={(lang as Lang) || 'en'} />
    </WorldCupPageShell>
  )
}
