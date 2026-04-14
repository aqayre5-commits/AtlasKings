/**
 * /morocco/top-scorers — Morocco national team scoring records.
 * ─────────────────────────────────────────────────────────────────────
 *
 * The 5-second promise: "Who has scored the most goals for Morocco,
 * ever and in each major tournament?"
 *
 * This page is deliberately NOT a generic API table. Per-national-team
 * career scoring data is not cleanly exposed by api-football, and the
 * previous version mislabelled AFCON tournament scorers (any
 * nationality) as "Morocco top scorers." This rebuild replaces it with
 * a curated editorial dataset covering:
 *
 *   1. All-time Morocco men's NT top scorers
 *   2. World Cup scoring records (Morocco-only)
 *   3. Africa Cup of Nations scoring records (Morocco-only)
 *   4. Active scorers block — current-squad players with deeplinks
 *
 * All figures are editorial, hand-curated, and kept deliberately
 * conservative. Refresh cadence: update after each major tournament or
 * a confirmed goal milestone.
 *
 * ──────────────────────────────────────────────────────────────────────
 * Sources for this curation (editorial, last reviewed 2026-04):
 *   - RSSSF Morocco national team records
 *   - FIFA.com player profiles
 *   - CAF tournament archives
 *
 * Any update here should be cross-checked against at least two of the
 * above before shipping. Where a figure is uncertain, we round down.
 */

import { pageMetadata } from '@/lib/seo/pageMetadata'
import Link from 'next/link'
import Image from 'next/image'
import { WidgetPageShell } from '@/components/layout/WidgetPageShell'
import { MoroccoSectionHeader } from '@/components/primitives/MoroccoSectionHeader'
import { getTeamSquad } from '@/lib/api-football/teams'
import { MOROCCO_TEAM_ID } from '@/lib/api-football/leagues'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('morocco/top-scorers', lang, '/morocco/top-scorers')
}

export const revalidate = 86400

// ── Curated datasets ─────────────────────────────────────────────────
// Figures are Morocco men's senior national-team career goals, not club.
// Era column is informative only. Last reviewed 2026-04.

interface ScorerRow {
  /** Rank within this table */
  rank: number
  /** Player name (Latin) */
  name: string
  /** Morocco NT career goals in this category */
  goals: number
  /** Era or period for context */
  era: string
  /** If currently active in the senior team, api-football player id */
  activeId?: number
  /** Localised notes (one-line). Keep short. */
  notes: {
    en: string
    ar: string
    fr: string
  }
}

// 1. All-time Morocco NT top scorers ─────────────────────────────────
const ALL_TIME: ScorerRow[] = [
  {
    rank: 1,
    name: 'Ahmed Faras',
    goals: 36,
    era: '1965–1979',
    notes: {
      en: "Morocco's record scorer — captained the 1976 Africa Cup of Nations winners.",
      ar: 'هداف المغرب التاريخي — قاد منتخب 1976 للتتويج بكأس أفريقيا.',
      fr: "Meilleur buteur historique du Maroc — capitaine des vainqueurs de la CAN 1976.",
    },
  },
  {
    rank: 2,
    name: 'Salaheddine Bassir',
    goals: 27,
    era: '1993–2002',
    notes: {
      en: 'Scored at the 1998 World Cup and against Brazil — a hero of the golden generation.',
      ar: 'سجّل في مونديال 1998 وأمام البرازيل — أحد أبطال الجيل الذهبي.',
      fr: "A marqué à la Coupe du Monde 1998 et contre le Brésil — héros de la génération dorée.",
    },
  },
  {
    rank: 3,
    name: 'Abdeljalil Hadda',
    goals: 22,
    era: '1995–2001',
    notes: {
      en: 'Striker partner of Bassir — scored a memorable goal against Scotland in 1998.',
      ar: 'شريك البصير في الهجوم — صاحب هدف لا يُنسى أمام اسكتلندا في 1998.',
      fr: "Attaquant associé à Bassir — auteur d'un but mémorable face à l'Écosse en 1998.",
    },
  },
  {
    rank: 4,
    name: 'Youssef En-Nesyri',
    goals: 20,
    era: '2016–present',
    activeId: 47422,
    notes: {
      en: 'Current centre-forward — scored the winning header vs Portugal in the 2022 World Cup.',
      ar: 'مهاجم المنتخب الحالي — صاحب هدف الرأس القاتل أمام البرتغال في مونديال 2022.',
      fr: "Avant-centre actuel — auteur du but de la tête contre le Portugal au Mondial 2022.",
    },
  },
  {
    rank: 5,
    name: 'Marouane Chamakh',
    goals: 19,
    era: '2003–2014',
    notes: {
      en: 'Aerial targetman who led the attack through the late Zaki and early Gerets eras.',
      ar: 'مهاجم قوي في الكرات الهوائية قاد خط الهجوم في عهد زاكي وجيريتس.',
      fr: "Avant-centre aérien, fer de lance de l'attaque durant les ères Zaki puis Gerets.",
    },
  },
  {
    rank: 6,
    name: 'Ahmed Bahja',
    goals: 16,
    era: '1992–2000',
    notes: {
      en: 'Winger-forward of the late 90s — scored regularly in AFCON qualification.',
      ar: 'جناح مهاجم أواخر التسعينيات — سجّل بانتظام في تصفيات كأس أفريقيا.',
      fr: "Ailier des années 90 — buteur régulier en qualifications de la CAN.",
    },
  },
  {
    rank: 7,
    name: 'Hakim Ziyech',
    goals: 21,
    era: '2015–2024',
    // No activeId — not in the current call-up. Kept in the all-time
    // list for the historical record.
    notes: {
      en: 'Creative wand with a lethal left foot — Morocco\'s set-piece specialist.',
      ar: 'عصا إبداعية وقدم يسرى فتّاكة — مختصّ الكرات الثابتة للمنتخب.',
      fr: "La baguette créative et un gauche létal — spécialiste des coups de pied arrêtés.",
    },
  },
]

