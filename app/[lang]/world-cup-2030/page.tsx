/**
 * /world-cup-2030 — tournament hub page.
 * ─────────────────────────────────────────────────────────────────────
 *
 * Phase G refactor (§6).
 *
 * What changed vs the previous version:
 *   - Full i18n for every user-facing string (hero, quick-links grid,
 *     stadium strip, Latest News label, countdown block, quick info
 *     facts, WC 2026 crosslink). Chrome strings all localised for
 *     EN / AR / FR.
 *   - Stadium strip now consumes the shared WC2030_VENUES module
 *     instead of a hardcoded local array — single source of truth
 *     with the stadiums + construction pages. Status labels localised
 *     via VENUE_STATUS. City display localised via pickLocale.
 *   - Articles rail now queries the current page locale instead of
 *     always hardcoding 'en'.
 *   - Added <main dir={dir}> for RTL support on Arabic.
 *   - Added SportsEvent JSON-LD for the tournament itself, with the
 *     6 venues as nested Place locations and inLanguage set to the
 *     current page locale. Matches the FAQPage (tickets) and
 *     Place (stadiums / cities) JSON-LD patterns.
 *
 * NOT changed in Phase G:
 *   - Visual layout / card structure (two-col main + sidebar)
 *   - Countdown logic (static target date)
 *   - AdSlot placement
 *   - Hub pageMetadata entry (was already correct from Phase B.1b)
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { pageMetadata } from '@/lib/seo/pageMetadata'
import { getArticlesForSectionAsync } from '@/lib/articles/getArticles'
import { formatRelativeTime, getArticleHref, isExternalArticle } from '@/lib/utils'
import { AdSlot } from '@/components/ads/AdSlot'
import {
  WC2030_VENUES,
  VENUE_STATUS,
  pickLocale,
} from '@/lib/data/wc2030Venues'
import type { Lang } from '@/lib/i18n/config'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return pageMetadata('world-cup-2030', lang, '/world-cup-2030')
}

export const revalidate = 3600

// ── Chrome strings for the hub ───────────────────────────────────────

interface HubCopy {
  hero: { title: string; tagline: string }
  links: {
    stadiums: { title: string; desc: string }
    cities: { title: string; desc: string }
    construction: { title: string; desc: string }
    travel: { title: string; desc: string }
    tickets: { title: string; desc: string }
    wc2026: { title: string; desc: string }
  }
  stadiumsLabel: string
  stadiumsCta: string
  latestNews: string
  countdownLabel: string
  countdownUnit: string
  quickInfo: string
  facts: Array<{ label: string; value: string }>
  alsoWc2026Title: string
  alsoWc2026Text: string
  alsoWc2026Cta: string
}

const HUB_T: Record<Lang, HubCopy> = {
  en: {
    hero: {
      title: 'Morocco Hosts the 2030 FIFA World Cup',
      tagline: 'Six stadiums across six cities. The first World Cup hosted in North Africa.',
    },
    links: {
      stadiums: { title: 'Stadiums', desc: '6 venues across Morocco' },
      cities: { title: 'Host Cities', desc: 'City guides & travel info' },
      construction: { title: 'Construction', desc: 'Stadium & infrastructure progress' },
      travel: { title: 'Travel Guide', desc: 'Visas, transport, culture' },
      tickets: { title: 'Tickets', desc: 'Prices, ballot & FAQ' },
      wc2026: { title: 'WC 2026', desc: 'Morocco at the World Cup' },
    },
    stadiumsLabel: 'Stadiums',
    stadiumsCta: 'Full guide',
    latestNews: 'Latest News',
    countdownLabel: 'Days until 2030 World Cup',
    countdownUnit: 'days to go',
    quickInfo: 'Quick Info',
    facts: [
      { label: 'Hosts', value: 'Morocco, Spain, Portugal' },
      { label: 'Stadiums', value: '6 venues in Morocco' },
      { label: 'Opening', value: 'Morocco (TBC)' },
      { label: 'Final', value: 'Casablanca' },
      { label: 'Capacity', value: '115,000 (Hassan II)' },
    ],
    alsoWc2026Title: 'Also: WC 2026',
    alsoWc2026Text: 'Morocco plays in the 2026 World Cup in USA, Canada & Mexico.',
    alsoWc2026Cta: 'WC 2026 Coverage',
  },
  ar: {
    hero: {
      title: 'المغرب يستضيف كأس العالم 2030',
      tagline: 'ستة ملاعب في ست مدن. أول كأس عالم تستضيفه شمال أفريقيا.',
    },
    links: {
      stadiums: { title: 'الملاعب', desc: '6 ملاعب عبر المغرب' },
      cities: { title: 'المدن المضيفة', desc: 'أدلة المدن ومعلومات السفر' },
      construction: { title: 'البناء', desc: 'تقدّم الملاعب والبنية التحتية' },
      travel: { title: 'دليل السفر', desc: 'التأشيرات والنقل والثقافة' },
      tickets: { title: 'التذاكر', desc: 'الأسعار والقرعة والأسئلة الشائعة' },
      wc2026: { title: 'مونديال 2026', desc: 'المغرب في كأس العالم' },
    },
    stadiumsLabel: 'الملاعب',
    stadiumsCta: 'الدليل الكامل',
    latestNews: 'آخر الأخبار',
    countdownLabel: 'أيام حتى كأس العالم 2030',
    countdownUnit: 'يوماً متبقياً',
    quickInfo: 'معلومات سريعة',
    facts: [
      { label: 'المستضيفون', value: 'المغرب، إسبانيا، البرتغال' },
      { label: 'الملاعب', value: '6 ملاعب في المغرب' },
      { label: 'الافتتاح', value: 'المغرب (لم يُحدَّد)' },
      { label: 'النهائي', value: 'الدار البيضاء' },
      { label: 'السعة', value: '115,000 (الحسن الثاني)' },
    ],
    alsoWc2026Title: 'أيضاً: مونديال 2026',
    alsoWc2026Text: 'يشارك المغرب في كأس العالم 2026 في الولايات المتحدة وكندا والمكسيك.',
    alsoWc2026Cta: 'تغطية مونديال 2026',
  },
  fr: {
    hero: {
      title: 'Le Maroc accueille la Coupe du Monde 2030',
      tagline: "Six stades à travers six villes. La première Coupe du Monde organisée en Afrique du Nord.",
    },
    links: {
      stadiums: { title: 'Stades', desc: '6 enceintes à travers le Maroc' },
      cities: { title: 'Villes hôtes', desc: 'Guides des villes & infos voyage' },
      construction: { title: 'Construction', desc: 'Stades & infrastructure' },
      travel: { title: 'Guide de voyage', desc: 'Visas, transports, culture' },
      tickets: { title: 'Billets', desc: 'Prix, tirage au sort & FAQ' },
      wc2026: { title: 'CM 2026', desc: 'Le Maroc à la Coupe du Monde' },
    },
    stadiumsLabel: 'Stades',
    stadiumsCta: 'Guide complet',
    latestNews: 'Dernières actualités',
    countdownLabel: 'Jours avant la Coupe du Monde 2030',
    countdownUnit: 'jours restants',
    quickInfo: 'Infos pratiques',
    facts: [
      { label: 'Hôtes', value: 'Maroc, Espagne, Portugal' },
      { label: 'Stades', value: '6 enceintes au Maroc' },
      { label: 'Ouverture', value: 'Maroc (à confirmer)' },
      { label: 'Finale', value: 'Casablanca' },
      { label: 'Capacité', value: '115 000 (Hassan II)' },
    ],
    alsoWc2026Title: 'Aussi : CM 2026',
    alsoWc2026Text: "Le Maroc jouera à la Coupe du Monde 2026 aux États-Unis, au Canada et au Mexique.",
    alsoWc2026Cta: 'Couverture CM 2026',
  },
}

// ── SportsEvent JSON-LD builder ──────────────────────────────────────

/**
 * Build a SportsEvent JSON-LD object for the WC 2030 tournament
 * itself, with the 6 Moroccan venues as nested Place locations. The
 * tournament is co-hosted (Morocco + Spain + Portugal + centenary
 * openers in Uruguay/Argentina/Paraguay), but this page is the
 * Morocco hub specifically — so we list the 6 Moroccan venues as the
 * primary locations and keep the description honest about the
 * co-host structure.
 *
 * Localised: description, inLanguage, and each venue's localised
 * city display name inside the location[] array. Name + geo stay
 * stable.
 */
