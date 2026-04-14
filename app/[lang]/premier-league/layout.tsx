import { SectionBar, type SectionBarTab } from '@/components/layout/SectionBar'

const TABS: SectionBarTab[] = [
  { label: { en: 'Overview', ar: '\u0646\u0638\u0631\u0629 \u0639\u0627\u0645\u0629', fr: 'Aper\u00E7u' }, href: '/premier-league' },
  { label: { en: 'Scores', ar: '\u0627\u0644\u0646\u062A\u0627\u0626\u062C', fr: 'Scores' }, href: '/premier-league/scores' },
  { label: { en: 'Table', ar: '\u0627\u0644\u062A\u0631\u062A\u064A\u0628', fr: 'Classement' }, href: '/premier-league/table' },
  { label: { en: 'Stats', ar: '\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A', fr: 'Statistiques' }, href: '/premier-league/stats' },
]

export default async function PremierLeagueLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  return (
    <div className="has-section-subnav">
      <SectionBar flag={'\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67\uDB40\uDC7F'} name={{ en: 'PREMIER LEAGUE', ar: '\u0627\u0644\u062F\u0648\u0631\u064A \u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A', fr: 'PREMIER LEAGUE' }} tabs={TABS} lang={lang} accentColor="#3d195b" />
      {children}
    </div>
  )
}
