import { SectionBar, type SectionBarTab } from '@/components/layout/SectionBar'

const TABS: SectionBarTab[] = [
  { label: { en: 'Overview', ar: '\u0646\u0638\u0631\u0629 \u0639\u0627\u0645\u0629', fr: 'Aper\u00E7u' }, href: '/botola-pro' },
  { label: { en: 'Scores', ar: '\u0627\u0644\u0646\u062A\u0627\u0626\u062C', fr: 'Scores' }, href: '/botola-pro/scores' },
  { label: { en: 'Table', ar: '\u0627\u0644\u062A\u0631\u062A\u064A\u0628', fr: 'Classement' }, href: '/botola-pro/table' },
  { label: { en: 'Stats', ar: '\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A', fr: 'Statistiques' }, href: '/botola-pro/stats' },
]

export default async function BotolaLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  return (
    <div className="has-section-subnav">
      <SectionBar flag={'\uD83C\uDDF2\uD83C\uDDE6'} name={{ en: 'BOTOLA PRO', ar: '\u0627\u0644\u0628\u0637\u0648\u0644\u0629', fr: 'BOTOLA PRO' }} tabs={TABS} lang={lang} accentColor="#006233" />
      {children}
    </div>
  )
}
