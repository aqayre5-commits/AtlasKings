import { pageMetadata } from '@/lib/seo/pageMetadata'
import { SectionPage } from '@/components/layout/SectionPage'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('botola-pro', lang, '/botola-pro')
}

export const revalidate = 3600

const subLinks = [{"label":"Home","href":"/botola-pro"},{"label":"Scores & Fixtures","href":"/botola-pro/scores"},{"label":"Table","href":"/botola-pro/table"},{"label":"Top Scorers","href":"/botola-pro/top-scorers"},{"label":"Teams","href":"/botola-pro/teams"}]

// Launch Session 3.1: visible localised dek on the Botola Pro hub.
// The AR variant carries a single natural mention of the colloquial
// "كورة" alongside the formal framing — captures diaspora search
// behaviour without keyword stuffing. EN + FR are standard.
const HUB_DEK: Record<'en' | 'ar' | 'fr', string> = {
  en: 'Moroccan top-flight football — Raja, Wydad, FAR, Berkane and every Botola Pro club. Live scores, table, fixtures and Moroccan football news.',
  ar: 'كورة المغرب على أرضها: الدوري المحترف المغربي — الرجاء والوداد والجيش ونهضة بركان وكل أندية البطولة الاحترافية. نتائج مباشرة وترتيب ومباريات وأخبار كرة القدم المغربية.',
  fr: "Le championnat marocain de première division — Raja, Wydad, FAR, Berkane et tous les clubs de Botola Pro. Scores en direct, classement, calendrier et actualité du football marocain.",
}

export default async function BotolaProPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return (
    <SectionPage
      title="Botola Pro"
      category="botola-pro"
      description="Moroccan top flight football — scores, standings and news."
      descriptionByLang={HUB_DEK}
      subLinks={subLinks}
      lang={lang}
      hideBreadcrumb
    />
  )
}
