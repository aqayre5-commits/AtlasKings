import type { Metadata } from 'next'
import { SearchClient } from './SearchClient'

interface Props {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  const q = params.q
  return {
    title: q ? 'Search: ' + q + ' — Atlas Kings' : 'Search — Atlas Kings',
    description: 'Search Atlas Kings for football news, scores and fixtures.',
    robots: { index: false, follow: false },
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams
  return <SearchClient initialQuery={params.q ?? ''} />
}