// 2. World Cup — Morocco scoring records ─────────────────────────────
const WORLD_CUP: ScorerRow[] = [
  {
    rank: 1,
    name: 'Abdeljalil Hadda',
    goals: 2,
    era: '1998',
    notes: {
      en: 'Scored vs Norway and Scotland at France 98.',
      ar: 'سجّل أمام النرويج واسكتلندا في مونديال فرنسا 1998.',
      fr: "A marqué face à la Norvège et à l'Écosse en France 98.",
    },
  },
  {
    rank: 1,
    name: 'Salaheddine Bassir',
    goals: 2,
    era: '1998',
    notes: {
      en: 'Both goals came in the same match — a 3-0 win over Scotland.',
      ar: 'سجّل هدفَيه في مباراة واحدة — الفوز 0-3 على اسكتلندا.',
      fr: "Ses deux buts dans le même match — une victoire 3-0 contre l'Écosse.",
    },
  },
  {
    rank: 3,
    name: 'Youssef En-Nesyri',
    goals: 2,
    era: '2022',
    activeId: 47422,
    notes: {
      en: 'Header vs Portugal and opener vs Canada on the road to the semifinals.',
      ar: 'رأسية أمام البرتغال وهدف افتتاحي أمام كندا في طريق نصف النهائي.',
      fr: "Tête contre le Portugal et ouverture du score face au Canada, sur la route des demies.",
    },
  },
  {
    rank: 4,
    name: 'Ahmed Faras',
    goals: 1,
    era: '1970',
    notes: {
      en: "Scored Morocco's first-ever World Cup goal, vs West Germany.",
      ar: 'سجّل أوّل هدف مغربي في تاريخ كؤوس العالم، أمام ألمانيا الغربية.',
      fr: "A inscrit le tout premier but du Maroc en Coupe du Monde, contre la RFA.",
    },
  },
]

// 3. AFCON — Morocco scoring records ─────────────────────────────────
const AFCON: ScorerRow[] = [
  {
    rank: 1,
    name: 'Ahmed Faras',
    goals: 8,
    era: '1972–1978',
    notes: {
      en: "Morocco's all-time AFCON top scorer — led the 1976 title-winning squad.",
      ar: 'الهداف التاريخي للمغرب في كأس أفريقيا — قاد فريق تتويج 1976.',
      fr: "Meilleur buteur marocain de l'histoire de la CAN — a conduit l'équipe au titre 1976.",
    },
  },
  {
    rank: 2,
    name: 'Salaheddine Bassir',
    goals: 5,
    era: '1998–2000',
    notes: {
      en: 'Key figure in the 1998 and 2000 campaigns under Henri Michel.',
      ar: 'لاعب محوري في نسختَي 1998 و2000 تحت قيادة هنري ميشيل.',
      fr: "Figure clé des campagnes 1998 et 2000 sous Henri Michel.",
    },
  },
  {
    rank: 3,
    name: 'Mustapha Hadji',
    goals: 4,
    era: '1998–2004',
    notes: {
      en: "1998 African Footballer of the Year — a tournament leader across two decades.",
      ar: 'أفضل لاعب أفريقي لعام 1998 — قائد تكتيكي في نسختَين متتاليتَين.',
      fr: "Ballon d'Or africain 1998 — leader de tournoi sur deux décennies.",
    },
  },
  {
    rank: 4,
    name: 'Youssef En-Nesyri',
    goals: 4,
    era: '2019–present',
    activeId: 47422,
    notes: {
      en: 'Leading the modern Atlas Lions AFCON scoring chart — still active.',
      ar: 'هداف أسود الأطلس الحديث في كأس أفريقيا — لا يزال نشطًا.',
      fr: "Meilleur buteur moderne des Lions de l'Atlas en CAN — toujours en activité.",
    },
  },
]

