import { SectionBar, type SectionBarTab } from '@/components/layout/SectionBar'

const TABS: SectionBarTab[] = [
  { label: { en: 'Overview', ar: '\u0646\u0638\u0631\u0629 \u0639\u0627\u0645\u0629', fr: 'Aper\u00E7u' }, href: '/champions-league' },
  { label: { en: 'Scores', ar: '\u0627\u0644\u0646\u062A\u0627\u0626\u062C', fr: 'Scores' }, href: '/champions-league/scores' },
  { label: { en: 'Table', ar: '\u0627\u0644\u062A\u0631\u062A\u064A\u0628', fr: 'Classement' }, href: '/champions-league/table' },
  { label: { en: 'Bracket', ar: '\u0627\u0644\u0634\u062C\u0631\u0629', fr: 'Tableau' }, href: '/champions-league/bracket' },
  { label: { en: 'Stats', ar: '\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A', fr: 'Statistiques' }, href: '/champions-league/stats' },
]

export default async function ChampionsLeagueLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  return (
    <div className="has-section-subnav">
      <SectionBar flag={'\u2B50'} name={{ en: 'CHAMPIONS LEAGUE', ar: '\u062F\u0648\u0631\u064A \u0627\u0644\u0623\u0628\u0637\u0627\u0644', fr: 'LIGUE DES CHAMPIONS' }} tabs={TABS} lang={lang} accentColor="#0a1f5c" />
      {children}
    </div>
  )
}
