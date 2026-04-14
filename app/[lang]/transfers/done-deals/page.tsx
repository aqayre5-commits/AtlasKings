import { pageMetadata } from '@/lib/seo/pageMetadata'
import { WidgetPageShell } from '@/components/layout/WidgetPageShell'
import { getArticlesForSectionAsync } from '@/lib/articles/getArticles'
import { StoryCard } from '@/components/cards/StoryCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('transfers/done-deals', lang, '/transfers/done-deals')
}

export const revalidate = 300

const CONFIRMED_KEYWORDS = ['done deal', 'confirmed', 'signs', 'signed', 'official', 'completed', 'joins', 'joined', 'loan', 'loaned', 'permanent', 'fee agreed', 'contract signed', 'medical passed', 'agreement reached']

export default async function TransfersDoneDealsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = getTranslations((lang as Lang) || 'en')
  const s = t.sections
  const p = lang === 'en' ? '' : `/${lang}`
  const langKey = (lang as 'en' | 'ar' | 'fr') || 'en'

  const articles = await getArticlesForSectionAsync('transfers', langKey, 20)

  // Filter to confirmed deals
  const doneDeals = articles.filter(a => {
    const text = `${a.title} ${a.excerpt} ${(a.tags ?? []).join(' ')}`.toLowerCase()
    return CONFIRMED_KEYWORDS.some(kw => text.includes(kw))
  })

  const label = s.doneDeals

  return (
    <WidgetPageShell section={t.nav.transfers} sectionHref="/transfers" title={label} category="transfers" lang={lang}>

      {doneDeals.length > 0 ? (
        <div>
          <div style={{
            padding: '12px 16px', background: 'var(--card-alt)',
            borderBottom: '1px solid var(--border)',
            fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 800,
            letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ width: 3, height: 14, borderRadius: 2, background: 'var(--live)' }} />
            <span>✅</span>
            {label}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {doneDeals.map(a => (
              <StoryCard key={a.slug} article={a} langPrefix={p} variant="horizontal" />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState icon="🔄" title={label} description="" />
      )}
    </WidgetPageShell>
  )
}
