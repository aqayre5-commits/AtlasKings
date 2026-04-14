/**
 * /world-cup-2030/stadiums — Morocco's six WC 2030 venues.
 * ─────────────────────────────────────────────────────────────────────
 *
 * Phase B.1 rebuild (§6, flagship).
 *
 * What changed vs the previous `'use client'` version:
 *   - Server component — no client JS for the content, SSR'd HTML
 *   - Venue dataset lifted into lib/data/wc2030Venues.ts (shared module)
 *   - `generateMetadata` with localised title/description
 *   - Breadcrumb via shared <Breadcrumb> primitive
 *   - Jump-to-stadium anchor TOC at the top of the content
 *   - Each stadium section carries a stable anchor id (venue.slug)
 *   - Per-venue <Place / StadiumOrArena> JSON-LD (6 scripts)
 *   - Bottom-of-page WC 2030 coverage rail (single shared rail, not
 *     per-stadium) pulling from the 'world-cup' article section
 *
 * Phase B.2 adds full AR/FR body translations for all 6 venues. Every
 * language-facing field (facts, story, architecture, matchday,
 * getting-there, match schedule, badge, capacity note, city display,
 * status label) now reads from the current page locale via
 * pickLocale(). The yellow "currently in English" banner is gone on
 * AR/FR — those readers now get the same flagship experience as EN.
 *
 * Per-venue Place / StadiumOrArena JSON-LD is now emitted in the page
 * locale via venueJsonLd(venue, langKey), matching the FAQPage JSON-LD
 * pattern shipped on /world-cup-2030/tickets.
 */

import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { StoryCard } from '@/components/cards/StoryCard'
import { pageMetadata } from '@/lib/seo/pageMetadata'
import { getArticlesForSectionAsync } from '@/lib/articles/getArticles'
import {
  WC2030_VENUES,
  VENUE_STATUS,
  venueJsonLd,
  pickLocale,
  type WC2030Venue,
} from '@/lib/data/wc2030Venues'
import type { Lang } from '@/lib/i18n/config'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return pageMetadata('world-cup-2030/stadiums', lang, '/world-cup-2030/stadiums')
}

export const revalidate = 86400 // static content — daily refresh is plenty

// ── Chrome strings (labels, section titles, TOC, article-rail) ───────
// Body prose lives in wc2030Venues.ts and is now fully localised.
// These strings are the user-visible chrome.

interface StadiumCopy {
  venues: string
  pageTitle: string
  pageDesc: string
  capacity: string
  theStory: string
  architecture: string
  matchday: string
  gettingThere: string
  matchSchedule: string
  jumpToVenue: string
  backToTop: string
  coverage: string
  exploreCities: string
  ticketInfo: string
}

const STADIUM_T: Record<Lang, StadiumCopy> = {
  en: {
    venues: 'VENUES',
    pageTitle: "Morocco's Six World Cup Stadiums",
    pageDesc: 'Six stadiums across Morocco will host the African leg of the 2030 FIFA World Cup. From the 115,000-seat Grand Stade Hassan II in Casablanca to the Atlantic shores of Agadir, each venue tells a story of ambition, heritage, and world-class engineering. Here is the complete guide.',
    capacity: 'Capacity',
    theStory: 'THE STORY',
    architecture: 'ARCHITECTURE & DESIGN',
    matchday: 'MATCHDAY EXPERIENCE',
    gettingThere: 'GETTING THERE',
    matchSchedule: 'MATCH SCHEDULE',
    jumpToVenue: 'Jump to venue',
    backToTop: 'Back to top',
    coverage: 'WC 2030 Coverage',
    exploreCities: 'Explore the Cities',
    ticketInfo: 'Ticket Information',
  },
  ar: {
    venues: 'الملاعب',
    pageTitle: 'ملاعب كأس العالم الستة في المغرب',
    pageDesc: 'ستة ملاعب عبر المغرب ستستضيف الشق الأفريقي من كأس العالم 2030. من ملعب الحسن الثاني الكبير بسعة 115,000 مقعد في الدار البيضاء إلى شواطئ أكادير الأطلسية، كل ملعب يحمل قصة من الطموح والتراث والهندسة العالمية.',
    capacity: 'السعة',
    theStory: 'القصة',
    architecture: 'العمارة والتصميم',
    matchday: 'تجربة يوم المباراة',
    gettingThere: 'الوصول',
    matchSchedule: 'جدول المباريات',
    jumpToVenue: 'انتقل إلى الملعب',
    backToTop: 'العودة إلى الأعلى',
    coverage: 'تغطية مونديال 2030',
    exploreCities: 'اكتشف المدن',
    ticketInfo: 'معلومات التذاكر',
  },
  fr: {
    venues: 'ENCEINTES',
    pageTitle: 'Les six stades de la Coupe du Monde au Maroc',
    pageDesc: "Six stades à travers le Maroc accueilleront le volet africain de la Coupe du Monde FIFA 2030. Du Grand Stade Hassan II de 115 000 places à Casablanca aux rivages atlantiques d'Agadir, chaque enceinte raconte une histoire d'ambition, de patrimoine et d'ingénierie de niveau mondial.",
    capacity: 'Capacité',
    theStory: "L'HISTOIRE",
    architecture: 'ARCHITECTURE & DESIGN',
    matchday: 'EXPÉRIENCE JOUR DE MATCH',
    gettingThere: 'COMMENT Y ACCÉDER',
    matchSchedule: 'CALENDRIER DES MATCHS',
    jumpToVenue: 'Aller au stade',
    backToTop: 'Retour en haut',
    coverage: 'Couverture CM 2030',
    exploreCities: 'Explorer les villes',
    ticketInfo: 'Informations billets',
  },
}