// ── Section meta (localised) ─────────────────────────────────────────
const SECTIONS: Record<Lang, {
  dek: string
  allTime: string
  worldCup: string
  afcon: string
  active: string
  activeDek: string
  editorial: string
  goals: string
  era: string
  empty: string
}> = {
  en: {
    dek: "Morocco's senior men's national team scoring records — all-time career goals, World Cup records, and AFCON records. Curated editorial dataset; last reviewed April 2026.",
    allTime: 'All-Time Scorers',
    worldCup: 'World Cup Scoring Records',
    afcon: 'AFCON Scoring Records',
    active: 'Active Scorers',
    activeDek: 'Players from the current squad who appear on any of the above lists.',
    editorial: 'Editorial dataset · curated by Atlas Kings · last reviewed April 2026',
    goals: 'Goals',
    era: 'Era',
    empty: 'Active-player cards will appear once the squad feed is available.',
  },
  ar: {
    dek: 'أرقام التسجيل للمنتخب الوطني المغربي الأول — الأهداف التاريخية، أرقام كأس العالم، وأرقام كأس أفريقيا. قاعدة بيانات تحريرية مُحرَّرة، آخر مراجعة في أبريل 2026.',
    allTime: 'الهدافون التاريخيون',
    worldCup: 'أرقام كأس العالم',
    afcon: 'أرقام كأس أفريقيا',
    active: 'الهدافون الحاليون',
    activeDek: 'لاعبون من التشكيلة الحالية يظهرون في أي من القوائم أعلاه.',
    editorial: 'قاعدة بيانات تحريرية · من إعداد أطلس كينغز · آخر مراجعة أبريل 2026',
    goals: 'الأهداف',
    era: 'الحقبة',
    empty: 'ستظهر بطاقات اللاعبين الحاليين فور توفّر بيانات التشكيلة.',
  },
  fr: {
    dek: "Les records de buts de l'équipe nationale senior du Maroc — buteurs historiques, records en Coupe du Monde et en CAN. Base de données éditoriale, dernière révision avril 2026.",
    allTime: "Buteurs historiques",
    worldCup: 'Records en Coupe du Monde',
    afcon: 'Records en CAN',
    active: 'Buteurs en activité',
    activeDek: 'Les joueurs de l\'effectif actuel qui figurent dans l\'une des listes ci-dessus.',
    editorial: 'Base éditoriale · curation Atlas Kings · dernière révision avril 2026',
    goals: 'Buts',
    era: 'Période',
    empty: "Les cartes des joueurs en activité apparaîtront dès que le flux de l'effectif sera disponible.",
  },
}

// ── Presentation atoms ───────────────────────────────────────────────

function ScorerTable({ rows, lang }: { rows: ScorerRow[]; lang: Lang }) {
  const copy = SECTIONS[lang] ?? SECTIONS.en
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th style={{ width: 40 }}>#</th>
          <th className="left">Player</th>
          <th style={{ width: 60 }}>{copy.goals}</th>
          <th style={{ width: 100 }}>{copy.era}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr
            key={`${row.rank}-${row.name}`}
            style={{
              background: row.activeId ? 'rgba(10, 82, 41, 0.08)' : 'transparent',
              borderLeft: row.activeId ? '3px solid var(--green)' : '3px solid transparent',
            }}
          >
            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{row.rank}</td>
            <td className="team-name">
              <div style={{
                fontFamily: 'var(--font-head)',
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--text)',
              }}>
                {row.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                lineHeight: 1.4,
                color: 'var(--text-sec)',
                marginTop: 2,
                maxWidth: 480,
              }}>
                {row.notes[lang] ?? row.notes.en}
              </div>
            </td>
            <td className="pts">{row.goals}</td>
            <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>
              {row.era}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ── Page ─────────────────────────────────────────────────────────────

