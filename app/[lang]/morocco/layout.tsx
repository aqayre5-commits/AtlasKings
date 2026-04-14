import { SectionBar, type SectionBarTab } from '@/components/layout/SectionBar'

const TABS: SectionBarTab[] = [
  { label: { en: 'Overview', ar: '\u0646\u0638\u0631\u0629 \u0639\u0627\u0645\u0629', fr: 'Aper\u00E7u' }, href: '/morocco' },
  { label: { en: 'Fixtures & Results', ar: '\u0627\u0644\u0645\u0628\u0627\u0631\u064A\u0627\u062A', fr: 'Matchs' }, href: '/morocco/fixtures' },
  { label: { en: 'WC 2026 Squad', ar: '\u062A\u0634\u0643\u064A\u0644\u0629 2026', fr: 'Effectif CM' }, href: '/morocco/key-players' },
  { label: { en: 'News', ar: '\u0627\u0644\u0623\u062E\u0628\u0627\u0631', fr: 'Actualit\u00E9s' }, href: '/morocco/news' },
  { label: { en: 'Qualification', ar: '\u0627\u0644\u062A\u0623\u0647\u0644', fr: 'Qualification' }, href: '/morocco/qualification' },
]

export default async function MoroccoLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  return (
    <div className="has-section-subnav">
      <SectionBar flag={'\uD83C\uDDF2\uD83C\uDDE6'} name={{ en: 'MOROCCO', ar: '\u0627\u0644\u0645\u063A\u0631\u0628', fr: 'MAROC' }} tabs={TABS} lang={lang} accentColor="#C1121F" />
      {children}
    </div>
  )
}
