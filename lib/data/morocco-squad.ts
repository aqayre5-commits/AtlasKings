/**
 * Morocco WC 2026 — Predicted 26-man squad data.
 *
 * Phase 1: all static, hardcoded. Phase 3 will join these records
 * against API-Football live data for form dots and season stats.
 *
 * Sources: Goal.com (Mar 9, 2026), api-football, editorial analysis.
 * Predicted 26 from a pool of 38+ players currently in contention.
 *
 * Status tiers:
 *   CERTAIN — automatic barring injury
 *   LIKELY  — strong form, expected to go
 *   BUBBLE  — fighting for last spots
 *   DOUBT   — injured, out of form, or recently dropped
 */

// ─── Types ─────────────────────────────────────────────────────

export type SquadStatus = 'CERTAIN' | 'LIKELY' | 'BUBBLE' | 'DOUBT'
export type PositionGroup = 'GK' | 'DEF' | 'MID' | 'FWD'

export type FormResult = 'W' | 'D' | 'L'

export interface SquadPlayer {
  name: string
  age: number
  caps: number
  club: string
  league: string
  country: string          // club country flag emoji
  position: PositionGroup
  status: SquadStatus
  /** API-Football player ID for photo/stats join. */
  apiId?: number
  /** Last 5 club match results (most recent first). Updated weekly. */
  form?: FormResult[]
  /** Optional viral one-liner for share graphics (Phase 5). */
  narrativeHook?: { en: string; ar: string; fr: string }
  en: { role: string; blurb: string }
  ar: { role: string; blurb: string }
  fr: { role: string; blurb: string }
}

// ─── Status config ─────────────────────────────────────────────

export const STATUS_CONFIG: Record<
  SquadStatus,
  { emoji: string; color: string; tint: string; label: { en: string; ar: string; fr: string } }
> = {
  CERTAIN: {
    emoji: '\u2705',
    color: '#006233',
    tint: '#f0fdf4',
    label: { en: 'Certain', ar: '\u0645\u0634\u0627\u0631\u0643 \u0628\u0627\u0644\u062A\u0623\u0643\u064A\u062F', fr: 'Certain' },
  },
  LIKELY: {
    emoji: '\uD83D\uDFE1',
    color: '#B8820A',
    tint: '#fffbeb',
    label: { en: 'Likely', ar: '\u0645\u062D\u062A\u0645\u0644', fr: 'Probable' },
  },
  BUBBLE: {
    emoji: '\uD83D\uDFE0',
    color: '#D97706',
    tint: '#fff7ed',
    label: { en: 'Bubble', ar: '\u0639\u0644\u0649 \u0627\u0644\u062D\u0627\u0641\u0629', fr: 'Dans le doute' },
  },
  DOUBT: {
    emoji: '\u274C',
    color: '#6B7280',
    tint: '#ffffff',
    label: { en: 'Doubt', ar: '\u0645\u0634\u0643\u0648\u0643 \u0641\u064A\u0647', fr: 'Incertain' },
  },
}

/** Top-border accent colors for stats bar pills. */
export const STAT_ACCENTS = ['#c1121f', '#B8820A', '#006233', '#c1121f']

// ─── Position groups ───────────────────────────────────────────

export const POSITION_GROUPS: {
  key: PositionGroup
  label: { en: string; ar: string; fr: string }
}[] = [
  { key: 'GK', label: { en: 'Goalkeepers', ar: '\u062D\u0631\u0627\u0633 \u0627\u0644\u0645\u0631\u0645\u0649', fr: 'Gardiens' } },
  { key: 'DEF', label: { en: 'Defenders', ar: '\u0627\u0644\u0645\u062F\u0627\u0641\u0639\u0648\u0646', fr: 'Defenseurs' } },
  { key: 'MID', label: { en: 'Midfielders', ar: '\u0644\u0627\u0639\u0628\u0648 \u0627\u0644\u0648\u0633\u0637', fr: 'Milieux' } },
  { key: 'FWD', label: { en: 'Forwards', ar: '\u0627\u0644\u0645\u0647\u0627\u062C\u0645\u0648\u0646', fr: 'Attaquants' } },
]

// ─── Aggregate stats bar ───────────────────────────────────────

export const SQUAD_STATS: { value: string; label: { en: string; ar: string; fr: string } }[] = [
  { value: '26', label: { en: 'Predicted Squad', ar: '\u0627\u0644\u062A\u0634\u0643\u064A\u0644\u0629 \u0627\u0644\u0645\u062A\u0648\u0642\u0639\u0629', fr: 'Effectif prevu' } },
  { value: '38+', label: { en: 'In Contention', ar: '\u0641\u064A \u0627\u0644\u0633\u0628\u0627\u0642', fr: 'En lice' } },
  { value: '~\u20AC680M', label: { en: 'Squad Value', ar: '\u0642\u064A\u0645\u0629 \u0627\u0644\u062A\u0634\u0643\u064A\u0644\u0629', fr: 'Valeur effectif' } },
  { value: '14', label: { en: 'Leagues', ar: '\u062F\u0648\u0631\u064A', fr: 'Championnats' } },
]

// ─── Group C fixtures (static) ─────────────────────────────────

export const GROUP_C_FIXTURES: {
  opponent: string
  opponentCode: string
  date: string
  city: string
}[] = [
  { opponent: 'Brazil', opponentCode: 'BRA', date: 'Jun 15', city: 'Philadelphia' },
  { opponent: 'Scotland', opponentCode: 'SCO', date: 'Jun 20', city: 'Atlanta' },
  { opponent: 'Haiti', opponentCode: 'HAI', date: 'Jun 24', city: 'Dallas' },
]

// ─── Starting XI formation (4-3-3) ─────────────────────────────
// Coordinates as percentages of pitch width/height for SVG layout.
// anchorId matches the player card id in the grid for tap-to-jump.

