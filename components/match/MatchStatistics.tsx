/**
 * <MatchStatistics> — native head-to-head stat comparison bars.
 *
 * Renders every stat type returned by `MatchDetail.statistics[]` as a
 * horizontal comparison row: home value on the left, away value on the
 * right, and a split bar showing the relative share between them.
 *
 * Handles percentages ("64%"), integers, and nulls. Generic over stat
 * names — does not hardcode a fixed list, so WC / domestic league
 * matches with different stat dictionaries render equivalently.
 *
 * Empty state: polished "Stats available once the match starts"
 * placeholder so pre-match pages still feel complete.
 *
 * Pure server component.
 */

import type { MatchDetail } from '@/lib/data/types'
import type { Lang } from '@/lib/i18n/config'

// ── Types ────────────────────────────────────────────────────────────────

interface Props {
  match: MatchDetail
  lang?: Lang
}

type StatValue = number | string | null

interface NormalizedStat {
  label: string
  homeValue: StatValue
  awayValue: StatValue
  homeNumeric: number
  awayNumeric: number
}

// ── Localized labels ────────────────────────────────────────────────────

const LABELS: Record<Lang, {
  title: string
  emptyTitle: string
  emptyDesc: string
}> = {
  en: {
    title: 'Match Stats',
    emptyTitle: 'Stats not yet available',
    emptyDesc: 'Match statistics will appear once the game is underway.',
  },
  ar: {
    title: 'إحصائيات المباراة',
    emptyTitle: 'الإحصائيات غير متاحة بعد',
    emptyDesc: 'ستظهر إحصائيات المباراة بمجرد بدء اللعب.',
  },
  fr: {
    title: 'Statistiques',
    emptyTitle: 'Statistiques pas encore disponibles',
    emptyDesc: "Les statistiques apparaîtront une fois que le match aura commencé.",
  },
}

// ── Stat name localization ──────────────────────────────────────────────
//
// API-Football returns English stat names. For AR/FR we translate the
// most common labels; unknown labels fall through untranslated (better
// than blanking them).

const STAT_NAME_I18N: Record<string, { ar: string; fr: string }> = {
  'Ball Possession':    { ar: 'الاستحواذ', fr: 'Possession' },
  'Total Shots':        { ar: 'إجمالي التسديدات', fr: 'Tirs' },
  'Shots on Goal':      { ar: 'تسديدات على المرمى', fr: 'Tirs cadrés' },
  'Shots off Goal':     { ar: 'تسديدات خارج المرمى', fr: 'Tirs non cadrés' },
  'Shots insidebox':    { ar: 'تسديدات من داخل المنطقة', fr: 'Tirs dans la surface' },
  'Shots outsidebox':   { ar: 'تسديدات من خارج المنطقة', fr: 'Tirs hors surface' },
  'Blocked Shots':      { ar: 'تسديدات محجوبة', fr: 'Tirs bloqués' },
  'Fouls':              { ar: 'الأخطاء', fr: 'Fautes' },
  'Corner Kicks':       { ar: 'الركنيات', fr: 'Corners' },
  'Offsides':           { ar: 'التسللات', fr: 'Hors-jeux' },
  'Yellow Cards':       { ar: 'البطاقات الصفراء', fr: 'Cartons jaunes' },
  'Red Cards':          { ar: 'البطاقات الحمراء', fr: 'Cartons rouges' },
  'Goalkeeper Saves':   { ar: 'تصديات الحارس', fr: 'Arrêts' },
  'Total passes':       { ar: 'إجمالي التمريرات', fr: 'Passes' },
  'Passes accurate':    { ar: 'تمريرات دقيقة', fr: 'Passes réussies' },
  'Passes %':           { ar: 'نسبة التمريرات', fr: '% de passes' },
  'expected_goals':     { ar: 'الأهداف المتوقعة', fr: 'xG' },
}

function localizeStatName(englishName: string, lang: Lang): string {
  if (lang === 'en') return englishName
  const entry = STAT_NAME_I18N[englishName]
  if (!entry) return englishName
  return entry[lang]
}

// ── Normalizer ──────────────────────────────────────────────────────────

