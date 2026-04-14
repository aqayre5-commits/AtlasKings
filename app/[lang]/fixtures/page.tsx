/**
 * /[lang]/fixtures — date-aware global fixtures page
 * ─────────────────────────────────────────────────────────────────────
 *
 * Fully server-rendered. No client components, no hooks, no client fetches.
 * The only interactivity is day-prev / day-next navigation via normal
 * <Link>s that update the `?date=YYYY-MM-DD` query param.
 *
 * Data flow:
 *
 *   URL ?date=YYYY-MM-DD
 *     │
 *     ▼  (server-side validation)
 *   normalizeDate() — strict regex + real-date roundtrip check
 *     │
 *     ▼
 *   footballData.matchesByDate(iso)   ← cached 5min at the data layer
 *     │
 *     ▼
 *   group by competition display name
 *     │
 *     ▼
 *   <MatchCard variant="list-row" showLeague={false}>
 *
 * SEO:
 *   - Today's view lives at the clean canonical `/fixtures`.
 *   - Other dates live at `/fixtures?date=YYYY-MM-DD` and set that as their
 *     canonical alternate so Google indexes them without dup-URL penalties.
 *   - All dates are indexable and reachable via crawlable <Link>s.
 *
 * Progressive enhancement hook:
 *   The page surface is structured so a future client-side date picker can
 *   be layered on top by swapping the <DayNavLinks> block — the data
 *   contract (`footballData.matchesByDate(iso)`) doesn't change.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { WidgetPageShell } from '@/components/layout/WidgetPageShell'
import { MatchCard } from '@/components/primitives/MatchCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { footballData } from '@/lib/data/service'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'
import type { MatchData } from '@/lib/data/types'

// ── Date utilities (server-side only, pure functions) ──────────────────

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Strict server-side date validation.
 *
 * Rules:
 *   1. Missing, array, or non-string → today
 *   2. Fails YYYY-MM-DD regex → today
 *   3. Fails to parse as a real date → today
 *   4. Roundtrips to a different day (e.g. 2026-02-31 → 2026-03-03) → today
 *
 * This means the server can ONLY ever receive a date string it has proven
 * is well-formed, reducing downstream assumption surface.
 */