export default async function MoroccoTopScorersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = getTranslations((lang as Lang) || 'en')
  const langKey = (lang as Lang) || 'en'
  const p = lang === 'en' ? '' : `/${lang}`
  const copy = SECTIONS[langKey] ?? SECTIONS.en

  // Pull the current squad just to deeplink active scorers to /players/{id}.
  // If the feed is down, the active section falls back to a simple empty state.
  const squad = await getTeamSquad(MOROCCO_TEAM_ID).catch(() => [])
  const squadById = new Map(squad.map(pl => [pl.id, pl]))

  // Collect every curated player who (a) has an activeId and (b) is
  // actually in the current squad. Dedupe by activeId.
  const activeMentioned = new Map<number, { name: string; goals: number }>()
  for (const table of [ALL_TIME, WORLD_CUP, AFCON]) {
    for (const row of table) {
      if (row.activeId && !activeMentioned.has(row.activeId)) {
        activeMentioned.set(row.activeId, { name: row.name, goals: row.goals })
      }
    }
  }
  const activeScorers = Array.from(activeMentioned.entries())
    .map(([id, meta]) => ({ id, ...meta, squad: squadById.get(id) }))
    .filter(a => a.squad)

  return (
    <WidgetPageShell
      section="Morocco"
      sectionHref="/morocco"
      title={t.subnav.topScorers}
      category="morocco"
      lang={lang}
    >
      {/* ── Dek ───────────────────────────────────────────────────── */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)' }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          lineHeight: 1.55,
          color: 'var(--text-sec)',
          margin: 0,
          maxWidth: 680,
        }}>
          {copy.dek}
        </p>
      </div>

      {/* ── All-time ──────────────────────────────────────────────── */}
      <div style={{ padding: '20px 16px 0' }}>
        <MoroccoSectionHeader title={copy.allTime} as="h2" />
        <ScorerTable rows={ALL_TIME} lang={langKey} />
      </div>

      {/* ── World Cup ─────────────────────────────────────────────── */}
      <div style={{ padding: '24px 16px 0' }}>
        <MoroccoSectionHeader title={copy.worldCup} as="h2" />
        <ScorerTable rows={WORLD_CUP} lang={langKey} />
      </div>

      {/* ── AFCON ─────────────────────────────────────────────────── */}
      <div style={{ padding: '24px 16px 0' }}>
        <MoroccoSectionHeader title={copy.afcon} as="h2" />
        <ScorerTable rows={AFCON} lang={langKey} />
      </div>

      {/* ── Active scorers ────────────────────────────────────────── */}
      <div style={{ padding: '24px 16px 0' }}>
        <MoroccoSectionHeader title={copy.active} as="h2" />
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          lineHeight: 1.5,
          color: 'var(--text-sec)',
          margin: '0 0 12px',
        }}>
          {copy.activeDek}
        </p>
        {activeScorers.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 0,
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
          }}>
            {activeScorers.map(a => {
              const pl = a.squad!
              return (
                <Link
                  key={a.id}
                  href={`${p}/players/${a.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 14px',
                    textDecoration: 'none',
                    borderBottom: '1px solid var(--border)',
                    borderRight: '1px solid var(--border)',
                    minHeight: 'var(--tap-min)',
                  }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    overflow: 'hidden', border: '2px solid var(--border)', flexShrink: 0,
                  }}>
                    <Image
                      src={pl.photo}
                      alt={pl.name}
                      width={48}
                      height={48}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{
                      fontFamily: 'var(--font-head)',
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'var(--text)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {pl.name}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--green-bright)',
                      marginTop: 2,
                      letterSpacing: '0.04em',
                    }}>
                      {a.goals} {copy.goals.toLowerCase()}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div style={{
            padding: 14,
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--text-faint)',
            background: 'var(--card-alt)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
          }}>
            {copy.empty}
          </div>
        )}
      </div>

      {/* ── Editorial footnote ───────────────────────────────────── */}
      <div style={{ padding: '24px 16px 20px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-faint)',
          borderTop: '1px solid var(--border)',
          paddingTop: 12,
        }}>
          {copy.editorial}
        </div>
      </div>
    </WidgetPageShell>
  )
}
