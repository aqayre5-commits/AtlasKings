import { pageMetadata } from '@/lib/seo/pageMetadata'
import Link from 'next/link'
import { WidgetPageShell } from '@/components/layout/WidgetPageShell'
import { getArticlesForSectionAsync } from '@/lib/articles/getArticles'
import { StoryCard } from '@/components/cards/StoryCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('transfers', lang, '/transfers')
}

export const revalidate = 300

// Keywords to classify transfer articles
const CONFIRMED_KEYWORDS = ['done deal', 'confirmed', 'signs', 'signed', 'official', 'completed', 'joins', 'joined', 'loan', 'loaned', 'permanent', 'fee agreed', 'contract signed', 'medical passed', 'agreement reached']
const RUMOR_KEYWORDS = ['rumour', 'rumor', 'target', 'targets', 'interested', 'bid', 'offer', 'chase', 'wants', 'eyes', 'monitoring', 'close to', 'talks', 'could join', 'set to', 'expected', 'likely', 'linked', 'pursuit', 'race for', 'considered']

function classifyTransfer(article: { title: string; excerpt: string; tags?: string[] }): 'confirmed' | 'rumor' | 'news' {
  const text = `${article.title} ${article.excerpt} ${(article.tags ?? []).join(' ')}`.toLowerCase()
  if (CONFIRMED_KEYWORDS.some(kw => text.includes(kw))) return 'confirmed'
  if (RUMOR_KEYWORDS.some(kw => text.includes(kw))) return 'rumor'
  return 'news'
}

export default async function TransfersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = getTranslations((lang as Lang) || 'en')
  const s = t.sections
  const p = lang === 'en' ? '' : `/${lang}`
  const langKey = (lang as 'en' | 'ar' | 'fr') || 'en'

  const articles = await getArticlesForSectionAsync('transfers', langKey, 20)

  // Classify articles
  const confirmed = articles.filter(a => classifyTransfer(a) === 'confirmed')
  const rumors = articles.filter(a => classifyTransfer(a) === 'rumor')
  const general = articles.filter(a => classifyTransfer(a) === 'news')

  const leadArticle = articles[0]
  const feedArticles = articles.slice(1)

  return (
    <WidgetPageShell section={t.nav.transfers} sectionHref="/transfers" title={t.nav.transfers} category="transfers" lang={lang}>

      {/* Lead story */}
      {leadArticle && (
        <div style={{ padding: '16px 16px 0' }}>
          <StoryCard article={leadArticle} langPrefix={p} variant="lead" />
        </div>
      )}

      {/* Confirmed / Done Deals */}
      {confirmed.length > 0 && (
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
            {s.doneDeals}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {confirmed.slice(0, 5).map(a => (
              <StoryCard key={a.slug} article={a} langPrefix={p} variant="horizontal" />
            ))}
          </div>
        </div>
      )}

      {/* Rumours & Targets */}
      {rumors.length > 0 && (
        <div>
          <div style={{
            padding: '12px 16px', background: 'var(--card-alt)',
            borderBottom: '1px solid var(--border)',
            fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 800,
            letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ width: 3, height: 14, borderRadius: 2, background: 'var(--gold)' }} />
            <span>🔥</span>
            {s.rumoursTargets}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {rumors.slice(0, 5).map(a => (
              <StoryCard key={a.slug} article={a} langPrefix={p} variant="horizontal" />
            ))}
          </div>
        </div>
      )}

      {/* All Transfer News */}
      {feedArticles.length > 0 && (
        <div>
          <div style={{
            padding: '12px 16px', background: 'var(--card-alt)',
            borderBottom: '1px solid var(--border)',
            fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 800,
            letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ width: 3, height: 14, borderRadius: 2, background: '#c1121f' }} />
            {s.latestNews}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {feedArticles.map(a => (
              <StoryCard key={a.slug} article={a} langPrefix={p} variant="horizontal" />
            ))}
          </div>
        </div>
      )}

      {articles.length === 0 && (
        <EmptyState icon="🔄" title={t.nav.transfers} description="" />
      )}
    </WidgetPageShell>
  )
}
