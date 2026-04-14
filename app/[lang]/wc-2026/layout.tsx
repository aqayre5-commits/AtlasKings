import { SectionBar, type SectionBarTab } from '@/components/layout/SectionBar'

const TABS: SectionBarTab[] = [
  { label: { en: 'Overview', ar: '\u0646\u0638\u0631\u0629 \u0639\u0627\u0645\u0629', fr: 'Aper\u00E7u' }, href: '/wc-2026' },
  { label: { en: 'Fixtures', ar: '\u0627\u0644\u0645\u0628\u0627\u0631\u064A\u0627\u062A', fr: 'Matchs' }, href: '/wc-2026/fixtures' },
  { label: { en: 'Standings', ar: '\u0627\u0644\u062A\u0631\u062A\u064A\u0628', fr: 'Classement' }, href: '/wc-2026/standings' },
  { label: { en: 'Simulation', ar: '\u0627\u0644\u0645\u062D\u0627\u0643\u0627\u0629', fr: 'Simulation' }, href: '/wc-2026/predictor' },
]

export default async function WorldCup2026Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  return (
    <div className="has-section-subnav">
      <SectionBar flag={'\uD83C\uDFC6'} name={{ en: 'WC 2026', ar: '\u0645\u0648\u0646\u062F\u064A\u0627\u0644 2026', fr: 'CM 2026' }} tabs={TABS} lang={lang} accentColor="#B8820A" />
      {children}
    </div>
  )
}