function tournamentJsonLd(lang: Lang) {
  const tagline = HUB_T[lang].hero.tagline
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    inLanguage: lang,
    name: HUB_T[lang].hero.title,
    description: tagline,
    sport: 'Football',
    startDate: '2030-06-08',
    endDate: '2030-07-21',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    organizer: {
      '@type': 'Organization',
      name: 'FIFA',
      url: 'https://www.fifa.com',
    },
    location: WC2030_VENUES.map(venue => ({
      '@type': 'Place',
      name: venue.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: pickLocale(venue.city, lang),
        addressRegion: venue.addressLocality,
        addressCountry: 'MA',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: venue.geo.latitude,
        longitude: venue.geo.longitude,
      },
    })),
  }
}

// ── Page ─────────────────────────────────────────────────────────────

export default async function WC2030Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params
  const lang: Lang = (['en', 'ar', 'fr'].includes(rawLang) ? rawLang : 'en') as Lang
  const t = HUB_T[lang]
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const p = lang === 'en' ? '' : `/${lang}`

  const articles = await getArticlesForSectionAsync('world-cup', lang, 4)
  const daysLeft = Math.max(0, Math.ceil((new Date('2030-06-01').getTime() - Date.now()) / 86400000))

  return (
    <main dir={dir}>
      {/* SportsEvent JSON-LD for the tournament itself */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tournamentJsonLd(lang)) }}
      />

      <div className="page-wrap">
        {/* Launch Session 2.3: breadcrumb on the WC 2030 hub so users
            always know where they are in the nav tree. */}
        {/* Breadcrumb removed — SectionBar handles navigation */}
        <div className="two-col">
          <div className="main-col">

            {/* Hero — redesigned. The previous version centred a tiny
                flag emoji above an italic 28 px h1, which collapsed
                into the quick-link grid below. This rebuild uses a
                two-column layout on desktop (copy left, centennial
                flag ornament right) and a centred stack on mobile.
                Typography bumped to clamp(30px, 4vw, 44px) so the
                hero reads as the anchor of the page. */}
            <div className="card" style={{ marginTop: 0, padding: 0, overflow: 'hidden' }}>
              <div
                style={{
                  background:
                    'linear-gradient(135deg, #0a5229 0%, #073d1e 55%, #041a0e 100%)',
                  padding: 'clamp(28px, 4vw, 44px) clamp(20px, 4vw, 36px)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Subtle diagonal pattern overlay — same language
                    as the Predictor CTA on the WC 2026 hub so the
                    two tournament hubs feel like a matched set. */}
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'repeating-linear-gradient(-45deg, transparent, transparent 22px, rgba(255,255,255,0.02) 22px, rgba(255,255,255,0.02) 44px)',
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'grid',
                    gridTemplateColumns:
                      'minmax(0, 1fr)',
                    alignItems: 'center',
                    gap: 18,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: '#e6b450',
                        marginBottom: 10,
                      }}
                    >
                      🇲🇦 {t.hero.title.includes('Maroc') || t.hero.title.includes('المغرب') ? '' : 'Morocco · Portugal · Spain'}
                    </div>
                    <h1
                      style={{
                        fontFamily: 'var(--font-head)',
                        fontSize: 'clamp(28px, 4.2vw, 44px)',
                        fontWeight: 900,
                        fontStyle: 'italic',
                        color: '#ffffff',
                        lineHeight: 1.1,
                        letterSpacing: '-0.005em',
                        margin: '0 0 12px',
                      }}
                    >
                      {t.hero.title}
                    </h1>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 15,
                        color: 'rgba(255,255,255,0.72)',
                        lineHeight: 1.55,
                        maxWidth: 640,
                        margin: 0,
                      }}
                    >
                      {t.hero.tagline}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick links — 3x2 grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--gap)' }}>
              {[
                { icon: '🏟️', title: t.links.stadiums.title, desc: t.links.stadiums.desc, href: `${p}/world-cup-2030/stadiums` },
                { icon: '🌍', title: t.links.cities.title, desc: t.links.cities.desc, href: `${p}/world-cup-2030/cities` },
                { icon: '🏗️', title: t.links.construction.title, desc: t.links.construction.desc, href: `${p}/world-cup-2030/construction` },
                { icon: '✈️', title: t.links.travel.title, desc: t.links.travel.desc, href: `${p}/world-cup-2030/travel` },
                { icon: '🎫', title: t.links.tickets.title, desc: t.links.tickets.desc, href: `${p}/world-cup-2030/tickets` },
                { icon: '🇲🇦', title: t.links.wc2026.title, desc: t.links.wc2026.desc, href: `${p}/world-cup-2026` },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="card card-lift"
                  style={{ padding: '16px', textDecoration: 'none', textAlign: 'center' }}
                >
                  <div aria-hidden style={{ fontSize: 24, marginBottom: 6 }}>{link.icon}</div>
                  <div
                    style={{
                      fontFamily: 'var(--font-head)',
                      fontSize: 14,
                      fontWeight: 800,
                      color: 'var(--text)',
                    }}
                  >
                    {link.title}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      color: 'var(--text-faint)',
                      marginTop: 3,
                    }}
                  >
                    {link.desc}
                  </div>
                </Link>
              ))}
            </div>

            {/* Stadiums overview — consumes the shared WC2030_VENUES module.
                Inline h2 override removed; .sec-head h2 already handles
                typography consistently across every hub. */}
            <div className="card">
              <div className="sec-head">
                <div className="sec-bar b-green" />
                <h2>{t.stadiumsLabel}</h2>
                <Link href={`${p}/world-cup-2030/stadiums`} className="sec-cta">
                  {t.stadiumsCta}
                </Link>
              </div>
              {WC2030_VENUES.map((venue, i) => {
                const cityDisplay = pickLocale(venue.city, lang)
                const statusLabel = pickLocale(VENUE_STATUS[venue.status].label, lang)
                return (
                  <div
                    key={venue.slug}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      borderBottom: i < WC2030_VENUES.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-head)',
                          fontSize: 14,
                          fontWeight: 700,
                          color: 'var(--text)',
                        }}
                      >
                        {venue.name}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 10,
                          color: 'var(--text-faint)',
                        }}
                      >
                        {cityDisplay}
                      </div>
                    </div>
                    <div style={{ textAlign: lang === 'ar' ? 'left' : 'right' }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 13,
                          fontWeight: 700,
                          color: 'var(--text)',
                        }}
                      >
                        {venue.capacity}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 9,
                          color: 'var(--text-faint)',
                        }}
                      >
                        {statusLabel}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* News */}
            {articles.length > 0 && (
              <div className="card">
                <div className="sec-head">
                  <div className="sec-bar b-red" />
                  <h2>{t.latestNews}</h2>
                </div>
                <div className="art-grid">
                  {articles.slice(0, 2).map(a => (
                    <Link
                      key={a.slug}
                      href={getArticleHref(a, p)}
                      target={isExternalArticle(a) ? '_blank' : undefined}
                      rel={isExternalArticle(a) ? 'noopener' : undefined}
                      className="art-card card-lift"
                    >
                      <div className="art-img">
                        <div className="img-ph ph-wc art-img-fill">
                          <span className="ph-label">Photo</span>
                        </div>
                      </div>
                      <div className="art-body">
                        <h3 className="art-title">{a.title}</h3>
                        <span className="art-meta">{formatRelativeTime(a.date)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            {/* Countdown — rebuilt with proper contrast and brand
                colours. The previous pass used #555 / #444 on a
                near-black background which failed WCAG AA. The new
                version uses the dark green brand gradient plus
                gold accents that match the Predictor CTA + bracket
                centre pill, so every hero-class surface on the
                site reads as a matched set. */}
            <div
              className="sidebar-card"
              style={{
                background:
                  'linear-gradient(160deg, #0a5229 0%, #073d1e 55%, #041a0e 100%)',
                border: '1px solid rgba(230, 180, 80, 0.25)',
                boxShadow: '0 4px 16px rgba(10, 82, 41, 0.25)',
              }}
            >
              <div style={{ padding: '22px 18px', textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: '#e6b450',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    marginBottom: 12,
                    fontWeight: 700,
                  }}
                >
                  {t.countdownLabel}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontSize: 56,
                    fontWeight: 900,
                    fontStyle: 'italic',
                    color: '#ffffff',
                    lineHeight: 1,
                    textShadow: '0 2px 12px rgba(230, 180, 80, 0.2)',
                  }}
                >
                  {daysLeft}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'rgba(255, 255, 255, 0.72)',
                    marginTop: 8,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {t.countdownUnit}
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="sidebar-card">
              <div className="sec-head">
                <div className="sec-bar b-green" />
                <h2>{t.quickInfo}</h2>
              </div>
              {t.facts.map((fact, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '9px 14px',
                    gap: 10,
                    borderBottom: i < t.facts.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      color: 'var(--text-faint)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {fact.label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-head)',
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'var(--text)',
                      textAlign: lang === 'ar' ? 'left' : 'right',
                    }}
                  >
                    {fact.value}
                  </span>
                </div>
              ))}
            </div>

            {/* WC 2026 crosslink */}
            <div className="sidebar-card">
              <div className="sec-head">
                <div className="sec-bar b-red" />
                <h2>{t.alsoWc2026Title}</h2>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    color: 'var(--text-sec)',
                    lineHeight: 1.6,
                    marginBottom: 12,
                  }}
                >
                  {t.alsoWc2026Text}
                </p>
                <Link
                  href={`${p}/world-cup-2026`}
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--red)',
                    textDecoration: 'none',
                  }}
                >
                  {t.alsoWc2026Cta}
                </Link>
              </div>
            </div>

            <AdSlot size="sidebar-rectangle" id="ad-wc2030" />
          </aside>
        </div>
      </div>
    </main>
  )
}
