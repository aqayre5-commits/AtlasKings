import { NextRequest, NextResponse } from 'next/server'
import { getArticlesByLang } from '@/lib/articles/getArticles'
import { categoryLabel } from '@/lib/utils'
import type { Lang } from '@/lib/i18n/config'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://atlaskings.com'

const FEED_META: Record<Lang, { title: string; description: string; lang: string }> = {
  en: {
    title: 'Atlas Kings — Football News',
    description: 'Independent football news covering Morocco, Botola Pro, Premier League, Champions League and the 2030 World Cup.',
    lang: 'en-GB',
  },
  ar: {
    title: 'أطلس كينغز — أخبار كرة القدم',
    description: 'أخبار كرة القدم المستقلة تغطي المغرب والبطولة المحترفة ودوري الأبطال وكأس العالم 2030.',
    lang: 'ar',
  },
  fr: {
    title: 'Atlas Kings — Actualités Football',
    description: 'Actualités football indépendantes couvrant le Maroc, la Botola Pro, la Premier League et la Coupe du Monde 2030.',
    lang: 'fr-FR',
  },
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function buildRSS(lang: Lang): string {
  const articles = getArticlesByLang(lang).slice(0, 20) // Latest 20
  const meta = FEED_META[lang]
  const feedUrl = lang === 'en'
    ? `${SITE_URL}/api/rss`
    : `${SITE_URL}/api/rss?lang=${lang}`
  const siteUrl = lang === 'en' ? SITE_URL : `${SITE_URL}/${lang}`

  const items = articles.map(article => {
    const url = lang === 'en'
      ? `${SITE_URL}/articles/${article.slug}`
      : `${SITE_URL}/${lang}/articles/${article.slug}`

    return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(article.excerpt)}</description>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <category>${escapeXml(categoryLabel(article.category))}</category>
      <author>editorial@atlaskings.com (${escapeXml(article.author)})</author>
      ${article.image ? '<enclosure url="' + SITE_URL + article.image + '" type="image/jpeg" length="0"/>' : ''}
      <source url="${feedUrl}">${escapeXml(meta.title)}</source>
    </item>`
  }).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:georss="http://www.georss.org/georss">
  <channel>
    <title>${escapeXml(meta.title)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(meta.description)}</description>
    <language>${meta.lang}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    <image>
      <url>${SITE_URL}/images/og-default.jpg</url>
      <title>${escapeXml(meta.title)}</title>
      <link>${siteUrl}</link>
    </image>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`
}

export async function GET(request: NextRequest) {
  const lang = (request.nextUrl.searchParams.get('lang') ?? 'en') as Lang
  const validLang: Lang = ['en', 'ar', 'fr'].includes(lang) ? lang : 'en'

  const xml = buildRSS(validLang)

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
