import { pageMetadata } from '@/lib/seo/pageMetadata'
import EditorialClient from './EditorialClient'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('editorial', lang, '/editorial')
}

export default async function EditorialPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <EditorialClient />
}
