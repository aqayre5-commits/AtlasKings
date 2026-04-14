/**
 * /world-cup-2030/cities — the six WC 2030 host cities.
 * ─────────────────────────────────────────────────────────────────────
 *
 * Phase E.1 rebuild (§6).
 *
 * What changed vs the previous `'use client'` version:
 *   - Server component — no client JS for the content, SSR'd HTML
 *   - City dataset lifted into lib/data/wc2030HostCities.ts
 *     (single source of truth, shared with the Phase G hub refactor)
 *   - `generateMetadata` with localised title/description
 *   - Breadcrumb via shared <Breadcrumb> primitive
 *   - Jump-to-city anchor TOC at the top of the content
 *   - Each city section carries a stable anchor id (city.slug) that
 *     matches the previous in-file ids exactly — no deep-link drift
 *   - Per-city <TouristDestination> JSON-LD (6 scripts, localised via
 *     hostCityJsonLd(city, langKey), matching the stadiums pattern)
 *   - Bottom-of-page WC 2030 coverage rail
 *
 * Phase E.2 adds full AR/FR body translations for all 6 cities. Every
 * language-facing field (kicker, facts, history, neighborhoods,
 * restaurants, accommodation, gettingThere, matchday, dontMiss) now
 * reads from the current page locale via pickLocale(). The yellow
 * "currently in English" banner is gone on AR/FR — those readers now
 * get the same flagship experience as EN. Per-city TouristDestination
 * JSON-LD is now emitted in the page locale via hostCityJsonLd(city,
 * langKey), matching the stadiums B.2 pattern.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { StoryCard } from '@/components/cards/StoryCard'
import { pageMetadata } from '@/lib/seo/pageMetadata'
import { getArticlesForSectionAsync } from '@/lib/articles/getArticles'
import { WC2030_HOST_CITIES, hostCityJsonLd, pickLocale } from '@/lib/data/wc2030HostCities'
import type { Lang } from '@/lib/i18n/config'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return pageMetadata('world-cup-2030/cities', lang, '/world-cup-2030/cities')
}

export const revalidate = 86400 // static content — daily refresh is plenty

// ── Chrome strings (labels, section titles, TOC, article-rail) ───────
// Body prose lives in wc2030HostCities.ts and is now fully localised.

interface CityCopy {
  hostCities: string
  pageTitle: string
  pageDesc: string
  history: string
  neighborhoods: string
  whereToEat: string
  whereToStay: string
  gettingThere: string
  matchday: string
  dontMiss: string
  jumpToCity: string
  coverage: string
  stadiumGuides: string
  ticketInfo: string
}

const CITY_T: Record<Lang, CityCopy> = {
  en: {
    hostCities: 'HOST CITIES',
    pageTitle: "Morocco's Six Host Cities",
    pageDesc: "Six cities across Morocco will host the 2030 FIFA World Cup — from the Atlantic commercial hub of Casablanca to the medieval alleys of Fes, from the red walls of Marrakech to the Atlantic beach of Agadir. Here is the complete guide to each, including where to stay, where to eat, how to get there, and what not to miss.",
    history: 'History',
    neighborhoods: 'Best Neighborhoods',
    whereToEat: 'Where to Eat',
    whereToStay: 'Where to Stay',
    gettingThere: 'Getting There',
    matchday: 'Matchday Experience',
    dontMiss: "Don't Miss",
    jumpToCity: 'Jump to city',
    coverage: 'WC 2030 Coverage',
    stadiumGuides: 'Stadium Guides',
    ticketInfo: 'Ticket Information',
  },
  ar: {
    hostCities: 'المدن المضيفة',
    pageTitle: 'المدن المضيفة الست في المغرب',
    pageDesc: 'ستستضيف ست مدن في المغرب كأس العالم 2030 — من الدار البيضاء مركز الأعمال الأطلسي إلى أزقة فاس العتيقة، ومن أسوار مراكش الحمراء إلى شاطئ أكادير الأطلسي. هذا هو الدليل الكامل لكل مدينة: أين تقيم، أين تأكل، كيف تصل، وما لا ينبغي تفويته.',
    history: 'التاريخ',
    neighborhoods: 'أفضل الأحياء',
    whereToEat: 'أين تأكل',
    whereToStay: 'أين تقيم',
    gettingThere: 'الوصول',
    matchday: 'تجربة يوم المباراة',
    dontMiss: 'لا تفوّت',
    jumpToCity: 'انتقل إلى المدينة',
    coverage: 'تغطية مونديال 2030',
    stadiumGuides: 'دليل الملاعب',
    ticketInfo: 'معلومات التذاكر',
  },
  fr: {
    hostCities: 'VILLES HÔTES',
    pageTitle: 'Les six villes hôtes du Maroc',
    pageDesc: "Six villes à travers le Maroc accueilleront la Coupe du Monde FIFA 2030 — du centre économique atlantique de Casablanca aux ruelles médiévales de Fès, des murs rouges de Marrakech à la plage atlantique d'Agadir. Voici le guide complet de chacune : où dormir, où manger, comment s'y rendre et ce qu'il ne faut pas manquer.",
    history: 'Histoire',
    neighborhoods: 'Meilleurs quartiers',
    whereToEat: 'Où manger',
    whereToStay: 'Où séjourner',
    gettingThere: 'Comment y accéder',
    matchday: 'Expérience jour de match',
    dontMiss: 'À ne pas manquer',
    jumpToCity: 'Aller à la ville',
    coverage: 'Couverture CM 2030',
    stadiumGuides: 'Guide des stades',
    ticketInfo: 'Informations billets',
  },
}

// ── Page-local presentation atoms ────────────────────────────────────

function SectionHeader({ title, accent }: { title: string; accent: string }) {
  return (
    <div className="sec-head" style={{ marginBottom: 16 }}>
      <div className="sec-bar" style={{ background: accent }} />
      <h3
        style={{
          fontFamily: 'var(--font-head)',
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text)',
        }}
      >
        {title}
      </h3>
    </div>
  )
}

function ItemRow({ name, desc, isLast }: { name: string; desc: string; isLast?: boolean }) {
  return (
    <div style={{ padding: '14px 0', borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
      <div
        style={{
          fontFamily: 'var(--font-head)',
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--text)',
          marginBottom: 5,
        }}
      >
        {name}
      </div>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13.5,
          lineHeight: 1.8,
          color: 'var(--text-sec)',
          margin: 0,
        }}
      >
        {desc}
      </p>
    </div>
  )
}

function StayTier({ tier, range, desc }: { tier: string; range: string; desc: string }) {
  return (
    <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <span
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--text)',
          }}
        >
          {tier}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-faint)',
          }}
        >
          {range}
        </span>
      </div>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          lineHeight: 1.8,
          color: 'var(--text-sec)',
          margin: 0,
        }}
      >
        {desc}
      </p>
    </div>
  )
}

const bodyText: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 15,
  lineHeight: 1.8,
  color: 'var(--text-sec)',
  margin: 0,
}

// ── Page ─────────────────────────────────────────────────────────────

export default async function CitiesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const langKey = (['en', 'ar', 'fr'].includes(lang) ? lang : 'en') as Lang
  const ct = CITY_T[langKey]
  const dir = langKey === 'ar' ? 'rtl' : 'ltr'
  const p = langKey === 'en' ? '' : `/${langKey}`

  const coverageArticles = await getArticlesForSectionAsync('world-cup', langKey, 4)

  return (
    <main dir={dir}>
      {/* Per-city <TouristDestination> JSON-LD — one script per city,
          each emitted in the current page locale (description +
          inLanguage). */}
      {WC2030_HOST_CITIES.map(city => (
        <script
          key={city.slug}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hostCityJsonLd(city, langKey)) }}
        />
      ))}

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 20px 80px' }}>

        {/* Page intro */}
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 34,
              fontWeight: 800,
              fontStyle: 'italic',
              color: 'var(--text)',
              lineHeight: 1.15,
              marginBottom: 14,
            }}
          >
            {ct.pageTitle}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 16,
              lineHeight: 1.85,
              color: 'var(--text-sec)',
              maxWidth: 700,
              margin: 0,
            }}
          >
            {ct.pageDesc}
          </p>
        </div>

        {/* ── Jump-to-city anchor TOC ──────────────────────────────── */}
        <nav
          aria-label={ct.jumpToCity}
          data-city-toc
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 12,
            marginBottom: 48,
            borderBottom: '2px solid var(--border)',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {WC2030_HOST_CITIES.map(city => (
            <a
              key={city.slug}
              href={`#${city.slug}`}
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: city.accent,
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 14px',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {city.emoji} {city.nameEn}
            </a>
          ))}
        </nav>

        {/* ── City sections ────────────────────────────────────────── */}
        {WC2030_HOST_CITIES.map((city, i) => {
          // Pre-pick every localised field once per city render, same
          // pattern as the stadiums template. Keeps the JSX readable
          // and guarantees every body field switches with the locale.
          const kicker = pickLocale(city.kicker, langKey)
          const facts = pickLocale(city.facts, langKey)
          const history = pickLocale(city.history, langKey)
          const neighborhoods = pickLocale(city.neighborhoods, langKey)
          const restaurants = pickLocale(city.restaurants, langKey)
          const accommodation = pickLocale(city.accommodation, langKey)
          const gettingThere = pickLocale(city.gettingThere, langKey)
          const matchday = pickLocale(city.matchday, langKey)
          const dontMiss = pickLocale(city.dontMiss, langKey)

          return (
          <section
            key={city.slug}
            id={city.slug}
            data-city-slug={city.slug}
            style={{
              marginBottom: 80,
              paddingBottom: i < WC2030_HOST_CITIES.length - 1 ? 80 : 0,
              borderBottom: i < WC2030_HOST_CITIES.length - 1 ? '2px solid var(--border)' : 'none',
              scrollMarginTop: 100,
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
              <div aria-hidden style={{ fontSize: 52, lineHeight: 1, flexShrink: 0 }}>{city.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'var(--text-faint)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}
                >
                  {kicker}
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontSize: 36,
                    fontWeight: 800,
                    fontStyle: 'italic',
                    color: 'var(--text)',
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {city.nameEn}
                </h2>
                <div
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontSize: 16,
                    color: 'var(--text-faint)',
                    letterSpacing: '0.06em',
                  }}
                >
                  {city.nameAr}
                </div>
              </div>
            </div>

            {/* Facts grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 1,
                background: 'var(--border)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                marginBottom: 28,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {facts.map(fact => (
                <div key={fact.label} style={{ background: 'var(--card)', padding: '12px 16px' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      color: 'var(--text-faint)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: 4,
                    }}
                  >
                    {fact.label}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 13,
                      color: 'var(--text)',
                      lineHeight: 1.4,
                    }}
                  >
                    {fact.value}
                  </div>
                </div>
              ))}
            </div>

            {/* History */}
            <SectionHeader title={ct.history} accent={city.accent} />
            <p style={{ ...bodyText, marginBottom: 32 }}>{history}</p>

            {/* Neighborhoods */}
            <SectionHeader title={ct.neighborhoods} accent={city.accent} />
            <div style={{ marginBottom: 32 }}>
              {neighborhoods.map((n, j) => (
                <ItemRow key={n.name} name={n.name} desc={n.desc} isLast={j === neighborhoods.length - 1} />
              ))}
            </div>

            {/* Where to Eat */}
            <SectionHeader title={ct.whereToEat} accent={city.accent} />
            <div style={{ marginBottom: 32 }}>
              {restaurants.map((r, j) => (
                <ItemRow key={r.name} name={r.name} desc={r.desc} isLast={j === restaurants.length - 1} />
              ))}
            </div>

            {/* Where to Stay */}
            <SectionHeader title={ct.whereToStay} accent={city.accent} />
            <div
              style={{
                background: 'var(--card-alt)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '18px 20px',
                marginBottom: 32,
              }}
            >
              {accommodation.map(s => (
                <StayTier key={s.tier} tier={s.tier} range={s.range} desc={s.desc} />
              ))}
            </div>

            {/* Getting There */}
            <SectionHeader title={ct.gettingThere} accent={city.accent} />
            <div
              style={{
                background: 'var(--card-alt)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '18px 20px',
                marginBottom: 32,
              }}
            >
              {gettingThere.map((row, j) => (
                <div key={row.label} style={{ marginBottom: j < gettingThere.length - 1 ? 14 : 0 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-head)',
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: city.accent,
                      marginBottom: 8,
                    }}
                  >
                    <span aria-hidden style={{ marginRight: 6 }}>{row.icon}</span>
                    {row.label}
                  </div>
                  <p style={{ ...bodyText, fontSize: 13, margin: 0 }}>{row.detail}</p>
                </div>
              ))}
            </div>

            {/* Matchday */}
            <div
              style={{
                background: 'var(--navy-light)',
                border: '1px solid #c8d4f0',
                borderRadius: 'var(--radius)',
                padding: '16px 20px',
                marginBottom: 32,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--navy)',
                  marginBottom: 8,
                }}
              >
                <span aria-hidden style={{ marginRight: 6 }}>⚽</span>
                {ct.matchday}
              </div>
              {matchday.map((para, j) => (
                <p
                  key={j}
                  style={{
                    ...bodyText,
                    fontSize: 13,
                    marginBottom: j < matchday.length - 1 ? 10 : 0,
                    marginTop: 0,
                  }}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Don't Miss */}
            <SectionHeader title={ct.dontMiss} accent={city.accent} />
            <div style={{ marginBottom: 0 }}>
              {dontMiss.map((item, j) => (
                <ItemRow key={item.name} name={item.name} desc={item.desc} isLast={j === dontMiss.length - 1} />
              ))}
            </div>
          </section>
          )
        })}

        {/* ── WC 2030 coverage rail ────────────────────────────────── */}
        {coverageArticles.length > 0 && (
          <section style={{ marginTop: 56, marginBottom: 56 }}>
            <div className="sec-head" style={{ marginBottom: 6 }}>{ct.coverage}</div>
            <div className="sec-bar" style={{ marginBottom: 20 }} />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 'var(--gap)',
              }}
            >
              {coverageArticles.map(article => (
                <StoryCard
                  key={article.slug}
                  article={article}
                  langPrefix={p}
                  showExcerpt={false}
                />
              ))}
            </div>
          </section>
        )}

        {/* Bottom navigation */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 32 }}>
          <Link
            href={`${p}/world-cup-2030/stadiums`}
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              background: 'var(--gold-light)',
              border: '1px solid #e0c88a',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 20px',
              textDecoration: 'none',
            }}
          >
            ← {ct.stadiumGuides}
          </Link>
          <Link
            href={`${p}/world-cup-2030/tickets`}
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--green)',
              background: 'var(--green-light)',
              border: '1px solid #b0d8c0',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 20px',
              textDecoration: 'none',
            }}
          >
            {ct.ticketInfo} →
          </Link>
        </div>
      </div>
    </main>
  )
}
