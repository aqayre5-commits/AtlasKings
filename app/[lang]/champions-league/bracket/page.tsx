import { pageMetadata } from '@/lib/seo/pageMetadata'
import { getKnockoutFixtures } from '@/lib/api-football/fixtures'
import { UclBracket } from '@/components/ucl/UclBracket'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('champions-league/bracket', lang, '/champions-league/bracket')
}

export const revalidate = 3600

export default async function UCLBracketPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const p = lang === 'en' ? '' : `/${lang}`

  const { rounds } = await getKnockoutFixtures('ucl').catch(() => ({ rounds: [] }))

  return (
    <main>
      <div className="page-wrap">
        <UclBracket rounds={rounds} langPrefix={p} />
      </div>
    </main>
  )
}
