import { pageMetadata } from '@/lib/seo/pageMetadata'
import AboutClient from './AboutClient'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('about', lang, '/about')
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <AboutClient />
}
