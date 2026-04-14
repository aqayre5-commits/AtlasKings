/**
 * /morocco/news — the Morocco newsroom.
 * ─────────────────────────────────────────────────────────────────────
 *
 * The 5-second promise: "Everything being written about Morocco right
 * now, grouped by topic."
 *
 * Previous version had two pieces of cosmetic fakery: filter chips that
 * didn't filter (server-only page) and a hardcoded "popular tags" cloud
 * that wasn't clickable. Both are gone.
 *
 * New structure:
 *   1. Lead article
 *   2. Latest feed (every Morocco article, newest first)
 *   3. Topic buckets driven by the same keyword arrays the page used to
 *      rely on for its fake chips — now actually used. Each bucket only
 *      renders if it has ≥2 stories, to avoid one-item dead-end blocks.
 *
 * Keyword matching is intentionally loose (substring across title +
 * excerpt + tags) so the buckets stay useful even as the corpus grows.
 */

import { pageMetadata } from '@/lib/seo/pageMetadata'
import { WidgetPageShell } from '@/components/layout/WidgetPageShell'
import { MoroccoSectionHeader } from '@/components/primitives/MoroccoSectionHeader'
import { getArticlesForTeam, getArticlesForSectionAsync } from '@/lib/articles/getArticles'
import { StoryCard } from '@/components/cards/StoryCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'
import type { ArticleMeta } from '@/types/article'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('morocco/news', lang, '/morocco/news')
}

export const revalidate = 300

// Keyword buckets shared across English / Arabic / French — matching is
// substring-based on title+excerpt+tags, so these lists only need to
// cover the common terms you'd expect in Moroccan football coverage.
const TOPIC_KEYWORDS: Record<string, string[]> = {
  qualifiers: [
    'qualifier', 'qualifying', 'qualification', 'afcon', 'world cup',
    'group stage', 'elimination', 'تصفي', 'مجموع', 'كأس أفريقيا', 'مونديال',
    'qualif', 'groupe', 'coupe du monde',
  ],
  squad: [
    'squad', 'call-up', 'callup', 'selection', 'roster', 'cap', 'debut',
    'تشكيلة', 'استدع', 'convocation', 'effectif', 'sélection',
  ],
  injuries: [
    'injury', 'injured', 'hamstring', 'knee', 'ankle', 'surgery', 'recovery',
    'fitness', 'doubt', 'ruled out', 'sidelined',
    'إصاب', 'blessure', 'blessé', 'forfait',
  ],
  federation: [
    'federation', 'frmf', 'ban', 'sanction', 'appointment', 'coach',
    'manager', 'contract', 'ouahbi',
    'اتحاد', 'الجامعة', 'fédération', 'entraîneur',
  ],
} as const

type TopicKey = keyof typeof TOPIC_KEYWORDS

function matchesTopic(article: ArticleMeta, keywords: string[]): boolean {
  const text = `${article.title} ${article.excerpt} ${(article.tags ?? []).join(' ')}`.toLowerCase()
  return keywords.some(kw => text.includes(kw.toLowerCase()))
}

export default async function MoroccoNewsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = getTranslations((lang as Lang) || 'en')
  const s = t.sections
  const p = lang === 'en' ? '' : `/${lang}`
  const langKey = (lang as 'en' | 'ar' | 'fr') || 'en'

  // Pull Morocco-section and Morocco-team articles, dedupe by slug.
  const [sectionArticleMetas, teamArticleMetas] = await Promise.all([
    getArticlesForSectionAsync('morocco', langKey, 30),
    Promise.resolve(getArticlesForTeam('morocco', langKey, 30)),
  ])

  const seen = new Set<string>()
  const allArticleMetas: ArticleMeta[] = []
  for (const a of [...sectionArticleMetas, ...teamArticleMetas]) {
    if (!seen.has(a.slug)) {
      seen.add(a.slug)
      allArticleMetas.push(a)
    }
  }

  const leadArticleMeta = allArticleMetas[0]
  const feedArticleMetas = allArticleMetas.slice(1, 11)

  // Build topic buckets. Each bucket draws from the full article pool
  // (not just the feed) so a relevant older piece can surface. We cap
  // each bucket at 4 items and require ≥2 to render at all.
  const topicOrder: TopicKey[] = ['qualifiers', 'squad', 'injuries', 'federation']
  const topicLabel: Record<TopicKey, string> = {
    qualifiers: s.filterQualifiers,
    squad: s.filterSquad,
    injuries: s.filterInjuries,
    federation: s.filterFederation,
  }
  const topicBuckets = topicOrder.map(key => ({
    key,
    label: topicLabel[key],
    articles: allArticleMetas
      .filter(a => matchesTopic(a, TOPIC_KEYWORDS[key]))
      .slice(0, 4),
  })).filter(b => b.articles.length >= 2)

  return (
    <WidgetPageShell
      section="Morocco"
      sectionHref="/morocco"
      title={s.news}
      category="morocco"
      lang={lang}
    >
      {/* ── Lead story ────────────────────────────────────────────── */}
      {leadArticleMeta && (
        <div style={{ padding: '16px 16px 0' }}>
          <StoryCard article={leadArticleMeta} langPrefix={p} variant="lead" />
        </div>
      )}

      {/* ── Latest feed ───────────────────────────────────────────── */}
      {feedArticleMetas.length > 0 && (
        <div style={{ padding: '24px 16px 0' }}>
          <MoroccoSectionHeader title={s.latestNews} as="h2" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {feedArticleMetas.map(a => (
              <StoryCard key={a.slug} article={a} langPrefix={p} variant="horizontal" />
            ))}
          </div>
        </div>
      )}

      {/* ── Topic buckets ─────────────────────────────────────────── */}
      {topicBuckets.map(bucket => (
        <div key={bucket.key} style={{ padding: '24px 16px 0' }}>
          <MoroccoSectionHeader title={bucket.label} as="h2" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {bucket.articles.map(a => (
              <StoryCard key={a.slug} article={a} langPrefix={p} variant="horizontal" />
            ))}
          </div>
        </div>
      ))}

      {/* Bottom padding so the last bucket doesn't hug the card edge */}
      {(leadArticleMeta || feedArticleMetas.length > 0) && <div style={{ height: 16 }} />}

      {allArticleMetas.length === 0 && (
        <EmptyState
          icon="🇲🇦"
          title={s.latestNews}
          description="Morocco stories will appear here as they are published."
        />
      )}
    </WidgetPageShell>
  )
}
