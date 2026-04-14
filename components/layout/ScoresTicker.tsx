import { getTickerData } from '@/lib/ticker/getTickerData'
import { TickerBar } from './TickerBar'
import type { Lang } from '@/lib/i18n/config'

export const revalidate = 60

interface Props { lang?: Lang }

export async function ScoresTicker({ lang = 'en' }: Props) {
  const data = await getTickerData()
  if (data.state === 'empty' || data.matches.length === 0) return null
  return <TickerBar data={data} lang={lang} />
}