function normalizeDate(raw: string | string[] | undefined): string {
  if (!raw || Array.isArray(raw)) return todayISO()
  if (!DATE_REGEX.test(raw)) return todayISO()
  const parsed = new Date(`${raw}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return todayISO()
  const roundtrip = parsed.toISOString().split('T')[0]
  return roundtrip === raw ? raw : todayISO()
}

function shiftDate(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().split('T')[0]
}

/** Map our 3 supported langs to `Intl.DateTimeFormat` locales. */
function localeFor(lang: string): string {
  if (lang === 'ar') return 'ar-MA'
  if (lang === 'fr') return 'fr-FR'
  return 'en-GB'
}

function formatLongDate(iso: string, lang: string): string {
  // Use UTC to avoid any server-timezone drift when rendering the label.
  const d = new Date(`${iso}T12:00:00Z`)
  return d.toLocaleDateString(localeFor(lang), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

// ── Grouping (pure) ────────────────────────────────────────────────────

/**
 * Preserve insertion order of competitions as they come back from the
 * data service (footballData.matchesByDate fetches leagues in a fixed
 * priority). A Map is used so the rendered order is stable across reloads.
 */
function groupByCompetition(matches: MatchData[]): Array<[string, MatchData[]]> {
  const groups = new Map<string, MatchData[]>()
  for (const m of matches) {
    const name = m.competition
    const bucket = groups.get(name)
    if (bucket) bucket.push(m)
    else groups.set(name, [m])
  }
  return Array.from(groups.entries())
}

// ── Route params / metadata ────────────────────────────────────────────

interface PageProps {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ date?: string | string[] }>
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://atlaskings.com'

const META: Record<'en' | 'ar' | 'fr', { title: string; desc: string }> = {
  en: {
    title: 'Fixtures & Schedule',
    desc: 'Every fixture across Morocco, Botola Pro, Premier League, La Liga, Champions League and the World Cup — browse day-by-day.',
  },
  ar: {
    title: 'المباريات والجدول',
    desc: 'جميع مباريات المغرب، البطولة المحترفة، الدوري الإنجليزي، الليغا، دوري الأبطال وكأس العالم — تصفح يوما بيوم.',
  },
  fr: {
    title: 'Calendrier des matchs',
    desc: 'Tous les matchs du Maroc, de la Botola Pro, Premier League, La Liga, Ligue des Champions et Coupe du Monde — au jour le jour.',
  },
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const sp = await searchParams
  const date = normalizeDate(sp.date)
  const today = todayISO()
  const isToday = date === today

  const validLang = (['en', 'ar', 'fr'].includes(lang) ? lang : 'en') as 'en' | 'ar' | 'fr'
  const m = META[validLang]
  const prefix = lang === 'en' ? '' : `/${lang}`

  // Canonical URL: clean `/fixtures` for today, `?date=…` for other days.
  const canonicalPath = isToday ? `${prefix}/fixtures` : `${prefix}/fixtures?date=${date}`
  const pageTitle = isToday ? m.title : `${m.title} — ${date}`

  return {
    title: pageTitle,
    description: m.desc,
    alternates: {
      canonical: `${SITE_URL}${canonicalPath}`,
      languages: {
        en: isToday ? `${SITE_URL}/fixtures` : `${SITE_URL}/fixtures?date=${date}`,
        ar: isToday ? `${SITE_URL}/ar/fixtures` : `${SITE_URL}/ar/fixtures?date=${date}`,
        fr: isToday ? `${SITE_URL}/fr/fixtures` : `${SITE_URL}/fr/fixtures?date=${date}`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

// ── Day nav (server-rendered link pair) ────────────────────────────────

function dayHref(prefix: string, iso: string): string {
  // Today omits the query param so the canonical URL is clean.
  if (iso === todayISO()) return `${prefix}/fixtures`
  return `${prefix}/fixtures?date=${iso}`
}

function DayNavLinks({
  prefix,
  currentDate,
  lang,
}: {
  prefix: string
  currentDate: string
  lang: string
}) {
  const prev = shiftDate(currentDate, -1)
  const next = shiftDate(currentDate, 1)
  const isToday = currentDate === todayISO()
  const isRTL = lang === 'ar'

  // Localised labels for accessible arrows
  const labels =
    lang === 'ar'
      ? { prev: 'اليوم السابق', next: 'اليوم التالي', today: 'اليوم' }
      : lang === 'fr'
        ? { prev: 'Jour précédent', next: 'Jour suivant', today: "Aujourd'hui" }
        : { prev: 'Previous day', next: 'Next day', today: 'Today' }

  return (
    <nav
      aria-label={labels.prev + ' / ' + labels.next}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--card-alt)',
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      <Link
        href={dayHref(prefix, prev)}
        aria-label={`${labels.prev}: ${formatLongDate(prev, lang)}`}
        rel="prev"
        prefetch={false}
        style={{
          fontFamily: 'var(--font-head)',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--text-sec)',
          textDecoration: 'none',
          padding: '8px 12px',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--card)',
          minHeight: 'var(--tap-min)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span aria-hidden>{isRTL ? '→' : '←'}</span>
        {labels.prev}
      </Link>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 14,
            fontWeight: 800,
            color: 'var(--text)',
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
          }}
        >
          {formatLongDate(currentDate, lang)}
        </span>
        {isToday && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#ffffff',
              background: 'var(--green)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {labels.today}
          </span>
        )}
      </div>

      <Link
        href={dayHref(prefix, next)}
        aria-label={`${labels.next}: ${formatLongDate(next, lang)}`}
        rel="next"
        prefetch={false}
        style={{
          fontFamily: 'var(--font-head)',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--text-sec)',
          textDecoration: 'none',
          padding: '8px 12px',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--card)',
          minHeight: 'var(--tap-min)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {labels.next}
        <span aria-hidden>{isRTL ? '←' : '→'}</span>
      </Link>
    </nav>
  )
}

// ── Competition header (server-rendered) ───────────────────────────────

function CompetitionHeader({ name }: { name: string }) {
  return (
    <div
      style={{
        padding: '10px 16px',
        background: 'var(--score-bg)',
        borderBottom: '1px solid var(--border)',
        fontFamily: 'var(--font-head)',
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#ffffff',
      }}
    >
      {name}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────

export default async function FixturesPage({ params, searchParams }: PageProps) {
  const { lang } = await params
  const sp = await searchParams
  const validLang = (['en', 'ar', 'fr'].includes(lang) ? lang : 'en') as Lang
  const t = getTranslations(validLang)
  const s = t.sections
  const prefix = lang === 'en' ? '' : `/${lang}`

  const date = normalizeDate(sp.date)

  // Single call through the data service. Never throws, returns [] on failure.
  const matches = await footballData.matchesByDate(date)
  const groups = groupByCompetition(matches)

  return (
    <WidgetPageShell
      section={s.scoresAndFixtures}
      sectionHref="/scores"
      title={s.scoresAndFixtures}
      category="morocco"
      lang={lang}
    >
      <DayNavLinks prefix={prefix} currentDate={date} lang={lang} />

      {groups.length > 0 ? (
        groups.map(([competitionName, comp]) => (
          <section key={competitionName} aria-label={competitionName}>
            <CompetitionHeader name={competitionName} />
            {comp.map(match => (
              <MatchCard
                key={match.id}
                match={match}
                variant="list-row"
                langPrefix={prefix}
                showLeague={false}
              />
            ))}
          </section>
        ))
      ) : (
        <div style={{ padding: 40 }}>
          <EmptyState
            icon="⚽"
            title={s.scoresAndFixtures}
            description=""
          />
        </div>
      )}
    </WidgetPageShell>
  )
}
