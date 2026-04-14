import { SectionBar, type SectionBarTab } from '@/components/layout/SectionBar'

const TABS: SectionBarTab[] = [
  { label: { en: 'Overview', ar: '\u0646\u0638\u0631\u0629 \u0639\u0627\u0645\u0629', fr: 'Aper\u00E7u' }, href: '/world-cup-2030' },
  { label: { en: 'Stadiums', ar: '\u0627\u0644\u0645\u0644\u0627\u0639\u0628', fr: 'Stades' }, href: '/world-cup-2030/stadiums' },
  { label: { en: 'Cities', ar: '\u0627\u0644\u0645\u062F\u0646', fr: 'Villes' }, href: '/world-cup-2030/cities' },
  { label: { en: 'Construction', ar: '\u0627\u0644\u0628\u0646\u0627\u0621', fr: 'Construction' }, href: '/world-cup-2030/construction' },
  { label: { en: 'Travel', ar: '\u0627\u0644\u0633\u0641\u0631', fr: 'Voyage' }, href: '/world-cup-2030/travel' },
  { label: { en: 'Tickets', ar: '\u0627\u0644\u062A\u0630\u0627\u0643\u0631', fr: 'Billets' }, href: '/world-cup-2030/tickets' },
]

export default async function WorldCup2030Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  return (
    <div className="has-section-subnav">
      <SectionBar flag={'\uD83C\uDFC6'} name={{ en: 'WC 2030', ar: '\u0645\u0648\u0646\u062F\u064A\u0627\u0644 2030', fr: 'CM 2030' }} tabs={TABS} lang={lang} accentColor="#B8820A" />
      {children}
    </div>
  )
}
