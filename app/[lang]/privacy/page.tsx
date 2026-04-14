import { pageMetadata } from '@/lib/seo/pageMetadata'
import PrivacyClient from './PrivacyClient'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('privacy', lang, '/privacy')
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <PrivacyClient />
}