export interface FormationPlayer {
  name: string
  anchorId: string
  position: 'GK' | 'DEF' | 'MID' | 'FWD'
  x: number  // % from left
  y: number  // % from top
  status: SquadStatus
  isCaptain?: boolean
}

export const STARTING_XI: FormationPlayer[] = [
  // GK
  { name: 'Bounou', anchorId: 'yassine-bounou', position: 'GK', x: 50, y: 90, status: 'CERTAIN' },
  // DEF (L→R)
  { name: 'Mazraoui', anchorId: 'noussair-mazraoui', position: 'DEF', x: 15, y: 72, status: 'CERTAIN' },
  { name: 'Dari', anchorId: 'achraf-dari', position: 'DEF', x: 37, y: 74, status: 'LIKELY' },
  { name: 'Aguerd', anchorId: 'nayef-aguerd', position: 'DEF', x: 63, y: 74, status: 'CERTAIN' },
  { name: 'Hakimi', anchorId: 'achraf-hakimi', position: 'DEF', x: 85, y: 72, status: 'CERTAIN', isCaptain: true },
  // MID
  { name: 'El Aynaoui', anchorId: 'neil-el-aynaoui', position: 'MID', x: 28, y: 52, status: 'LIKELY' },
  { name: 'Amrabat', anchorId: 'sofyan-amrabat', position: 'MID', x: 50, y: 56, status: 'CERTAIN' },
  { name: 'El Khannouss', anchorId: 'bilal-el-khannouss', position: 'MID', x: 72, y: 52, status: 'CERTAIN' },
  // FWD
  { name: 'Ezzalzouli', anchorId: 'abdessamad-ezzalzouli', position: 'FWD', x: 20, y: 28, status: 'CERTAIN' },
  { name: 'Diaz', anchorId: 'brahim-diaz', position: 'FWD', x: 50, y: 22, status: 'CERTAIN' },
  { name: 'El Kaabi', anchorId: 'ayoub-el-kaabi', position: 'FWD', x: 80, y: 28, status: 'LIKELY' },
]

// ─── Predicted XI text (SEO + shareable) ───────────────────────

export const PREDICTED_XI: { en: string; ar: string; fr: string } = {
  en: 'Bounou; Hakimi, Aguerd, Dari, Mazraoui; Amrabat, El Khannouss, El Aynaoui; Diaz, Ezzalzouli, El Kaabi',
  ar: '\u0628\u0648\u0646\u0648\u061B \u062D\u0643\u064A\u0645\u064A\u060C \u0623\u0643\u0631\u062F\u060C \u062F\u0627\u0631\u064A\u060C \u0645\u0632\u0631\u0627\u0648\u064A\u061B \u0623\u0645\u0631\u0627\u0628\u0637\u060C \u0627\u0644\u062E\u0646\u0648\u0633\u060C \u0627\u0644\u0639\u064A\u0646\u0627\u0648\u064A\u061B \u062F\u064A\u0627\u0632\u060C \u0627\u0644\u0632\u0644\u0632\u0648\u0644\u064A\u060C \u0627\u0644\u0643\u0639\u0628\u064A',
  fr: 'Bounou ; Hakimi, Aguerd, Dari, Mazraoui ; Amrabat, El Khannouss, El Aynaoui ; Diaz, Ezzalzouli, El Kaabi',
}

// ─── 26-man predicted squad ────────────────────────────────────

