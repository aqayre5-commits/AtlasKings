import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LANGS, LANG_META, type Lang } from '@/lib/i18n/config'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DirectionProvider } from '@/components/layout/DirectionProvider'
import { SkipToContent } from '@/components/layout/SkipToContent'
import { getTickerData } from '@/lib/ticker/getTickerData'
import { InstallPrompt } from '@/components/ui/InstallPrompt'

export const revalidate = 60

interface Props {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export async function generateStaticParams() {
  return SUPPORTED_LANGS.map(lang => ({ lang }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const validLang = SUPPORTED_LANGS.includes(lang as Lang) ? lang as Lang : 'en'
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://atlaskings.com'
  return {
    alternates: {
      canonical: validLang === 'en' ? SITE_URL : `${SITE_URL}/${validLang}`,
      languages: {
        'en': SITE_URL,
        'ar': `${SITE_URL}/ar`,
        'fr': `${SITE_URL}/fr`,
        'x-default': SITE_URL,
      },
    },
  }
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params

  if (!SUPPORTED_LANGS.includes(lang as Lang)) {
    notFound()
  }

  const validLang = lang as Lang
  const meta = LANG_META[validLang]
  const tickerData = await getTickerData()

  const skipText = validLang === 'ar' ? 'تخطي إلى المحتوى' : validLang === 'fr' ? 'Aller au contenu' : 'Skip to main content'

  return (
    <DirectionProvider lang={validLang}>
      <SkipToContent label={skipText} />
      <Header lang={validLang} tickerData={tickerData} />
      <div id="main-content">
        {children}
      </div>
      <Footer lang={validLang} />
      <InstallPrompt lang={validLang} />
    </DirectionProvider>
  )
}