function toNumeric(value: StatValue): number {
  if (value == null) return 0
  if (typeof value === 'number') return value
  const cleaned = String(value).replace('%', '').trim()
  const parsed = parseFloat(cleaned)
  return Number.isFinite(parsed) ? parsed : 0
}

function formatDisplay(value: StatValue): string {
  if (value == null) return '0'
  return String(value)
}

function normalizeStats(match: MatchDetail, lang: Lang): NormalizedStat[] {
  const stats = match.statistics ?? []
  if (stats.length < 2) return []

  const [homeTeam, awayTeam] = stats
  if (!homeTeam.statistics || !awayTeam.statistics) return []

  // Build a map keyed by stat type so we can align home vs away even if
  // one side omits a field.
  const byType = new Map<string, { home: StatValue; away: StatValue }>()

  for (const stat of homeTeam.statistics) {
    byType.set(stat.type, { home: stat.value, away: null })
  }
  for (const stat of awayTeam.statistics) {
    const existing = byType.get(stat.type)
    if (existing) {
      existing.away = stat.value
    } else {
      byType.set(stat.type, { home: null, away: stat.value })
    }
  }

  return Array.from(byType.entries()).map(([type, values]) => ({
    label: localizeStatName(type, lang),
    homeValue: values.home,
    awayValue: values.away,
    homeNumeric: toNumeric(values.home),
    awayNumeric: toNumeric(values.away),
  }))
}

// ── Component ───────────────────────────────────────────────────────────

export function MatchStatistics({ match, lang = 'en' }: Props) {
  const L = LABELS[lang] ?? LABELS.en
  const rows = normalizeStats(match, lang)

  return (
    <section
      aria-label={L.title}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      {/* Section header */}
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--card-alt)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text)',
            margin: 0,
          }}
        >
          {L.title}
        </h2>
      </div>

      {rows.length === 0 ? (
        <EmptyPlaceholder title={L.emptyTitle} description={L.emptyDesc} />
      ) : (
        <div style={{ padding: '14px 18px 18px' }}>
          {rows.map((row, i) => (
            <StatRow key={`${row.label}-${i}`} row={row} />
          ))}
        </div>
      )}
    </section>
  )
}

// ── Subcomponents ───────────────────────────────────────────────────────

function StatRow({ row }: { row: NormalizedStat }) {
  const total = row.homeNumeric + row.awayNumeric
  const homePct = total > 0 ? (row.homeNumeric / total) * 100 : 50
  const awayPct = total > 0 ? (row.awayNumeric / total) * 100 : 50

  return (
    <div
      style={{
        marginBottom: 14,
      }}
    >
      {/* Value row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 6,
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--text)',
        }}
      >
        <span style={{ flex: 1, textAlign: 'left' }}>{formatDisplay(row.homeValue)}</span>
        <span
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-sec)',
            padding: '0 12px',
            whiteSpace: 'nowrap',
          }}
        >
          {row.label}
        </span>
        <span style={{ flex: 1, textAlign: 'right' }}>{formatDisplay(row.awayValue)}</span>
      </div>

      {/* Comparison bar */}
      <div
        aria-hidden
        style={{
          display: 'flex',
          height: 4,
          borderRadius: 2,
          overflow: 'hidden',
          background: 'var(--border)',
        }}
      >
        <div
          style={{
            width: `${homePct}%`,
            background: 'var(--green)',
            transition: 'width 0.2s ease',
          }}
        />
        <div
          style={{
            width: `${awayPct}%`,
            background: 'var(--navy)',
            transition: 'width 0.2s ease',
          }}
        />
      </div>
    </div>
  )
}

function EmptyPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div
      style={{
        padding: '36px 20px',
        textAlign: 'center',
      }}
    >
      <div
        aria-hidden
        style={{
          fontSize: 28,
          marginBottom: 10,
          opacity: 0.5,
        }}
      >
        📊
      </div>
      <div
        style={{
          fontFamily: 'var(--font-head)',
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--text)',
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          color: 'var(--text-sec)',
          maxWidth: 360,
          margin: '0 auto',
          lineHeight: 1.5,
        }}
      >
        {description}
      </div>
    </div>
  )
}