export const WC_SQUAD: SquadPlayer[] = [
  // ═══ GOALKEEPERS (3) ═══
  {
    name: 'Yassine Bounou',
    age: 33, caps: 87,
    club: 'Al Hilal', league: 'Saudi Pro League', country: '\uD83C\uDDF8\uD83C\uDDE6',
    position: 'GK', status: 'CERTAIN',
    apiId: 2701,
    form: ['W', 'W', 'D', 'W', 'W'],
    en: { role: 'Starter #1', blurb: 'Undisputed No.1. Won Saudi title 2025-26.' },
    ar: { role: '\u0627\u0644\u062D\u0627\u0631\u0633 \u0627\u0644\u0623\u0648\u0644', blurb: '\u0627\u0644\u062D\u0627\u0631\u0633 \u0627\u0644\u0623\u0648\u0644 \u0628\u0644\u0627 \u0645\u0646\u0627\u0632\u0639. \u0641\u0627\u0632 \u0628\u0627\u0644\u062F\u0648\u0631\u064A \u0627\u0644\u0633\u0639\u0648\u062F\u064A 2025-26.' },
    fr: { role: 'Titulaire #1', blurb: 'Numero un inconteste. Champion d\'Arabie Saoudite 2025-26.' },
  },
  {
    name: 'Munir El Kajoui',
    age: 34, caps: 12,
    club: 'Renaissance Berkane', league: 'Botola Pro', country: '\uD83C\uDDF2\uD83C\uDDE6',
    position: 'GK', status: 'LIKELY',
    apiId: 80564,
    form: ['W', 'D', 'W', 'L', 'W'],
    en: { role: 'Backup GK', blurb: 'Experienced backup. CAF CC finalist 2026.' },
    ar: { role: '\u0627\u0644\u062D\u0627\u0631\u0633 \u0627\u0644\u0628\u062F\u064A\u0644', blurb: '\u062D\u0627\u0631\u0633 \u0628\u062F\u064A\u0644 \u062E\u0628\u064A\u0631. \u0646\u0647\u0627\u0626\u064A \u0643\u0623\u0633 \u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A 2026.' },
    fr: { role: 'Gardien remplacant', blurb: 'Remplacant experimente. Finaliste de la Coupe CAF 2026.' },
  },
  {
    name: 'El Mehdi Harrar',
    age: 24, caps: 3,
    club: 'Raja Casablanca', league: 'Botola Pro', country: '\uD83C\uDDF2\uD83C\uDDE6',
    position: 'GK', status: 'LIKELY',
    apiId: 340912,
    form: ['W', 'W', 'L', 'W', 'D'],
    en: { role: 'Third GK', blurb: 'Rising star. Heir apparent to Bounou long-term.' },
    ar: { role: '\u0627\u0644\u062D\u0627\u0631\u0633 \u0627\u0644\u062B\u0627\u0644\u062B', blurb: '\u0646\u062C\u0645 \u0635\u0627\u0639\u062F. \u0627\u0644\u0648\u0631\u064A\u062B \u0627\u0644\u0645\u0646\u062A\u0638\u0631 \u0644\u0628\u0648\u0646\u0648 \u0639\u0644\u0649 \u0627\u0644\u0645\u062F\u0649 \u0627\u0644\u0637\u0648\u064A\u0644.' },
    fr: { role: 'Troisieme gardien', blurb: 'Etoile montante. Heritier de Bounou a long terme.' },
  },

  // ═══ DEFENDERS (8) ═══
  {
    name: 'Achraf Hakimi',
    age: 27, caps: 88,
    club: 'Paris Saint-Germain', league: 'Ligue 1', country: '\uD83C\uDDEB\uD83C\uDDF7',
    position: 'DEF', status: 'CERTAIN',
    apiId: 9,
    form: ['W', 'W', 'W', 'D', 'W'],
    narrativeHook: {
      en: 'African Player of the Year 2025. Captain and talisman.',
      ar: '\u0623\u0641\u0636\u0644 \u0644\u0627\u0639\u0628 \u0623\u0641\u0631\u064A\u0642\u064A 2025. \u0627\u0644\u0642\u0627\u0626\u062F \u0648\u0627\u0644\u0631\u0643\u064A\u0632\u0629.',
      fr: 'Joueur africain de l\'annee 2025. Capitaine et talisman.',
    },
    en: { role: 'Captain / Star', blurb: 'African Player of the Year 2025. 18G+26A under Luis Enrique. UCL final goal.' },
    ar: { role: '\u0627\u0644\u0642\u0627\u0626\u062F / \u0627\u0644\u0646\u062C\u0645', blurb: '\u0623\u0641\u0636\u0644 \u0644\u0627\u0639\u0628 \u0623\u0641\u0631\u064A\u0642\u064A 2025. 18 \u0647\u062F\u0641 \u062626 \u062A\u0645\u0631\u064A\u0631\u0629 \u062D\u0627\u0633\u0645\u0629 \u0645\u0639 \u0644\u0648\u064A\u0633 \u0625\u0646\u0631\u064A\u0643\u064A.' },
    fr: { role: 'Capitaine / Star', blurb: 'Joueur africain de l\'annee 2025. 18B+26A sous Luis Enrique. But en finale de LDC.' },
  },
  {
    name: 'Noussair Mazraoui',
    age: 28, caps: 35,
    club: 'Manchester United', league: 'Premier League', country: '\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67\uDB40\uDC7F',
    position: 'DEF', status: 'CERTAIN',
    apiId: 545,
    form: ['L', 'W', 'D', 'W', 'W'],
    en: { role: 'Versatile starter', blurb: 'Premier League experience. Covers both flanks.' },
    ar: { role: '\u0645\u062F\u0627\u0641\u0639 \u0645\u062A\u0639\u062F\u062F \u0627\u0644\u0645\u0631\u0627\u0643\u0632', blurb: '\u062E\u0628\u0631\u0629 \u0641\u064A \u0627\u0644\u062F\u0648\u0631\u064A \u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A. \u064A\u063A\u0637\u064A \u0627\u0644\u062C\u0646\u0627\u062D\u064A\u0646.' },
    fr: { role: 'Titulaire polyvalent', blurb: 'Experience en Premier League. Couvre les deux flancs.' },
  },
  {
    name: 'Nayef Aguerd',
    age: 28, caps: 52,
    club: 'Marseille', league: 'Ligue 1', country: '\uD83C\uDDEB\uD83C\uDDF7',
    position: 'DEF', status: 'CERTAIN',
    apiId: 21518,
    form: ['W', 'D', 'W', 'W', 'L'],
    en: { role: 'First-choice CB', blurb: 'Starring for Marseille in 2025-26. Commanding in the air.' },
    ar: { role: '\u0642\u0644\u0628 \u0627\u0644\u062F\u0641\u0627\u0639 \u0627\u0644\u0623\u0648\u0644', blurb: '\u062A\u0623\u0644\u0642 \u0645\u0639 \u0645\u0627\u0631\u0633\u064A\u0644\u064A\u0627 \u0641\u064A 2025-26. \u0645\u0633\u064A\u0637\u0631 \u0641\u064A \u0627\u0644\u0643\u0631\u0627\u062A \u0627\u0644\u0647\u0648\u0627\u0626\u064A\u0629.' },
    fr: { role: 'Defenseur central titulaire', blurb: 'Brille a Marseille en 2025-26. Dominant dans les airs.' },
  },
  {
    name: 'Achraf Dari',
    age: 26, caps: 18,
    club: 'Al Ahly', league: 'Egyptian Premier League', country: '\uD83C\uDDEA\uD83C\uDDEC',
    position: 'DEF', status: 'LIKELY',
    apiId: 296614,
    form: ['W', 'W', 'D', 'W', 'W'],
    en: { role: 'CB partner', blurb: 'Solid partner for Aguerd. CAF CL experience.' },
    ar: { role: '\u0634\u0631\u064A\u0643 \u0642\u0644\u0628 \u0627\u0644\u062F\u0641\u0627\u0639', blurb: '\u0634\u0631\u064A\u0643 \u0642\u0648\u064A \u0644\u0623\u0643\u0631\u062F. \u062E\u0628\u0631\u0629 \u0641\u064A \u062F\u0648\u0631\u064A \u0623\u0628\u0637\u0627\u0644 \u0623\u0641\u0631\u064A\u0642\u064A\u0627.' },
    fr: { role: 'Partenaire de charniere', blurb: 'Partenaire solide d\'Aguerd. Experience en Ligue des champions CAF.' },
  },
  {
    name: 'Adam Masina',
    age: 31, caps: 29,
    club: 'Free agent', league: 'N/A', country: '',
    position: 'DEF', status: 'DOUBT',
    apiId: 30453,
    en: { role: 'Left-back depth', blurb: 'Currently without a club. A free agent 2 months before the World Cup is a major risk.' },
    ar: { role: '\u0638\u0647\u064A\u0631 \u0623\u064A\u0633\u0631 \u0628\u062F\u064A\u0644', blurb: '\u062D\u0627\u0644\u064A\u064B\u0627 \u0628\u062F\u0648\u0646 \u0646\u0627\u062F\u064D. \u0644\u0627\u0639\u0628 \u062D\u0631 \u0642\u0628\u0644 \u0634\u0647\u0631\u064A\u0646 \u0645\u0646 \u0627\u0644\u0645\u0648\u0646\u062F\u064A\u0627\u0644 \u0645\u062E\u0627\u0637\u0631\u0629 \u0643\u0628\u064A\u0631\u0629.' },
    fr: { role: 'Doublure arriere gauche', blurb: 'Actuellement sans club. Un agent libre a 2 mois du Mondial, un risque majeur.' },
  },
  {
    name: 'Abdelhamid Ait Boudlal',
    age: 19, caps: 4,
    club: 'Rennes', league: 'Ligue 1', country: '\uD83C\uDDEB\uD83C\uDDF7',
    position: 'DEF', status: 'BUBBLE',
    apiId: 406221,
    form: ['D', 'W', 'L', 'W', 'W'],
    en: { role: 'Young prospect', blurb: 'Impressive Ligue 1 debut season. Could earn first WC.' },
    ar: { role: '\u0645\u0648\u0647\u0628\u0629 \u0634\u0627\u0628\u0629', blurb: '\u0645\u0648\u0633\u0645 \u0623\u0648\u0644 \u0645\u0628\u0647\u0631 \u0641\u064A \u0627\u0644\u062F\u0648\u0631\u064A \u0627\u0644\u0641\u0631\u0646\u0633\u064A. \u0642\u062F \u064A\u062D\u0635\u0644 \u0639\u0644\u0649 \u0623\u0648\u0644 \u0645\u0648\u0646\u062F\u064A\u0627\u0644.' },
    fr: { role: 'Jeune espoir', blurb: 'Premiere saison impressionnante en Ligue 1. Pourrait gagner sa premiere Coupe du Monde.' },
  },
  {
    name: 'Jawad El Yamiq',
    age: 32, caps: 28,
    club: 'Real Zaragoza', league: 'La Liga 2', country: '\uD83C\uDDEA\uD83C\uDDF8',
    position: 'DEF', status: 'BUBBLE',
    apiId: 50160,
    form: ['L', 'D', 'W', 'W', 'L'],
    en: { role: 'Veteran depth', blurb: 'Experienced WC 2022 veteran. Now in Spanish second tier.' },
    ar: { role: '\u062E\u0628\u0631\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629', blurb: '\u0644\u0627\u0639\u0628 \u0645\u062E\u0636\u0631\u0645 \u0645\u0646 \u0645\u0648\u0646\u062F\u064A\u0627\u0644 2022. \u062D\u0627\u0644\u064A\u064B\u0627 \u0641\u064A \u0627\u0644\u062F\u0631\u062C\u0629 \u0627\u0644\u062B\u0627\u0646\u064A\u0629 \u0627\u0644\u0625\u0633\u0628\u0627\u0646\u064A\u0629.' },
    fr: { role: 'Profondeur de banc', blurb: 'Veteran du Mondial 2022. Desormais en deuxieme division espagnole.' },
  },
  {
    name: 'Omar El Hilali',
    age: 24, caps: 8,
    club: 'RCD Espanyol', league: 'La Liga', country: '\uD83C\uDDEA\uD83C\uDDF8',
    position: 'DEF', status: 'BUBBLE',
    apiId: 342155,
    form: ['W', 'L', 'D', 'W', 'W'],
    en: { role: 'Cover for Hakimi', blurb: 'La Liga experience. Could provide Hakimi backup.' },
    ar: { role: '\u0628\u062F\u064A\u0644 \u062D\u0643\u064A\u0645\u064A', blurb: '\u062E\u0628\u0631\u0629 \u0641\u064A \u0627\u0644\u0644\u064A\u063A\u0627. \u0642\u062F \u064A\u0643\u0648\u0646 \u0627\u0644\u0628\u062F\u064A\u0644 \u0627\u0644\u0623\u0645\u062B\u0644 \u0644\u062D\u0643\u064A\u0645\u064A.' },
    fr: { role: 'Doublure de Hakimi', blurb: 'Experience en Liga. Pourrait assurer le remplacement de Hakimi.' },
  },

  // ═══ MIDFIELDERS (8) ═══
  {
    name: 'Sofyan Amrabat',
    age: 29, caps: 62,
    club: 'Real Betis', league: 'La Liga', country: '\uD83C\uDDEA\uD83C\uDDF8',
    position: 'MID', status: 'CERTAIN',
    apiId: 74,
    form: ['W', 'W', 'D', 'W', 'L'],
    en: { role: 'Defensive anchor', blurb: 'WC 2022 breakout star. Engine of the team. On loan from Fenerbahce.' },
    ar: { role: '\u0627\u0644\u0645\u062D\u0648\u0631 \u0627\u0644\u062F\u0641\u0627\u0639\u064A', blurb: '\u0646\u062C\u0645 \u0645\u0648\u0646\u062F\u064A\u0627\u0644 2022. \u0645\u062D\u0631\u0643 \u0627\u0644\u0641\u0631\u064A\u0642. \u0645\u0639\u0627\u0631 \u0645\u0646 \u0641\u0646\u0631\u0628\u062E\u0634\u0647.' },
    fr: { role: 'Ancre defensive', blurb: 'Revelation du Mondial 2022. Moteur de l\'equipe. Prete par Fenerbahce.' },
  },
  {
    name: 'Bilal El Khannouss',
    age: 21, caps: 22,
    club: 'Stuttgart', league: 'Bundesliga', country: '\uD83C\uDDE9\uD83C\uDDEA',
    position: 'MID', status: 'CERTAIN',
    apiId: 340573,
    form: ['W', 'W', 'W', 'D', 'W'],
    en: { role: 'Creative spark', blurb: 'One of Africa\'s most exciting young talents. Moved to Bundesliga from Leicester.' },
    ar: { role: '\u0627\u0644\u0634\u0631\u0627\u0631\u0629 \u0627\u0644\u0625\u0628\u062F\u0627\u0639\u064A\u0629', blurb: '\u0645\u0646 \u0623\u0628\u0631\u0632 \u0627\u0644\u0645\u0648\u0627\u0647\u0628 \u0627\u0644\u0634\u0627\u0628\u0629 \u0641\u064A \u0623\u0641\u0631\u064A\u0642\u064A\u0627. \u0627\u0646\u062A\u0642\u0644 \u0625\u0644\u0649 \u0627\u0644\u0628\u0648\u0646\u062F\u0633\u0644\u064A\u063A\u0627 \u0645\u0646 \u0644\u064A\u0633\u062A\u0631.' },
    fr: { role: 'Etincelle creative', blurb: 'L\'un des jeunes talents les plus excitants d\'Afrique. Transfere en Bundesliga depuis Leicester.' },
  },
  {
    name: 'Neil El Aynaoui',
    age: 22, caps: 14,
    club: 'Roma', league: 'Serie A', country: '\uD83C\uDDEE\uD83C\uDDF9',
    position: 'MID', status: 'LIKELY',
    apiId: 406117,
    form: ['W', 'D', 'W', 'L', 'W'],
    en: { role: 'Box-to-box', blurb: 'Excellent debut Serie A season. Composure beyond his years.' },
    ar: { role: '\u0644\u0627\u0639\u0628 \u0648\u0633\u0637 \u0634\u0627\u0645\u0644', blurb: '\u0645\u0648\u0633\u0645 \u0623\u0648\u0644 \u0645\u0645\u062A\u0627\u0632 \u0641\u064A \u0627\u0644\u062F\u0648\u0631\u064A \u0627\u0644\u0625\u064A\u0637\u0627\u0644\u064A. \u0631\u0628\u0627\u0637\u0629 \u062C\u0623\u0634 \u062A\u0641\u0648\u0642 \u0639\u0645\u0631\u0647.' },
    fr: { role: 'Box-to-box', blurb: 'Excellente premiere saison en Serie A. Un sang-froid au-dela de son age.' },
  },
  {
    name: 'Azzedine Ounahi',
    age: 24, caps: 38,
    club: 'Girona', league: 'La Liga', country: '\uD83C\uDDEA\uD83C\uDDF8',
    position: 'MID', status: 'LIKELY',
    apiId: 129678,
    form: ['D', 'W', 'W', 'L', 'W'],
    en: { role: 'Ball carrier', blurb: 'Dynamic runner. Moved to Girona for more consistent minutes.' },
    ar: { role: '\u062D\u0627\u0645\u0644 \u0627\u0644\u0643\u0631\u0629', blurb: '\u0639\u062F\u0627\u0621 \u062F\u064A\u0646\u0627\u0645\u064A\u0643\u064A. \u0627\u0646\u062A\u0642\u0644 \u0625\u0644\u0649 \u062C\u064A\u0631\u0648\u0646\u0627 \u0644\u0644\u062D\u0635\u0648\u0644 \u0639\u0644\u0649 \u0648\u0642\u062A \u0644\u0639\u0628 \u0623\u0643\u062B\u0631.' },
    fr: { role: 'Porteur de balle', blurb: 'Coureur dynamique. Transfere a Girona pour plus de temps de jeu.' },
  },
  {
    name: 'Ismael Saibari',
    age: 24, caps: 15,
    club: 'PSV Eindhoven', league: 'Eredivisie', country: '\uD83C\uDDF3\uD83C\uDDF1',
    position: 'MID', status: 'LIKELY',
    apiId: 342016,
    form: ['W', 'W', 'W', 'W', 'D'],
    en: { role: 'Attacking midfielder', blurb: 'Strong season at PSV. Adds goal threat from midfield.' },
    ar: { role: '\u0644\u0627\u0639\u0628 \u0648\u0633\u0637 \u0647\u062C\u0648\u0645\u064A', blurb: '\u0645\u0648\u0633\u0645 \u0642\u0648\u064A \u0645\u0639 \u0623\u064A\u0646\u062F\u0647\u0648\u0641\u0646. \u064A\u0636\u064A\u0641 \u062E\u0637\u0631 \u0627\u0644\u062A\u0647\u062F\u064A\u0641 \u0645\u0646 \u0627\u0644\u0648\u0633\u0637.' },
    fr: { role: 'Milieu offensif', blurb: 'Belle saison au PSV. Apporte une menace de but depuis le milieu.' },
  },
  {
    name: 'Selim Amallah',
    age: 28, caps: 31,
    club: 'Standard Liege', league: 'Belgian Pro League', country: '\uD83C\uDDE7\uD83C\uDDEA',
    position: 'MID', status: 'BUBBLE',
    apiId: 47419,
    form: ['L', 'D', 'W', 'W', 'L'],
    en: { role: 'Squad depth', blurb: 'Experienced but faces strong competition for places.' },
    ar: { role: '\u0639\u0645\u0642 \u0627\u0644\u062A\u0634\u0643\u064A\u0644\u0629', blurb: '\u0644\u0627\u0639\u0628 \u062E\u0628\u064A\u0631 \u0644\u0643\u0646\u0647 \u064A\u0648\u0627\u062C\u0647 \u0645\u0646\u0627\u0641\u0633\u0629 \u0634\u062F\u064A\u062F\u0629 \u0639\u0644\u0649 \u0627\u0644\u0645\u0631\u0643\u0632.' },
    fr: { role: 'Profondeur de banc', blurb: 'Experimente mais fait face a une forte concurrence.' },
  },
  {
    name: 'Ilias Akhomach',
    age: 21, caps: 6,
    club: 'Rayo Vallecano', league: 'La Liga', country: '\uD83C\uDDEA\uD83C\uDDF8',
    position: 'MID', status: 'BUBBLE',
    apiId: 340688,
    form: ['W', 'L', 'D', 'W', 'L'],
    en: { role: 'Wildcard option', blurb: 'Technically gifted. Finding his feet at Rayo Vallecano.' },
    ar: { role: '\u062E\u064A\u0627\u0631 \u0645\u0641\u0627\u062C\u0626', blurb: '\u0645\u0648\u0647\u0648\u0628 \u062A\u0642\u0646\u064A\u064B\u0627. \u064A\u062C\u062F \u0645\u0648\u0637\u0626 \u0642\u062F\u0645\u0647 \u0641\u064A \u0631\u0627\u064A\u0648 \u0641\u0627\u064A\u0643\u0627\u0646\u0648.' },
    fr: { role: 'Joker', blurb: 'Techniquement doue. Trouve ses marques a Rayo Vallecano.' },
  },
  {
    name: 'Sofiane Boufal',
    age: 32, caps: 30,
    club: 'Union Saint-Gilloise', league: 'Belgian Pro League', country: '\uD83C\uDDE7\uD83C\uDDEA',
    position: 'MID', status: 'BUBBLE',
    apiId: 21613,
    form: ['W', 'D', 'W', 'W', 'L'],
    narrativeHook: {
      en: 'The WC 2022 dancing-with-his-mother moment. Morocco\'s most iconic image.',
      ar: '\u0644\u062D\u0638\u0629 \u0627\u0644\u0631\u0642\u0635 \u0645\u0639 \u0623\u0645\u0647 \u0641\u064A \u0645\u0648\u0646\u062F\u064A\u0627\u0644 2022. \u0623\u0634\u0647\u0631 \u0635\u0648\u0631\u0629 \u0641\u064A \u0643\u0631\u0629 \u0627\u0644\u0642\u062F\u0645 \u0627\u0644\u0645\u063A\u0631\u0628\u064A\u0629.',
      fr: 'Le moment de danse avec sa mere au Mondial 2022. L\'image la plus iconique du Maroc.',
    },
    en: { role: 'Creative wildcard', blurb: 'WC 2022 fan favourite. Still has the magic on his day. Belgian league revival.' },
    ar: { role: '\u0627\u0644\u0645\u0628\u062F\u0639 \u0627\u0644\u0645\u0641\u0627\u062C\u0626', blurb: '\u0645\u062D\u0628\u0648\u0628 \u062C\u0645\u0627\u0647\u064A\u0631 \u0645\u0648\u0646\u062F\u064A\u0627\u0644 2022. \u0644\u0627 \u064A\u0632\u0627\u0644 \u064A\u0645\u0644\u0643 \u0627\u0644\u0633\u062D\u0631. \u0639\u0648\u062F\u0629 \u0641\u064A \u0627\u0644\u062F\u0648\u0631\u064A \u0627\u0644\u0628\u0644\u062C\u064A\u0643\u064A.' },
    fr: { role: 'Joker creatif', blurb: 'Favori des fans du Mondial 2022. Garde sa magie. Renaissance en Belgique.' },
  },

  // ═══ FORWARDS (8) ═══
  {
    name: 'Brahim Diaz',
    age: 26, caps: 31,
    club: 'Real Madrid', league: 'La Liga', country: '\uD83C\uDDEA\uD83C\uDDF8',
    position: 'FWD', status: 'CERTAIN',
    apiId: 37103,
    form: ['W', 'W', 'W', 'W', 'D'],
    narrativeHook: {
      en: 'Missed the penalty that could have won AFCON 2025. Has a point to prove at the World Cup.',
      ar: '\u0623\u062E\u0637\u0623 \u0627\u0644\u0631\u0643\u0644\u0629 \u0627\u0644\u062A\u064A \u0643\u0627\u0646\u062A \u0633\u062A\u0645\u0646\u062D \u0627\u0644\u0645\u063A\u0631\u0628 \u0627\u0644\u0643\u0623\u0633. \u0644\u062F\u064A\u0647 \u0645\u0627 \u064A\u062B\u0628\u062A\u0647 \u0641\u064A \u0627\u0644\u0645\u0648\u0646\u062F\u064A\u0627\u0644.',
      fr: 'A manque le penalty qui aurait pu donner la CAN au Maroc. A des comptes a regler.',
    },
    en: { role: 'No.10 / Key man', blurb: 'AFCON 2025 top scorer (5 goals). Real Madrid\'s creative hub. Penalty miss haunts him.' },
    ar: { role: '\u0631\u0642\u0645 10 / \u0627\u0644\u0644\u0627\u0639\u0628 \u0627\u0644\u0623\u0633\u0627\u0633\u064A', blurb: '\u0647\u062F\u0627\u0641 \u0643\u0623\u0633 \u0623\u0641\u0631\u064A\u0642\u064A\u0627 2025 (5 \u0623\u0647\u062F\u0627\u0641). \u0645\u062D\u0648\u0631 \u0625\u0628\u062F\u0627\u0639 \u0631\u064A\u0627\u0644 \u0645\u062F\u0631\u064A\u062F. \u0631\u0643\u0644\u0629 \u0627\u0644\u062C\u0632\u0627\u0621 \u0627\u0644\u0636\u0627\u0626\u0639\u0629 \u062A\u0637\u0627\u0631\u062F\u0647.' },
    fr: { role: 'No.10 / Homme cle', blurb: 'Meilleur buteur de la CAN 2025 (5 buts). Plaque tournante du Real. Le penalty manque le hante.' },
  },
  {
    name: 'Abdessamad Ezzalzouli',
    age: 24, caps: 27,
    club: 'Betis', league: 'La Liga', country: '\uD83C\uDDEA\uD83C\uDDF8',
    position: 'FWD', status: 'CERTAIN',
    apiId: 340678,
    form: ['W', 'D', 'W', 'W', 'L'],
    en: { role: 'Left wing starter', blurb: 'One of La Liga\'s best dribblers. Direct and pacey.' },
    ar: { role: '\u062C\u0646\u0627\u062D \u0623\u064A\u0633\u0631 \u0623\u0633\u0627\u0633\u064A', blurb: '\u0645\u0646 \u0623\u0641\u0636\u0644 \u0627\u0644\u0645\u0631\u0627\u0648\u063A\u064A\u0646 \u0641\u064A \u0627\u0644\u0644\u064A\u063A\u0627. \u0645\u0628\u0627\u0634\u0631 \u0648\u0633\u0631\u064A\u0639.' },
    fr: { role: 'Ailier gauche titulaire', blurb: 'L\'un des meilleurs dribbleurs de Liga. Direct et rapide.' },
  },
  {
    name: 'Ayoub El Kaabi',
    age: 32, caps: 21,
    club: 'Olympiacos', league: 'Super League Greece', country: '\uD83C\uDDEC\uD83C\uDDF7',
    position: 'FWD', status: 'LIKELY',
    apiId: 76783,
    form: ['W', 'W', 'D', 'W', 'W'],
    en: { role: 'Poacher / Finisher', blurb: 'Europa Conference League top scorer. One last WC dance.' },
    ar: { role: '\u0635\u064A\u0627\u062F \u0623\u0647\u062F\u0627\u0641', blurb: '\u0647\u062F\u0627\u0641 \u062F\u0648\u0631\u064A \u0627\u0644\u0645\u0624\u062A\u0645\u0631 \u0627\u0644\u0623\u0648\u0631\u0648\u0628\u064A. \u0631\u0642\u0635\u0629 \u0627\u0644\u0645\u0648\u0646\u062F\u064A\u0627\u0644 \u0627\u0644\u0623\u062E\u064A\u0631\u0629.' },
    fr: { role: 'Buteur / Finisseur', blurb: 'Meilleur buteur de la Conference League. Une derniere danse en Coupe du Monde.' },
  },
  {
    name: 'Youssef En-Nesyri',
    age: 29, caps: 85,
    club: 'Fenerbahce', league: 'Super Lig', country: '\uD83C\uDDF9\uD83C\uDDF7',
    position: 'FWD', status: 'LIKELY',
    apiId: 47422,
    form: ['W', 'L', 'W', 'D', 'W'],
    en: { role: 'Target man', blurb: 'WC 2022 QF hero. Scored vs Portugal. Strong Fenerbahce form.' },
    ar: { role: '\u0645\u0647\u0627\u062C\u0645 \u0627\u0644\u0627\u0631\u062A\u0643\u0627\u0632', blurb: '\u0628\u0637\u0644 \u0631\u0628\u0639 \u0646\u0647\u0627\u0626\u064A \u0645\u0648\u0646\u062F\u064A\u0627\u0644 2022. \u0633\u062C\u0644 \u0636\u062F \u0627\u0644\u0628\u0631\u062A\u063A\u0627\u0644. \u0623\u062F\u0627\u0621 \u0642\u0648\u064A \u0645\u0639 \u0641\u0646\u0631\u0628\u062E\u0634\u0647.' },
    fr: { role: 'Avant-centre cible', blurb: 'Heros des quarts du Mondial 2022. Buteur contre le Portugal. En forme a Fenerbahce.' },
  },
  {
    name: 'Hamza Igamane',
    age: 22, caps: 9,
    club: 'Lille', league: 'Ligue 1', country: '\uD83C\uDDEB\uD83C\uDDF7',
    position: 'FWD', status: 'LIKELY',
    apiId: 406310,
    form: ['W', 'W', 'W', 'W', 'D'],
    narrativeHook: {
      en: 'Top scorer in Ligue 1 this season at just 22.',
      ar: '\u0647\u062F\u0627\u0641 \u0627\u0644\u062F\u0648\u0631\u064A \u0627\u0644\u0641\u0631\u0646\u0633\u064A \u0647\u0630\u0627 \u0627\u0644\u0645\u0648\u0633\u0645 \u0628\u0639\u0645\u0631 22 \u0633\u0646\u0629 \u0641\u0642\u0637.',
      fr: 'Meilleur buteur de Ligue 1 cette saison a seulement 22 ans.',
    },
    en: { role: 'Young striker', blurb: 'Breakthrough season at Lille. Top Ligue 1 scorer. The dark horse.' },
    ar: { role: '\u0645\u0647\u0627\u062C\u0645 \u0634\u0627\u0628', blurb: '\u0645\u0648\u0633\u0645 \u0627\u0646\u0637\u0644\u0627\u0642\u0629 \u0645\u0639 \u0644\u064A\u0644. \u0647\u062F\u0627\u0641 \u0627\u0644\u062F\u0648\u0631\u064A \u0627\u0644\u0641\u0631\u0646\u0633\u064A. \u0627\u0644\u062D\u0635\u0627\u0646 \u0627\u0644\u0623\u0633\u0648\u062F.' },
    fr: { role: 'Jeune attaquant', blurb: 'Saison revelatrice a Lille. Meilleur buteur de Ligue 1. L\'outsider.' },
  },
  {
    name: 'Eliesse Ben Seghir',
    age: 20, caps: 11,
    club: 'Bayer Leverkusen', league: 'Bundesliga', country: '\uD83C\uDDE9\uD83C\uDDEA',
    position: 'FWD', status: 'LIKELY',
    apiId: 406028,
    form: ['W', 'W', 'D', 'W', 'W'],
    narrativeHook: {
      en: 'Could be the youngest player in Morocco\'s WC squad.',
      ar: '\u0642\u062F \u064A\u0643\u0648\u0646 \u0623\u0635\u063A\u0631 \u0644\u0627\u0639\u0628 \u0641\u064A \u062A\u0634\u0643\u064A\u0644\u0629 \u0627\u0644\u0645\u063A\u0631\u0628 \u0644\u0644\u0645\u0648\u0646\u062F\u064A\u0627\u0644.',
      fr: 'Pourrait etre le plus jeune joueur de l\'effectif marocain.',
    },
    en: { role: 'Super-sub / Wildcard', blurb: 'Moved to Leverkusen from Monaco. Thriving in the Bundesliga.' },
    ar: { role: '\u0627\u0644\u0628\u062F\u064A\u0644 \u0627\u0644\u062E\u0627\u0631\u0642 / \u0627\u0644\u0645\u0641\u0627\u062C\u0623\u0629', blurb: '\u0627\u0646\u062A\u0642\u0644 \u0625\u0644\u0649 \u0644\u064A\u0641\u0631\u0643\u0648\u0632\u0646 \u0645\u0646 \u0645\u0648\u0646\u0627\u0643\u0648. \u064A\u062A\u0623\u0644\u0642 \u0641\u064A \u0627\u0644\u0628\u0648\u0646\u062F\u0633\u0644\u064A\u063A\u0627.' },
    fr: { role: 'Super-sub / Joker', blurb: 'Transfere a Leverkusen depuis Monaco. S\'epanouit en Bundesliga.' },
  },
  {
    name: 'Amine Adli',
    age: 25, caps: 8,
    club: 'Bournemouth', league: 'Premier League', country: '\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67\uDB40\uDC7F',
    position: 'FWD', status: 'BUBBLE',
    apiId: 296483,
    form: ['D', 'W', 'L', 'W', 'W'],
    en: { role: 'Wide attacker', blurb: 'Premier League form. Adds pace and directness on the flanks.' },
    ar: { role: '\u0645\u0647\u0627\u062C\u0645 \u062C\u0646\u0627\u062D', blurb: '\u0623\u062F\u0627\u0621 \u062C\u064A\u062F \u0641\u064A \u0627\u0644\u062F\u0648\u0631\u064A \u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A. \u064A\u0636\u064A\u0641 \u0627\u0644\u0633\u0631\u0639\u0629 \u0648\u0627\u0644\u0645\u0628\u0627\u0634\u0631\u0629 \u0639\u0644\u0649 \u0627\u0644\u0623\u062C\u0646\u062D\u0629.' },
    fr: { role: 'Attaquant de couloir', blurb: 'En forme en Premier League. Apporte vitesse et percussion sur les ailes.' },
  },
  {
    name: 'Soufiane Rahimi',
    age: 27, caps: 19,
    club: 'Al Ain', league: 'UAE Pro League', country: '\uD83C\uDDE6\uD83C\uDDEA',
    position: 'FWD', status: 'BUBBLE',
    apiId: 296550,
    form: ['W', 'W', 'W', 'D', 'L'],
    en: { role: 'Wide attacker', blurb: 'AFC Champions League top scorer 2024. UAE move a risk.' },
    ar: { role: '\u0645\u0647\u0627\u062C\u0645 \u062C\u0646\u0627\u062D', blurb: '\u0647\u062F\u0627\u0641 \u062F\u0648\u0631\u064A \u0623\u0628\u0637\u0627\u0644 \u0622\u0633\u064A\u0627 2024. \u0627\u0644\u0627\u0646\u062A\u0642\u0627\u0644 \u0644\u0644\u0625\u0645\u0627\u0631\u0627\u062A \u0645\u062D\u0641\u0648\u0641 \u0628\u0627\u0644\u0645\u062E\u0627\u0637\u0631.' },
    fr: { role: 'Attaquant de couloir', blurb: 'Meilleur buteur de la Champions League AFC 2024. Transfert aux EAU risque.' },
  },
  {
    name: 'Hakim Ziyech',
    age: 33, caps: 61,
    club: 'TBC', league: 'TBC', country: '',
    position: 'FWD', status: 'DOUBT',
    apiId: 744,
    narrativeHook: {
      en: 'Will Ziyech get one last chance? Morocco\'s biggest debate.',
      ar: '\u0647\u0644 \u064A\u062D\u0635\u0644 \u0632\u064A\u0627\u0634 \u0639\u0644\u0649 \u0641\u0631\u0635\u0629 \u0623\u062E\u064A\u0631\u0629\u061F \u0623\u0643\u0628\u0631 \u0646\u0642\u0627\u0634 \u0641\u064A \u0627\u0644\u0643\u0631\u0629 \u0627\u0644\u0645\u063A\u0631\u0628\u064A\u0629.',
      fr: 'Ziyech aura-t-il une derniere chance? Le plus grand debat du foot marocain.',
    },
    en: { role: 'Veteran wildcard', blurb: 'Injury concerns. Omitted from recent squads. Coach relationship strained.' },
    ar: { role: '\u0627\u0644\u0645\u062E\u0636\u0631\u0645 \u0627\u0644\u0645\u0641\u0627\u062C\u0626', blurb: '\u0645\u062E\u0627\u0648\u0641 \u0645\u0646 \u0627\u0644\u0625\u0635\u0627\u0628\u0629. \u063A\u0627\u0626\u0628 \u0639\u0646 \u0627\u0644\u062A\u0634\u0643\u064A\u0644\u0627\u062A \u0627\u0644\u0623\u062E\u064A\u0631\u0629. \u0639\u0644\u0627\u0642\u0629 \u0645\u062A\u0648\u062A\u0631\u0629 \u0645\u0639 \u0627\u0644\u0645\u062F\u0631\u0628.' },
    fr: { role: 'Joker veteran', blurb: 'Inquietudes sur les blessures. Absent des derniers groupes. Relation tendue avec le coach.' },
  },
]