// ── Small status-pill helper ────────────────────────────────────────

function StatusPill({ venue, lang }: { venue: WC2030Venue; lang: Lang }) {
  const s = VENUE_STATUS[venue.status]
  const bg = s.color === '#22c55e' ? '#dcfce7' : s.color === '#eab308' ? '#fef9c3' : '#dbeafe'
  const fg = s.color === '#22c55e' ? '#15803d' : s.color === '#eab308' ? '#a16207' : '#1d4ed8'
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: fg,
        background: bg,
        padding: '3px 10px',
        borderRadius: 'var(--radius-sm)',
      }}
    >
      {s.emoji} {pickLocale(s.label, lang)}
    </span>
  )
}

// ── Page ─────────────────────────────────────────────────────────────

export default async function StadiumsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const langKey = (['en', 'ar', 'fr'].includes(lang) ? lang : 'en') as Lang
  const st = STADIUM_T[langKey]
  const dir = langKey === 'ar' ? 'rtl' : 'ltr'
  const p = langKey === 'en' ? '' : `/${langKey}`

  // Bottom-of-page coverage rail. Safe-fetches, never throws.
  const coverageArticles = await getArticlesForSectionAsync('world-cup', langKey, 4)

  return (
    <main dir={dir}>
      {/* Per-venue <Place / StadiumOrArena> JSON-LD — one script per venue,
          each emitted in the current page locale (description + inLanguage). */}
      {WC2030_VENUES.map(venue => (
        <script
          key={venue.slug}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(venueJsonLd(venue, langKey)) }}
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
            {st.pageTitle}
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
            {st.pageDesc}
          </p>
        </div>

        {/* ── Jump-to-venue anchor TOC ─────────────────────────────── */}
        <nav
          aria-label={st.jumpToVenue}
          data-stadium-toc
          style={{
            marginBottom: 56,
            padding: '16px 18px',
            background: 'var(--card-alt)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-faint)',
              marginBottom: 10,
            }}
          >
            {st.jumpToVenue}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {WC2030_VENUES.map(venue => (
              <a
                key={venue.slug}
                href={`#${venue.slug}`}
                style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: venue.accent,
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {pickLocale(venue.city, langKey)}
              </a>
            ))}
          </div>
        </nav>

        {/* ── Stadium cards ────────────────────────────────────────── */}
        {WC2030_VENUES.map((venue, i) => {
          // Pre-pick every localised field once per venue render. Keeps
          // the JSX readable and guarantees every body field switches
          // cleanly with the page locale.
          const cityDisplay = pickLocale(venue.city, langKey)
          const badgeLabel = pickLocale(venue.badge, langKey)
          const capacityNoteText = venue.capacityNote ? pickLocale(venue.capacityNote, langKey) : null
          const facts = pickLocale(venue.facts, langKey)
          const story = pickLocale(venue.story, langKey)
          const architecture = pickLocale(venue.architecture, langKey)
          const matchday = pickLocale(venue.matchday, langKey)
          const gettingThere = pickLocale(venue.gettingThere, langKey)
          const matchScheduleText = pickLocale(venue.matchSchedule, langKey)

          return (
          <section
            key={venue.slug}
            id={venue.slug}
            data-venue-slug={venue.slug}
            style={{
              marginBottom: 72,
              paddingBottom: 72,
              borderBottom: i < WC2030_VENUES.length - 1 ? '2px solid var(--border)' : 'none',
              scrollMarginTop: 100,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 20,
                marginBottom: 20,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                  <span aria-hidden style={{ fontSize: 28, lineHeight: 1 }}>🇲🇦</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#fff',
                      background: venue.badgeColor,
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {badgeLabel}
                  </span>
                  <StatusPill venue={venue} lang={langKey} />
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontSize: 30,
                    fontWeight: 800,
                    fontStyle: 'italic',
                    color: 'var(--text)',
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {venue.name}
                </h2>
                <div
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--text-faint)',
                  }}
                >
                  {cityDisplay}
                </div>
              </div>
              <div
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '18px 24px',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-sm)',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 36,
                    fontWeight: 700,
                    color: venue.accent,
                    lineHeight: 1,
                  }}
                >
                  {venue.capacity}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    color: 'var(--text-faint)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginTop: 4,
                  }}
                >
                  {st.capacity}
                </div>
                {capacityNoteText && (
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 11,
                      color: 'var(--text-faint)',
                      marginTop: 6,
                      lineHeight: 1.3,
                    }}
                  >
                    {capacityNoteText}
                  </div>
                )}
              </div>
            </div>

            {/* Stadium image */}
            {venue.venueId && (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 280,
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  marginBottom: 24,
                  border: '1px solid var(--border)',
                }}
              >
                <Image
                  src={`https://media.api-sports.io/football/venues/${venue.venueId}.png`}
                  alt={`${venue.name} stadium`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            )}

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
                marginBottom: 32,
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
                      lineHeight: 1.5,
                    }}
                  >
                    {fact.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Story */}
            <div style={{ marginBottom: 32 }}>
              <div className="sec-head" style={{ marginBottom: 6 }}>{st.theStory}</div>
              <div className="sec-bar" style={{ marginBottom: 16 }} />
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 16,
                  lineHeight: 1.85,
                  color: 'var(--text-sec)',
                }}
              >
                {story.map((para, j) => (
                  <p key={j} style={{ marginBottom: '1.4rem' }}>{para}</p>
                ))}
              </div>
            </div>

            {/* Architecture */}
            <div style={{ marginBottom: 32 }}>
              <div className="sec-head" style={{ marginBottom: 6 }}>{st.architecture}</div>
              <div className="sec-bar" style={{ marginBottom: 16 }} />
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 16,
                  lineHeight: 1.85,
                  color: 'var(--text-sec)',
                }}
              >
                {architecture.map((para, j) => (
                  <p key={j} style={{ marginBottom: '1.4rem' }}>{para}</p>
                ))}
              </div>
            </div>

            {/* Matchday */}
            <div style={{ marginBottom: 32 }}>
              <div className="sec-head" style={{ marginBottom: 6 }}>{st.matchday}</div>
              <div className="sec-bar" style={{ marginBottom: 16 }} />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 1,
                  background: 'var(--border)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {matchday.map(card => (
                  <div key={card.label} style={{ background: 'var(--card)', padding: '16px 20px' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-head)',
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: venue.accent,
                        marginBottom: 6,
                      }}
                    >
                      {card.label}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        color: 'var(--text-sec)',
                        lineHeight: 1.7,
                      }}
                    >
                      {card.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Getting There */}
            <div style={{ marginBottom: 32 }}>
              <div className="sec-head" style={{ marginBottom: 6 }}>{st.gettingThere}</div>
              <div className="sec-bar" style={{ marginBottom: 16 }} />
              <div
                style={{
                  background: 'var(--navy-light)',
                  border: '1px solid #c8d4f0',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                }}
              >
                {gettingThere.map((row, j) => (
                  <div
                    key={row.mode}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '140px 1fr',
                      gap: 0,
                      borderBottom: j < gettingThere.length - 1 ? '1px solid #c8d4f0' : 'none',
                    }}
                  >
                    <div
                      style={{
                        padding: '12px 16px',
                        fontFamily: 'var(--font-head)',
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: 'var(--navy)',
                      }}
                    >
                      {row.mode}
                    </div>
                    <div
                      style={{
                        padding: '12px 16px',
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        color: 'var(--text-sec)',
                        lineHeight: 1.6,
                        borderLeft: '1px solid #c8d4f0',
                      }}
                    >
                      {row.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Match schedule */}
            <div style={{ marginBottom: 16 }}>
              <div className="sec-head" style={{ marginBottom: 6 }}>{st.matchSchedule}</div>
              <div className="sec-bar" style={{ marginBottom: 16 }} />
              <div
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '16px 20px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <span aria-hidden style={{ fontSize: 20 }}>⚽</span>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    color: 'var(--text)',
                    lineHeight: 1.6,
                    fontWeight: 500,
                  }}
                >
                  {matchScheduleText}
                </div>
              </div>
            </div>

            {/* Back-to-top link — only on non-last venues so TOC is reachable */}
            {i < WC2030_VENUES.length - 1 && (
              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <a
                  href="#top"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--text-faint)',
                    textDecoration: 'none',
                  }}
                >
                  ↑ {st.backToTop}
                </a>
              </div>
            )}
          </section>
          )
        })}

        {/* ── WC 2030 coverage rail ────────────────────────────────── */}
        {coverageArticles.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <div className="sec-head" style={{ marginBottom: 6 }}>{st.coverage}</div>
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
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href={`${p}/world-cup-2030/cities`}
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
            {st.exploreCities} →
          </Link>
          <Link
            href={`${p}/world-cup-2030/tickets`}
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
            {st.ticketInfo} →
          </Link>
        </div>
      </div>
    </main>
  )
}
