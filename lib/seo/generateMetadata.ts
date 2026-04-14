import type { Metadata } from 'next'
import type { Article } from '@/types/article'
import { categoryLabel } from '@/lib/utils'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://atlaskings.com'
const SITE_NAME = 'Atlas Kings'
const TWITTER_HANDLE = '@atlaskingsfootball'
const PUBLISHER_LOGO_URL = `${SITE_URL}/images/logo.png`
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.jpg`

/**
 * Build a language-prefixed article URL.
 *
 *   en → /articles/{slug}        (clean URL, no prefix)
 *   ar → /ar/articles/{slug}
 *   fr → /fr/articles/{slug}
 */
function articleUrlForLang(slug: string, lang: 'en' | 'ar' | 'fr'): string {
  const prefix = lang === 'en' ? '' : `/${lang}`
  return `${SITE_URL}${prefix}/articles/${slug}`
}

/**
 * Resolve an article image to an absolute URL with sensible fallback.
 * Honours an explicit `image` field, then falls back to the site default.
 */
function resolveImageUrl(image: string | undefined): string {
  if (!image) return DEFAULT_OG_IMAGE
  return image.startsWith('http') ? image : `${SITE_URL}${image}`
}

// ── Article page metadata ──
//
// §2 article content + trust pass updates:
//   - language alternates (hreflang) for EN / AR / FR
//   - canonical URL respects article.language
//   - article:modified_time set from article.modified
//   - article:section + article:tag exposed
//   - alt text uses article.imageAlt when present
export function generateArticleMetadata(article: Article): Metadata {
  const lang = article.language ?? 'en'
  const url = articleUrlForLang(article.slug, lang)
  const image = resolveImageUrl(article.image)
  const imageAlt = article.imageAlt ?? article.title

  return {
    title: { absolute: article.title },
    description: article.excerpt,

    alternates: {
      canonical: url,
      languages: {
        en: articleUrlForLang(article.slug, 'en'),
        ar: articleUrlForLang(article.slug, 'ar'),
        fr: articleUrlForLang(article.slug, 'fr'),
        'x-default': articleUrlForLang(article.slug, 'en'),
      },
    },

    openGraph: {
      type: 'article',
      url,
      title: article.title,
      description: article.excerpt,
      siteName: SITE_NAME,
      publishedTime: article.date,
      modifiedTime: article.modified ?? article.date,
      authors: [article.author],
      tags: article.tags,
      section: categoryLabel(article.category),
      locale: lang === 'ar' ? 'ar_MA' : lang === 'fr' ? 'fr_FR' : 'en_GB',
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt }],
    },

    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      title: article.title,
      description: article.excerpt,
      images: [image],
    },

    other: {
      'article:published_time': article.date,
      'article:modified_time': article.modified ?? article.date,
      'article:section': categoryLabel(article.category),
      ...(article.tags && article.tags.length > 0
        ? { 'article:tag': article.tags.join(',') }
        : {}),
    },
  }
}

// ── NewsArticle JSON-LD schema ──
//
// §2 expansion:
//   - mainEntityOfPage  → tells Google this URL is the canonical surface for the entity
//   - isPartOf          → links the article to the WebSite entity for sitelinks
//   - copyrightHolder   → publisher attribution
//   - copyrightYear     → derived from article.date
//   - dateModified      → real value from article.modified, not a copy of date
//   - author            → Organization (decision C1, no individual byline)
export function articleSchema(article: Article) {
  const lang = article.language ?? 'en'
  const url = articleUrlForLang(article.slug, lang)
  const image = resolveImageUrl(article.image)
  const datePublished = article.date
  const dateModified = article.modified ?? article.date
  const copyrightYear = new Date(datePublished).getUTCFullYear()

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    datePublished,
    dateModified,
    author: {
      '@type': 'Organization',
      name: article.author || 'Atlas Kings Editorial Team',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: PUBLISHER_LOGO_URL,
      },
    },
    isPartOf: {
      '@type': 'WebSite',
      '@id': SITE_URL,
      name: SITE_NAME,
      url: SITE_URL,
    },
    copyrightHolder: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    copyrightYear,
    image: {
      '@type': 'ImageObject',
      url: image,
      width: 1200,
      height: 630,
    },
    articleSection: categoryLabel(article.category),
    keywords: article.tags?.join(', '),
    inLanguage: lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-GB',
    isAccessibleForFree: true,
  }
}

// ── BreadcrumbList JSON-LD ──
export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  }
}
