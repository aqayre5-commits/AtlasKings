import { pageMetadata } from '@/lib/seo/pageMetadata'
import CookiesClient from './CookiesClient'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('cookies', lang, '/cookies')
}

export default async function CookiesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <CookiesClient />
}
