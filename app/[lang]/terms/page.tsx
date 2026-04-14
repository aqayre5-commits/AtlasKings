import { pageMetadata } from '@/lib/seo/pageMetadata'
import TermsClient from './TermsClient'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('terms', lang, '/terms')
}

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <TermsClient />
}
