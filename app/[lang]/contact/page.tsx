import { pageMetadata } from '@/lib/seo/pageMetadata'
import ContactClient from './ContactClient'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('contact', lang, '/contact')
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <ContactClient />
}
