import { SectionBar, type SectionBarTab } from '@/components/layout/SectionBar'

const TABS: SectionBarTab[] = [
  { label: { en: 'Latest', ar: '\u0627\u0644\u0623\u062E\u064A\u0631\u0629', fr: 'Derni\u00E8res' }, href: '/transfers' },
  { label: { en: 'Done Deals', ar: '\u0635\u0641\u0642\u0627\u062A \u0645\u0646\u062C\u0632\u0629', fr: 'Transferts confirm\u00E9s' }, href: '/transfers/done-deals' },
]

export default async function TransfersLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  return (
    <div className="has-section-subnav">
      <SectionBar flag={'\uD83D\uDD04'} name={{ en: 'TRANSFERS', ar: '\u0627\u0644\u0627\u0646\u062A\u0642\u0627\u0644\u0627\u062A', fr: 'TRANSFERTS' }} tabs={TABS} lang={lang} accentColor="#c1121f" />
      {children}
    </div>
  )
}
